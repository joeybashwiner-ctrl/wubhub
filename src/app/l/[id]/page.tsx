"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { TradeBuilder } from "@/components/TradeBuilder";
import { MetaRow } from "@/components/MetaRow";
import { GlitchCountdown } from "@/components/Countdown";
import { BidSheet } from "@/components/BidSheet";
import { CheckoutSheet } from "@/components/CheckoutSheet";
import { useListing, useListingBids, useProfile, useStore } from "@/lib/store";
import {
  authenticityLabel,
  conditionLabel,
  money,
  relativeTime,
} from "@/lib/format";

export default function ListingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const listing = useListing(params.id);
  const seller = useProfile(listing?.seller_id ?? "");
  const bids = useListingBids(listing?.id ?? "");
  const { currentUserId, placeBid, buyNow } = useStore();

  const [activeImage, setActiveImage] = useState(0);
  const [bidOpen, setBidOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);

  const topBid = bids[0];
  const minNextBid = topBid
    ? topBid.amount_cents + 1000
    : listing?.starting_bid_cents ?? 0;

  if (!listing || !seller) {
    return (
      <div className="px-5 py-32 text-center">
        <div className="display text-3xl">404 — LISTING GHOSTED</div>
        <Link href="/" className="btn btn-ghost mt-6">BACK TO FEED</Link>
      </div>
    );
  }

  const isOwn = listing.seller_id === currentUserId;
  const isAuction = listing.listing_type === "auction";
  const isTradeOnly = listing.listing_type === "trade";
  const isFixed = listing.listing_type === "fixed_price";
  const purchasable = listing.status === "active";

  function onBid(amountCents: number) {
    placeBid(listing!.id, amountCents);
    setBidOpen(false);
  }

  function onConfirmBuy() {
    const order = buyNow(listing!.id);
    setCheckoutOpen(false);
    if (order) router.push(`/order/${order.id}`);
  }

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0 pb-32 lg:pb-0">
      {/* Image gallery — edge-to-edge with overlay */}
      <div className="relative bg-surface lg:sticky lg:top-[57px] lg:self-start">
        <div className="aspect-square w-full relative overflow-hidden">
          <img
            src={listing.images[activeImage]}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Top gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          {/* Status overlay (top-right) */}
          {!purchasable && (
            <div className="absolute top-4 right-4">
              <span
                className={`pill-acid ${
                  listing.status === "sold" || listing.status === "traded"
                    ? "bg-bg"
                    : ""
                }`}
              >
                {listing.status.toUpperCase().replace("_", " ")}
              </span>
            </div>
          )}
          {/* Dot pagination */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
            {listing.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className="transition-all"
                style={{
                  width: i === activeImage ? 18 : 5,
                  height: 3,
                  background:
                    i === activeImage ? "#C8FF00" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        </div>
        {/* Thumbnail strip */}
        <div className="grid grid-cols-4 gap-1 p-1">
          {listing.images.slice(0, 4).map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActiveImage(i)}
              className={`aspect-square overflow-hidden border ${
                activeImage === i ? "border-acid" : "border-transparent"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Right rail */}
      <div className="px-4 lg:px-8 py-6 lg:py-10 lg:border-l border-line">
        {/* LIVE banner for auctions */}
        {isAuction && purchasable && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-2 h-2 bg-hot rounded-full animate-wub-pulse" />
            <span className="label text-hot">
              LIVE AUCTION · {bids.length} BIDS
            </span>
          </div>
        )}

        {/* Authenticity pill */}
        <div className="mb-2.5">
          <span className="pill-acid">
            ✓ {authenticityLabel(listing.authenticity)}
          </span>
        </div>

        {/* Title */}
        <h1 className="display text-3xl md:text-4xl">{listing.title}</h1>
        <div className="label mt-2 normal-case font-mono">
          {listing.brand.toUpperCase()} · {conditionLabel(listing.condition)} · {listing.size} · {seller.city.toUpperCase()}
        </div>

        {/* Owner / status banners */}
        {isOwn && listing.status === "under_review" && (
          <div className="mt-4 border border-acid p-4">
            <div className="label text-acid mb-1">UNDER AUTHENTICITY REVIEW</div>
            <p className="text-sm text-acid">
              We're verifying your OFFICIAL ARTIST claim. ~24h SLA. Buyers won't see this listing until approved.
            </p>
          </div>
        )}
        {isOwn && listing.status === "rejected" && (
          <div className="mt-4 border border-hot p-4">
            <div className="label text-hot mb-1">REJECTED</div>
            <p className="text-sm text-hot">{listing.mod_notes ?? "Authenticity could not be verified."}</p>
          </div>
        )}

        {/* Price block */}
        {isFixed && (
          <div className="mt-5 py-4 border-t-2 border-ink border-b border-line">
            <div className="label">ASKING</div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="mono-price text-4xl">
                {money(listing.asking_price_cents)}
              </div>
              <div className="font-mono text-[11px] text-muted">
                + {money(listing.shipping_price_cents)} SHIP
              </div>
            </div>
          </div>
        )}

        {isAuction && (
          <>
            {/* Countdown box */}
            <div className="mt-5 p-4 bg-surface border border-line rounded-card">
              <div className="label mb-2">ENDS IN</div>
              <GlitchCountdown targetIso={listing.auction_ends_at} />
              <div className="label mt-2.5 text-muted normal-case font-mono">
                ⓘ ANTI‑SNIPE: BID IN FINAL 2M EXTENDS BY 2M
              </div>
            </div>
            {/* Current bid block — black bg, 2px acid border */}
            <div className="mt-3 p-4 bg-black border-2 border-acid rounded-card">
              <div className="flex items-baseline justify-between">
                <span className="label text-acid">CURRENT BID</span>
                <span className="label text-muted">
                  {topBid ? "RESERVE MET" : "NO BIDS YET"}
                </span>
              </div>
              <div className="flex items-baseline gap-2.5 mt-1">
                <div className="mono-price text-5xl text-acid">
                  {money(topBid?.amount_cents ?? listing.starting_bid_cents)}
                </div>
                <div className="font-mono text-[11px] text-muted">
                  MIN NEXT {money(minNextBid)}
                </div>
              </div>
            </div>
          </>
        )}

        {isTradeOnly && (
          <div className="mt-5 py-4 border-t-2 border-ink border-b border-line">
            <div className="label text-acid">TRADE ONLY</div>
            <div className="mono-price text-4xl text-acid mt-1">SWAP</div>
            <div className="font-mono text-[11px] text-muted mt-1">
              + {money(listing.shipping_price_cents)} SHIP
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mt-5 text-sm leading-relaxed text-ink/90">
          {listing.description}
        </div>

        {/* Meta grid */}
        <div className="mt-5">
          <MetaRow label="BRAND" value={listing.brand.toUpperCase()} />
          <MetaRow label="CATEGORY" value={listing.category.toUpperCase()} />
          <MetaRow label="SIZE" value={listing.size.toUpperCase()} />
          <MetaRow label="CONDITION" value={conditionLabel(listing.condition)} />
          <MetaRow label="SHIPS FROM" value={seller.city.toUpperCase()} />
          <MetaRow label="LISTED" value={relativeTime(listing.created_at).toUpperCase()} />
        </div>

        {listing.trade_wants && (
          <div className="mt-5 border border-line p-3 bg-surface">
            <div className="label mb-1">SELLER WANTS IN TRADE</div>
            <div className="text-sm">{listing.trade_wants}</div>
          </div>
        )}

        {/* Seller card */}
        <Link
          href={`/u/${seller.username}`}
          className="mt-5 flex items-center gap-3 border border-line p-3.5 bg-surface hover:border-acid rounded-card"
        >
          <img
            src={seller.avatar_url}
            alt=""
            className="w-11 h-11 object-cover"
          />
          <div className="flex-1">
            <div className="font-extrabold text-sm tracking-tight">@{seller.username}</div>
            <div className="label mt-0.5">
              ★ {seller.reputation.toFixed(2)} · {seller.total_sales} SALES · {seller.total_trades} TRADES
            </div>
          </div>
          <span className="label text-acid">VIEW →</span>
        </Link>

        {/* Bid history */}
        {isAuction && bids.length > 0 && (
          <div className="mt-6">
            <div className="label mb-2">BID HISTORY ({bids.length})</div>
            <div>
              {bids.slice(0, 8).map((b, i) => (
                <BidRow
                  key={b.id}
                  rank={i}
                  total={bids.length}
                  bidderId={b.bidder_id}
                  amount={b.amount_cents}
                />
              ))}
            </div>
          </div>
        )}

        {/* Report */}
        {!isOwn && (
          <div className="mt-6 text-center label cursor-pointer hover:text-acid">
            ⚑ REPORT THIS LISTING
          </div>
        )}
      </div>

      {/* STICKY CTA BAR — mobile + desktop */}
      {!isOwn && purchasable && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-auto lg:right-0 lg:max-w-[42vw] z-30 bg-bg border-t border-line">
          <div className="px-4 py-3 flex gap-2">
            {isFixed && (
              <>
                {(listing.open_to_trade) && (
                  <button
                    className="btn btn-secondary flex-1"
                    onClick={() => setTradeOpen(true)}
                    data-testid="trade-btn"
                  >
                    OFFER TRADE
                  </button>
                )}
                <button
                  className="btn btn-primary flex-[2]"
                  onClick={() => setCheckoutOpen(true)}
                  data-testid="buy-now-btn"
                >
                  BUY NOW · {money(listing.asking_price_cents)}
                </button>
              </>
            )}
            {isAuction && (
              <>
                <button className="btn btn-secondary w-14 px-0 text-base" aria-label="Watch">
                  ♡
                </button>
                <button
                  className="btn btn-primary flex-1"
                  onClick={() => setBidOpen(true)}
                  data-testid="bid-btn"
                >
                  PLACE BID →
                </button>
              </>
            )}
            {isTradeOnly && (
              <button
                className="btn btn-primary w-full"
                onClick={() => setTradeOpen(true)}
                data-testid="trade-btn"
              >
                PROPOSE A TRADE
              </button>
            )}
          </div>
        </div>
      )}
      {isOwn && (listing.status === "active" || listing.status === "sold") && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-auto lg:right-0 lg:max-w-[42vw] z-30 bg-bg border-t border-line">
          <div className="px-4 py-3 label text-center text-muted">
            THIS IS YOUR LISTING — SWITCH USER IN HEADER TO TEST BUYING
          </div>
        </div>
      )}

      {/* Bid sheet */}
      <BidSheet
        open={bidOpen}
        onClose={() => setBidOpen(false)}
        currentBidCents={topBid?.amount_cents ?? listing.starting_bid_cents ?? 0}
        minNextCents={minNextBid}
        onConfirm={onBid}
      />

      {/* Checkout sheet */}
      <CheckoutSheet
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        listing={listing}
        sellerName={seller.username}
        onPay={onConfirmBuy}
      />

      {/* Trade modal */}
      <Modal
        open={tradeOpen}
        onClose={() => setTradeOpen(false)}
        title="PROPOSE A TRADE"
        size="lg"
      >
        <TradeBuilder listing={listing} onDone={() => setTradeOpen(false)} />
      </Modal>
    </div>
  );
}

function BidRow({
  rank,
  total,
  bidderId,
  amount,
}: {
  rank: number;
  total: number;
  bidderId: string;
  amount: number;
}) {
  const profile = useProfile(bidderId);
  const isTop = rank === 0;
  return (
    <div
      className="grid grid-cols-[60px_1fr_80px] py-2.5 border-b border-line font-mono text-[11px]"
      style={{ animation: isTop ? "wub-bid-in 0.4s ease" : undefined }}
    >
      <span className={`tracking-widest font-bold ${isTop ? "text-acid" : "text-muted"}`}>
        {isTop ? "◉ TOP" : `#${total - rank}`}
      </span>
      <span className="text-ink">@{profile?.username}</span>
      <span className="text-ink font-bold text-right mono-price">{money(amount)}</span>
    </div>
  );
}
