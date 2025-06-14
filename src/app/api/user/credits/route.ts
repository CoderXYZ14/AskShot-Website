import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      freeTrialsLeft: user.freeTrialsLeft,
      isExpired: user.freeTrialsLeft <= 0
    });
  } catch (error) {
    console.error("GetUserCredits | Error:", error);
    return NextResponse.json(
      { error: "Failed to get user credits" },
      { status: 500 }
    );
  }
}
