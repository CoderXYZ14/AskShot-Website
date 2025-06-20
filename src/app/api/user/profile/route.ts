import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ email: session.user.email });

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

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
