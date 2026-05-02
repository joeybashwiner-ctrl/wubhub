# wubhub — Phase 0 Legal Checklist

> **Status:** Not started · **Owner:** Bry · **Target close:** before any real money moves
>
> ⚠️ **Read first:** none of the documents in `docs/legal/` are legal advice. They're starting drafts based on common marketplace ToS patterns. Every doc has to be reviewed by a licensed attorney in your jurisdiction before it goes live. The whole point of doing the drafting yourself is to keep the lawyer's job to *review*, which costs ~$300–800 instead of $2–3k for a from-scratch draft.

---

## The blocking dependency chain

```
Form business entity ──► Domain + email ──► Draft ToS + Privacy ──► Lawyer review ──► Publish ──► Stripe Connect onboarding
                          │
                          └─► DMCA agent registration ──► Brand-name listings can go live
```

Don't start Stripe Connect onboarding before legal is done. Stripe's Restricted Partner Agreement requires you to have your own ToS in place, and they sometimes ask for the URL during platform onboarding.

---

## Action items (check off as you go)

### 1 · Business entity

- [ ] **Form an LLC** (or C-Corp if planning to raise) — currently operating as a sole proprietor exposes your personal assets when someone disputes a $400 hoodie.
  - Cheapest path: state of residence, ~$50–500 depending on state
  - Standard "I might raise" path: **Stripe Atlas** ($500 — Delaware C-Corp + EIN + Mercury bank account, ~2 week turnaround)
  - LegalZoom LLC: ~$99 + state filing fee
- [ ] **Get EIN** from IRS (free, 10 min, online — required for Stripe + bank account)
- [ ] **Open business bank account** (Mercury, Relay, or local — Stripe deposits go here)
- [ ] **Decide on entity name** — exact spelling matters for ToS/contracts. Likely `wubhub LLC` or `wubhub Inc.` Set this once, find/replace through every draft.

### 2 · Domain + email aliases

- [ ] Register **wubhub.app** at Cloudflare or Namecheap (~$15–30/yr)
- [ ] Register **wubhub.com** defensively if available (cheap insurance against squatters once the brand catches)
- [ ] Set up Google Workspace or Fastmail ($6/user/mo)
- [ ] Create the four email aliases the docs reference:
  - [ ] `support@wubhub.app` — buyer/seller help, dispute intake
  - [ ] `dmca@wubhub.app` — IP takedown notices (this exact alias is what gets registered with USCO)
  - [ ] `legal@wubhub.app` — service of process, attorney comms
  - [ ] `privacy@wubhub.app` — GDPR/CCPA data requests
- [ ] Forward all four to your inbox until volume justifies a help desk

### 3 · Trademark search

- [ ] Run a free **USPTO TESS** search for "wubhub" → https://tmsearch.uspto.gov
  - Look for live marks in classes 9 (mobile apps) and 35 (online retail/marketplace services)
- [ ] Google search: `"wubhub" site:.app` and `"wubhub" trademark`
- [ ] Optional: file a trademark application yourself ($350 per class via TEAS Plus) **only after** the entity is formed and product is live. Premature filing dates are weak.

### 4 · DMCA agent registration

This is the cheapest, most-skipped, most-important item on this list.

- [ ] Open `03-dmca-agent.md` and fill in your data
- [ ] Register at https://dmca.copyright.gov (USCO online portal)
- [ ] Pay $6 fee
- [ ] Save the confirmation email and the assigned **Service Provider ID**
- [ ] Add the agent name and contact details to ToS § 14
- [ ] Set calendar reminder for 3-year renewal

Without this, you have no DMCA safe harbor. One artist team filing a takedown when you have no registered agent → personal liability for every infringing listing on your platform.

### 5 · Draft ToS + Privacy + Acceptable Use

- [ ] Read `01-terms-of-service.md` end-to-end. Replace every `[...]` placeholder with your actual data
- [ ] Read `02-privacy-policy.md` end-to-end. Same drill
- [ ] Decide on governing law jurisdiction (default in template is Delaware — change if you formed elsewhere)
- [ ] Decide on arbitration provider (default is AAA — JAMS or NAM are alternatives)
- [ ] Decide if you want a class-action waiver (default: yes — standard for US marketplaces)

### 6 · Lawyer review (the part you're paying for)

- [ ] Find a marketplace/e-commerce attorney — see `04-lawyer-review-brief.md` for sourcing
- [ ] Send them the brief in `04-lawyer-review-brief.md` and the two drafts
- [ ] Get a fixed-fee quote ($300–800 is normal for review-only of two docs)
- [ ] Apply their line edits
- [ ] Get their sign-off in writing (one-line email is fine)
- [ ] Have them flag anything that needs state-specific carve-outs (CA, NY, MA tend to add work)

