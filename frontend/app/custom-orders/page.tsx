"use client";

import { useState } from "react";
import { RevealWords } from "@/components/store/Cinematic";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createOrder, payOrder } from "@/services/store";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/Toast";
import { Lock } from "lucide-react";

const FIELDS = ["Bust", "Waist", "Hips", "Shoulder", "Sleeve length", "Top length", "Skirt/Gown length", "Trouser length", "Thigh", "Neck"];

export default function CustomOrdersPage() {
  const { clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const order = await createOrder({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        items: [],
        notes: `CUSTOM: ${inspiration}`,
        isCustomOrder: true,
        measurements,
      });
      const { authorizationUrl } = await payOrder(order.id);
      clear();
      window.location.href = authorizationUrl;
    } catch {
      toast.error("Could not start custom order — chat with concierge instead");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="pt-28 md:pt-36 pb-20 bg-ivory min-h-screen">
      <div className="container-page max-w-4xl">
        <span className="label">Made for one — you</span>
        <RevealWords as="h1" text="Custom Orders" className="editorial-h1 mt-3 block" />
        <p className="mt-4 text-muted max-w-2xl">Describe your dream piece, drop your measurements, and pay a commitment deposit. Our atelier calls within 24 hours to confirm fabric and fit.</p>
        <form onSubmit={submit} className="mt-10 border border-line p-6 md:p-10 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Phone / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div>
            <label className="label block mb-2">Describe your piece</label>
            <textarea value={inspiration} onChange={(e) => setInspiration(e.target.value)} required rows={4} placeholder="e.g. Royal blue agbada with champagne embroidery for December wedding..." className="w-full bg-transparent border border-line p-3 focus:outline-none focus:border-champagne" />
          </div>
          <div>
            <p className="label mb-4">Measurements (inches)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {FIELDS.map((f) => (
                <Input key={f} label={f} value={measurements[f] ?? ""} onChange={(e) => setMeasurements({ ...measurements, [f]: e.target.value })} placeholder="—" />
              ))}
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full" loading={busy}>
            <Lock className="w-4 h-4" /> Submit & pay deposit
          </Button>
          <p className="text-xs text-muted text-center">A stylist confirms every custom order on WhatsApp before cutting.</p>
        </form>
      </div>
    </main>
  );
}
