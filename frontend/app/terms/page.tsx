import { RevealWords } from "@/components/store/Cinematic";
import { BRAND } from "@/lib/brand";

export default function TermsPage() {
  return (
    <main className="pt-28 md:pt-36 pb-20 bg-ivory">
      <div className="container-page max-w-3xl">
        <span className="label">Legal</span>
        <RevealWords as="h1" text="Terms of Service" className="editorial-h1 mt-3 block" />
        <div className="mt-10 space-y-6 text-charcoal/80 leading-relaxed">
          <p>All pieces are made to order in 7–14 days unless stated. Delivery timelines are estimates; concierge keeps you updated.</p>
          <p>Ready-to-wear may be exchanged within 7 days unworn with tags. Custom and made-to-order pieces are final sale with complimentary alterations within 14 days.</p>
          <p>Prices are in Naira and include tailoring. {BRAND.name} reserves the right to confirm availability before cutting fabric.</p>
          <p>Contact {BRAND.email} for anything else.</p>
        </div>
      </div>
    </main>
  );
}
