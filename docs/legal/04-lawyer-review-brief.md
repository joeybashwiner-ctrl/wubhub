# Lawyer Review Brief — wubhub Phase 0 Legal

> Send the brief below to a marketplace/e-commerce attorney along with `01-terms-of-service.md` and `02-privacy-policy.md`. Goal: a fixed-fee **review** (not redraft) that catches material gaps and applies any state-specific or jurisdiction-specific edits we missed.

---

## How to find an attorney willing to do review-only

Most attorneys default to "let me draft it from scratch for $3k+". You want one who will quote a fixed fee for **review of a near-final draft**. They exist; just be specific in your outreach.

### Sources, ranked by speed/cost

1. **UpCounsel** (https://www.upcounsel.com) — post a fixed-fee project ("Review marketplace ToS + Privacy Policy, ~10 pages each, US peer-to-peer marketplace, max $750"). Attorneys bid. Read reviews. ~3-5 day turnaround
2. **Specialized fixed-fee firms** that advertise marketplace work:
   - **TermsFeed Legal Review** (around $300–500)
   - **Mark Litwak / Pacific Legal Group** style indie practitioners
   - **LegalZoom Business Advisory Plan** ($499/yr, includes attorney consultation hours that can be applied to this)
3. **Local IP + commercial litigation attorney** referred by your local bar association. Slower (~2 weeks) but builds a relationship if you'll need litigation help later. Hourly rates $250–400; the review usually fits in 2-3 billable hours
4. **Stripe-recommended counsel** — Stripe sometimes shares a list of vetted marketplace lawyers when you ask during Connect onboarding. Free to ask
5. **Twitter / r/SaaS / Indie Hackers** referrals — a 30-min DM hunt usually surfaces an indie-friendly lawyer in your network

### What you're NOT looking for

- Big-firm corporate counsel ($600+/hr, will quote $5k for the same scope)
- Generalist family-law attorneys who "do business stuff" (won't catch marketplace-specific issues)
- Online "legal templates" without an actual attorney signoff (defeats the point — you already have templates)

---

## The brief — copy/paste below into an email

Subject: `Fixed-fee review of marketplace ToS + Privacy Policy (US, peer-to-peer resale)`

> Hi [Attorney Name],
>
> I'm the founder of **wubhub**, a peer-to-peer marketplace for resale of festival merchandise (hoodies, pashminas, totems, etc.) — think Grailed for the EDM scene. We're pre-launch, US-only, web + mobile, integrating Stripe Connect for payments. **Our model is the standard online marketplace pattern**: we provide a venue, sellers list items, buyers buy, we take a percentage fee, we are not a party to the sale.
>
> **I've drafted our Terms of Service and Privacy Policy myself, working from common marketplace ToS structures.** I'm not asking for a re-draft. I'm looking for a fixed-fee review that flags:
>
> 1. Material gaps or sections that fall short of what's typical for a US peer-to-peer marketplace
> 2. Compliance issues with **CCPA/CPRA, GDPR**, and any state-specific carve-outs we're missing (especially CA, NY, MA)
> 3. Compatibility with the **Stripe Connect Restricted Partner Agreement** — particularly around our buyer-protection commitments and our role as a marketplace facilitator for sales tax
> 4. Anything that would invite an App Store / Play Store rejection (we've already locked in Apple Guideline 3.1.3(e) for physical-goods compliance — payments will be Apple Pay via Stripe, not IAP)
> 5. Any unusual or risky clauses that you'd push back on if you were defending a class action against us
>
> The two documents are roughly **8–10 pages each**. There's some specificity unique to us:
>
> - We accept **trades** (peer-to-peer item swaps with optional cash-on-top), held in escrow until both ship — the trade flow has its own fee structure ($1.99 flat per side rather than a percentage)
> - We have an **authenticity review queue** — listings claiming "official artist" go through a 24-hour mod review before going live; this is a brand-integrity check, not an authentication guarantee
> - We use **AI image cleanup** (white-background isolation) for listing photos, with disclosure
>
> **Deliverable I'm hoping for:**
>
> - Inline comments / line edits on both documents
> - A short summary memo (1–2 pages) of any material issues
> - Sign-off email confirming the documents are okay to publish after my edits land
>
> **Timeline:** I'd love to have edits back within 1 week of your start.
>
> **Budget:** I'm targeting **$300–800 total fixed fee for both documents**. I understand state-specific work or unusual issues might bump that — happy to scope-and-quote those separately if they come up.
>
> Both drafts are attached as PDF. Looking forward to hearing back. Thanks.
>
> — [Your name]
> [your-email@wubhub.app] · [phone]

---

## What to attach

- `01-terms-of-service.md` exported as PDF (use `pandoc` or just print-to-PDF from a markdown previewer — the formatting matters for the lawyer's reading speed)
- `02-privacy-policy.md` same
- Optional: a one-page product overview with screenshots of the listing detail, checkout, and trade flow so they understand the actual surface

```bash
# in docs/legal/
pandoc 01-terms-of-service.md -o 01-terms-of-service.pdf --pdf-engine=weasyprint
pandoc 02-privacy-policy.md -o 02-privacy-policy.pdf --pdf-engine=weasyprint
```

---

## Questions to ask in the kickoff call (30 min, free for most)

Before signing the engagement, ask these to filter out wrong-fit lawyers:

1. **"Do you have prior experience reviewing marketplace ToS specifically?"** (You want a yes — peer-to-peer marketplaces have unique issues. Pure SaaS lawyers will miss them.)
2. **"Have you worked with Stripe Connect platforms before?"** (Bonus if yes — they'll spot Restricted Partner Agreement gaps fast.)
3. **"What's your process for fixed-fee review?"** (You want: read, comment, write summary memo, sign off. Not: rebuild from your own template.)
4. **"What's the upside of CCPA private right of action exposure for a platform our size?"** (Tests their knowledge of consumer-class-action plaintiff bar.)
5. **"What's a state-specific carve-out you'd flag for us?"** (NY, CA, MA expect arbitration carve-outs for certain consumer claims; if they don't know this, they're the wrong fit.)

---

## What to do with their feedback

- Apply line edits in the markdown source. Commit to git
- Save their summary memo as `docs/legal/_lawyer-memo-[YYYY-MM-DD].pdf`
- Save their sign-off email as `docs/legal/_lawyer-signoff-[YYYY-MM-DD].eml`
- Update the **"Last updated"** date in both documents to the publish date
- Update the version note in your repo CHANGELOG that legal review landed at this commit

After their sign-off, the docs are publishable. **Do not publish before the sign-off email arrives.**

---

## Ongoing

Once you launch:

- **Material changes to the ToS or Privacy Policy** require a re-review. Budget ~$200–400 each time. Don't ship privacy-impacting changes (new vendors, new tracking, EU users, etc.) without a review pass
- **Once a year**, do a refresh review. Laws change (CPRA was a big one; state privacy laws are landing every year)
- **If a complaint or claim arrives**, your reviewer is your first call. The 30-min relationship investment now pays off when something hits the fan
