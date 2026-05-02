"use client";

import { useEffect } from "react";
import { money } from "@/lib/format";
import { conditionLabel } from "@/lib/format";
import type { Listing } from "@/lib/types";

function ApplePayLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M17.5 12.5c0-2.5 2-3.7 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9-1.6 0-3.1 1-4 2.4C2.9 12 4 18 6.4 21.3c.9 1.4 2.1 2.6 3.6 2.6 1.5-.1 2-.9 3.7-.9s2.2.9 3.7.9c1.5 0 2.5-1.4 3.4-2.7.7-1 1.3-2 1.7-3.1-1-.3-3-1.6-3-3.6zm-2.4-7.4C16 4 16.5 2.7 16.4 1.4c-1.1.1-2.5.7-3.3 1.6-.7.7-1.4 2.1-1.2 3.3 1.2.1 2.5-.6 3.2-1.2z" />
    </svg>
  );
}

export function CheckoutSheet({
  open,
  onClose,
  listing,
  sellerName,
  onPay,
}: {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  sellerName: string;
  onPay: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const itemCents = listing.asking_price_cents ?? listing.buy_now_price_cents ?? 0;
  const shipCents = listing.shipping_price_cents;
  const taxCents = Math.round(itemCents * 0.078);
  const totalCents = itemCents + shipCents + taxCents;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-bg border-t-2 border-acid pt-3 pb-8 animate-wub-sheet-up"
        role="dialog"
        aria-modal
      >
        <div className="w-9 h-1 bg-line mx-auto mb-4" />
        <div className="px-5">
          <h2 className="display text-2xl">CONFIRM PURCHASE</h2>

          {/* Item card */}
          <div className="mt-4 p-3 bg-surface border border-line rounded-card flex gap-3">
            <img
              src={listing.images[0]}
              alt=""
              className="w-16 h-16 object-cover"
            />
            <div className="flex-1">
              <div className="text-[13px] font-extrabold uppercase tracking-tight">
                {listing.title}
              </div>
              <div className="label mt-0.5">
                @{sellerName} · {listing.size} · {conditionLabel(listing.condition)}
              </div>
              <div className="mono-price text-base mt-1">{money(itemCents)}</div>
            </div>
          </div>

          {/* Ship to */}
          <div className="mt-4">
            <div className="label mb-1.5">SHIP TO</div>
            <div className="p-3 bg-surface border border-line rounded-card flex justify-between items-center">
              <div>
                <div className="text-[13px] font-bold">Bry Clark</div>
                <div className="label mt-0.5">447 NEON ST · DENVER, CO 80202</div>
              </div>
              <button className="label text-acid hover:text-ink">EDIT</button>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-4 py-3 border-t border-line border-b border-line">
            {([
              ["ITEM", money(itemCents)],
              ["SHIPPING", money(shipCents)],
              ["SALES TAX", money(taxCents)],
            ] as const).map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5 font-mono text-[11px]">
                <span className="label">{l}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between py-3 items-baseline">
            <span className="label">TOTAL</span>
            <span className="mono-price text-3xl">{money(totalCents)}</span>
          </div>

          {/* Buyer protection */}
          <div className="p-2.5 bg-surface border border-line flex items-center gap-2">
            <span className="text-ok text-base">✓</span>
            <span className="label normal-case text-muted leading-relaxed">
              WUBHUB BUYER PROTECTION · FUNDS HELD UNTIL DELIVERY CONFIRMED
            </span>
          </div>

          {/* Apple Pay */}
          <button
            onClick={onPay}
            className="btn-apple-pay mt-4"
            data-testid="confirm-buy-btn"
          >
            <ApplePayLogo />
            <span className="ml-1">Pay</span>
          </button>
          <div className="text-center label mt-2.5 text-muted normal-case font-mono">
            DOUBLE‑CLICK SIDE BUTTON TO PAY · STRIPE CONNECT
          </div>
        </div>
      </div>
    </div>
  );
}
