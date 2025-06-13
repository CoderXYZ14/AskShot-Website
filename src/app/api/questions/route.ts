import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import QuestionModel from "@/models/Question";
import ScreenshotModel from "@/models/Screenshot";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { question, screenshotId } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    if (!screenshotId) {
      return NextResponse.json({ error: "Screenshot ID is required" }, { status: 400 });
    }

    const screenshot = await ScreenshotModel.findById(screenshotId);
    if (!screenshot) {
      return NextResponse.json({ error: "Screenshot not found" }, { status: 404 });
    }

    if (screenshot.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newQuestion = await QuestionModel.create({
      userId: session.user.id,
      screenshotId,
      question,
    });

    return NextResponse.json({ success: true, question: newQuestion }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const screenshotId = url.searchParams.get("screenshotId");

    await dbConnect();
    
    if (screenshotId) {
      const questions = await QuestionModel.find({ 
        userId: session.user.id,
        screenshotId
      }).sort({ createdAt: -1 });
      
      return NextResponse.json({ questions });
    } else {
      const questions = await QuestionModel.find({ 
        userId: session.user.id 
      }).sort({ createdAt: -1 });
      
      return NextResponse.json({ questions });
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
