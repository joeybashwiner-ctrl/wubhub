"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ShippingEstimator } from "@/components/ShippingEstimator";
import { Modal } from "@/components/Modal";
import { MetaRow } from "@/components/MetaRow";
import { useStore } from "@/lib/store";
import { money, relativeTime } from "@/lib/format";
import { carrierLabel, carrierTint } from "@/lib/shipping";
import type { ShippingQuote } from "@/lib/types";

const STAGES = [
  { key: "paid", label: "PAID" },
  { key: "shipped", label: "SHIPPED" },
  { key: "delivered", label: "DELIVERED" },
  { key: "completed", label: "COMPLETED" },
] as const;

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const { orders, listings, profiles, currentUserId, purchaseShippingLabel } = useStore();
  const order = orders.find((o) => o.id === params.id);
  const listing = listings.find((l) => l.id === order?.listing_id);
  const seller = profiles.find((p) => p.id === order?.seller_id);
  const buyer = profiles.find((p) => p.id === order?.buyer_id);

  const [labelOpen, setLabelOpen] = useState(false);
  const [picked, setPicked] = useState<ShippingQuote | undefined>();

  if (!order || !listing || !seller || !buyer) {
    return (
      <div className="px-5 py-32 text-center">
        <div className="display text-3xl">ORDER NOT FOUND</div>
        <Link href="/" className="btn btn-ghost mt-5">HOME</Link>
      </div>
    );
  }

  const isSeller = order.seller_id === currentUserId;
  const stageIdx = STAGES.findIndex((s) => s.key === order.status);

  function buyLabel() {
    if (!picked) return;
    purchaseShippingLabel(order!.id, picked);
    setLabelOpen(false);
    setPicked(undefined);
  }

  return (
    <div className="px-5 py-8 max-w-xl mx-auto pb-24">
      {/* Status hero */}
      <div className="border border-acid p-6 text-center bg-black/30">
        <div className="display text-5xl text-acid">{order.status.toUpperCase().replace("_", " ")}.</div>
        <div className="label mt-2 text-muted">RECEIPT #{order.id.slice(-6).toUpperCase()}</div>
      </div>

      {/* Timeline */}
      <div className="mt-6">
        <div className="label mb-3">PROGRESS</div>
        <div className="grid grid-cols-4 gap-2">
          {STAGES.map((s, i) => {
            const reached = i <= stageIdx;
            return (
              <div key={s.key} className="text-center">
                <div
                  className={`h-1 w-full ${reached ? "bg-acid" : "bg-line"}`}
                  aria-hidden
                />
                <div
                  className={`label mt-2 ${
                    reached ? "text-acid" : "text-muted"
                  }`}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item */}
      <div className="mt-6 p-3 bg-surface border border-line rounded-card flex gap-3">
        <img src={listing.images[0]} alt="" className="w-20 h-20 object-cover" />
        <div className="flex-1">
          <div className="text-[13px] font-extrabold uppercase tracking-tight">
            {listing.title}
          </div>
          <div className="label mt-1">
            @{seller.username} · {listing.size} · {listing.condition.replace(/_/g, " ").toUpperCase()}
          </div>
        </div>
      </div>

      {/* Receipt */}
      <div className="mt-6">
        <div className="label mb-2">RECEIPT</div>
        <div>
          <MetaRow label="ITEM" value={money(order.subtotal_cents)} />
          <MetaRow label="SHIPPING" value={money(order.shipping_cents)} />
          <MetaRow
            label="WUBHUB FEE 8.08%"
            value={`(SELLER) − ${money(order.platform_fee_cents)}`}
          />
          <MetaRow
            label="TOTAL CHARGED"
            value={money(order.total_cents)}
            accent
          />
        </div>
      </div>

      {/* Shipping label — seller only */}
      {isSeller && (
        <div className="mt-6 border border-line">
          <div className="px-4 py-3 border-b border-line flex items-center justify-between">
            <div>
              <div className="display text-base">SHIPPING LABEL</div>
              <div className="label mt-1 normal-case text-muted">
                SHIP WITHIN 5 DAYS · PRINT FROM WUBHUB
              </div>
            </div>
            <span
              className={`label px-2 py-1 border ${
                order.shipping_label
                  ? "border-acid text-acid"
                  : "border-line text-muted"
              }`}
            >
              {order.shipping_label ? "PURCHASED" : "NOT YET"}
            </span>
          </div>

          {order.shipping_label ? (
            <div className="p-4">
              <div className="flex items-center gap-2">
                <span className={`label px-1.5 py-0.5 border ${carrierTint(order.shipping_label.carrier)}`}>
                  {carrierLabel(order.shipping_label.carrier)}
                </span>
                <span className="text-sm font-bold">
                  {order.shipping_label.service}
                </span>
              </div>
              <div className="mt-3">
                <MetaRow label="LABEL COST" value={money(order.shipping_label.rate_cents)} />
                <MetaRow label="TRACKING" value={order.shipping_label.tracking_number} />
              </div>
              <button
                className="btn btn-secondary w-full mt-3"
                onClick={() => window.print()}
                data-testid="print-label-btn"
              >
                PRINT LABEL (PDF)
              </button>
            </div>
          ) : (
            <div className="p-4">
              <button
                className="btn btn-primary w-full"
                onClick={() => setLabelOpen(true)}
                data-testid="get-label-btn"
              >
                GET A SHIPPING LABEL
              </button>
            </div>
          )}
        </div>
      )}

      {/* Buyer protection / next steps */}
      <div className="mt-6 p-3 bg-surface border border-line">
        <div className="label text-acid mb-1">✓ WUBHUB BUYER PROTECTION</div>
        <p className="label normal-case text-muted leading-relaxed">
          {isSeller ? (
            <>FUNDS HELD UNTIL DELIVERY CONFIRMED · BUYER HAS 3 DAYS TO REPORT AFTER DELIVERY · OTHERWISE FUNDS RELEASE AUTOMATICALLY</>
          ) : (
            <>FUNDS HELD UNTIL YOU CONFIRM RECEIPT · 3 DAY DISPUTE WINDOW AFTER DELIVERY</>
          )}
        </p>
      </div>

      <div className="mt-6 grid gap-2">
        <Link href="/orders" className="btn btn-secondary">VIEW ALL ORDERS</Link>
        <Link href="/" className="btn btn-ghost">KEEP BROWSING</Link>
      </div>

      <Modal open={labelOpen} onClose={() => setLabelOpen(false)} title="BUY SHIPPING LABEL">
        <p className="label normal-case mb-3 text-muted">
          PICK A REAL RATE. WUBHUB BUYS IT FOR YOU — BILLED TO YOUR PAYOUT.
        </p>
        <ShippingEstimator
          category={listing.category}
          selected={picked}
          onSelect={setPicked}
        />
        <button
          className="btn btn-primary w-full mt-4"
          onClick={buyLabel}
          disabled={!picked}
          data-testid="confirm-label-btn"
        >
          {picked ? `BUY LABEL · ${money(picked.rate_cents)}` : "PICK A RATE"}
        </button>
      </Modal>
    </div>
  );
}
