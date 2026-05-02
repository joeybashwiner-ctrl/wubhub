"use client";

import { useMemo, useState } from "react";
import { quoteShipping, carrierLabel, carrierTint } from "@/lib/shipping";
import type { Category, ShippingQuote } from "@/lib/types";
import { money } from "@/lib/format";

export function ShippingEstimator({
  category,
  defaultFromZip = "11201",
  selected,
  onSelect,
}: {
  category: Category;
  defaultFromZip?: string;
  selected?: ShippingQuote;
  onSelect: (q: ShippingQuote) => void;
}) {
  const [fromZip, setFromZip] = useState(defaultFromZip);
  const [toZip, setToZip] = useState("80202");

  const quotes = useMemo(
    () => quoteShipping(category, fromZip, toZip),
    [category, fromZip, toZip],
  );

  return (
    <div className="border border-line">
      <div className="grid grid-cols-2 gap-0">
        <label className="border-r border-line p-3 block">
          <div className="label mb-1">SHIPS FROM (ZIP)</div>
          <input
            value={fromZip}
            onChange={(e) => setFromZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            className="!border-0 !p-0 !bg-transparent"
            inputMode="numeric"
            data-testid="from-zip"
          />
        </label>
        <label className="p-3 block">
          <div className="label mb-1">EST. BUYER ZIP</div>
          <input
            value={toZip}
            onChange={(e) => setToZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            className="!border-0 !p-0 !bg-transparent"
            inputMode="numeric"
            data-testid="to-zip"
          />
        </label>
      </div>

      <div className="border-t border-line">
        {quotes.map((q) => {
          const isSelected =
            selected?.carrier === q.carrier && selected?.service === q.service;
          return (
            <button
              key={`${q.carrier}-${q.service}`}
              type="button"
              onClick={() => onSelect(q)}
              className={`w-full flex items-center gap-3 px-3 py-3 border-b border-line last:border-b-0 text-left ${
                isSelected ? "bg-raised" : "hover:bg-raised"
              }`}
              data-testid={`rate-${q.carrier}-${q.service.replace(/\s/g, "-")}`}
            >
              <span
                className={`label px-1.5 py-0.5 border ${carrierTint(q.carrier)}`}
              >
                {carrierLabel(q.carrier)}
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{q.service}</div>
                <div className="label">EST. {q.est_days} BUSINESS DAYS</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{money(q.rate_cents)}</div>
                <div
                  className={`label ${isSelected ? "text-acid" : "text-muted"}`}
                >
                  {isSelected ? "SELECTED" : "USE THIS"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-3 py-2 border-t border-line label text-muted">
        Real rates via Shippo / EasyPost in production. Print labels directly from
        wubhub once an order is paid — no copy-paste tracking.
      </div>
    </div>
  );
}
