import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email!;
    const cacheKey = `user:credits:${userEmail}`;

    // Try to get data from cache first
    try {
      const cachedCredits = await redis.get(cacheKey);
      if (cachedCredits) {
        return NextResponse.json(cachedCredits);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }

    await dbConnect();

    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const creditsData = {
      freeTrialsLeft: user.freeTrialsLeft,
      isExpired: user.freeTrialsLeft <= 0,
    };

    // Cache the credits data for 5 minutes (300 seconds)
    try {
      await redis.set(cacheKey, JSON.stringify(creditsData), { ex: 300 });
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json(creditsData);
  } catch (error) {
    console.error("GetUserCredits | Error:", error);
    return NextResponse.json(
      { error: "Failed to get user credits" },
      { status: 500 }
    );
  }
}
