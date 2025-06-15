import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import dbConnect from "../../../../lib/dbConnect";
import UserModel, { User } from "../../../../models/User";
import { verifyPayment } from "../../../../lib/cashfree";

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
            user.maxCredits = 20; // Increase maxCredits for premium users
            user.freeTrialsLeft = user.maxCredits; // Set freeTrialsLeft to match maxCredits
            await user.save();

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
