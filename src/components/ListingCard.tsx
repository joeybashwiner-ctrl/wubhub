"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useListingBids, useProfile } from "@/lib/store";
import type { Listing } from "@/lib/types";
import { conditionLabel, money, timeUntil } from "@/lib/format";

export function ListingCard({ listing }: { listing: Listing }) {
  const bids = useListingBids(listing.id);
  const top = bids[0];
  const seller = useProfile(listing.seller_id);
  const isAuction = listing.listing_type === "auction";
  const isTrade = listing.listing_type === "trade";

  const price = isAuction
    ? top?.amount_cents ?? listing.starting_bid_cents
    : listing.asking_price_cents;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const timer = mounted && listing.auction_ends_at ? timeUntil(listing.auction_ends_at) : null;
  const bidsCount = bids.length;

  return (
    <Link
      href={`/l/${listing.id}`}
      className="group block"
      data-testid={`listing-card-${listing.id}`}
    >
      <div className="relative aspect-square bg-surface overflow-hidden rounded-card border border-line">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
        {/* Top-left badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {isAuction ? (
            <span className="pill-hot">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-wub-pulse" />
              LIVE · {bidsCount > 0 ? bidsCount : 0} BIDS
            </span>
          ) : isTrade ? (
            <span className="pill-acid bg-bg">TRADE ONLY</span>
          ) : (
            <span
              className="text-acid font-bold"
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.15em",
                background: "#000",
                padding: "3px 6px",
              }}
            >
              BUY NOW
            </span>
          )}
          {listing.open_to_trade && !isTrade && (
            <span className="label bg-acid text-bg px-1.5 py-0.5">TRADE OK</span>
          )}
        </div>
        {/* Status overlays */}
        {listing.status === "sold" && (
          <span className="absolute top-2 right-2 pill-line bg-bg/80">SOLD</span>
        )}
        {listing.status === "traded" && (
          <span className="absolute top-2 right-2 pill-acid bg-bg">TRADED</span>
        )}
      </div>

      <div className="pt-2 px-1">
        <div className="text-[12px] font-extrabold uppercase tracking-tight leading-tight group-hover:text-acid line-clamp-2">
          {listing.title}
        </div>
        <div className="label mt-1 normal-case">
          {seller ? `@${seller.username}` : ""} · {listing.size} · {conditionLabel(listing.condition)}
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="mono-price text-base">
            {isTrade ? "TRADE" : price != null ? money(price) : "—"}
          </span>
          {isAuction && timer && (
            <span
              className={`label ${timer.ending ? "text-hot" : "text-muted"}`}
            >
              {timer.label}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
