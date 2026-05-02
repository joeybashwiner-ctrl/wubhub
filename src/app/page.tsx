"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { useStore } from "@/lib/store";
import type { Category } from "@/lib/types";

const CATEGORY_CHIPS: Array<{ key: Category | "all"; label: string }> = [
  { key: "all", label: "ALL" },
  { key: "hoodie", label: "HOODIES" },
  { key: "tee", label: "TEES" },
  { key: "pashmina", label: "PASHMINAS" },
  { key: "totem", label: "TOTEMS" },
  { key: "hat", label: "HATS" },
  { key: "accessory", label: "ACCESSORIES" },
];

const TYPE_CHIPS = [
  { key: "all", label: "ALL" },
  { key: "buy_now", label: "BUY NOW" },
  { key: "auction", label: "AUCTIONS" },
  { key: "trade", label: "TRADE‑ONLY" },
  { key: "trade_ok", label: "OPEN TO TRADE" },
] as const;
type Filter = (typeof TYPE_CHIPS)[number]["key"];

export default function HomePage() {
  const { listings } = useStore();
  const [category, setCategory] = useState<Category | "all">("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return listings
      .filter((l) => l.status === "active")
      .filter((l) => (category === "all" ? true : l.category === category))
      .filter((l) => {
        if (filter === "all") return true;
        if (filter === "buy_now") return l.listing_type === "fixed_price";
        if (filter === "auction") return l.listing_type === "auction";
        if (filter === "trade") return l.listing_type === "trade";
        if (filter === "trade_ok") return l.open_to_trade;
        return true;
      })
      .filter((l) => {
        if (!q.trim()) return true;
        const needle = q.trim().toLowerCase();
        return (
          l.title.toLowerCase().includes(needle) ||
          l.brand.toLowerCase().includes(needle) ||
          l.description.toLowerCase().includes(needle)
        );
      });
  }, [listings, category, filter, q]);

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-line">
        <div className="px-5 py-12 md:py-16">
          <div className="label text-acid mb-3 normal-case">
            WUBHUB / UNDERGROUND · BST FOR FESTIVAL MERCH
          </div>
          <div className="display text-5xl md:text-7xl max-w-4xl">
            BUY · SELL · <span className="text-acid">TRADE</span>
            <br />
            FESTIVAL MERCH.
          </div>
          <p className="mt-4 max-w-xl text-muted text-sm leading-relaxed">
            wubhub is the underground marketplace for hoodies, pashminas, totems, and one‑off
            festival drops. Made for collectors, not influencers.
          </p>
          <div className="mt-3 max-w-xl text-sm">
            <span className="text-acid font-bold">8.08% marketplace fee.</span>{" "}
            <span className="text-muted">Poshmark takes 20%.</span>{" "}
            <span className="text-acid font-bold">$1.99 flat on trades.</span>{" "}
            <span className="text-muted">Authenticity reviewed in 24h.</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sell" className="btn btn-primary" data-testid="cta-sell">
              LIST AN ITEM
            </Link>
            <a href="#feed" className="btn btn-ghost">BROWSE THE DROP</a>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <div className="px-5 py-3 border-b border-line">
        <div className="label normal-case text-muted">
          BROWSE / {category === "all" ? "ALL" : category.toUpperCase()}
          {filter !== "all" && ` / ${filter.replace("_", " ").toUpperCase()}`}
        </div>
      </div>

      {/* FILTERS */}
      <section
        id="feed"
        className="px-5 py-4 border-b border-line sticky top-[57px] sm:top-[57px] bg-bg z-30"
      >
        <div className="flex flex-col gap-3">
          <input
            placeholder="search brand, title, drop…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            data-testid="search-input"
          />
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_CHIPS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key as Category | "all")}
                className={`px-2.5 py-1.5 font-mono text-[10px] tracking-widest font-bold border transition-colors ${
                  category === c.key
                    ? "bg-acid text-bg border-acid"
                    : "border-line text-muted hover:text-ink hover:border-ink"
                }`}
                data-testid={`cat-${c.key}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TYPE_CHIPS.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-2.5 py-1.5 font-mono text-[10px] tracking-widest font-bold border transition-colors ${
                  filter === t.key
                    ? "bg-ink text-bg border-ink"
                    : "border-line text-muted hover:text-ink hover:border-ink"
                }`}
                data-testid={`filter-${t.key}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="px-3 py-4">
        {filtered.length === 0 ? (
          <div className="px-5 py-32 text-center">
            <div className="display text-3xl">NOTHING IN THIS BIN.</div>
            <div className="label mt-3">TRY CLEARING FILTERS.</div>
          </div>
        ) : (
          <div
            className="grid gap-1 sm:gap-2 md:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            data-testid="listing-grid"
          >
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
