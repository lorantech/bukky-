"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Truck, ShieldCheck, Scissors } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { BRAND, whatsappUrl } from "@/lib/brand";
import { MEDIA_VIDEOS, MEDIA_IMAGES } from "@/lib/media";
import { RevealWords, ParallaxImage, GoldRule } from "@/components/store/Cinematic";

export function AtelierBand() {
  const stats = [
    { icon: Scissors, stat: 8, suffix: "+ yrs", label: "Master tailoring" },
    { icon: Star, stat: 1200, suffix: "+", label: "Five-star fits" },
    { icon: Truck, stat: 36, suffix: "", label: "States delivered" },
    { icon: ShieldCheck, stat: 100, suffix: "%", label: "Fit guaranteed" },
  ];
  return (
    <section className="relative overflow-hidden bg-charcoal text-ivory">
      <ParallaxImage speed={50} className="absolute inset-0 opacity-25">
        <Image src={MEDIA_IMAGES.atelier || MEDIA_IMAGES.hero1.src} alt="Inside the Bukky Collection atelier" fill className="object-cover object-top" sizes="100vw" />
      </ParallaxImage>
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
      <div className="relative container-page section-py grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="label !text-champagne">The Atelier</span>
          <RevealWords as="h2" text="Cut for royalty, sewn with soul" className="editorial-h2 mt-3 block" />
          <GoldRule className="my-8 max-w-[240px]" />
          <p className="text-lg text-ivory/70 max-w-xl">Every Bukky piece begins on the cutting table — measured to your body, finished by hand, pressed to perfection.</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button href="/custom-orders" variant="primary" className="!bg-ivory !text-charcoal hover:!bg-champagne">Start custom order</Button>
            <a href={whatsappUrl("Hello Bukky Collection, I'd like a fitting")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-ivory/40 text-ivory text-[0.72rem] font-semibold tracking-[0.16em] uppercase hover:bg-ivory hover:text-charcoal transition-colors">WhatsApp concierge</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="border border-ivory/15 bg-ivory/[0.03] p-6 backdrop-blur">
              <s.icon className="w-5 h-5 text-champagne mb-4" strokeWidth={1.5} />
              <Counter value={s.stat} suffix={s.suffix} className="font-serif text-4xl" />
              <p className="label !text-ivory/50 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialBand() {
  const quotes = [
    { name: "Adaeze O.", text: "My agbada fit like it was poured on me. I have never felt this confident.", piece: "Royal Agbada" },
    { name: "Mrs. Adebayo", text: "From measurement to delivery, everything felt luxurious. Worth every naira.", piece: "Custom Gown" },
    { name: "Chiamaka E.", text: "The senator set turns heads everywhere. Tailoring is truly world-class.", piece: "Senator Set" },
  ];
  return (
    <section className="section-py bg-burgundy text-ivory overflow-hidden">
      <div className="container-page">
        <span className="label !text-champagne">Word of mouth</span>
        <RevealWords as="h2" text="Adored across Nigeria" className="editorial-h2 mt-3 block max-w-3xl" />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.figure key={q.name} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }} className="border border-ivory/15 bg-ivory/[0.04] p-8 flex flex-col">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, s) => (<Star key={s} className="w-4 h-4 fill-champagne text-champagne" />))}
              </div>
              <blockquote className="font-serif text-xl leading-relaxed flex-1">"{q.text}"</blockquote>
              <figcaption className="mt-6 pt-6 border-t border-ivory/10">
                <p className="text-sm font-semibold">{q.name}</p>
                <p className="label !text-champagne/80 mt-1">{q.piece}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConciergeBand() {
  return (
    <section className="section-py bg-ivory">
      <div className="container-page text-center max-w-3xl mx-auto">
        <span className="label">Concierge</span>
        <RevealWords as="h2" text="Not sure where to begin?" className="editorial-h2 mt-3 block" />
        <p className="mt-6 text-lg text-muted">Chat with our stylist on WhatsApp — measurements, fabrics, delivery, all handled.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href={whatsappUrl("Hello, I need styling help")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-charcoal text-ivory text-[0.72rem] font-semibold tracking-[0.16em] uppercase hover:bg-burgundy transition-colors">Chat on WhatsApp</a>
          <Button href="/faq" variant="ghost">Read the FAQ</Button>
        </div>
        <p className="mt-6 text-xs text-muted">{BRAND.whatsappDisplay} · {BRAND.email}</p>
      </div>
    </section>
  );
}