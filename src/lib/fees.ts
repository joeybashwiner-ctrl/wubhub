// wubhub fee structure — positioned against Poshmark's flat 20% on $20+
// Marketplace: 8.08% of item subtotal (Stripe processing passed through).
// Trade: flat $1.99 per side (covers escrow + dispute infra).
// Why 8.08% — undercuts Poshmark by ~12pp at every price tier and lands inside the
// Whatnot (8% verified) / Mercari (10%) band so sellers porting their inventory
// see real take-home gain on day one.

export const MARKETPLACE_FEE_RATE = 0.0808;
export const STRIPE_RATE = 0.029;
export const STRIPE_FLAT_CENTS = 30;
export const TRADE_FEE_CENTS = 199;

export interface MarketplaceFeeBreakdown {
  subtotal_cents: number;
  platform_cents: number;        // wubhub take
  stripe_cents: number;          // pass-through
  seller_payout_cents: number;
  poshmark_payout_cents: number; // for the comparison ribbon
  poshmark_fee_cents: number;
  saved_vs_poshmark_cents: number;
}

export function marketplaceFee(subtotal_cents: number): MarketplaceFeeBreakdown {
  const platform = Math.round(subtotal_cents * MARKETPLACE_FEE_RATE);
  const stripe = Math.round(subtotal_cents * STRIPE_RATE) + STRIPE_FLAT_CENTS;
  const payout = subtotal_cents - platform - stripe;
  const poshmark =
    subtotal_cents < 2000 ? 295 : Math.round(subtotal_cents * 0.20);
  const poshmark_payout = subtotal_cents - poshmark;
  return {
    subtotal_cents,
    platform_cents: platform,
    stripe_cents: stripe,
    seller_payout_cents: payout,
    poshmark_fee_cents: poshmark,
    poshmark_payout_cents: poshmark_payout,
    saved_vs_poshmark_cents: poshmark - platform,
  };
}

export function tradeFee(): { each_cents: number; total_cents: number } {
  return { each_cents: TRADE_FEE_CENTS, total_cents: TRADE_FEE_CENTS * 2 };
}
