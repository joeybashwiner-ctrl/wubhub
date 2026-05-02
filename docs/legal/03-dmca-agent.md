# DMCA Agent Registration — wubhub

> The cheapest, fastest, most-skipped item on the legal checklist. **$6, 15 minutes online.** Without it you have no DMCA safe harbor — one takedown notice arrives, no registered agent, your personal liability begins.

---

## What this is

DMCA § 512 limits an online service provider's liability for copyright infringement by its users — but **only if you register a designated agent with the U.S. Copyright Office (USCO)**. The agent is the person artists and rights holders contact to file takedown notices. Once you register and respond to valid notices in time, you keep the safe harbor.

Marketplaces with brand-name listings without a registered agent are sitting ducks. Excision's management team finds a counterfeit "Detox Tour" hoodie, sends a cease-and-desist to no one in particular, and your platform — and you personally if you're the founder of an unincorporated entity — are on the hook.

---

## Before you register

You need:

- [ ] **Business entity formed** (LLC or corp). The agent registration is in the name of the legal entity. Don't register as "Bryan Clark, sole proprietor" if you plan to operate as wubhub LLC — you'll have to redo it
- [ ] **Mailing address** for the entity. **You can use a P.O. Box or a service like iPostal1 or Stable** ($10–25/mo) if you don't want your home address public — the registration is **public record**
- [ ] **Phone number** for the entity. A Google Voice number is fine; it doesn't need to be staffed 24/7
- [ ] **Email address:** `dmca@wubhub.app` (set this up first; it must be live)
- [ ] **A USCO online account** — sign up free at https://dmca.copyright.gov

---

## Registration walkthrough

1. Go to https://dmca.copyright.gov/
2. Click **"Log in to designate an agent"** (top right)
3. Sign in with your USCO account, or create one
4. Click **"Designate New Agent"**
5. Fill in the **Service Provider** information using the data block below
6. Fill in the **Designated Agent** information
7. Pay **$6** (credit card or ACH)
8. Save the confirmation email and the assigned **Service Provider ID**

The whole flow takes 15 minutes the first time.

---

## Data to enter

Replace every `[bracket]` with your actual info, then enter **exactly** what you write here. The names in this form must match the entity name you use in your ToS § 1.

```
─── SERVICE PROVIDER ───────────────────────────────────────────

Full legal name of service provider:
  [wubhub Inc. / wubhub LLC]

Alternate names (DBAs, also-known-as) — one per line:
  wubhub
  wubhub.app

URLs of websites covered by this designation — one per line:
  https://wubhub.app
  https://www.wubhub.app

Physical mail address:
  [Street address — can be P.O. Box or commercial mail service]
  [City, State, ZIP]

Phone:
  [+1 (XXX) XXX-XXXX]

Email:
  [legal@wubhub.app]

─── DESIGNATED AGENT ───────────────────────────────────────────

Full legal name:
  [Bryan T. Clark]    ← (whoever will receive takedowns)

Title or position:
  Founder & Designated DMCA Agent

Organization:
  [wubhub Inc. / wubhub LLC]

Physical mail address:
  [Same address or different — must be a real address]
  [City, State, ZIP]

Phone:
  [Phone number]

Email:
  dmca@wubhub.app   ← (must be live and monitored)
```

---

## After registration

- [ ] Save the confirmation email — it includes your **Service Provider ID** (an integer like `1234567`). You'll reference this in any DMCA correspondence
- [ ] Update **ToS § 14** with the agent name + address you used
- [ ] Confirm `dmca@wubhub.app` actually delivers (send a test from a personal account)
- [ ] Set up an inbox rule: any new email to `dmca@wubhub.app` triggers a Slack/Discord ping or pushes to your phone — **48-hour response SLA**, weekends count
- [ ] Add a calendar reminder for 3-year renewal (the registration expires; you must renew or the safe harbor lapses)

---

## Handling your first takedown notice

When one arrives, the workflow is:

1. **Verify the notice has the six required elements** (signature, identification of the work, identification of the listing, contact info, good-faith statement, perjury statement). Listed in ToS § 14
2. If valid, **remove the listing within 48 hours** by setting `status = "removed"` in the database. Save a copy of the listing record + photos for your records (you may need them if a counter-notice comes back)
3. **Notify the seller** via email and in-app, with the basis (which work was claimed, who claimed it). Tell them about counter-notice rights under § 512(g)
4. **Add a strike** to the seller's account (counterfeits are first-strike-warning per ToS § 11; mislabeled fan-made items might be a soft warning)
5. **Reply to the notifier** confirming removal
6. If a counter-notice comes back within 14 days, send it to the original notifier. If they don't sue within 14 days, the listing can be reinstated

The exact wording for these notices is templated in `docs/legal/_templates/` *(create when you handle your first takedown)*.

---

## Renewing every 3 years

USCO requires renewal every three years. Set a calendar reminder. The cost is the same $6.

If you fail to renew, you lose safe harbor protection during the lapse window — even if the rest of the system worked perfectly. This is a one-line item that ends businesses.
