import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: "admin" | "customer";
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.session;
  if (!token) {
    return next(ApiError.unauthorized("Please log in to continue"));
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      role: "admin" | "customer";
    };
    const user = await User.findById(payload.userId).select("-passwordHash");
    if (!user) {
      return next(ApiError.unauthorized("User not found"));
    }
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role as "admin" | "customer",
    };
    return next();
  } catch {
    return next(ApiError.unauthorized("Invalid or expired session"));
  }
};

export const requireRole =
  (...roles: ("admin" | "customer")[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden("Insufficient permissions"));
    }
    return next();
  };