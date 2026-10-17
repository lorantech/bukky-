import { RevealWords } from "@/components/store/Cinematic";
import { BRAND } from "@/lib/brand";

export default function PrivacyPage() {
  return (
    <main className="pt-28 md:pt-36 pb-20 bg-ivory">
      <div className="container-page max-w-3xl">
        <span className="label">Legal</span>
        <RevealWords as="h1" text="Privacy Policy" className="editorial-h1 mt-3 block" />
        <div className="mt-10 space-y-6 text-charcoal/80 leading-relaxed">
          <p>{BRAND.name} collects only what we need to tailor and deliver your order: name, contact, measurements, and delivery address.</p>
          <p>Payments are processed securely by Paystack — we never see or store your card details.</p>
          <p>We use your email for order updates and, with consent, style letters. Unsubscribe anytime.</p>
          <p>Questions? {BRAND.email} · {BRAND.whatsappDisplay}</p>
        </div>
      </div>
    </main>
  );
}
