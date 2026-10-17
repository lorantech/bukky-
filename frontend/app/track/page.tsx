"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PackageSearch, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/brand";
import { getOrder, verifyPayment, type Order } from "@/services/store";
import { useToast } from "@/components/ui/Toast";
import { RevealWords } from "@/components/store/Cinematic";

const STAGES = ["pending", "paid", "tailoring", "shipped", "delivered"] as const;

export default function TrackPage() {
  const [ref, setRef] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      let found = await getOrder(ref.trim());
      if (found.status === "pending") {
        try {
          const v = await verifyPayment(ref.trim());
          if (v.paid) found = v.order;
        } catch { /* payment may not exist yet */ }
      }
      setOrder(found);
    } catch {
      toast.error("Order not found — check your reference");
      setOrder(null);
    } finally {
      setBusy(false);
    }
  };

  const stageIndex = order ? STAGES.indexOf(order.status as (typeof STAGES)[number]) : -1;

  return (
    <main className="pt-28 md:pt-36 pb-20 bg-ivory min-h-screen">
      <div className="container-page max-w-3xl">
        <span className="label">Concierge tracking</span>
        <RevealWords as="h1" text="Where Is My Order?" className="editorial-h1 mt-3 block" />
        <form onSubmit={lookup} className="mt-10 flex gap-3">
          <div className="flex-1"><Input label="Order reference" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="BC-XXXXXX" required /></div>
          <div className="pt-7"><Button type="submit" variant="primary" loading={busy}>Track</Button></div>
        </form>

        {order && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mt-10 border border-line p-6 md:p-10">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="label">Order {order.reference}</p>
                <p className="font-serif text-2xl mt-1">{formatPrice(order.total)}</p>
              </div>
              <span className="px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase bg-charcoal text-ivory">{order.status}</span>
            </div>
            {order.status === "cancelled" ? (
              <p className="mt-6 text-muted">This order was cancelled. Contact concierge for help.</p>
            ) : (
              <div className="mt-8">
                <div className="flex items-center">
                  {STAGES.map((s, i) => (
                    <div key={s} className="flex-1 flex items-center last:flex-none">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`w-9 h-9 flex items-center justify-center border ${i <= stageIndex ? "bg-charcoal text-ivory border-charcoal" : "border-line text-muted"}`}>
                          {i <= stageIndex ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                        </span>
                        <span className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase">{s}</span>
                      </div>
                      {i < STAGES.length - 1 && <div className={`flex-1 h-px mx-2 mb-6 ${i < stageIndex ? "bg-champagne" : "bg-line"}`} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-8 pt-6 border-t border-line space-y-2 text-sm">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between text-muted"><span>{it.name} × {it.quantity}</span><span>{formatPrice(it.price * it.quantity)}</span></div>
              ))}
            </div>
          </motion.div>
        )}

        {!order && (
          <div className="mt-10 border border-dashed border-line p-10 text-center text-muted">
            <PackageSearch className="w-8 h-8 mx-auto mb-3 text-champagne" />
            <p>Enter the reference from your confirmation to see live status.</p>
          </div>
        )}
      </div>
    </main>
  );
}
