"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { money, relativeTime } from "@/lib/format";
import type { TradeMessage } from "@/lib/types";

export default function TradeDetailPage() {
  const params = useParams<{ id: string }>();
  const {
    trades,
    listings,
    profiles,
    currentUserId,
    respondToTrade,
    acceptTrade,
  } = useStore();
  const trade = trades.find((t) => t.id === params.id);
  const [counterMode, setCounterMode] = useState(false);
  const [counterListings, setCounterListings] = useState<string[]>([]);
  const [counterCash, setCounterCash] = useState("");
  const [msg, setMsg] = useState("");

  if (!trade) {
    return (
      <div className="px-5 py-32 text-center">
        <div className="display text-3xl">TRADE NOT FOUND</div>
        <Link href="/trades" className="btn btn-ghost mt-5">BACK</Link>
      </div>
    );
  }

  const target = listings.find((l) => l.id === trade.listing_id);
  const proposer = profiles.find((p) => p.id === trade.proposer_id);
  const recipient = profiles.find((p) => p.id === trade.recipient_id);
  const isIncoming = trade.recipient_id === currentUserId;
  const isProposer = trade.proposer_id === currentUserId;
  const offered = listings.filter((l) => trade.offered_listing_ids.includes(l.id));

  const myListings = listings.filter(
    (l) => l.seller_id === currentUserId && l.status === "active" && l.id !== target?.id,
  );

  const open = trade.status === "proposed" || trade.status === "countered";

  function toggleCounterListing(id: string) {
    setCounterListings((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function sendCounter() {
    const cents = Math.round((parseFloat(counterCash) || 0) * 100);
    respondToTrade(trade!.id, "counter", msg || "Counter offer.", {
      offered_listing_ids: counterListings,
      offered_cash_cents: cents,
    });
    setCounterMode(false);
    setMsg("");
    setCounterListings([]);
    setCounterCash("");
  }

  function sendMessage() {
    if (!msg.trim()) return;
    respondToTrade(trade!.id, "message", msg);
    setMsg("");
  }

  return (
    <div className="px-5 py-8 max-w-3xl mx-auto">
      <Link href="/trades" className="label hover:text-acid">← BACK TO TRADES</Link>

      <h1 className="display text-3xl tracking-tighter mt-3">
        TRADE · <span className={`text-acid`}>{trade.status.toUpperCase()}</span>
      </h1>
      <div className="label mt-1">
        Between <span className="text-ink">@{proposer?.username}</span> ↔ <span className="text-ink">@{recipient?.username}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <div className="border border-line p-3">
          <div className="label mb-2">{isIncoming ? "YOU GIVE UP" : "YOU GET"}</div>
          {target && (
            <Link href={`/l/${target.id}`} className="flex items-center gap-2 hover:text-acid">
              <img src={target.images[0]} alt="" className="w-16 h-16 object-cover" />
              <div>
                <div className="text-sm font-semibold">{target.title}</div>
                <div className="label">{money(target.asking_price_cents ?? target.buy_now_price_cents)}</div>
              </div>
            </Link>
          )}
        </div>
        <div className="border border-line p-3">
          <div className="label mb-2">{isIncoming ? "THEY OFFER" : "YOU OFFER"}</div>
          <div className="space-y-2">
            {offered.map((l) => (
              <Link key={l.id} href={`/l/${l.id}`} className="flex items-center gap-2 hover:text-acid">
                <img src={l.images[0]} alt="" className="w-12 h-12 object-cover" />
                <div className="text-sm">
                  <div className="font-semibold">{l.title}</div>
                  <div className="label">{money(l.asking_price_cents ?? l.buy_now_price_cents)}</div>
                </div>
              </Link>
            ))}
            {trade.offered_cash_cents > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-acid text-bg display flex items-center justify-center">$</div>
                <div className="text-sm">
                  <div className="font-semibold">CASH ON TOP</div>
                  <div className="label">{money(trade.offered_cash_cents)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Negotiation history */}
      <div className="mt-8">
        <div className="label mb-2">CONVERSATION</div>
        <div className="border border-line">
          {trade.history.map((m) => (
            <Message key={m.id} msg={m} mineId={currentUserId} />
          ))}
        </div>
      </div>

      {/* Action area */}
      {open && (
        <div className="mt-6 space-y-3">
          {isIncoming && (
            <>
              <button
                className="btn btn-primary w-full"
                onClick={() => acceptTrade(trade.id)}
                data-testid="accept-trade-btn"
              >
                ACCEPT TRADE
              </button>
              <button
                className="btn btn-secondary w-full"
                onClick={() => setCounterMode((v) => !v)}
                data-testid="counter-trade-btn"
              >
                {counterMode ? "CANCEL COUNTER" : "COUNTER OFFER"}
              </button>
              <button
                className="btn btn-ghost w-full"
                onClick={() => respondToTrade(trade.id, "decline", "Declined.")}
                data-testid="decline-trade-btn"
              >
                DECLINE
              </button>
            </>
          )}
          {isProposer && (
            <button
              className="btn btn-ghost w-full"
              onClick={() => respondToTrade(trade.id, "withdraw", "Withdrew proposal.")}
            >
              WITHDRAW PROPOSAL
            </button>
          )}

          {counterMode && (
            <div className="border border-acid p-4 mt-2 space-y-3">
              <div className="label">COUNTER OFFER — pick from your closet</div>
              {myListings.length === 0 ? (
                <div className="text-sm text-muted">No items to offer. Add cash instead.</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {myListings.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => toggleCounterListing(l.id)}
                      className={`text-left border ${
                        counterListings.includes(l.id) ? "border-acid" : "border-line"
                      }`}
                    >
                      <div className="aspect-square">
                        <img src={l.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-1.5 text-[11px] line-clamp-1 font-semibold">{l.title}</div>
                    </button>
                  ))}
                </div>
              )}
              <input
                type="number"
                placeholder="Cash on top ($)"
                value={counterCash}
                onChange={(e) => setCounterCash(e.target.value)}
              />
              <textarea
                rows={2}
                placeholder="Message (optional)"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <button
                className="btn btn-primary w-full"
                onClick={sendCounter}
                data-testid="send-counter-btn"
              >
                SEND COUNTER
              </button>
            </div>
          )}

          {!counterMode && (
            <div className="flex gap-2">
              <input
                placeholder="Add a message…"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <button className="btn btn-ghost" onClick={sendMessage}>SEND</button>
            </div>
          )}
        </div>
      )}

      {trade.status === "accepted" && (
        <div className="mt-6 border border-acid p-4">
          <div className="display text-2xl text-acid">DEAL.</div>
          <p className="text-sm mt-1">
            Both parties have 5 days to ship. Add tracking once shipped. Funds (cash on top) held in escrow until both
            confirm receipt.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="btn btn-secondary">MARK SHIPPED + ADD TRACKING</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Message({ msg, mineId }: { msg: TradeMessage; mineId: string }) {
  const { profiles, listings } = useStore();
  const author = profiles.find((p) => p.id === msg.author_id);
  const mine = msg.author_id === mineId;
  const items = msg.offered_listing_ids
    ? listings.filter((l) => msg.offered_listing_ids!.includes(l.id))
    : [];

  const labels: Record<string, string> = {
    propose: "PROPOSED",
    counter: "COUNTERED",
    accept: "ACCEPTED",
    decline: "DECLINED",
    withdraw: "WITHDREW",
    message: "NOTE",
  };

  return (
    <div className={`px-3 py-3 border-b border-line last:border-b-0 ${mine ? "bg-raised" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={author?.avatar_url} alt="" className="w-5 h-5 rounded-full" />
          <span className="label">@{author?.username}</span>
          <span className={`label ${msg.kind === "accept" ? "text-acid" : msg.kind === "decline" ? "text-hot" : ""}`}>
            {labels[msg.kind]}
          </span>
        </div>
        <span className="label text-muted">{relativeTime(msg.created_at)}</span>
      </div>
      {msg.body && <div className="mt-1 text-sm">{msg.body}</div>}
      {(items.length > 0 || (msg.offered_cash_cents ?? 0) > 0) && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {items.map((l) => (
            <div key={l.id} className="flex items-center gap-2 border border-line p-1 pr-2">
              <img src={l.images[0]} alt="" className="w-8 h-8 object-cover" />
              <span className="text-xs">{l.title}</span>
            </div>
          ))}
          {(msg.offered_cash_cents ?? 0) > 0 && (
            <div className="flex items-center gap-2 border border-acid text-acid p-1 px-2">
              <span className="font-bold text-xs">+ {money(msg.offered_cash_cents!)} CASH</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
