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
    const cacheKey = `user:tier:${userEmail}`;

    // Try to get data from cache first
    try {
      const cachedTier = await redis.get(cacheKey);
      if (cachedTier) {
        return NextResponse.json(cachedTier);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }

    await dbConnect();

    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tierData = {
      tier: user.tier,
    };

    // Cache the tier data for 1 hour (3600 seconds) as it rarely changes
    try {
      await redis.set(cacheKey, JSON.stringify(tierData), { ex: 3600 });
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json(tierData);
  } catch (error) {
    console.error("GetUserTier | Error:", error);
    return NextResponse.json(
      { error: "Failed to get user tier" },
      { status: 500 }
    );
  }
}
