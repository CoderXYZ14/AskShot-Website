import mongoose, { Schema, Document } from "mongoose";

export interface Order extends Document {
  userId: mongoose.Types.ObjectId;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paymentSessionId: string;
  planType: string;
  period: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      required: true,
      default: "CREATED",
    },
    paymentSessionId: {
      type: String,
    },
    planType: {
      type: String,
      default: "Pro",
    },
    period: {
      type: String,
      default: "monthly",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema);
