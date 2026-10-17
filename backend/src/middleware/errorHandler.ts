import { type Request, type Response, type NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const asyncHandler =
  <T>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  // Mongoose validation error
  if (err instanceof Error && err.name === "ValidationError") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: err.message,
      },
    });
  }

  // Mongoose duplicate key (MongoServerError code 11000 in Mongoose 8)
  if (err instanceof Error && (err as any).code === 11000) {
    return res.status(409).json({
      error: {
        code: "CONFLICT",
        message: "Resource already exists",
      },
    });
  }

  // JWT errors
  if (err instanceof Error && err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid token" },
    });
  }
  if (err instanceof Error && err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token expired" },
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: process.env.NODE_ENV === "production" ? "Internal server error" : (err as Error)?.message,
    },
  });
};