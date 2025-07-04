import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import QuestionModel from "@/models/Question";
import ScreenshotModel from "@/models/Screenshot";
import { redis } from "@/lib/redis";
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
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (!screenshotId) {
      return NextResponse.json(
        { error: "Screenshot ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const screenshot = await ScreenshotModel.findById(screenshotId);
    if (!screenshot) {
      return NextResponse.json(
        { error: "Screenshot not found" },
        { status: 404 }
      );
    }

    if (screenshot.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newQuestion = await QuestionModel.create({
      userId,
      screenshotId,
      question,
    });

    // Invalidate related caches
    try {
      await redis.del(`user:questions:${userId}:all`);
      await redis.del(`user:questions:${userId}:screenshot:${screenshotId}`);
      await redis.del(`screenshot:${screenshotId}:details`);
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json(
      { success: true, question: newQuestion },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(req.url);
    const screenshotId = url.searchParams.get("screenshotId");

    // Create appropriate cache key based on whether screenshotId is provided
    const cacheKey = screenshotId
      ? `user:questions:${userId}:screenshot:${screenshotId}`
      : `user:questions:${userId}:all`;

    // Try to get data from cache first
    try {
      const cachedQuestions = await redis.get(cacheKey);
      if (cachedQuestions) {
        return NextResponse.json(cachedQuestions);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }

    await dbConnect();

    let questions;
    if (screenshotId) {
      questions = await QuestionModel.find({
        userId,
        screenshotId,
      }).sort({ createdAt: -1 });
    } else {
      questions = await QuestionModel.find({
        userId,
      }).sort({ createdAt: -1 });
    }

    const responseData = { questions };

    // Cache the questions data for 2 minutes
    try {
      await redis.set(cacheKey, JSON.stringify(responseData), { ex: 120 });
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
