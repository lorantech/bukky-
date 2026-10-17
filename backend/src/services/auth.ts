import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User, type IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";

export interface TokenPayload {
  userId: string;
  role: "admin" | "customer";
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const setAuthCookie = (res: any, token: string) => {
  res.cookie("session", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

export const clearAuthCookie = (res: any) => {
  res.clearCookie("session", { path: "/" });
};

export const register = async (input: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) throw ApiError.conflict("Email already registered");
  return User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.password,
    role: "customer",
  });
};

export const login = async (input: {
  email: string;
  password: string;
}): Promise<IUser> => {
  const user = await User.findOne({ email: input.email.toLowerCase() });
  if (!user) throw ApiError.unauthorized("Invalid email or password");
  const ok = await user.comparePassword(input.password);
  if (!ok) throw ApiError.unauthorized("Invalid email or password");
  return user;
};

export const toSafeUser = (user: IUser) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  role: user.role,
});