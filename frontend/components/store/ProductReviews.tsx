"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getProductReviews, submitReview, type Review } from "@/services/store";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export function ProductReviews({ productId, fabric, care }: { productId: string; fabric: string | null; care: string | null }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [tab, setTab] = useState<"details" | "reviews">("details");
  const [rName, setRName] = useState("");
  const [rRating, setRRating] = useState(5);
  const [rBody, setRBody] = useState("");
  const toast = useToast();

  useEffect(() => {
    getProductReviews(productId).then((r) => { setReviews(r.reviews); setAverage(r.average); }).catch(() => {});
  }, [productId]);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReview({ productId, customerName: rName, rating: rRating, body: rBody });
      toast.success("Review submitted for approval");
      setRName(""); setRBody(""); setRRating(5);
    } catch {
      toast.error("Could not submit review");
    }
  };

  return (
    <div className="mt-16 border-t border-line pt-10">
      <div className="flex gap-8 border-b border-line mb-8">
        {(["details", "reviews"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("pb-4 label !text-charcoal/60", tab === t && "!text-charcoal border-b-2 border-champagne -mb-px")}>
            {t === "details" ? "Details & Care" : `Reviews (${reviews.length})`}
          </button>
        ))}
      </div>
      {tab === "details" ? (
        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div><p className="label mb-3">Fabric</p><p className="text-muted">{fabric ?? "Premium sourced fabric"}</p></div>
          <div><p className="label mb-3">Care</p><p className="text-muted">{care ?? "Dry clean only"}</p></div>
          <div><p className="label mb-3">Fit</p><p className="text-muted">Tailored fit. Between sizes? Size up or book custom measurements.</p></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {average !== null && <p className="font-serif text-2xl">{average} / 5 average</p>}
            {reviews.length === 0 && <p className="text-muted">No reviews yet — be the first to share your fit.</p>}
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-line pb-6">
                <div className="flex gap-1 mb-2">{Array.from({ length: 5 }).map((_, s) => (<Star key={s} className={cn("w-4 h-4", s < r.rating ? "fill-gold text-gold" : "text-line")} />))}</div>
                <p className="font-semibold">{r.customerName}</p>
                <p className="mt-1 text-muted text-sm">{r.body}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleReview} className="border border-line p-6 space-y-4 h-fit">
            <p className="label">Write a review</p>
            <input value={rName} onChange={(e) => setRName(e.target.value)} required placeholder="Your name" className="w-full bg-transparent border-b border-line py-3 focus:outline-none focus:border-champagne" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRRating(n)} aria-label={`${n} stars`}><Star className={cn("w-6 h-6", n <= rRating ? "fill-gold text-gold" : "text-line")} /></button>
              ))}
            </div>
            <textarea value={rBody} onChange={(e) => setRBody(e.target.value)} required placeholder="How did it fit?" rows={4} className="w-full bg-transparent border border-line p-3 focus:outline-none focus:border-champagne" />
            <Button type="submit" variant="primary" className="w-full">Submit review</Button>
          </form>
        </div>
      )}
    </div>
  );
}
