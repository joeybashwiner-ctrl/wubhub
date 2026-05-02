export type Authenticity = "official_artist" | "festival_vendor_unofficial" | "fan_made" | "unknown";
export type Condition = "new_with_tags" | "like_new" | "good" | "fair";
export type Category = "hoodie" | "tee" | "pashmina" | "totem" | "hat" | "accessory" | "other";
export type ListingType = "fixed_price" | "auction" | "trade";
export type ListingStatus =
  | "draft"
  | "under_review"      // Authenticity queue (official_artist listings)
  | "rejected"          // Mod rejected — counterfeit / mislabeled
  | "active"
  | "sold"
  | "ended_no_sale"
  | "removed"
  | "traded";

export type Carrier = "usps" | "ups" | "fedex";

export interface ShippingQuote {
  carrier: Carrier;
  service: string;          // "Priority Mail", "Ground", "2Day"
  rate_cents: number;
  est_days: string;         // "2-3"
  label_id?: string;        // mock — present after label purchase
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  reputation: number;
  total_sales: number;
  total_trades: number;
  city: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  brand: string;
  category: Category;
  size: string;
  condition: Condition;
  authenticity: Authenticity;
  listing_type: ListingType;
  asking_price_cents: number | null;
  starting_bid_cents: number | null;
  buy_now_price_cents: number | null;
  shipping_price_cents: number;
  auction_ends_at: string | null;
  status: ListingStatus;
  images: string[];
  view_count: number;
  // trade preferences
  open_to_trade: boolean;
  trade_wants?: string;
  // shipping
  shipping_quote?: ShippingQuote;
  // moderation
  mod_notes?: string;
  submitted_for_review_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
}

export interface Bid {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount_cents: number;
  created_at: string;
}

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  subtotal_cents: number;
  shipping_cents: number;
  platform_fee_cents: number;
  total_cents: number;
  seller_payout_cents: number;
  status: "pending_payment" | "paid" | "shipped" | "delivered" | "completed" | "refunded";
  tracking_number?: string;
  shipping_label?: ShippingQuote & { tracking_number: string; purchased_at: string };
  created_at: string;
}

export type TradeStatus = "proposed" | "countered" | "accepted" | "declined" | "withdrawn" | "shipped" | "completed";

export interface TradeProposal {
  id: string;
  listing_id: string;            // the listing the proposer wants
  proposer_id: string;
  recipient_id: string;          // listing seller
  // what the proposer is offering
  offered_listing_ids: string[]; // links to proposer's listings
  offered_cash_cents: number;    // optional cash on top
  offered_note: string;
  // counter-offer support
  history: TradeMessage[];
  status: TradeStatus;
  created_at: string;
  updated_at: string;
}

export interface TradeMessage {
  id: string;
  trade_id: string;
  author_id: string;
  kind: "propose" | "counter" | "accept" | "decline" | "message" | "withdraw";
  body: string;
  offered_listing_ids?: string[];
  offered_cash_cents?: number;
  created_at: string;
}
