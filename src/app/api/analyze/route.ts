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
      return NextResponse.json({ 
        error: "No credits left", 
        freeTrialsLeft: 0,
        isExpired: true 
      }, { status: 403 });
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

    let screenshotDoc;
    
    // If a screenshot ID is provided, try to find that screenshot
    if (screenshotId && mongoose.Types.ObjectId.isValid(screenshotId)) {
      screenshotDoc = await ScreenshotModel.findOne({
        _id: screenshotId,
        userId: session.user.id
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
    await QuestionModel.create({
      userId: session.user.id,
      screenshotId: screenshotDoc._id,
      question,
      answer,
    });
    
    // Decrement the user's free trials
    user.freeTrialsLeft = Math.max(0, user.freeTrialsLeft - 1);
    await user.save();

    return NextResponse.json({
      answer,
      status: "success",
      screenshotId: screenshotDoc._id,
      freeTrialsLeft: user.freeTrialsLeft,
      isExpired: user.freeTrialsLeft <= 0
    });
  } catch (error) {
    console.error("AnthropicAnalyse | Error:", error);
    return NextResponse.json(
      { error: "Failed to process image", details: String(error) },
      { status: 500 }
    );
  }
}
