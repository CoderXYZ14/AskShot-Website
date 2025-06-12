import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  email: string;
  name?: string;
  image?: string;
  role: "user" | "admin";
  tier: "free" | "paid";
  freeTrialsLeft: number;
  maxCredits: number;
  nextTrialReset: Date;
  googleId?: string;
}

const UserSchema: Schema<User> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    tier: { type: String, enum: ["free", "paid"], default: "free" },
    freeTrialsLeft: { type: Number, default: 5 },
    maxCredits: { type: Number, default: 5 },
    nextTrialReset: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    googleId: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (this.isModified("tier")) {
    this.maxCredits = this.tier === "paid" ? 20 : 5;
    this.freeTrialsLeft = this.maxCredits;
  }
  next();
});

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);
export default UserModel as mongoose.Model<User>;
