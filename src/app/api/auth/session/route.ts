import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { checkAndResetTrials } from "@/lib/resetTrials";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { authenticated: false, message: "No session found" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user || !user._id) {
      return NextResponse.json(
        { authenticated: false, message: "User not found in database" },
        { status: 401 }
      );
    }

    await checkAndResetTrials(String(user._id));
    const updatedUser = await UserModel.findById(user._id);
  
  return NextResponse.json({
    authenticated: true,
    user: {
      ...session.user,
      role: updatedUser?.role ?? "user",
      tier: updatedUser?.tier ?? "free",
      freeTrialsLeft: updatedUser?.freeTrialsLeft ?? 0,
      id: String(updatedUser?._id),
      nextTrialReset: updatedUser?.nextTrialReset ?? null,
    },
  });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { authenticated: false, message: "Server error" },
      { status: 500 }
    );
  }
}
