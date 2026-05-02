"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { useStore } from "@/lib/store";

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const { profiles, listings } = useStore();
  const profile = profiles.find((p) => p.username === params.username);
  const userListings = listings.filter((l) => l.seller_id === profile?.id);

  if (!profile) {
    return (
      <div className="px-5 py-32 text-center">
        <div className="display text-3xl">USER NOT FOUND</div>
        <Link href="/" className="btn btn-ghost mt-5">HOME</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="px-5 py-8 border-b border-line">
        <div className="flex items-center gap-4">
          <img src={profile.avatar_url} alt="" className="w-20 h-20 border border-line object-cover" />
          <div className="flex-1">
            <div className="display text-4xl">@{profile.username}</div>
            <div className="label mt-2">
              ★ {profile.reputation.toFixed(2)} · {profile.total_sales} SALES · {profile.total_trades} TRADES · {profile.city.toUpperCase()}
            </div>
            {profile.bio && <p className="text-sm mt-3 max-w-lg text-muted leading-relaxed">{profile.bio}</p>}
          </div>
        </div>
      </section>

      <section className="px-3 py-4">
        <div className="px-2 label mb-2">{userListings.length} ACTIVE LISTINGS</div>
        {userListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="display text-2xl">CLOSET EMPTY.</div>
          </div>
        ) : (
          <div className="grid gap-1 sm:gap-2 md:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {userListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
