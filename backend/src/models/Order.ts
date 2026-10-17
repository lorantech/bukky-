import { Schema, model, type Document, type Types } from "mongoose";

export type OrderStatus = "pending" | "paid" | "tailoring" | "shipped" | "delivered" | "cancelled";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  image: string | null;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  reference: string;
  customer: Types.ObjectId | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  isCustomOrder: boolean;
  measurements: Record<string, string> | null;
  notes: string | null;
  paystackReference: string | null;
  paidAt: Date | null;
  deliveryAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: null },
    color: { type: String, default: null },
    image: { type: String, default: null },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    reference: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", default: null },
    customerName: { type: String, required: true, trim: true, maxlength: 120 },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerPhone: { type: String, required: true, trim: true, maxlength: 30 },
    items: { type: [itemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "tailoring", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    isCustomOrder: { type: Boolean, default: false },
    measurements: { type: Schema.Types.Mixed, default: null },
    notes: { type: String, default: null, maxlength: 2000 },
    paystackReference: { type: String, default: null },
    paidAt: { type: Date, default: null },
    deliveryAddress: { type: String, default: null, maxlength: 1000 },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customerEmail: 1, createdAt: -1 });
orderSchema.index({ customer: 1, createdAt: -1 });

export const Order = model<IOrder>("Order", orderSchema);
