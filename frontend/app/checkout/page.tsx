"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/brand";
import { createOrder, payOrder } from "@/services/store";
import { useToast } from "@/components/ui/Toast";
import { RevealWords } from "@/components/store/Cinematic";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const deliveryFee = subtotal >= 500000 || subtotal === 0 ? 0 : 5000;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your bag is empty");
    setBusy(true);
    try {
      const order = await createOrder({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size ?? undefined, color: i.color ?? undefined })),
        deliveryAddress: address,
        notes: notes || undefined,
        deliveryFee,
      });
      const { authorizationUrl } = await payOrder(order.id);
      clear();
      window.location.href = authorizationUrl;
    } catch (err) {
      toast.error("Checkout failed — please try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="pt-28 md:pt-36 pb-20 bg-ivory min-h-screen">
      <div className="container-page">
        <span className="label">Secure checkout</span>
        <RevealWords as="h1" text="Almost Yours" className="editorial-h1 mt-3 block" />
        <div className="mt-12 grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          <motion.form onSubmit={handlePay} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="border border-line bg-ivory p-6 md:p-10 space-y-6">
            <p className="label">Contact</p>
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Adaeze Obi" />
            <div className="grid sm:grid-cols-2 gap-6">
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              <Input label="Phone / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+234 ..." />
            </div>
            <p className="label pt-4">Delivery</p>
            <Input label="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Street, city, state" />
            <div>
              <label className="label block mb-2">Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Delivery instructions, occasion date..." className="w-full bg-transparent border border-line p-3 focus:outline-none focus:border-champagne" />
            </div>
            <Button type="submit" variant="primary" className="w-full" loading={busy}>
              <Lock className="w-4 h-4" /> Pay {formatPrice(subtotal + deliveryFee)} <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-xs text-muted text-center">Secured by Paystack · Verve, Mastercard, Visa, bank transfer</p>
          </motion.form>
          <aside className="border border-line bg-charcoal text-ivory p-6 md:p-8 lg:sticky lg:top-28">
            <p className="label !text-champagne">Order summary</p>
            <div className="mt-4 space-y-4 max-h-80 overflow-y-auto">
              {items.map((i) => (
                <div key={`${i.productId}|${i.size}|${i.color}`} className="flex justify-between gap-3 text-sm">
                  <span className="text-ivory/80">{i.name} × {i.quantity}</span>
                  <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
              {items.length === 0 && <p className="text-ivory/60 text-sm">Your bag is empty.</p>}
            </div>
            <div className="mt-6 pt-6 border-t border-ivory/15 space-y-2 text-sm">
              <div className="flex justify-between text-ivory/70"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-ivory/70"><span>Delivery</span><span>{deliveryFee === 0 ? "Complimentary" : formatPrice(deliveryFee)}</span></div>
              <div className="flex justify-between font-serif text-2xl pt-2"><span>Total</span><span>{formatPrice(subtotal + deliveryFee)}</span></div>
            </div>
            <button onClick={() => router.push("/track")} className="mt-6 text-xs text-ivory/60 underline underline-offset-4 hover:text-ivory">Track an existing order</button>
          </aside>
        </div>
      </div>
    </main>
  );
}
