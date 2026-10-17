// Single source of truth for the brand. Never hardcode the brand name elsewhere.
export const BRAND = {
  name: "Bukky Collection",
  wordmark: "BUKKY COLLECTION",
  tagline: "Wear Your Confidence",
  description:
    "Tailored luxury rooted in African heritage. Premium fashion, made to order.",
  url: "https://bukkycollection.com",
  whatsapp: "+2347046681825",
  whatsappDisplay: "+234 704 668 1825",
  email: "concierge@bukkycollection.com",
  instagram: "@bukky_fashion_collection",
  tiktok: "@bukky_fashion_collection",
  founded: 2018,
  currency: "NGN",
  currencySymbol: "N\u20A6",
  accentColor: "#B79B6A",
} as const;

export function siteUrl(path = ""): string {
  const base = BRAND.url.replace(/\/$/, "");
  const p = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${base}${p}`;
}

export function ogTitle(title: string): string {
  return title ? `${title} | ${BRAND.wordmark}` : BRAND.wordmark;
}

export function formatPrice(amount: number): string {
  return `${BRAND.currencySymbol}${amount.toLocaleString("en-NG")}`;
}

export function whatsappUrl(message = ""): string {
  const text = encodeURIComponent(message || BRAND.tagline);
  return `https://wa.me/${BRAND.whatsapp.replace(/\+/g, "")}?text=${text}`;
}

export function instagramUrl(): string {
  return `https://instagram.com/${BRAND.instagram.replace("@", "")}`;
}

export function tiktokUrl(): string {
  return `https://tiktok.com/@${BRAND.tiktok.replace("@", "")}`;
}