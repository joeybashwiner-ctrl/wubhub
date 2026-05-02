"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShippingEstimator } from "@/components/ShippingEstimator";
import { useStore } from "@/lib/store";
import { marketplaceFee } from "@/lib/fees";
import type {
  Authenticity,
  Category,
  Condition,
  ListingType,
  ShippingQuote,
} from "@/lib/types";
import { money } from "@/lib/format";

const CATS: Category[] = ["hoodie", "tee", "pashmina", "totem", "hat", "accessory", "other"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "OS"];
const CONDS: Array<[Condition, string]> = [
  ["new_with_tags", "NEW W/ TAGS"],
  ["like_new", "LIKE NEW"],
  ["good", "GOOD"],
  ["fair", "FAIR"],
];
const AUTHS: Array<{ key: Authenticity; label: string; sub: string }> = [
  { key: "official_artist", label: "OFFICIAL ARTIST", sub: "Sold via official channels" },
  { key: "festival_vendor_unofficial", label: "FESTIVAL VENDOR", sub: "Bought from festival vendor" },
  { key: "fan_made", label: "FAN-MADE", sub: "Custom totem, pashmina, etc." },
  { key: "unknown", label: "UNKNOWN", sub: "Don't know" },
];

const STOCK_IMAGES = [
  "https://picsum.photos/seed/wub1/1200/1200",
  "https://picsum.photos/seed/wub2/1200/1200",
  "https://picsum.photos/seed/wub3/1200/1200",
  "https://picsum.photos/seed/wub4/1200/1200",
  "https://picsum.photos/seed/wub5/1200/1200",
  "https://picsum.photos/seed/wub6/1200/1200",
];

function Chip({
  label,
  active,
  onClick,
  testid,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  testid?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      className={`px-3 py-2 font-mono text-[11px] tracking-widest font-bold border transition-colors ${
        active
          ? "bg-acid text-bg border-acid"
          : "border-line text-ink hover:border-ink"
      }`}
    >
      {label}
    </button>
  );
}

