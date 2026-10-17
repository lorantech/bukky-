import Image from "next/image";
import { RevealWords, GoldRule } from "@/components/store/Cinematic";
import { BRAND, whatsappUrl } from "@/lib/brand";
import { MEDIA } from "@/lib/media";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <main className="pt-28 md:pt-36 pb-20 bg-ivory">
      <div className="container-page">
        <span className="label">Our story</span>
        <RevealWords as="h1" text="Dressed With Intention" className="editorial-h1 mt-3 block max-w-5xl" />
        <GoldRule className="my-10 max-w-[280px]" />
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-14">
          {MEDIA.about.map((src, i) => (
            <div key={src} className="group relative aspect-[4/5] overflow-hidden bg-charcoal">
              <Image
                src={src}
                alt={i === 0 ? "Bukky Collection signature look" : "Atelier craftsmanship detail"}
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-60" />
              <span className="absolute bottom-5 left-5 label !text-champagne">
                {i === 0 ? "The Muse" : "The Craft"}
              </span>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6 text-lg text-charcoal/80 leading-relaxed">
            <p>Founded in {BRAND.founded}, {BRAND.name} began with a single belief — that African tailoring deserves a place on the world&apos;s most glamorous stages.</p>
            <p>Every piece is cut in our Lagos atelier by master tailors, finished by hand, and fitted to your exact measurements. No mass runs. No compromises.</p>
            <p>From royal agbadas to red-carpet gowns, our clients wear confidence — tailored, pressed, and unforgettable.</p>
          </div>
          <div id="atelier" className="border border-line p-8 bg-charcoal text-ivory h-fit">
            <p className="label !text-champagne">The Atelier</p>
            <ul className="mt-6 space-y-4 text-ivory/80">
              <li className="flex gap-3"><span className="text-champagne">01</span> Private fittings in Lagos & Abuja</li>
              <li className="flex gap-3"><span className="text-champagne">02</span> Virtual measurements worldwide</li>
              <li className="flex gap-3"><span className="text-champagne">03</span> Bridal & aso-ebi parties</li>
              <li className="flex gap-3"><span className="text-champagne">04</span> 7–14 day made-to-order</li>
            </ul>
            <div className="mt-8">
              <Button href="/custom-orders" variant="primary" className="!bg-ivory !text-charcoal hover:!bg-champagne">Book a fitting</Button>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center border-t border-line pt-12">
          <p className="text-muted">Prefer to talk? <a className="text-burgundy underline underline-offset-4" target="_blank" rel="noopener noreferrer" href={whatsappUrl("Hello, I'd love to know more")}>Chat on WhatsApp</a> · {BRAND.email}</p>
        </div>
      </div>
    </main>
  );
}
