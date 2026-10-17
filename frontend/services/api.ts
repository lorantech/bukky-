import axios, { type AxiosInstance, type AxiosError } from "axios";
import { BRAND } from "@/lib/brand";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export interface ApiError {
  error?: {
    code?: string;
    message?: string;
    details?: unknown[];
  };
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin")) {
        // silent fail for public routes; auth context handles admin
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.error?.message;
    if (msg) return msg;
    if (error.response?.status === 404) return "Not found";
    if (error.response?.status === 429) return "Too many requests, try again later";
    if (error.code === "ECONNABORTED") return "Request timed out";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}