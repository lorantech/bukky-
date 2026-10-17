import { Schema, model, type Document, type Types } from "mongoose";

export type ProductStatus = "draft" | "active" | "archived";

export interface IProductImage {
  url: string;
  alt?: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: Types.ObjectId;
  images: IProductImage[];
  sizes: string[];
  colors: string[];
  stock: number;
  status: ProductStatus;
  featured: boolean;
  fabric: string | null;
  care: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: { type: [imageSchema], default: [] },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["draft", "active", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    fabric: { type: String, default: null },
    care: { type: String, default: null },
  },
  { timestamps: true }
);

productSchema.index({ status: 1, featured: -1, createdAt: -1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: "text", description: "text" });

export const Product = model<IProduct>("Product", productSchema);
