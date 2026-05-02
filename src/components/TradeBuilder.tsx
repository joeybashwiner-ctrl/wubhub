"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { TRADE_FEE_CENTS } from "@/lib/fees";
import type { Listing } from "@/lib/types";
import { money } from "@/lib/format";

export function TradeBuilder({ listing, onDone }: { listing: Listing; onDone: () => void }) {
  const router = useRouter();
  const { listings, currentUserId, proposeTrade } = useStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [cash, setCash] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"pick" | "review" | "done">("pick");

  const myListings = useMemo(
    () =>
      listings.filter(
        (l) => l.seller_id === currentUserId && l.status === "active" && l.id !== listing.id,
      ),
    [listings, currentUserId, listing.id],
  );

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const cashCents = Math.round((parseFloat(cash) || 0) * 100);

  const totalOfferValue = useMemo(() => {
    const items = listings
      .filter((l) => selected.includes(l.id))
      .reduce((acc, l) => acc + (l.asking_price_cents ?? l.buy_now_price_cents ?? 0), 0);
    return items + cashCents;
  }, [listings, selected, cashCents]);

  const askPrice = listing.asking_price_cents ?? listing.buy_now_price_cents ?? 0;
  const valueGap = askPrice - totalOfferValue;
  const goodOffer = totalOfferValue >= askPrice * 0.9 || listing.listing_type === "trade";

  function submit() {
    proposeTrade({
      listingId: listing.id,
      offered_listing_ids: selected,
      offered_cash_cents: cashCents,
      note,
    });
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="text-center py-6">
        <div className="display text-3xl text-acid mb-2">TRADE SENT.</div>
        <p className="text-sm text-muted max-w-sm mx-auto">
          We notified the seller. You can negotiate, counter, or cancel from your trades inbox.
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <button
            className="btn btn-primary"
            onClick={() => {
              onDone();
              router.push("/trades");
            }}
            data-testid="goto-trades-btn"
          >
            GO TO TRADES
          </button>
          <button className="btn btn-ghost" onClick={onDone}>
            KEEP BROWSING
          </button>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="space-y-5">
        <div>
          <div className="label mb-2">YOU GET</div>
          <div className="border border-line flex items-center gap-3 p-3">
            <img src={listing.images[0]} alt="" className="w-16 h-16 object-cover" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{listing.title}</div>
              <div className="label">{listing.brand} · {listing.size}</div>
            </div>
            <div className="text-sm font-bold">{money(askPrice || 0)}</div>
          </div>
        </div>

        <div>
          <div className="label mb-2">YOU GIVE</div>
          {selected.length === 0 && cashCents === 0 && (
            <div className="border border-hot text-hot p-3 text-sm">
              No items or cash selected. Go back and add at least one.
            </div>
          )}
          <div className="border border-line">
            {listings
              .filter((l) => selected.includes(l.id))
              .map((l) => (
                <div key={l.id} className="flex items-center gap-3 p-3 border-b border-line last:border-b-0">
                  <img src={l.images[0]} alt="" className="w-12 h-12 object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{l.title}</div>
                    <div className="label">{l.brand} · {l.size}</div>
                  </div>
                  <div className="text-sm">{money(l.asking_price_cents ?? l.buy_now_price_cents)}</div>
                </div>
              ))}
            {cashCents > 0 && (
              <div className="flex items-center gap-3 p-3">
                <div className="w-12 h-12 bg-acid text-bg display flex items-center justify-center text-xl">$</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">CASH ON TOP</div>
                  <div className="label">via stripe — held in escrow</div>
                </div>
                <div className="text-sm">{money(cashCents)}</div>
              </div>
            )}
          </div>
        </div>

        {askPrice > 0 && (
          <div
            className={`p-3 text-sm ${
              goodOffer ? "border border-acid text-acid" : "border border-hot text-hot"
            }`}
          >
            <div className="flex justify-between">
              <span className="label">YOUR OFFER VALUE</span>
              <span>{money(totalOfferValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="label">SELLER ASKING</span>
              <span>{money(askPrice)}</span>
            </div>
            {valueGap > 0 && (
              <div className="flex justify-between font-bold mt-1">
                <span className="label">GAP</span>
                <span>−{money(valueGap)}</span>
              </div>
            )}
            <div className="label mt-2 text-muted">
              {goodOffer
                ? "Within 10% of ask — strong proposal."
                : "More than 10% under ask — likely to be countered."}
            </div>
          </div>
        )}

        <div className="border border-line p-3 text-sm flex justify-between">
          <span className="label">WUBHUB TRADE FEE (each side)</span>
          <span>{money(TRADE_FEE_CENTS)}</span>
        </div>

        <div>
          <div className="label mb-1">MESSAGE TO SELLER (optional)</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why this trade makes sense for both of you…"
            rows={3}
            data-testid="trade-note"
          />
        </div>

        <div className="flex gap-2">
          <button className="btn btn-ghost flex-1" onClick={() => setStep("pick")}>
            BACK
          </button>
          <button
            className="btn btn-primary flex-1"
            onClick={submit}
            disabled={selected.length === 0 && cashCents === 0}
            data-testid="submit-trade-btn"
          >
            SEND PROPOSAL
          </button>
        </div>
      </div>
    );
  }

  // step === "pick"
  return (
    <div className="space-y-5">
      <div className="border border-line p-3 flex gap-3 items-center bg-raised">
        <img src={listing.images[0]} alt="" className="w-14 h-14 object-cover" />
        <div className="flex-1">
          <div className="text-sm font-semibold">You want: {listing.title}</div>
          {listing.trade_wants && (
            <div className="label text-muted">SELLER WANTS: {listing.trade_wants}</div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="label">PICK ITEMS FROM YOUR CLOSET</div>
          <div className="label text-acid">{selected.length} SELECTED</div>
        </div>
        {myListings.length === 0 ? (
          <div className="border border-line p-4 text-sm text-muted">
            You have no active listings yet. Add cash on top, or list something first.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {myListings.map((l) => (
              <button
                key={l.id}
                onClick={() => toggle(l.id)}
                className={`text-left border ${
                  selected.includes(l.id) ? "border-acid" : "border-line"
                }`}
                data-testid={`offer-${l.id}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-1.5">
                  <div className="text-[11px] line-clamp-1 font-semibold">{l.title}</div>
                  <div className="label">{money(l.asking_price_cents ?? l.buy_now_price_cents)}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="label mb-1">CASH ON TOP (optional)</div>
        <input
          type="number"
          step="1"
          min="0"
          placeholder="$"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          data-testid="cash-input"
        />
        <div className="label mt-1 text-muted">
          Held in escrow. Released when both parties confirm receipt.
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button className="btn btn-ghost flex-1" onClick={onDone}>
          CANCEL
        </button>
        <button
          className="btn btn-primary flex-1"
          onClick={() => setStep("review")}
          disabled={selected.length === 0 && cashCents === 0}
          data-testid="review-trade-btn"
        >
          REVIEW PROPOSAL →
        </button>
      </div>
    </div>
  );
}
