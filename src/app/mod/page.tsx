"use client";

import Link from "next/link";
import { useState } from "react";
import { isMod, useStore } from "@/lib/store";
import { authenticityLabel, conditionLabel, money, relativeTime } from "@/lib/format";

export default function ModPage() {
  const { listings, profiles, currentUserId, approveListing, rejectListing } = useStore();
  const allowed = isMod(currentUserId);

  const queue = listings
    .filter((l) => l.status === "under_review")
    .sort((a, b) => +new Date(a.submitted_for_review_at ?? a.created_at) - +new Date(b.submitted_for_review_at ?? b.created_at));

  const decided = listings
    .filter((l) => l.reviewed_at)
    .sort((a, b) => +new Date(b.reviewed_at!) - +new Date(a.reviewed_at!))
    .slice(0, 10);

  if (!allowed) {
    return (
      <div className="px-5 py-32 text-center">
        <div className="display text-3xl">MOD ACCESS ONLY</div>
        <p className="label mt-3 text-muted">
          Switch to <span className="text-acid">@wubmom</span> in the header to act as the demo moderator.
        </p>
        <Link href="/" className="btn btn-ghost mt-6">HOME</Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 max-w-4xl mx-auto">
      <div className="label text-acid">⚑ AUTHENTICITY · MODS ONLY</div>
      <h1 className="display text-4xl mt-2">MOD QUEUE</h1>
      <p className="label normal-case text-muted mt-2 leading-relaxed">
        TARGET SLA · 24 HOURS · APPROVE OFFICIAL ARTIST CLAIMS ONLY WHEN THE ARTIST DROP SIGNATURE CHECKS OUT
      </p>

      <section className="mt-8">
        <div className="label mb-2">PENDING · {queue.length}</div>
        {queue.length === 0 ? (
          <div className="text-center py-12 border border-line">
            <div className="display text-2xl">INBOX ZERO.</div>
            <div className="label mt-2 text-muted">Queue cleared. Go listen to a set.</div>
          </div>
        ) : (
          <div className="grid gap-3">
            {queue.map((l) => {
              const seller = profiles.find((p) => p.id === l.seller_id);
              return (
                <ReviewRow
                  key={l.id}
                  listing={l}
                  sellerName={seller?.username ?? ""}
                  onApprove={(note) => approveListing(l.id, note)}
                  onReject={(note) => rejectListing(l.id, note)}
                />
              );
            })}
          </div>
        )}
      </section>

      {decided.length > 0 && (
        <section className="mt-10">
          <div className="label mb-2">RECENT DECISIONS</div>
          <div className="border border-line divide-y divide-line">
            {decided.map((l) => (
              <Link
                key={l.id}
                href={`/l/${l.id}`}
                className="flex items-center gap-3 px-3 py-2 hover:bg-raised"
              >
                <img src={l.images[0]} alt="" className="w-10 h-10 object-cover" />
                <div className="flex-1">
                  <div className="text-sm">{l.title}</div>
                  <div className="label text-muted">{relativeTime(l.reviewed_at!)}</div>
                </div>
                <span
                  className={`label px-2 py-1 border ${
                    l.status === "active" ? "border-acid text-acid" : "border-hot text-hot"
                  }`}
                >
                  {l.status === "active" ? "APPROVED" : "REJECTED"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ReviewRow({
  listing,
  sellerName,
  onApprove,
  onReject,
}: {
  listing: ReturnType<typeof useStore>["listings"][number];
  sellerName: string;
  onApprove: (note?: string) => void;
  onReject: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [active, setActive] = useState<"none" | "approve" | "reject">("none");

  return (
    <div className="border border-line p-3" data-testid={`review-row-${listing.id}`}>
      <div className="flex gap-3">
        <Link href={`/l/${listing.id}`} className="shrink-0">
          <img src={listing.images[0]} alt="" className="w-24 h-24 object-cover" />
        </Link>
        <div className="flex-1">
          <div className="font-semibold">{listing.title}</div>
          <div className="label mt-1">
            @{sellerName} · {listing.brand} · {listing.size} · {conditionLabel(listing.condition)}
          </div>
          <div className="label text-acid mt-0.5">
            CLAIM: {authenticityLabel(listing.authenticity)}
          </div>
          <div className="text-sm mt-2 text-ink/90 line-clamp-3">{listing.description}</div>
          <div className="label mt-1 text-muted">
            {listing.asking_price_cents
              ? `${money(listing.asking_price_cents)} buy now`
              : listing.starting_bid_cents
              ? `${money(listing.starting_bid_cents)} starting bid`
              : "trade only"}{" "}
            · submitted {relativeTime(listing.submitted_for_review_at ?? listing.created_at)}
          </div>
        </div>
      </div>

      {active === "none" ? (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            className="btn btn-primary"
            onClick={() => setActive("approve")}
            data-testid={`approve-${listing.id}`}
          >
            APPROVE
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setActive("reject")}
            data-testid={`reject-${listing.id}`}
          >
            REJECT
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <input
            placeholder={
              active === "approve"
                ? "Optional note for the seller…"
                : "Required: tell the seller why this was rejected"
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            data-testid={`mod-note-${listing.id}`}
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setActive("none");
                setNote("");
              }}
            >
              CANCEL
            </button>
            <button
              className={active === "approve" ? "btn btn-primary" : "btn btn-danger"}
              onClick={() => {
                if (active === "approve") onApprove(note || undefined);
                else if (note.trim()) onReject(note);
              }}
              disabled={active === "reject" && !note.trim()}
              data-testid={`confirm-${active}-${listing.id}`}
            >
              CONFIRM {active.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
