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
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { screenshot, question } = body;

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
        text:
          question ||
          "What do you see in this screenshot? Please describe it in detail.",
      } as TextBlockParam,
    ];

    const response = await anthropicClient.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content }],
    });

    const answer = (response.content[0] as TextBlockParam).text;

    // Connect to the database
    await dbConnect();

    // Check if the same screenshot already exists for this user
    let screenshotDoc = await ScreenshotModel.findOne({
      userId: session.user.id,
      imageUrl: screenshot,
    });

    // If the screenshot doesn't exist, create a new entry
    if (!screenshotDoc) {
      screenshotDoc = await ScreenshotModel.create({
        userId: session.user.id,
        imageUrl: screenshot,
      });
    }

    // Store the question and answer
    await QuestionModel.create({
      userId: session.user.id,
      screenshotId: screenshotDoc._id,
      question,
      answer,
    });

    return NextResponse.json({
      answer,
      status: "success",
      screenshotId: screenshotDoc._id,
    });
  } catch (error) {
    console.error("AnthropicAnalyse | Error:", error);
    return NextResponse.json(
      { error: "Failed to process image", details: String(error) },
      { status: 500 }
    );
  }
}
