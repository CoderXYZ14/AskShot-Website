import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import UserModel, { User } from "../../../../models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const webhookData = await request.json();
    
    // Log webhook data for debugging
    console.log("Cashfree webhook received:", webhookData);
    
    // Extract payment information
    const { orderId, orderAmount, referenceId, txStatus } = webhookData;
    
    if (txStatus === "SUCCESS") {
      // Extract user ID from order ID (assuming format: order_timestamp_userId)
      const orderIdParts = orderId.split("_");
      if (orderIdParts.length >= 3) {
        const userId = orderIdParts[2];
        
        // Update user subscription
        const user = await UserModel.findById(userId).exec() as User;
        if (user) {
          user.tier = "paid";
          await user.save();
          
          console.log(`User ${user.email} upgraded to paid tier via webhook`);
        }
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
