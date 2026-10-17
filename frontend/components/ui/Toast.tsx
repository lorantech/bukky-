"use client";

import React from "react";
import { Toaster, toast } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0E0E0D",
          color: "#F4EFE6",
          fontFamily: "var(--font-manrope)",
          fontSize: "0.875rem",
          borderRadius: 0,
          border: "1px solid #B79B6A",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#B79B6A", secondary: "#F4EFE6" },
        },
        error: {
          iconTheme: { primary: "#4A1620", secondary: "#F4EFE6" },
        },
      }}
    />
  );
}

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    dismiss: (id?: string) => toast.dismiss(id),
    custom: toast.custom,
  };
}