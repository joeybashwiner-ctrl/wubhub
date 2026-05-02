# wubhub — Launch Checklist

> Simple-man's checklist to ship wubhub. Five phases, top to bottom. **Don't skip Phase A** — it blocks everything monetary.

---

## A · Pre-flight (legal + entity) — week 1-2

Cost: ~$1,200 upfront, $100/yr recurring.

- [ ] Form **LLC or C-Corp** (Stripe Atlas $500 = Delaware C-Corp + EIN + Mercury bank, or LegalZoom LLC ~$150)
- [ ] Get **EIN** from IRS (free, 10 min online)
- [ ] Open **business bank account**
- [ ] Buy **wubhub.app** + defensively **wubhub.com**
- [ ] Set up email aliases: `support@`, `dmca@`, `legal@`, `privacy@`
- [ ] **DMCA agent registration** at https://dmca.copyright.gov ($6, 15 min) — see [`docs/legal/03-dmca-agent.md`](docs/legal/03-dmca-agent.md)
- [ ] **USPTO TESS** trademark search for "wubhub" (free)
- [ ] Edit [`docs/legal/01-terms-of-service.md`](docs/legal/01-terms-of-service.md) and [`docs/legal/02-privacy-policy.md`](docs/legal/02-privacy-policy.md) — replace every `[bracket]`
- [ ] Send to lawyer for review-only ($300-800) using [`docs/legal/04-lawyer-review-brief.md`](docs/legal/04-lawyer-review-brief.md)
- [ ] Save lawyer sign-off email
- [ ] Publish ToS at `wubhub.app/terms`, Privacy at `wubhub.app/privacy`
- [ ] Read **Stripe Connect Restricted Partner Agreement** end-to-end

---

## B · Build (backend + stripe + shipping) — week 3-6

### Backend (Supabase)

- [ ] Create **Supabase project** (Pro $25/mo) + apply schema from [`src/lib/types.ts`](src/lib/types.ts)
- [ ] **RLS policies** on every table per the spec
- [ ] **Auth** — email/password + Apple OAuth + Google OAuth
- [ ] Replace `src/lib/store.tsx` mock with Supabase client
- [ ] Generate TypeScript types from schema → drop into `types.ts`

### Edge Functions

- [ ] `place-bid` (atomic top-bid update + outbid notification)
- [ ] `settle-auction` (cron, every 60s)
- [ ] `create-payment-intent` (with platform fee + transfer_data)
- [ ] `stripe-webhook` (account.updated, payment_intent.succeeded, charge.refunded)
- [ ] `process-listing-image` (calls fal.ai Nano Banana Pro for white-bg cleanup)
- [ ] `approve-listing` / `reject-listing` (mod actions, audit log)

### Stripe Connect (P2P payments)

- [ ] **Stripe Connect Standard** accounts for sellers
- [ ] **Lazy onboarding** — only triggered before publishing first listing
- [ ] **Apple Pay** merchant ID + domain verification
- [ ] **PaymentIntent** for fixed-price (with `application_fee_amount` = 8.08% + `transfer_data[destination]` = seller account)
- [ ] **SetupIntent** for auction bid pre-auth (charge only on win)
- [ ] **Auction close fallback** — if winner's card fails, retry top 3 bidders
- [ ] **Stripe Tax** enabled (auto-collect + remit US sales tax)
- [ ] **Refund flow** — buyer protection cases (full refund + return label paid by wubhub)
- [ ] **Trade fee** — flat $1.99 per side, taken from cash-on-top or invoiced

### Real shipping

- [ ] Sign up for **Shippo** (cheaper at low volume) or **EasyPost**
- [ ] Replace `quoteShipping()` in [`src/lib/shipping.ts`](src/lib/shipping.ts) with API call
- [ ] **Address validation** in checkout
- [ ] **Label purchase** on seller behalf, billed to Stripe payout
- [ ] **Tracking webhook** → auto-mark `delivered`, kick 3-day auto-confirm timer

---

## C · Test the BST loop end-to-end — week 6

Each flow tested with real money in private beta accounts:

### Buy flow

- [ ] Browse → search → filter
- [ ] Listing detail (auction + fixed + trade-only)
- [ ] Buy now → Apple Pay → PaymentIntent succeeds
- [ ] Order receipt with real fee breakdown (8.08% + Stripe 2.9% + 30¢)
- [ ] Email transactional notifications fire
- [ ] Seller sees order in their dashboard
- [ ] Funds appear pending in seller's Stripe Connect account

### Sell flow

- [ ] Sign up → onboarding → first listing creation
- [ ] Stripe Connect KYC redirect → approve → return → publish
- [ ] Photos upload → fal.ai cleanup → toggle accept/reject per photo
- [ ] List as `official_artist` → goes to mod queue
- [ ] Mod approves → listing goes live
- [ ] Buy a real shipping label, print PDF, ship
- [ ] Tracking webhook updates → buyer auto-confirms 3 days after delivered
- [ ] Funds release to seller's bank in 2 days

### Trade flow

- [ ] Propose trade with closet items + cash on top
- [ ] Counter offer → accept
- [ ] Both parties enter "ship within 5 days" mode
- [ ] Both ship + tracking
- [ ] Funds (cash on top) release on dual confirmation
- [ ] $1.99 fee charged to each side

### Auction flow

