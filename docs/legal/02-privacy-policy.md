# Privacy Policy — wubhub

> ⚠️ **DRAFT — NOT LEGAL ADVICE.** Patterns adapted from common US marketplace privacy policies (Mercari, Poshmark, eBay) plus standard CCPA + GDPR scaffolding. Must be reviewed and signed off by a licensed attorney in your jurisdiction before going live. Replace every `[bracket]`. Verify the **vendor list in § 4** matches the tooling you actually use — the Privacy Nutrition Labels you submit to Apple have to match this document exactly.

**Effective date:** [DATE TO BE SET WHEN PUBLISHED]
**Last updated:** [DATE]

---

## 1 · Introduction

This Privacy Policy explains how **[wubhub Inc. / wubhub LLC]** ("**wubhub**", "**we**", "**us**") collects, uses, shares, and protects information about you when you use **wubhub.app**, our mobile applications, and related services (the "**Service**").

By using the Service, you consent to the practices described here. If you do not agree, do not use the Service.

This policy is subject to your state and country privacy rights, including the California Consumer Privacy Act ("**CCPA**", as amended by the CPRA), and the EU General Data Protection Regulation ("**GDPR**") where applicable. See § 7 for region-specific rights.

## 2 · Information we collect

### 2.1 · Information you give us

- **Account info:** email address, username, password (hashed), display name, optional profile photo, optional bio, city
- **Identity verification (sellers):** legal name, date of birth, last four digits of SSN, and bank account details — collected directly by **Stripe** during Stripe Connect onboarding. wubhub does not store these
- **Listing content:** photos, descriptions, brand and authenticity declarations, prices, sizes, conditions
- **Transaction data:** items purchased, sold, traded; shipping address; tracking numbers; reviews
- **Communications:** messages you send to other users via wubhub, support tickets, dispute filings
- **Tax info:** for sellers exceeding the IRS Form 1099-K threshold, we collect tax identification info via Stripe

### 2.2 · Information we collect automatically

- **Device info:** device model, OS version, app version, browser type, language, time zone
- **Usage info:** pages viewed, time on page, search queries, click events, feature usage
- **Location info:** approximate location derived from IP address (city-level, never GPS unless you explicitly grant the permission for shipping-address autofill)
- **Cookies and similar technologies:** see § 8

### 2.3 · Information from third parties

- **Payment processor (Stripe):** transaction status, fraud signals, chargeback notices
- **Shipping providers (Shippo / EasyPost / USPS / UPS / FedEx):** delivery status, tracking events
- **Identity verification (Stripe):** confirmation that seller KYC has completed
- **Sign-in providers (Apple, Google):** if you use Apple or Google to sign in, we receive the email address and unique identifier they share with us

### 2.4 · What we do not collect

- Full credit card numbers (handled and stored by Stripe; we receive only a token and last 4)
- Full bank account numbers (same)
- Your contacts, photo library beyond what you explicitly upload, microphone, or camera (unless you explicitly grant the permission for camera-based listing photos)
- Health, biometric, or precise GPS location

## 3 · How we use information

We use information to:

- **Run the Service:** authenticate accounts, process listings, route auctions, settle trades, deliver messages
- **Process transactions:** charge buyers, calculate fees and tax, pay sellers via Stripe, generate shipping labels
- **Provide buyer protection:** investigate disputes, evaluate refund claims
- **Communicate:** send transactional emails (order placed, shipped, delivered), and operational announcements (policy changes, scheduled maintenance)
- **Marketing (opt-in only):** if you opt in, we send product update emails and weekly drop digests. You can unsubscribe in one click
- **Improve the Service:** analyze aggregated usage to find bugs, improve search, identify popular categories
- **Trust and safety:** detect fraud, counterfeit listings, harassment, account takeovers; enforce our Terms; identify repeat offenders
- **Comply with law:** respond to subpoenas, court orders, law enforcement requests, and our own legal obligations (including 1099-K filings for high-volume sellers)

We do **not** sell your personal information to third parties. We do not engage in cross-context behavioral advertising as defined under the CPRA.

