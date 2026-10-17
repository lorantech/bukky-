export * from "../schemas";

export type Currency = "NGN" | "USD" | "GBP" | "EUR";

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "tailoring" 
  | "shipped" 
  | "delivered" 
  | "cancelled" 
  | "refunded";

export type ReviewStatus = "pending" | "approved" | "rejected";
export type UserRole = "admin" | "customer";
export type VideoPlatform = "youtube" | "vimeo" | "instagram" | "tiktok";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;