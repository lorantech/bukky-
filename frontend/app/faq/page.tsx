"use client";

import { useState } from "react";
import { RevealWords } from "@/components/store/Cinematic";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "How long does tailoring take?", a: "Ready-to-wear pieces ship in 3–5 days. Made-to-order and custom pieces take 7–14 days depending on detailing. Need it sooner? Message concierge for express." },
  { q: "How do I get measured?", a: "Book a virtual fitting on WhatsApp — our stylist guides you through each measurement on video. Lagos clients can visit the atelier in person." },
  { q: "What is your size range?", a: "We cut UK 6–24 as standard, and every style can be graded beyond that at no extra cost. Your body, your fit." },
  { q: "Do you deliver outside Nigeria?", a: "Yes — we ship worldwide via DHL in 5–10 business days. Duties are calculated at checkout for select countries." },
  { q: "What payment methods do you accept?", a: "Paystack secures every order: Verve, Mastercard, Visa, bank transfer and USSD. Cash on delivery is not available." },
  { q: "Can I return or exchange?", a: "Ready-to-wear can be exchanged within 7 days (unworn, tagged). Custom and made-to-order pieces are final sale — but we offer complimentary alterations within 14 days." },
  { q: "How do I care for my piece?", a: "Dry clean structured pieces, hand-wash soft fabrics cold, and store agbadas on padded hangers. Full care notes ship with every order." },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <main className="pt-28 md:pt-36 pb-20 bg-ivory min-h-screen">
      <div className="container-page max-w-3xl">
        <span className="label">Good to know</span>
        <RevealWords as="h1" text="Questions, Answered" className="editorial-h1 mt-3 block" />
        <div className="mt-12 divide-y divide-line border-y border-line">
          {FAQS.map((f, i) => (
            <div key={i}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 py-6 text-left">
                <span className="font-serif text-xl">{f.q}</span>
                <ChevronDown className={cn("w-5 h-5 flex-shrink-0 transition-transform", open === i && "rotate-180 text-burgundy")} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                    <p className="pb-6 text-muted leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