## 4 · How we share information

We share information only as described below.

### 4.1 · Other users

When you list an item, post a review, or send a message, the information becomes visible to other users:

- **Public:** username, display name, profile photo, bio, city, listings, reputation score, public reviews
- **Visible to your transaction counterparty:** shipping address (after they purchase your item), real first name (printed on the shipping label by the carrier)
- **Private to you:** email, payment details, full address, message contents (visible only to the recipient)

### 4.2 · Service providers

We share information with vendors that help us operate the Service. Each is contractually bound to use the data only as we direct and to protect it appropriately.

| Vendor | Role | Data shared |
|---|---|---|
| **Stripe** | Payment processing + Stripe Connect KYC + Stripe Tax | Transaction details, seller identity verification |
| **Supabase** | Database, authentication, storage | All Service data (encrypted at rest) |
| **Vercel** | Web hosting | Web request data |
| **Shippo** *(or EasyPost)* | Shipping rate quotes + label purchase | Sender + recipient address, item category, weight |
| **fal.ai** | AI image cleanup of listing photos | The original photo you uploaded for cleanup |
| **Resend** *(or Postmark)* | Transactional email delivery | Email address, message body |
| **Sentry** | Error reporting | Error stacks, user agent, partial request data (PII redacted) |
| **PostHog** | Product analytics | Anonymous usage events tied to a hashed user ID |
| **Apple Push Notification Service / Firebase Cloud Messaging** | Push notifications (mobile only) | Device token, notification content |

If we change vendors materially, we will update this list and notify users.

### 4.3 · Legal disclosures

We may disclose information if we have a good-faith belief it is necessary to:

- Comply with applicable law, subpoena, or court order
- Enforce our Terms or any other agreement
- Detect, investigate, or prevent fraud, security incidents, or harm to wubhub, users, or the public
- Protect our rights, property, or safety

### 4.4 · Business transfers

If wubhub is involved in a merger, acquisition, financing, or sale of assets, your information may be transferred as part of that deal. We will give notice (in-app and by email) before your information becomes subject to a different privacy policy.

### 4.5 · With your consent

We may share information for additional purposes if you explicitly consent.

## 5 · Data retention

We keep information for as long as needed to operate the Service and comply with legal obligations:

- **Account data:** kept while your account is active. Closed accounts: retained for 7 years to satisfy IRS, state tax, AML, and Stripe chargeback windows. After 7 years, account data is deleted or fully de-identified
- **Transaction data:** retained for 7 years
- **Listing photos:** kept while listing is active; deleted within 90 days of listing removal unless tied to an open dispute
- **Support tickets:** kept 3 years
- **Aggregated analytics:** kept indefinitely in de-identified form

Earlier deletion requests under § 7 are honored to the extent legally permissible.

## 6 · Data security

We implement reasonable technical and organizational measures including:

- TLS 1.2+ encryption in transit
- AES-256 encryption at rest (via Supabase)
- Row-level security on all database tables
- Token-based authentication with short-lived sessions
- Bcrypt-hashed passwords
- PCI-compliant card handling delegated entirely to Stripe
- Vendor security review before any new vendor receives personal data

No system is impenetrable. If a breach affecting your data occurs, we will notify you and the relevant authorities as required by law.

## 7 · Your rights

### 7.1 · All users

- **Access** the information we hold about you (in-app via Settings → Data, or by email to privacy@wubhub.app)
- **Correct** information that is inaccurate
- **Delete** your account, which will trigger our retention process under § 5
- **Object** to certain processing
- **Opt out** of marketing emails (one-click unsubscribe link in every marketing email)

To exercise these rights, email **privacy@wubhub.app** from the email on your account or use the in-app controls.

### 7.2 · California residents (CCPA / CPRA)

You have the right to:

- Know what personal information we collect, the sources, the purposes, and the third parties we share with
- Access a copy of your personal information
- Request deletion (subject to exceptions, e.g. fraud prevention, tax records)
- Opt out of "sale" or "sharing" of personal information **— wubhub does not sell or share personal information for cross-context behavioral advertising**
- Limit use of sensitive personal information **— wubhub does not use sensitive personal information beyond what is necessary to provide the Service**
- Be free from retaliation for exercising these rights

