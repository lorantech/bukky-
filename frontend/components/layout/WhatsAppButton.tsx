"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { BRAND, whatsappUrl } from "@/lib/brand";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-charcoal text-ivory px-4 py-3 text-xs font-semibold tracking-[0.16em] uppercase hover:bg-burgundy transition-colors border border-champagne"
    >
      <MessageCircle className="w-4 h-4" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}