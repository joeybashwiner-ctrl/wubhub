# wubhub — v0.1 prototype

Underground BST (Buy / Sell / Trade) marketplace for festival merch. Web prototype, mock data, all flows wired.

## Run

```bash
cd wubhub
npm install
npm run dev
# http://localhost:3001
```

## What works (clickable end-to-end)

- **Browse** — home feed with category, listing-type, "open to trade" filters and search.
- **Listing detail** — image gallery, badges (authenticity / condition / open-to-trade), seller card, bid history.
- **Buy now** — confirm modal → mock Stripe charge → order receipt page with fee breakdown (8% platform + 2.9%+30¢ Stripe).
- **Auctions** — place bid modal with pre-auth language, live top-bid update, anti-sniping copy.
- **Trade proposals (NEW)** — pick items from your closet, add cash on top, value-gap meter, review screen, send.
- **Trade negotiation** — incoming/outgoing inboxes, conversation thread, **accept / counter / decline**. Counter offer can swap items + cash.
- **Trade acceptance** — both involved listings get marked TRADED, both parties enter "ship within 5 days" mode.
- **Sell** — full create-listing form with photo picker (stock fixtures), 8%/Stripe fee preview, lazy publish.
- **Profile** — `/u/[username]` with active listings grid.
- **Multi-user demo** — header dropdown switches `currentUserId` so you can role-play buyer / seller / proposer / recipient without auth.
- **Persistence** — state lives in `localStorage`, survives reload.

## Architecture

- **Next.js 15 App Router** + TypeScript + Tailwind. No backend — `src/lib/store.tsx` is a React Context with localStorage hydration that stands in for Supabase.
- **Design system** — `src/app/globals.css` + `tailwind.config.ts`. Helvetica anchor, near-black background `#0A0A0A`, acid green accent `#C8FF00`, hot red `#FF3B30`, sharp 0–4px corners.
- **Data shapes** mirror the spec in `src/lib/types.ts` so the swap to real Supabase tables is mechanical.

## What's mocked vs real (per spec)

| Spec | Status |
|---|---|
| Apple Pay / Stripe Connect | Confirm modal labels Apple Pay; no real Stripe call |
| AI image processing (fal.ai) | Stock images, "DEMO: pick from stock" copy in seller form |
| Auction close cron | Auctions show ENDS IN timer; no automatic settlement yet |
| RLS / auth | Replaced by `currentUserId` switcher in header |
| DMCA / reports / trust & safety | Schema present, no UI yet |

## Trade model (the new one)

`TradeProposal` carries: target listing, proposer, recipient, offered listings + cash, conversation `history` of `TradeMessage`, status (`proposed | countered | accepted | declined | withdrawn | shipped | completed`).

On `accept`, both the target listing and every offered listing flip to `status: "traded"` so they leave the active feed in one shot. Cash on top is the bridge for value gaps — held in escrow language carried through the UI.

## Test flow (90 seconds)

1. http://localhost:3001 — browse the seeded grid (6 listings across 4 sellers).
2. Click the Excision hoodie → **BUY NOW** → confirm → land on PAID receipt.
3. Open the Bassnectar holographic pashmina (TRADE-ONLY) → **PROPOSE A TRADE** → pick the Old Soul pashmina from your closet → add $40 cash → review → send.
4. Switch user dropdown to **wubmom** → the trades nav shows a `1` badge → open the trade → **ACCEPT TRADE** → DEAL panel.
5. Browse home — both involved listings are gone from the active feed; visit `/u/wubmom` to see TRADED badge on the pashmina.
6. Open the Subtronics tee (auction) → **PLACE BID** → top bid updates live.
7. `/sell` — fill, publish → land on the new listing immediately.

## Reset

In the browser console: `localStorage.removeItem("wubhub-state-v2"); location.reload()`.

Or from any page in the app, future surface: a tiny "reset demo" button (TODO).

## Next from the spec

- Real Stripe Connect + PaymentIntent + SetupIntent
- Supabase migration of `src/lib/types.ts` → SQL with RLS
- Native mobile via Expo (the Tailwind tokens map to Tamagui without much work)
- Image upload + fal.ai isolation
- Auction close scheduled function
- DMCA agent + reports flow + 3-strike enforcement
