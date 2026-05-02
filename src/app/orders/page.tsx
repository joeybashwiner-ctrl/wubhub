"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { money, relativeTime } from "@/lib/format";

export default function OrdersPage() {
  const { orders, listings, profiles, currentUserId } = useStore();
  const mine = orders.filter(
    (o) => o.buyer_id === currentUserId || o.seller_id === currentUserId,
  );

  return (
    <div className="px-5 py-8 max-w-3xl mx-auto">
      <h1 className="display text-4xl tracking-tighter">ORDERS</h1>
      {mine.length === 0 ? (
        <div className="text-center py-20">
          <div className="display text-2xl">NO ORDERS YET.</div>
          <Link href="/" className="btn btn-ghost mt-5">BROWSE</Link>
        </div>
      ) : (
        <div className="grid gap-3 mt-5">
          {mine.map((o) => {
            const l = listings.find((x) => x.id === o.listing_id);
            const counterId = o.buyer_id === currentUserId ? o.seller_id : o.buyer_id;
            const counter = profiles.find((p) => p.id === counterId);
            const role = o.buyer_id === currentUserId ? "BUYER" : "SELLER";
            return (
              <Link
                key={o.id}
                href={`/order/${o.id}`}
                className="border border-line p-4 hover:border-acid block"
              >
                <div className="flex items-center gap-3">
                  {l && <img src={l.images[0]} alt="" className="w-14 h-14 object-cover" />}
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{l?.title}</div>
                    <div className="label">
                      {role} · @{counter?.username} · {relativeTime(o.created_at)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{money(o.total_cents)}</div>
                    <div className="label text-acid">{o.status.toUpperCase()}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
