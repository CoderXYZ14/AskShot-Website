import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email!;
    const cacheKey = `user:profile:${userEmail}`;

    try {
      const cachedUser = await redis.get(cacheKey);
      if (cachedUser) {
        return NextResponse.json(cachedUser);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }

    await dbConnect();

    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const createdAt = new Date((user as User).createdAt || Date.now());
    const memberSince = createdAt.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    const userData = {
      id: String(user._id),
      name: user.name || "",
      email: user.email,
      image: user.image || "",
      plan: user.tier === "paid" ? "pro" : "free",
      memberSince,
      extensionVersion: "v0.0.1",
      planStatus: "active",
      freeTrialsLeft: user.freeTrialsLeft,
      maxCredits: user.maxCredits,
    };

    try {
      await redis.set(cacheKey, JSON.stringify(userData), { ex: 3600 });
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email!;
    const { name } = await req.json();

    await dbConnect();

    const user = await UserModel.findOneAndUpdate(
      { email: userEmail },
      { name },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cacheKey = `user:profile:${userEmail}`;
    try {
      await redis.del(cacheKey);
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
