import { Schema, model, type Document, type Types } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  customerName: string;
  rating: number;
  title: string | null;
  body: string;
  videoUrl: string | null;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    customerName: { type: String, required: true, trim: true, maxlength: 120 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: null, maxlength: 160 },
    body: { type: String, required: true, maxlength: 2000 },
    videoUrl: { type: String, default: null },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, approved: 1, createdAt: -1 });

export const Review = model<IReview>("Review", reviewSchema);
