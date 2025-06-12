import UserModel from "@/models/User";
import dbConnect from "./dbConnect";

export async function checkAndResetTrials(userId: string): Promise<number> {
  await dbConnect();
  const user = await UserModel.findById(userId);
  if (!user) return 0;

  const now = new Date();
  if (now >= user.nextTrialReset) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysPassed =
      Math.floor((now.getTime() - user.nextTrialReset.getTime()) / msPerDay) +
      1;

    user.freeTrialsLeft = user.maxCredits;
    user.nextTrialReset = new Date(
      user.nextTrialReset.getTime() + daysPassed * msPerDay
    );

    await user.save();
  }

  return user.freeTrialsLeft;
}

export async function useFreeTrial(userId: string): Promise<number> {
  await dbConnect();
  await checkAndResetTrials(userId);

  const user = await UserModel.findById(userId);
  if (!user) return 0;

  if (user.freeTrialsLeft > 0) {
    user.freeTrialsLeft -= 1;
    await user.save();
  }

  return user.freeTrialsLeft;
}
