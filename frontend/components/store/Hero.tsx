"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";
import { HERO_IMAGES } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/motion";

const HEROES = [
  { src: HERO_IMAGES[0].src, alt: HERO_IMAGES[0].alt, eyebrow: "New Season", title: "Wear Your Confidence" },
  { src: HERO_IMAGES[1].src, alt: HERO_IMAGES[1].alt, eyebrow: "The Atelier Edit", title: "Tailored To Adore" },
  { src: HERO_IMAGES[2].src, alt: HERO_IMAGES[2].alt, eyebrow: "Heritage Luxury", title: "Rooted In Elegance" },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % HEROES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const hero = HEROES[index];
  const words = hero.title.split(" ");

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={hero.src}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image src={hero.src} alt="" aria-hidden fill className="object-cover scale-110 blur-2xl opacity-60" sizes="100vw" />
            <Image src={hero.src} alt={hero.alt} fill priority={index === 0} className="object-contain object-right md:object-right" sizes="100vw" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/30 to-transparent" />
      </div>
      <div className="relative z-10 container-page pb-20 pt-40 w-full">
        <p className="label !text-champagne mb-5">{hero.eyebrow} — {BRAND.tagline}</p>
        <h1 className="editorial-h1 text-ivory max-w-6xl" aria-label={hero.title}>
          <AnimatePresence mode="wait">
            <motion.span
              key={`title-${index}`}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -24, transition: { duration: 0.4 } }}
              variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
              className="block"
            >
              {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                  <motion.span className="inline-block" variants={{ hidden: { y: "110%" }, visible: { y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } } }}>
                    {w}{i < words.length - 1 ? "\u00A0" : ""}
                  </motion.span>
                </span>
              ))}
            </motion.span>
          </AnimatePresence>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ivory/70">{BRAND.description}</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button href="/shop" variant="primary" className="!bg-ivory !text-charcoal hover:!bg-champagne hover:!text-charcoal">
            Shop the collection <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/custom-orders" variant="ghost" className="!text-ivory !border-ivory/50 hover:!bg-ivory hover:!text-charcoal">
            Book custom fitting
          </Button>
        </div>
        <div className="mt-14 flex items-center gap-3">
          {HEROES.map((h, i) => (
            <button key={h.src} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`} className="relative h-1 w-16 bg-ivory/20 overflow-hidden">
              <span className={`absolute inset-0 bg-champagne origin-left ${i === index ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}