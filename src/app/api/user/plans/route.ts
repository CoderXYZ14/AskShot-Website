import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import ScreenshotModel from "@/models/Screenshot";
import QuestionModel from "@/models/Question";

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

    // Get user's current plan
    const userPlanTier = user.tier === "paid" ? "pro" : "free";

    // Define plan limit types
    type ScreenshotLimit = number | "unlimited";

    interface PlanLimits {
      screenshotsPerDay: ScreenshotLimit;
      aiChatsPerDay: number;
    }

    // Define limits based on plan
    const limits: Record<string, PlanLimits> = {
      free: {
        screenshotsPerDay: 20,
        aiChatsPerDay: 5,
      },
      pro: {
        screenshotsPerDay: "unlimited",
        aiChatsPerDay: 20,
      },
    };

    // Get actual counts from database
    const userId = user._id;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count screenshots created today
    const screenshotCountToday = await ScreenshotModel.countDocuments({
      userId: userId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Count total screenshots
    const totalScreenshotCount = await ScreenshotModel.countDocuments({
      userId: userId,
    });

    // Calculate question count using maxCredits - freeTrialsLeft for today
    const questionCountToday = user.maxCredits - user.freeTrialsLeft;

    // Count total questions
    const totalQuestionCount = await QuestionModel.countDocuments({
      userId: userId,
    });

    // Get limits based on user's plan
    const planLimits = limits[userPlanTier];

    // Calculate percentages for progress bars
    const screenshotPercentage =
      planLimits.screenshotsPerDay === "unlimited"
        ? 0 // For unlimited plan, always show 0% usage
        : Math.min(
            100,
            (screenshotCountToday / planLimits.screenshotsPerDay) * 100
          );

    const aiChatsPercentage = Math.min(
      100,
      (questionCountToday / planLimits.aiChatsPerDay) * 100
    );

    return NextResponse.json({
      currentPlan: userPlanTier,
      usage: {
        screenshots: {
          daily: {
            used: screenshotCountToday,
            total: planLimits.screenshotsPerDay,
            percentage: screenshotPercentage,
          },
          total: totalScreenshotCount,
        },
        aiChats: {
          daily: {
            used: questionCountToday,
            total: planLimits.aiChatsPerDay,
            percentage: aiChatsPercentage,
          },
          total: totalQuestionCount,
        },
      },
    });
  } catch (error) {
    console.error("Error in plans API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
