"use client";

import Link from "next/link";
import { isMod, useStore } from "@/lib/store";

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export function Header() {
  const { profiles, listings, currentUserId, setCurrentUser, trades, orders } = useStore();
  const me = profiles.find((p) => p.id === currentUserId);
  const incomingTrades = trades.filter(
    (t) =>
      t.recipient_id === currentUserId &&
      (t.status === "proposed" || t.status === "countered"),
  ).length;
  const myOrders = orders.filter(
    (o) => o.buyer_id === currentUserId || o.seller_id === currentUserId,
  ).length;
  const modQueueCount = listings.filter((l) => l.status === "under_review").length;
  const showMod = isMod(currentUserId);

  return (
    <header className="border-b border-line bg-bg sticky top-0 z-40">
      <div className="px-4 sm:px-5 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="display text-3xl">wubhub</span>
          <span className="label text-acid">v1.0</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 ml-2">
          <Link href="/" className="label hover:text-acid">BROWSE</Link>
          <Link href="/sell" className="label hover:text-acid">SELL</Link>
          <Link
            href="/trades"
            className="label hover:text-acid relative"
            data-testid="nav-trades"
          >
            TRADES
            {incomingTrades > 0 && (
              <span className="ml-1 inline-block bg-acid text-bg font-bold px-1.5 py-0.5 align-middle">
                {incomingTrades}
              </span>
            )}
          </Link>
          <Link href="/orders" className="label hover:text-acid">
            ORDERS{myOrders > 0 && ` · ${myOrders}`}
          </Link>
          {showMod && (
            <Link
              href="/mod"
              className="label hover:text-acid relative"
              data-testid="nav-mod"
            >
              MOD
              {modQueueCount > 0 && (
                <span className="ml-1 inline-block bg-hot text-ink font-bold px-1.5 py-0.5 align-middle">
                  {modQueueCount}
                </span>
              )}
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        <button className="text-ink hover:text-acid p-1" aria-label="Search">
          <IconSearch />
        </button>
        <button className="text-ink hover:text-acid p-1 hidden sm:block" aria-label="Notifications">
          <IconBell />
        </button>

        <select
          aria-label="Switch user (demo)"
          value={currentUserId}
          onChange={(e) => setCurrentUser(e.target.value)}
          className="!w-auto !py-1.5 !px-2 !text-[11px] font-mono"
          data-testid="user-switcher"
        >
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              @{p.username}
            </option>
          ))}
        </select>

        <Link
          href={`/u/${me?.username ?? "you"}`}
          className="hidden sm:flex items-center gap-2 text-sm hover:text-acid"
        >
          <img
            src={me?.avatar_url}
            alt=""
            className="w-7 h-7 rounded-full border border-line"
          />
        </Link>
      </div>

      {/* Mobile nav row */}
      <div className="px-4 pb-2 md:hidden flex items-center gap-4 overflow-x-auto">
        <Link href="/" className="label hover:text-acid">BROWSE</Link>
        <Link href="/sell" className="label hover:text-acid">SELL</Link>
        <Link href="/trades" className="label hover:text-acid">
          TRADES{incomingTrades > 0 && ` · ${incomingTrades}`}
        </Link>
        <Link href="/orders" className="label hover:text-acid">ORDERS</Link>
        {showMod && (
          <Link href="/mod" className="label hover:text-acid">
            MOD{modQueueCount > 0 && ` · ${modQueueCount}`}
          </Link>
        )}
      </div>
    </header>
  );
}
