"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { money, relativeTime } from "@/lib/format";
import type { TradeProposal } from "@/lib/types";

export default function TradesPage() {
  const { trades, currentUserId } = useStore();
  const [tab, setTab] = useState<"incoming" | "outgoing" | "all">("incoming");

  const filtered = useMemo(() => {
    return trades
      .filter((t) => {
        if (tab === "incoming") return t.recipient_id === currentUserId;
        if (tab === "outgoing") return t.proposer_id === currentUserId;
        return t.recipient_id === currentUserId || t.proposer_id === currentUserId;
      })
      .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
  }, [trades, tab, currentUserId]);

  return (
    <div className="px-5 py-6 max-w-3xl mx-auto">
      <div className="label">BST · BUY SELL TRADE</div>
      <h1 className="display text-4xl mt-2">TRADES</h1>
      <p className="label normal-case text-muted mt-2 leading-relaxed">
        PROPOSE · COUNTER · ACCEPT · $1.99 FLAT EACH SIDE · ESCROW UNTIL BOTH SHIP
      </p>

      <div className="mt-5 flex gap-2 border-b border-line">
        {(["incoming", "outgoing", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 -mb-px border-b-2 font-mono text-[10px] tracking-widest font-bold uppercase ${
              tab === t ? "border-acid text-acid" : "border-transparent text-muted hover:text-ink"
            }`}
            data-testid={`trades-tab-${t}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="display text-2xl">NO TRADES YET.</div>
            <div className="label mt-2 text-muted">FIND A LISTING WITH THE OPEN TO TRADE BADGE</div>
            <Link href="/" className="btn btn-ghost mt-5">BROWSE</Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((t) => (
              <TradeRow key={t.id} trade={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TradeRow({ trade }: { trade: TradeProposal }) {
  const { listings, profiles, currentUserId } = useStore();
  const target = listings.find((l) => l.id === trade.listing_id);
  const offered = listings.filter((l) => trade.offered_listing_ids.includes(l.id));
  const proposer = profiles.find((p) => p.id === trade.proposer_id);
  const recipient = profiles.find((p) => p.id === trade.recipient_id);
  const isIncoming = trade.recipient_id === currentUserId;
  const counterparty = isIncoming ? proposer : recipient;

  const statusColor =
    trade.status === "accepted"
      ? "text-acid border-acid"
      : trade.status === "declined" || trade.status === "withdrawn"
      ? "text-muted border-line"
      : "text-ink border-ink";

  return (
    <Link
      href={`/trades/${trade.id}`}
      className="border border-line p-4 hover:border-acid block"
      data-testid={`trade-row-${trade.id}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <img src={counterparty?.avatar_url} alt="" className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <div className="text-sm">
            {isIncoming ? (
              <>
                <span className="font-semibold">@{counterparty?.username}</span> proposed a trade for{" "}
                <span className="text-acid">{target?.title}</span>
              </>
            ) : (
              <>
                You proposed to <span className="font-semibold">@{counterparty?.username}</span> for{" "}
                <span className="text-acid">{target?.title}</span>
              </>
            )}
          </div>
          <div className="label text-muted">{relativeTime(trade.updated_at)}</div>
        </div>
        <span className={`label px-2 py-1 border ${statusColor}`}>{trade.status.toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 items-stretch">
        <div className="border border-line p-2">
          <div className="label mb-1">{isIncoming ? "THEY OFFER" : "YOU OFFER"}</div>
          <div className="flex flex-wrap gap-1">
            {offered.map((l) => (
              <img key={l.id} src={l.images[0]} alt="" className="w-10 h-10 object-cover" />
            ))}
            {trade.offered_cash_cents > 0 && (
              <div className="w-10 h-10 bg-acid text-bg flex items-center justify-center text-xs font-bold">
                {money(trade.offered_cash_cents)}
              </div>
            )}
          </div>
        </div>
        <div className="border border-line p-2">
          <div className="label mb-1">{isIncoming ? "YOU GIVE UP" : "YOU GET"}</div>
          {target && (
            <img src={target.images[0]} alt="" className="w-10 h-10 object-cover" />
          )}
        </div>
      </div>
    </Link>
  );
}