### 7 · Stripe Connect Restricted Partner Agreement

- [ ] Read https://stripe.com/legal/connect-account#restricted-services — full text, not the summary
- [ ] Confirm none of your prohibited-items list overlaps with Stripe's prohibited businesses (drug paraphernalia is a hard "no" on both — already in your prohibited list)
- [ ] Note that Stripe requires your buyer protection policy to be at least their PaymentIntent dispute coverage. Cross-check `01-terms-of-service.md` § Buyer Protection
- [ ] During platform onboarding, you'll provide:
  - [ ] Live ToS URL
  - [ ] Live Privacy Policy URL
  - [ ] Acceptable Use / prohibited items policy URL
  - [ ] Designated DMCA agent details

### 8 · Apple / Google policies

- [ ] App Store: confirm your model is **Guideline 3.1.3(e) — Person-to-Person Goods** (physical goods, NOT IAP) — already locked in spec
- [ ] App Store: prepare **Privacy Nutrition Labels** entries that match your Privacy Policy disclosures (every type of data must match)
- [ ] App Store: pick an age rating (recommend **17+** because some festival merch references controlled substances)
- [ ] Play Store: prepare the **Data safety form** (same data as Apple, different format)
- [ ] Both: review their policies on counterfeit / IP-infringing goods. Both will reject you on first scan if they spot brand names without a takedown process — your DMCA agent registration + reports flow are the proof you have one

### 9 · Sales tax setup

- [ ] Register for sales tax in your home state (free, instant in most states)
- [ ] Enable **Stripe Tax** in dashboard (it auto-collects + remits; you still need to be registered)
- [ ] Note: marketplace facilitator laws mean wubhub is generally responsible for collecting + remitting in 45+ states once the platform passes economic nexus (~$100k or 200 transactions in a state per year). Stripe Tax handles the math; your job is to be registered and to file annual returns
- [ ] Decide if you'll absorb shipping tax or pass through (default: pass through, already in checkout UI)

### 10 · Cookie + tracking consent

- [ ] Decide on consent management: **CookieYes** ($10/mo) or **Cookiebot** (free under 100 pages) or roll your own
- [ ] Banner copy is in `02-privacy-policy.md` § Cookies
- [ ] PostHog + Sentry are flagged in the Privacy Policy as essential (analytics) and error reporting — verify your tooling list matches what's in the doc

### 11 · Brand-name listing risk policy

- [ ] Decide on the brand watch-list — first 3 listings of any new artist (e.g. "Excision", "Subtronics", "Bassnectar") get manual mod review even if seller is established
- [ ] Confirm authenticity review queue is wired to flag every `official_artist` listing — already implemented
- [ ] Document the takedown response SLA (default: 48 hours from `dmca@wubhub.app` receipt to listing removal) in ToS § DMCA

### 12 · Insurance (do this once GMV > $10k/mo, not before)

- [ ] **General liability** — small business policy, ~$500/yr (Hiscox, Next, Thimble)
- [ ] **Cyber liability** — covers data breach response, $500–1500/yr
- [ ] **E&O / professional liability** — covers misclassified listings, fraud disputes
- [ ] Skip until you have real revenue — too expensive to carry while pre-launch

---

## Cost summary

| Item | One-time | Recurring |
|---|---|---|
| LLC formation (Stripe Atlas path) | $500 | — |
| EIN | $0 | — |
| Domains | $30 | $30/yr |
| Google Workspace | — | $72/yr |
| DMCA agent | $6 | $6/3yr |
| Lawyer review | $300–800 | — |
| USPTO trademark (if filing) | $350 | — |
| **Phase 0 total** | **~$1,200** | **~$100/yr** |

vs. the $2–3k you'd pay a lawyer to draft from scratch.

---

## Before you mark Phase 0 complete

All of these must be true:

- [ ] LLC formed, EIN issued, business bank account open
- [ ] wubhub.app live, all four email aliases working
- [ ] DMCA agent registered, USCO confirmation saved
- [ ] ToS published at `wubhub.app/terms`
- [ ] Privacy Policy published at `wubhub.app/privacy`
- [ ] Acceptable Use Policy published at `wubhub.app/policies/acceptable-use` (lives inside the ToS draft as appendix; can be split out)
- [ ] Lawyer sign-off email saved in `docs/legal/_lawyer-signoff.eml`
- [ ] Stripe Connect Restricted Partner Agreement read, screenshot of "I agree" saved
- [ ] First-listing reviewer rotation set up (you, until volume needs more)

Once everything above is checked, you can start Phase 1 (Supabase + auth) without any legal blockers waiting in the wings.