- [ ] Place bid → SetupIntent saved
- [ ] Get outbid → email/push fires
- [ ] Anti-snipe extends auction by 2 min on bid in final 2 min
- [ ] Auction closes → winning bidder charged → fallback chain works if first card fails
- [ ] Reserve-not-met → all SetupIntents cleared, no charges

### Trust & safety

- [ ] Report a counterfeit listing → mod queue → action taken
- [ ] Strike system increments correctly
- [ ] DMCA takedown email arrives at `dmca@wubhub.app` → 48h response
- [ ] Buyer protection refund processes correctly

---

## D · Polish (onboarding + security) — week 7

### Onboarding

- [ ] Wire the 3-screen primer (already designed) to real signup
- [ ] Email verification flow
- [ ] Profile completion (username, optional avatar, optional bio + city)
- [ ] **Drop into feed** — no Stripe Connect prompt yet (lazy)
- [ ] Welcome email via Resend or Postmark

### Security audit

- [ ] **Dependency audit**: `npm audit` → fix all high/critical
- [ ] **RLS test suite**: assert user A can't read/edit user B's data
- [ ] **Secrets scan**: no API keys in code, all in env vars
- [ ] **Auth review**: short-lived sessions, password requirements, rate limiting on login
- [ ] **OWASP Top 10 walkthrough**: SQL injection (none — using Supabase params), XSS (React escapes), CSRF (Supabase handles), open redirects, IDOR
- [ ] **PII audit**: confirm no PII in PostHog events, Sentry stack traces redact email
- [ ] **Stripe webhook signature** verification on every endpoint
- [ ] **Penetration test** — at least one external review (Cobalt or HackerOne private bounty, ~$500-2k)

### Observability

- [ ] **Sentry** wired (web + mobile + Edge Functions)
- [ ] **PostHog** wired with funnels: signup → first listing, listing → buy
- [ ] **Stripe webhook event log** archived in Supabase for debugging
- [ ] **Status page** at status.wubhub.app

---

## E · Launch — week 8-10

### Pre-launch

- [ ] **Curated 10-20 sellers** committed to listing on day one (your network)
- [ ] **Seed listings** loaded — at least 50 real items live before public open
- [ ] **TestFlight** beta with 25-50 users for 2 weeks
- [ ] **App Store** submission with 17+ rating, Privacy Nutrition Labels matching [`docs/legal/02-privacy-policy.md`](docs/legal/02-privacy-policy.md)
- [ ] **Play Store** Data Safety form submitted
- [ ] **Vercel** production deploy with custom domain

### Marketing seed

- [ ] Twitter/Instagram/TikTok handle live (`@wubhub`)
- [ ] Discord server with dedicated trade-buy-sell channels
- [ ] First Reddit posts in r/aves, r/EDM, r/EDC announcing private beta
- [ ] Demo video (~30s) walking the BST loop
- [ ] Press email to EDM blogs (Your EDM, Dancing Astronaut, Run The Trap)

### Public launch

- [ ] Drop the beta gate
- [ ] Post launch announcement everywhere
- [ ] Watch error rates + fraud signals first 72 hours
- [ ] Be available to handle disputes personally for the first month

---

## Total realistic timeline

**8-10 weeks to public web + iOS launch** with one engineer + one founder doing legal/ops.

Add ~3 weeks for full Android polish if you want feature parity from day one (RN handles most of it; just need device testing).

---

## Costs at-a-glance

| Bucket | Upfront | Monthly | Notes |
|---|---|---|---|
| Legal + entity + DMCA | ~$1,200 | $30 (mailbox + email) | Stripe Atlas + lawyer review + Google Workspace |
| Domains | $30 | — | wubhub.app + wubhub.com |
| Supabase | — | $25 | Pro tier |
| Vercel | — | $20 | Pro tier |
| Sentry | — | $0 | Free tier OK to start |
| PostHog | — | $0 | Free tier OK to start |
| fal.ai | — | usage | ~$0.50 per listing |
| Stripe + Shippo | — | pass-through | Built into fee structure |
| Apple Developer | $99/yr | — | Required for App Store |
| Pen test | $500-2k | — | One-time before public |
| **Total to launch** | **~$2,000-3,500** | **~$75-100** | |

---

## Three things this doesn't cover (but should be on your radar)

1. **You'll need a fraud team-of-one until ~month 6.** First time someone files a $400 chargeback claiming non-receipt while the seller has scan-confirmed delivery, you need a person to make a call. Budget 2-4 hours/week.
2. **Plan for App Store rejection on attempts 1-2.** Apple will flag *something* — usually authenticity claims, age-gating around drug paraphernalia in totem listings, or chargeback handling. Budget 2 weeks of back-and-forth.
3. **Brand-name listing risk is ongoing.** Set up an email rule that pings your phone when `dmca@wubhub.app` gets traffic. The 48-hour SLA is non-negotiable.

---

## Pre-flight check before public launch

All of these must be true the day you remove the beta gate:

- [ ] LLC formed, EIN, business bank, Stripe Connect platform live
- [ ] DMCA agent registered, ToS + Privacy Policy published, lawyer sign-off saved
- [ ] First-listing manual review process running (you, until volume justifies a hire)
- [ ] At least 50 listings live, at least 5 completed real-money transactions in beta
- [ ] Sentry green, PostHog wired, status page live
- [ ] Pen test complete, all high/critical findings fixed
- [ ] You can answer dispute emails within 24h for the first month

When all checked → ship it.
