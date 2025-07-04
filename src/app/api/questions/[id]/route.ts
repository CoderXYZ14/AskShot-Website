import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import QuestionModel from "@/models/Question";
import { redis } from "@/lib/redis";
import { authOptions } from "../../auth/[...nextauth]/options";

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
    const questionId = params.id;
    const question = await QuestionModel.findById(questionId);

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const screenshotId = question.screenshotId;
    await QuestionModel.findByIdAndDelete(questionId);

    // Invalidate related caches
    try {
      await redis.del(`user:questions:${userId}:all`);
      await redis.del(`user:questions:${userId}:screenshot:${screenshotId}`);
      await redis.del(`screenshot:${screenshotId}:details`);

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
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
