import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  anthropicClient,
  validateBase64Image,
  cleanBase64Image,
} from "@/utils/anthropic";
import {
  ContentBlockParam,
  ImageBlockParam,
  TextBlockParam,
} from "@anthropic-ai/sdk/resources";
import dbConnect from "@/lib/dbConnect";
import ScreenshotModel from "@/models/Screenshot";
import QuestionModel from "@/models/Question";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Check user's free trials
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has free trials left
    if (user.freeTrialsLeft <= 0) {
      return NextResponse.json(
        {
          error: "No credits left",
          freeTrialsLeft: 0,
          isExpired: true,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { screenshot, question, screenshotId } = body;

    if (!screenshot || !validateBase64Image(screenshot)) {
      return NextResponse.json(
        { error: "Invalid or missing screenshot" },
        { status: 400 }
      );
    }

    const cleanedImageData = cleanBase64Image(screenshot);
    const mediaTypeMatch = screenshot.match(/^data:image\/(\w+);base64,/);
    const mediaType = mediaTypeMatch
      ? `image/${mediaTypeMatch[1]}`
      : "image/png";

    const content: ContentBlockParam[] = [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data: cleanedImageData,
        },
      } as ImageBlockParam,
      {
        type: "text",
        text: `You are an expert AI that helps users understand screenshots of webpages they’ve selected by drawing on them. Analyze the screenshot and respond appropriately to the user's question.
      
      Guidelines:
      1. If the image includes vulgar/explicit content, respond: "⚠️ This image may contain inappropriate content. Please upload a different screenshot."
      2. If the image contains sensitive data (e.g. passwords, personal info), respond: "⚠️ This screenshot may include sensitive information. Please review before sharing further."
      3. If the question is not related to the screenshot, say: "This question doesn’t seem related to the selected area. Want me to describe the image instead?"
      4. If no question is provided, describe the screenshot as clearly as possible.
      5. If the question is clear and related, give a precise, helpful answer.
      6. Prefer short, direct responses (around 30–40 words) when the question is simple. Use longer, detailed responses **only when needed**.
      
      User’s question: "${question}"`,
      } as TextBlockParam,
    ];

    const response = await callAnthropicWithRetry(content);

    const answer = (response.content[0] as TextBlockParam).text;

    let screenshotDoc;

    // If a screenshot ID is provided, try to find that screenshot
    if (screenshotId && mongoose.Types.ObjectId.isValid(screenshotId)) {
      screenshotDoc = await ScreenshotModel.findOne({
        _id: screenshotId,
        userId: session.user.id,
      });

      // If the screenshot with the provided ID doesn't exist or doesn't belong to the user,
      // we'll create a new one below
    }

    // If no screenshot ID was provided or the screenshot wasn't found, check if the same image exists
    if (!screenshotDoc) {
      screenshotDoc = await ScreenshotModel.findOne({
        userId: session.user.id,
        imageUrl: screenshot,
      });
    }

    // If the screenshot doesn't exist, create a new entry
    if (!screenshotDoc) {
      screenshotDoc = await ScreenshotModel.create({
        userId: session.user.id,
        imageUrl: screenshot,
      });
    }

    // Store the question and answer
    const newQuestion = await QuestionModel.create({
      userId: session.user.id,
      screenshotId: screenshotDoc._id,
      question,
      answer,
    });

    // Decrement the user's free trials
    user.freeTrialsLeft = Math.max(0, user.freeTrialsLeft - 1);
    await user.save();

    // Update Redis cache
    try {
      const userId = session.user.id;

      // Invalidate user questions cache
      await redis.del(`user:questions:${userId}:all`);
      await redis.del(
        `user:questions:${userId}:screenshot:${screenshotDoc._id}`
      );

      // If it's a new screenshot, invalidate the screenshots cache
      if (!screenshotId) {
        await redis.del(`user:screenshots:${userId}`);
      }

      // Update screenshot details cache with the new question
      const cacheKey = `screenshot:${screenshotDoc._id}:details`;
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData as string);
          if (parsedData.questions) {
            parsedData.questions.unshift(newQuestion.toJSON());
            await redis.set(cacheKey, JSON.stringify(parsedData), { ex: 120 });
          } else {
            await redis.del(cacheKey); // If structure is unexpected, invalidate cache
          }
        } catch (parseError) {
          console.error("Error parsing cached data:", parseError);
          await redis.del(cacheKey); // If parsing fails, invalidate cache
        }
      }

      // Update plans cache
      const currentDate = new Date().toISOString().split("T")[0];
      if (session.user.email) {
        await redis.del(`user:plans:${session.user.email}:${currentDate}`);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json({
      answer,
      status: "success",
      screenshotId: screenshotDoc._id,
      freeTrialsLeft: user.freeTrialsLeft,
      isExpired: user.freeTrialsLeft <= 0,
    });
  } catch (error) {
    console.error("AnthropicAnalyse | Error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status: number }).status === 529
    ) {
      return NextResponse.json(
        {
          error: "Service is experiencing high demand",
          message:
            "Our AI service is currently experiencing high demand. Please try again later.",
          isOverloaded: true,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process image", details: String(error) },
      { status: 500 }
    );
  }
}

async function callAnthropicWithRetry(
  content: ContentBlockParam[],
  retries = 3,
  delay = 1000
) {
  for (let i = 0; i < retries; i++) {
    try {
      return await anthropicClient.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content }],
      });
    } catch (err) {
      if (
        i < retries - 1 &&
        (err as { status: number }).status === 529 &&
        (err as { error: { type: string } }).error.type === "overloaded_error"
      ) {
        console.warn(`Retrying (${i + 1})...`);
        await new Promise((r) => setTimeout(r, delay * (i + 1))); // exponential backoff
      } else {
        throw err;
      }
    }
  }

  throw new Error("Anthropic overloaded after retries");
}