export default function SellPage() {
  const router = useRouter();
  const { addListing, currentUserId } = useStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [aiOn, setAiOn] = useState<Record<string, boolean>>({});
  const [pickedImages, setPickedImages] = useState<string[]>(STOCK_IMAGES.slice(0, 3));

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("hoodie");
  const [size, setSize] = useState("M");
  const [condition, setCondition] = useState<Condition>("like_new");
  const [authenticity, setAuthenticity] = useState<Authenticity>("official_artist");
  const [type, setType] = useState<ListingType>("fixed_price");
  const [price, setPrice] = useState("");
  const [openToTrade, setOpenToTrade] = useState(true);
  const [tradeWants, setTradeWants] = useState("");
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | undefined>();

  useEffect(() => {
    setShippingQuote(undefined);
  }, [category]);

  const priceCents = Math.round((parseFloat(price) || 0) * 100);
  const fees = priceCents > 0 ? marketplaceFee(priceCents) : null;

  const photosOK = pickedImages.length >= 3;

  const formValid =
    title.length >= 3 &&
    description.length >= 20 &&
    brand.length > 0 &&
    (type === "trade" || (priceCents >= 500 && shippingQuote !== undefined));

  function toggleImage(url: string) {
    setPickedImages((prev) =>
      prev.includes(url)
        ? prev.filter((p) => p !== url)
        : prev.length >= 8
        ? prev
        : [...prev, url],
    );
  }

  function publish() {
    const listing = addListing({
      seller_id: currentUserId,
      title,
      description,
      brand,
      category,
      size,
      condition,
      authenticity,
      listing_type: type,
      asking_price_cents: type === "fixed_price" ? priceCents : null,
      starting_bid_cents: type === "auction" ? priceCents : null,
      buy_now_price_cents: null,
      shipping_price_cents: shippingQuote?.rate_cents ?? 0,
      shipping_quote: shippingQuote,
      auction_ends_at:
        type === "auction" ? new Date(Date.now() + 3 * 86400000).toISOString() : null,
      images: pickedImages,
      open_to_trade: openToTrade || type === "trade",
      trade_wants: openToTrade || type === "trade" ? tradeWants : undefined,
    });
    router.push(`/l/${listing.id}`);
  }

  const willGoToReview = authenticity === "official_artist";

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto pb-32">
      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <span className="label">STEP {step} / 2</span>
        <Link href="/" className="label hover:text-acid">CANCEL</Link>
      </div>

      {step === 1 && (
        <>
          <h1 className="display text-3xl md:text-4xl mt-4">ADD 3+ PHOTOS</h1>
          <p className="label mt-2 normal-case text-muted">
            FIRST TWO MUST BE FRONT AND BACK. AI WILL CLEAN BACKGROUND.
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STOCK_IMAGES.map((url, i) => {
              const idx = pickedImages.indexOf(url);
              const filled = idx >= 0;
              const ai = aiOn[url] ?? true;
              return (
                <div key={url} className="relative aspect-square">
                  <button
                    onClick={() => toggleImage(url)}
                    className={`relative w-full h-full overflow-hidden border ${
                      filled ? "border-acid" : "border-line border-dashed hover:border-muted"
                    }`}
                    data-testid={`pick-img-${url}`}
                  >
                    {filled ? (
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-3xl text-muted font-light">+</span>
                    )}
                  </button>
                  {filled && (
                    <>
                      <span className="absolute top-1.5 left-1.5 bg-black text-acid font-mono text-[8px] font-bold tracking-widest px-1 py-0.5">
                        {idx === 0 ? "01 · FRONT" : idx === 1 ? "02 · BACK" : String(idx + 1).padStart(2, "0")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAiOn({ ...aiOn, [url]: !ai });
                        }}
                        className={`absolute bottom-1.5 left-1.5 right-1.5 font-mono text-[9px] font-bold tracking-widest text-center py-1 ${
                          ai ? "bg-acid text-bg" : "bg-black text-acid"
                        }`}
                      >
                        {ai ? "✓ AI ON" : "AI OFF"}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-surface border border-line">
            <div className="label text-acid">⚡ AI CLEANUP</div>
            <p className="label mt-1 normal-case text-muted leading-relaxed">
              ISOLATES GARMENT ON CLEAN BG. PRESERVES PRINTS, LOGOS, FABRIC. TOGGLE PER PHOTO.
            </p>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-30 bg-bg border-t border-line">
            <div className="px-5 py-3 max-w-2xl mx-auto">
              <button
                className="btn btn-primary w-full h-14"
                disabled={!photosOK}
                onClick={() => setStep(2)}
                data-testid="next-to-form-btn"
              >
                NEXT · ITEM DETAILS →
              </button>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="display text-3xl md:text-4xl mt-4">ITEM DETAILS</h1>

          <div className="mt-5">
            <FormField label="TITLE">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Excision · Detox Tour Hoodie"
                className="!border-x-0 !border-t-0 !border-b !rounded-none !bg-transparent !px-0 !text-base !font-bold"
                data-testid="title-input"
              />
            </FormField>

            <FormField label="BRAND">
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Excision, Subtronics…"
                className="!border-x-0 !border-t-0 !border-b !rounded-none !bg-transparent !px-0 !text-sm"
                data-testid="brand-input"
              />
            </FormField>

            <FormField label="DESCRIPTION">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="When + where worn, condition details, smoke‑free, etc."
                data-testid="description-input"
              />
            </FormField>

            <FormField label="CATEGORY">
              <div className="flex flex-wrap gap-1.5">
                {CATS.map((c) => (
                  <Chip
                    key={c}
                    label={c.toUpperCase()}
                    active={category === c}
                    onClick={() => setCategory(c)}
                  />
                ))}
              </div>
            </FormField>

            <FormField label="SIZE">
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    active={size === s}
                    onClick={() => setSize(s)}
                  />
                ))}
              </div>
            </FormField>

            <FormField label="CONDITION">
              <div className="grid grid-cols-2 gap-1.5">
                {CONDS.map(([k, l]) => (
                  <Chip
                    key={k}
                    label={l}
                    active={condition === k}
                    onClick={() => setCondition(k)}
                  />
                ))}
              </div>
            </FormField>

            <FormField
              label="AUTHENTICITY · YOU MUST DECLARE"
              hint="MISLABELED ITEMS = ACCOUNT STRIKE"
            >
              <div className="grid gap-1.5">
                {AUTHS.map((a) => {
                  const active = authenticity === a.key;
                  return (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => setAuthenticity(a.key)}
                      data-testid={`auth-${a.key}`}
                      className={`p-3 border flex items-center gap-2.5 text-left transition-colors ${
                        active ? "bg-black border-acid" : "border-line hover:border-ink"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border-2 shrink-0"
                        style={{
                          borderColor: active ? "#C8FF00" : "#2A2A2A",
                          background: active ? "#C8FF00" : "transparent",
                        }}
                      />
                      <span className="flex-1">
                        <span
                          className={`block font-mono text-[11px] font-bold tracking-widest ${
                            active ? "text-acid" : "text-ink"
                          }`}
                        >
                          {a.label}
                        </span>
                        <span className="block label normal-case text-muted mt-0.5">
                          {a.sub}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </FormField>

            {willGoToReview && (
              <div className="my-3 border border-acid p-3 text-sm text-acid">
                <div className="label text-acid mb-1">AUTHENTICITY REVIEW · ~24H</div>
                Listings claiming OFFICIAL ARTIST go to a mod queue before they go live. List as
                FESTIVAL VENDOR or FAN MADE for instant publish.
              </div>
            )}

            <FormField label="LISTING TYPE">
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    ["fixed_price", "BUY NOW"],
                    ["auction", "AUCTION"],
                    ["trade", "TRADE ONLY"],
                  ] as Array<[ListingType, string]>
                ).map(([k, l]) => (
                  <Chip
                    key={k}
                    label={l}
                    active={type === k}
                    onClick={() => setType(k)}
                    testid={`type-${k}`}
                  />
                ))}
              </div>
            </FormField>

            {type !== "trade" && (
              <FormField label={type === "auction" ? "STARTING BID" : "ASKING PRICE"}>
                <div className="flex items-baseline gap-1 py-3 border-b-2 border-ink">
                  <span className="mono-price text-3xl text-muted">$</span>
                  <input
                    type="number"
                    step="1"
                    min="5"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="!border-0 !bg-transparent !p-0 !text-3xl mono-price flex-1 !rounded-none"
                    data-testid="price-input"
                  />
                  <span className="font-mono text-[10px] text-muted tracking-widest">USD</span>
                </div>
              </FormField>
            )}

            {type !== "trade" && (
              <FormField label="SHIPPING — PICK A REAL RATE">
                <ShippingEstimator
                  category={category}
                  selected={shippingQuote}
                  onSelect={setShippingQuote}
                />
              </FormField>
            )}

            <FormField label="TRADES">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="!w-4 !h-4 accent-acid"
                  checked={openToTrade}
                  onChange={(e) => setOpenToTrade(e.target.checked)}
                  data-testid="open-to-trade-input"
                />
                <span className="label normal-case">ALSO OPEN TO TRADES</span>
              </label>
              {(openToTrade || type === "trade") && (
                <input
                  className="mt-2"
                  value={tradeWants}
                  onChange={(e) => setTradeWants(e.target.value)}
                  placeholder="What you want in trade (e.g. Subtronics tee XL, pashmina, cash on top)"
                />
              )}
            </FormField>

            {fees && type !== "trade" && (
              <div className="mt-2 border border-line p-4">
                <div className="label mb-2">YOUR TAKE‑HOME</div>
                <FeeRow k="Asking price" v={money(fees.subtotal_cents)} />
                <FeeRow k="wubhub fee (8.08%)" v={`− ${money(fees.platform_cents)}`} />
                <FeeRow k="Stripe processing (2.9% + 30¢)" v={`− ${money(fees.stripe_cents)}`} />
                <FeeRow k="YOU RECEIVE" v={money(fees.seller_payout_cents)} highlight />
                {fees.saved_vs_poshmark_cents > 0 && (
                  <div
                    className="mt-3 border border-acid text-acid p-2.5 text-xs leading-relaxed"
                    data-testid="poshmark-comparison"
                  >
                    <span className="label text-acid block mb-1">vs POSHMARK</span>
                    Poshmark takes {money(fees.poshmark_fee_cents)} on a {money(fees.subtotal_cents)} item ({fees.subtotal_cents < 2000 ? "$2.95 flat under $20" : "20%"}).
                    On wubhub you keep <strong>{money(fees.saved_vs_poshmark_cents)} more</strong>.
                  </div>
                )}
              </div>
            )}

            {type === "trade" && (
              <div className="mt-2 border border-line p-4 text-sm">
                <div className="label mb-1">TRADE FEE</div>
                $1.99 flat per side. Covers escrow + dispute. No percentage.
              </div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-30 bg-bg border-t border-line">
            <div className="px-5 py-3 max-w-2xl mx-auto flex gap-2">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                ← PHOTOS
              </button>
              <button
                onClick={publish}
                disabled={!formValid}
                className="btn btn-primary flex-1 h-14"
                data-testid="publish-listing-btn"
              >
                {!formValid
                  ? "FILL REQUIRED FIELDS"
                  : willGoToReview
                  ? "SUBMIT FOR REVIEW →"
                  : "PUBLISH LISTING →"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-5">
      <div className="label mb-2">{label}</div>
      {children}
      {hint && <div className="label mt-2 text-muted">{hint}</div>}
    </div>
  );
}

function FeeRow({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div
      className={`flex justify-between py-1 ${
        highlight ? "border-t border-line mt-2 pt-2" : ""
      }`}
    >
      <span className={highlight ? "label text-acid" : "label"}>{k}</span>
      <span className={highlight ? "mono-price text-xl" : "text-sm font-mono"}>{v}</span>
    </div>
  );
}
