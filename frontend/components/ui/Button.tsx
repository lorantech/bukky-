"use client";

import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";

// framer-motion's motion.button types its own onAnimationStart/onAnimationComplete/
// onAnimationEnd (AnimationDefinition) which clash with React's DOM animation handlers.
// Omit the DOM versions so spreading ...rest onto motion.button typechecks.
type MotionSafeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDragStart" | "onDragEnd" | "onDrag"
>;

interface ButtonProps extends MotionSafeButtonProps {
  variant?: "primary" | "ghost" | "burgundy" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingLabel?: ReactNode;
  href?: string;
  external?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingLabel,
  href,
  external,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold tracking-[0.16em] uppercase text-[0.72rem] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne";

  const variants = {
    primary: "bg-charcoal text-ivory hover:bg-burgundy",
    ghost: "bg-transparent text-charcoal hover:bg-charcoal/5",
    burgundy: "bg-burgundy text-ivory hover:bg-charcoal",
    outline: "border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory",
  };

  const sizes = {
    sm: "px-4 py-2.5",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const MotionButton = motion.button;
  const reduced = usePrefersReducedMotion();

  const content = loading ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      {loadingLabel ?? "Loading"}
    </>
  ) : (
    children
  );

  const motionProps = {
    whileHover: !reduced ? { scale: 1.02 } : undefined,
    whileTap: !reduced ? { scale: 0.97 } : undefined,
    transition: { duration: 0.2 },
  };

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(base, variants[variant], sizes[size], disabled && "opacity-50 pointer-events-none", className)}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cn(base, variants[variant], sizes[size], disabled && "opacity-50 pointer-events-none", className)}>
        {content}
      </Link>
    );
  }

  return (
    <MotionButton
      type="button"
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], disabled && "opacity-50 cursor-not-allowed", className)}
      {...motionProps}
      {...rest}
    >
      {content}
    </MotionButton>
  );
}