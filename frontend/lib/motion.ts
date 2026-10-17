// Shared motion tokens. All variants respect prefers-reduced-motion.
// NOTE: `prefersReducedMotion` is intentionally NOT evaluated at module scope.
// Reading window/matchMedia during SSR vs hydration produces different trees.
// Use the `usePrefersReducedMotion()` hook (client-only, post-mount) instead.
"use client";

import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";

export const EASING = [0.22, 1, 0.36, 1] as const;

export const MOTION_DURATION = {
  fast: 0.25,
  base: 0.55,
  slow: 0.9,
  reveal: 0.9,
} as const;

export const prefersReducedMotion = false;

const QUERY = "(prefers-reduced-motion: reduce)";

function readPreference(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(QUERY).matches;
}

// Client-only hook: returns false on first render (matches SSR), then the real
// OS preference after mount. Components that branch on this MUST render the
// non-reduced tree until mounted to keep hydration identical.
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(readPreference());
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export const reducedMotion = {
  animate: { transition: { duration: 0 } },
  initial: { opacity: 1 },
  whileHover: {},
  whileTap: {},
  whileInView: {},
  transition: { duration: 0 },
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATION.base, ease: EASING },
  },
};

export const reveal: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", WebkitClipPath: "inset(100% 0 0 0)" },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    WebkitClipPath: "inset(0% 0 0 0)",
    transition: { duration: MOTION_DURATION.reveal, ease: EASING },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATION.base, ease: EASING },
  },
};

export const imageMask: Variants = {
  hidden: { scale: 1.15, opacity: 0.6 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: MOTION_DURATION.slow, ease: EASING },
  },
};

export const parallax = (y: number) => ({
  y,
  transition: { duration: 0.2, ease: "easeOut" },
});

export const magnetic = {
  whileHover: { scale: 1.02, transition: { duration: 0.2, ease: EASING } },
  whileTap: { scale: 0.97 },
};

export const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: EASING },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.35, ease: EASING },
  },
};

export const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: EASING },
  },
};

export const countUp = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASING } },
};