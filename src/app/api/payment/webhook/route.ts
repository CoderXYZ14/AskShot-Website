import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import UserModel, { User } from "../../../../models/User";
import OrderModel from "../../../../models/Order";
import { redis } from "../../../../lib/redis";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const webhookData = await request.json();

    // Extract payment information
    const { orderId, txStatus, referenceId } = webhookData;

    if (txStatus === "SUCCESS") {
      // Find the order in our database
      const order = await OrderModel.findOne({ orderId }).exec();

      if (order) {
        // Update order status
        order.status = "PAID";
        order.paymentSessionId = referenceId;
        await order.save();

        // Update user subscription
        const user = (await UserModel.findById(order.userId).exec()) as User;
        if (user) {
          user.tier = "paid";
          user.maxCredits = 20;
          user.freeTrialsLeft = user.maxCredits;
          await user.save();

          try {
            await Promise.all([
              redis.del(`user:tier:${user.email}`),
              redis.del(`user:profile:${user.email}`),
              redis.del(`user:credits:${user.email}`),
            ]);
          } catch (redisError) {
            console.error("Redis cache invalidation error:", redisError);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
