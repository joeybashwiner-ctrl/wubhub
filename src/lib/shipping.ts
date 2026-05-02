import type { Carrier, Category, ShippingQuote } from "./types";

// Mock weight model — real impl would call USPS/UPS/FedEx APIs (Shippo, EasyPost, ShipEngine).
// These rates are realistic enough for a demo but not authoritative.
const BASE_WEIGHT_OZ: Record<Category, number> = {
  hoodie: 28,
  tee: 8,
  pashmina: 10,
  totem: 64,
  hat: 6,
  accessory: 4,
  other: 16,
};

interface CarrierConfig {
  carrier: Carrier;
  service: string;
  base_cents: number;
  per_oz_cents: number;
  est_days: string;
}

const CARRIERS: CarrierConfig[] = [
  { carrier: "usps", service: "USPS Priority Mail", base_cents: 595, per_oz_cents: 12, est_days: "2-3" },
  { carrier: "usps", service: "USPS Ground Advantage", base_cents: 425, per_oz_cents: 9, est_days: "3-5" },
  { carrier: "ups", service: "UPS Ground", base_cents: 825, per_oz_cents: 14, est_days: "1-5" },
  { carrier: "fedex", service: "FedEx Home Delivery", base_cents: 795, per_oz_cents: 13, est_days: "1-5" },
  { carrier: "fedex", service: "FedEx 2Day", base_cents: 1495, per_oz_cents: 18, est_days: "2" },
];

export function quoteShipping(category: Category, fromZip = "11201", toZip = "80202"): ShippingQuote[] {
  const oz = BASE_WEIGHT_OZ[category] ?? 16;
  return CARRIERS.map((c) => {
    // tiny pseudo-distance bump using zip diffs so the rate visibly responds to inputs
    const distFactor = 1 + Math.min(0.25, Math.abs(parseInt(fromZip, 10) - parseInt(toZip, 10)) / 100000);
    const rate = Math.round((c.base_cents + c.per_oz_cents * oz) * distFactor);
    return {
      carrier: c.carrier,
      service: c.service,
      rate_cents: rate,
      est_days: c.est_days,
    };
  }).sort((a, b) => a.rate_cents - b.rate_cents);
}

export function carrierLabel(c: Carrier): string {
  return c.toUpperCase();
}

export function carrierTint(c: Carrier): string {
  switch (c) {
    case "usps": return "border-acid text-acid";
    case "ups":  return "border-[#754f1d] text-[#c4914b]";   // brown
    case "fedex": return "border-[#4d148c] text-[#ad42d8]";   // purple
  }
}
