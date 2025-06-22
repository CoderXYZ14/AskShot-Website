import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "../../../../lib/dbConnect";
import UserModel, { User } from "../../../../models/User";
import OrderModel from "../../../../models/Order";
import {
  createCashfreeOrder,
  CashfreeOrderData,
} from "../../../../lib/cashfree";

export async function POST(request: Request) {
  // Get the request body
  const body = await request.json();
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
      order_amount: body.amount || 679, // Default to monthly price if not specified
      order_currency: "INR",
      customer_details: {
        customer_id: user._id?.toString(),
        customer_name: user.name || "AskShot User",
        customer_email: user.email,
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/status?order_id=${orderId}`,
      },
      order_note: "Premium Subscription",
    };

    // Create order record in database
    await OrderModel.create({
      userId: user._id,
      orderId: orderId,
      amount: orderData.order_amount,
      currency: orderData.order_currency,
      status: "CREATED",
      planType: body.planType || "Pro",
      period: body.period || "monthly",
    });

    // Create order with payment gateway
    const response = await createCashfreeOrder(orderData as CashfreeOrderData);

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
