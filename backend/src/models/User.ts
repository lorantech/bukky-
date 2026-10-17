import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";

export interface IUser extends Document {
  name: string | null;
  email: string;
  passwordHash: string;
  role: "admin" | "customer";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, default: null },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = model<IUser>("User", userSchema);

export const seedAdmin = async () => {
  const email = env.ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    // Self-heal: ensure the seeded admin keeps the role and the current password.
    // (If ADMIN_PASSWORD changed in .env, re-hash so login keeps working.)
    let changed = false;
    if (existing.role !== "admin") {
      existing.role = "admin";
      changed = true;
    }
    const matches = await existing.comparePassword(env.ADMIN_PASSWORD);
    if (!matches) {
      existing.passwordHash = env.ADMIN_PASSWORD;
      changed = true;
    }
    if (changed) {
      await existing.save();
      console.log(`Admin repaired: ${email}`);
    }
    return;
  }
  await User.create({
    name: env.ADMIN_NAME,
    email,
    passwordHash: env.ADMIN_PASSWORD,
    role: "admin",
  });
  console.log(`Admin seeded: ${env.ADMIN_EMAIL}`);
};