import mongoose, { Schema, Document } from "mongoose";

export interface Question extends Document {
  userId: mongoose.Types.ObjectId;
  screenshotId: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema<Question> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  screenshotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screenshot', required: true },
  question: { type: String, required: true },
  answer: { type: String },
}, { timestamps: true });

const QuestionModel = mongoose.models.Question || mongoose.model<Question>("Question", QuestionSchema);
export default QuestionModel as mongoose.Model<Question>;
