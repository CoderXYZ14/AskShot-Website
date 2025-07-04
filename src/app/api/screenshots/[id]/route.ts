import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import ScreenshotModel from "@/models/Screenshot";
import QuestionModel from "@/models/Question";
import { redis } from "@/lib/redis";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const screenshotId = params.id;
    const cacheKey = `screenshot:${screenshotId}:details`;

    // Try to get data from cache first
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }

    await dbConnect();

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

    const questions = await QuestionModel.find({ screenshotId }).sort({
      createdAt: -1,
    });

    const responseData = { screenshot, questions };

    // Cache the screenshot details for 2 minutes
    try {
      await redis.set(cacheKey, JSON.stringify(responseData), { ex: 120 });
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching screenshot details:", error);
    return NextResponse.json(
      { error: "Failed to fetch screenshot details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = session.user.id;
    const screenshotId = params.id;
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

    await QuestionModel.deleteMany({ screenshotId });
    await ScreenshotModel.findByIdAndDelete(screenshotId);

    // Invalidate related caches
    try {
      await redis.del(`screenshot:${screenshotId}:details`);
      await redis.del(`user:screenshots:${userId}`);
      
      // Invalidate plans cache to update usage counts
      const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const userEmail = session.user.email;
      if (userEmail) {
        await redis.del(`user:plans:${userEmail}:${currentDate}`);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting screenshot:", error);
    return NextResponse.json(
      { error: "Failed to delete screenshot" },
      { status: 500 }
    );
  }
}
