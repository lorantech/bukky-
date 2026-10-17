"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

// Cinematic word-by-word headline reveal
export function RevealWords({ text, className, as: Tag = "span", delay = 0 }: { text: string; className?: string; as?: "span" | "h1" | "h2" | "h3" | "p"; delay?: number }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    const Cmp = Tag as "span";
    return <Cmp className={className}>{text}</Cmp>;
  }
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

// Parallax image frame
export function ParallaxImage({ children, className, speed = 60 }: { children: ReactNode; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  if (reduced) return <div ref={ref} className={className}>{children}</div>;
  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y, scale: 1.15 }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

// Gold hairline that draws itself on scroll into view
export function GoldRule({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={`h-px bg-champagne ${className}`} />;
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "left" }}
      className={`h-px bg-gradient-to-r from-champagne via-gold to-champagne ${className}`}
    />
  );
}

// Slow Ken Burns zoom for hero imagery
export function KenBurns({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ scale: 1.12 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
