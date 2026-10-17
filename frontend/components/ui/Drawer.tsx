"use client";

import React, { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { drawerVariants, usePrefersReducedMotion } from "@/lib/motion";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: "right" | "left";
  width?: string;
}

export function Drawer({ open, onClose, children, title, side = "right", width = "w-full sm:w-[420px]" }: DrawerProps) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (reduced) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-charcoal/40" onClick={onClose} />
        <div className={cn("absolute top-0 h-full bg-ivory shadow-xl", side === "right" ? "right-0" : "left-0", width)}>
          <div className="flex items-center justify-between p-4 border-b border-line">
            <span className="label">{title ?? ""}</span>
            <button onClick={onClose} className="p-2 text-charcoal" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative h-full bg-ivory shadow-2xl flex flex-col",
              side === "right" ? "ml-auto" : "mr-auto",
              width
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-line">
              <span className="label">{title ?? ""}</span>
              <button onClick={onClose} className="p-2 text-charcoal" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}