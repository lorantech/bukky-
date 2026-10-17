export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown[]
  ) {
    super(message);
    this.name = "ApiError";
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, ApiError);
    }
  }

  static badRequest(message: string, details?: unknown[]) {
    return new ApiError(400, message, "BAD_REQUEST", details);
  }
  static unauthorized(message = "Unauthorized", details?: unknown[]) {
    return new ApiError(401, message, "UNAUTHORIZED", details);
  }
  static forbidden(message = "Forbidden", details?: unknown[]) {
    return new ApiError(403, message, "FORBIDDEN", details);
  }
  static notFound(message = "Not found", details?: unknown[]) {
    return new ApiError(404, message, "NOT_FOUND", details);
  }
  static conflict(message: string, details?: unknown[]) {
    return new ApiError(409, message, "CONFLICT", details);
  }
  static tooManyRequests(message = "Too many requests", details?: unknown[]) {
    return new ApiError(429, message, "TOO_MANY_REQUESTS", details);
  }
  static internal(message = "Internal server error", details?: unknown[]) {
    return new ApiError(500, message, "INTERNAL_ERROR", details);
  }
}