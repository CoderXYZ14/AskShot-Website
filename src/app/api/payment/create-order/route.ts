import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import dbConnect from "../../../../lib/dbConnect";
import UserModel, { User } from "../../../../models/User";
import {
  createCashfreeOrder,
  CashfreeOrderData,
} from "../../../../lib/cashfree";

export async function POST() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = (await UserModel.findOne({
      email: session.user.email,
    }).exec()) as User;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.tier === "paid") {
      return NextResponse.json(
        { error: "You already have a premium subscription" },
        { status: 400 }
      );
    }

    const orderId = `order_${Date.now()}_${user._id?.toString()}`;

    const orderData = {
      order_id: orderId,
      order_amount: 1,
      order_currency: "INR",
      customer_details: {
        customer_id: user._id?.toString() || `user_${Date.now()}`,
        customer_name: user.name || "AskShot User",
        customer_email: user.email,
        customer_phone: "9999999999", // Default phone number required by Cashfree
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/status?order_id=${orderId}`,
      },
      order_note: "AskShot Premium Subscription",
    };

    // Use the utility function to create the order
    const response = await createCashfreeOrder(orderData as CashfreeOrderData);

    // Log the full response for debugging
    console.log(
      "Full Cashfree response in API route:",
      JSON.stringify(response)
    );

    if (!response.payment_session_id) {
      console.error("No payment_session_id in Cashfree response");
      return NextResponse.json(
        { error: "Payment gateway did not return a session ID" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: response.payment_session_id,
      orderId: orderId,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