You may designate an authorized agent to make a request on your behalf. We may need to verify their authority.

To exercise CCPA rights: email privacy@wubhub.app or call **[CCPA HOTLINE NUMBER — required for businesses with > 100k consumers]**. We will respond within 45 days.

### 7.3 · EEA / UK / Swiss residents (GDPR / UK GDPR)

You have the right to:

- Access, correction, deletion, portability, restriction of processing, and objection
- Withdraw consent where consent is the legal basis
- Lodge a complaint with your supervisory authority

Our **legal bases** for processing are:

- **Performance of contract** for account, listing, and transaction processing
- **Legitimate interest** for fraud prevention, security, product improvement, and trust-and-safety operations (balanced against your rights)
- **Consent** for marketing emails and any optional features
- **Legal obligation** for tax, AML, and law enforcement responses

International transfers: when we transfer data out of the EEA / UK / Switzerland (e.g. to our U.S. hosting), we rely on **Standard Contractual Clauses** with our vendors and assess each transfer for adequacy.

Note: wubhub currently operates in the United States only. EU-based users accessing the Service do so at their own initiative and these rights apply to the limited data we collect.

### 7.4 · Children

The Service is not directed to children under 13. We do not knowingly collect information from children under 13. Users 13 to 17 must use the Service only with the consent and supervision of a parent or guardian. If you believe we may have collected information from a child under 13, contact privacy@wubhub.app and we will investigate and delete.

## 8 · Cookies and similar technologies

We use cookies and similar technologies to:

- Keep you signed in
- Remember your preferences (theme, density, etc.)
- Measure feature usage
- Detect fraud and security issues

We use:

- **Strictly necessary cookies** — required for the Service to function (session, CSRF). These cannot be disabled
- **Analytics cookies** — PostHog, used to understand aggregate usage
- **Functional cookies** — preferences

We do **not** use advertising or cross-site tracking cookies. You can manage cookie preferences in our cookie banner (shown on first visit and re-accessible from the footer link "**Cookie Settings**").

## 9 · Do Not Track

Our systems do not respond differently to "Do Not Track" browser signals because there is no industry-wide consensus on how to interpret them. Our actual behavior — no behavioral advertising, no sale of personal information — already reflects what most DNT users intend.

## 10 · Changes to this Policy

We may update this Privacy Policy. Material changes will be announced at least 14 days in advance by email and an in-app notice. The "Last updated" date at the top reflects the current version. Prior versions are available at wubhub.app/privacy/history.

## 11 · Contact

For privacy questions, complaints, or requests:

**privacy@wubhub.app**
[wubhub Inc. / wubhub LLC]
[Mailing address]

For data subject requests under CCPA or GDPR, please put **"Privacy Request"** in the subject line and identify yourself by the email associated with your wubhub account.

---

*End of Privacy Policy.*

---

## Appendix: cookie banner copy (for the consent management tool)

> **wubhub uses cookies.**
> Strictly necessary cookies keep you signed in. Optional analytics cookies (PostHog) help us understand which features people use. We don't sell your data and we don't use advertising cookies.
> [ ACCEPT ALL ] [ ESSENTIAL ONLY ] [ MANAGE → ]

## Appendix: Apple Privacy Nutrition Labels

The categories below must be ticked exactly to match this Policy. Verify in App Store Connect → App Information → Privacy.

**Data Used to Track You:** *None*

**Data Linked to You:**
- Contact Info: Email Address, Name
- User Content: Photos or Videos, Customer Support, Other User Content
- Identifiers: User ID
- Purchases: Purchase History
- Usage Data: Product Interaction
- Diagnostics: Crash Data, Performance Data

**Data Not Linked to You:**
- Diagnostics: Other Diagnostic Data (Sentry, redacted)

If your final Apple submission needs more or fewer items, update this Policy to match before publishing.
