import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
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
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if the same image already exists for this user
    const existingScreenshot = await ScreenshotModel.findOne({
      userId,
      imageUrl,
    });

    if (existingScreenshot) {
      // If the image already exists, return the existing screenshot
      return NextResponse.json(
        { success: true, screenshot: existingScreenshot },
        { status: 200 }
      );
    }

    // If the image doesn't exist, create a new entry
    const screenshot = await ScreenshotModel.create({
      userId,
      imageUrl,
    });

    // Invalidate the screenshots cache when adding a new screenshot
    try {
      await redis.del(`user:screenshots:${userId}`);
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json({ success: true, screenshot }, { status: 201 });
  } catch (error) {
    console.error("Error creating screenshot:", error);
    return NextResponse.json(
      { error: "Failed to create screenshot" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const cacheKey = `user:screenshots:${userId}`;

    // Try to get data from cache first
    try {
      const cachedScreenshots = await redis.get(cacheKey);
      if (cachedScreenshots) {
        return NextResponse.json(cachedScreenshots);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }

    await dbConnect();
    const screenshots = await ScreenshotModel.find({
      userId,
    }).sort({ createdAt: -1 });

    const responseData = { screenshots };

    // Cache the screenshots data for 2 minutes
    try {
      await redis.set(cacheKey, JSON.stringify(responseData), { ex: 120 });
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching screenshots:", error);
    return NextResponse.json(
      { error: "Failed to fetch screenshots" },
      { status: 500 }
    );
  }
}
