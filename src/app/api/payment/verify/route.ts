import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "../../../../lib/dbConnect";
import UserModel, { User } from "../../../../models/User";
import { verifyPayment } from "../../../../lib/cashfree";
import { redis } from "../../../../lib/redis";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get orderId from query params
    const url = new URL(request.url);
    const orderId = url.searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    try {
      // Verify payment with Cashfree
      const paymentData = await verifyPayment(orderId);

      // Check if payment was successful
      if (paymentData && paymentData.length > 0) {
        const payment = paymentData[0];

        if (payment && payment.payment_status === "SUCCESS") {
          const user = (await UserModel.findOne({
            email: session.user.email,
          }).exec()) as User;

          if (user) {
            user.tier = "paid";
            user.maxCredits = 20;
            user.freeTrialsLeft = user.maxCredits;
            await user.save();

            // Invalidate Redis cache for user data
            const userEmail = session.user.email;
            try {
              await Promise.all([
                redis.del(`user:tier:${userEmail}`),
                redis.del(`user:profile:${userEmail}`),
                redis.del(`user:credits:${userEmail}`),
              ]);
            } catch (redisError) {
              console.error("Redis cache invalidation error:", redisError);
            }

            return NextResponse.json({
              success: true,
              message: "Payment successful and subscription upgraded",
              orderId: orderId,
            });
          }
        }
      }

      return NextResponse.json({
        success: false,
        message: "Payment verification failed",
      });
    } catch (paymentError) {
      console.error("Error verifying payment with Cashfree:", paymentError);
      return NextResponse.json(
        { error: "Failed to verify payment with payment gateway" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in payment verification route:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
