import { Schema, model, type Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Subscriber = model<ISubscriber>("Subscriber", subscriberSchema);
