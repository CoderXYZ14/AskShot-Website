import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import ScreenshotModel from "@/models/Screenshot";
import QuestionModel from "@/models/Question";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Check if the same image already exists for this user
    const existingScreenshot = await ScreenshotModel.findOne({
      userId: session.user.id,
      imageUrl
    });

    if (existingScreenshot) {
      // If the image already exists, return the existing screenshot
      return NextResponse.json({ success: true, screenshot: existingScreenshot }, { status: 200 });
    }

    // If the image doesn't exist, create a new entry
    const screenshot = await ScreenshotModel.create({
      userId: session.user.id,
      imageUrl,
    });

    return NextResponse.json({ success: true, screenshot }, { status: 201 });
  } catch (error) {
    console.error("Error creating screenshot:", error);
    return NextResponse.json({ error: "Failed to create screenshot" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const screenshots = await ScreenshotModel.find({ userId: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ screenshots });
  } catch (error) {
    console.error("Error fetching screenshots:", error);
    return NextResponse.json({ error: "Failed to fetch screenshots" }, { status: 500 });
  }
}
