"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (reduced) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 bg-ivory">
        <div className="container-page flex items-center gap-4 h-16">
          <Search className="w-5 h-5 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search collections..."
            className="flex-1 bg-transparent border-b border-line py-2 text-lg focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} aria-label="Close">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="container-page py-8">
          <p className="label mb-4">Popular</p>
          <div className="flex flex-wrap gap-2">
            {["Agbada", "Senator Wear", "Ready-to-Wear", "Custom Designs"].map((t) => (
              <button key={t} className="px-4 py-2 border border-line text-sm hover:border-charcoal">
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-ivory"
        >
          <div className="container-page flex items-center gap-4 h-16">
            <Search className="w-5 h-5 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collections, products..."
              className="flex-1 bg-transparent border-b border-line py-2 text-lg focus:outline-none focus:border-charcoal"
              autoFocus
            />
            <button onClick={onClose} aria-label="Close" className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="container-page py-8">
            <p className="label mb-4">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {["Agbada", "Senator Wear", "Ready-to-Wear", "Custom Designs", "Accessories"].map((t) => (
                <button key={t} className="px-4 py-2 border border-line text-sm hover:border-charcoal transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}