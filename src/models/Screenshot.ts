import mongoose, { Schema, Document } from "mongoose";

export interface Screenshot extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScreenshotSchema: Schema<Screenshot> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const ScreenshotModel = mongoose.models.Screenshot || mongoose.model<Screenshot>("Screenshot", ScreenshotSchema);
export default ScreenshotModel as mongoose.Model<Screenshot>;
