"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { seedBids, seedListings, seedProfiles } from "./seed";
import { marketplaceFee, TRADE_FEE_CENTS } from "./fees";
import type {
  Bid,
  Listing,
  Order,
  Profile,
  ShippingQuote,
  TradeMessage,
  TradeProposal,
} from "./types";

const STORAGE_KEY = "wubhub-state-v3";

// Demo moderator — wubmom plays the dual role of seller + mod for the prototype.
const MOD_USER_ID = "u_wubmom";
export function isMod(userId: string) {
  return userId === MOD_USER_ID;
}

interface State {
  profiles: Profile[];
  listings: Listing[];
  bids: Bid[];
  orders: Order[];
  trades: TradeProposal[];
  currentUserId: string;
}

const initialState: State = {
  profiles: seedProfiles,
  listings: seedListings,
  bids: seedBids,
  orders: [],
  trades: [],
  currentUserId: "u_you",
};

interface StoreCtx extends State {
  setCurrentUser: (id: string) => void;
  addListing: (l: Omit<Listing, "id" | "created_at" | "view_count" | "status">) => Listing;
  approveListing: (id: string, note?: string) => void;
  rejectListing: (id: string, note: string) => void;
  placeBid: (listingId: string, amountCents: number) => Bid | null;
  buyNow: (listingId: string) => Order | null;
  purchaseShippingLabel: (orderId: string, quote: ShippingQuote) => void;
  proposeTrade: (input: {
    listingId: string;
    offered_listing_ids: string[];
    offered_cash_cents: number;
    note: string;
  }) => TradeProposal;
  respondToTrade: (
    tradeId: string,
    kind: TradeMessage["kind"],
    body: string,
    counter?: { offered_listing_ids: string[]; offered_cash_cents: number },
  ) => void;
  acceptTrade: (tradeId: string) => void;
  reset: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

let counter = 0;
const uid = (prefix = "x") => `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const hydrated = useRef(false);

  // hydrate from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const setCurrentUser = useCallback((id: string) => {
    setState((s) => ({ ...s, currentUserId: id }));
  }, []);

  const addListing = useCallback<StoreCtx["addListing"]>((draft) => {
    // Authenticity gate: anything claiming OFFICIAL ARTIST goes to mod queue.
    // Festival vendor / fan made / unknown publish immediately.
    const needsReview = draft.authenticity === "official_artist";
    const now = new Date().toISOString();
    const listing: Listing = {
      ...draft,
      id: uid("l"),
      created_at: now,
      view_count: 0,
      status: needsReview ? "under_review" : "active",
      submitted_for_review_at: needsReview ? now : undefined,
    };
    setState((s) => ({ ...s, listings: [listing, ...s.listings] }));
    return listing;
  }, []);

  const approveListing = useCallback<StoreCtx["approveListing"]>((id, note) => {
    setState((s) => ({
      ...s,
      listings: s.listings.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "active",
              reviewed_at: new Date().toISOString(),
              reviewed_by: s.currentUserId,
              mod_notes: note,
            }
          : l,
      ),
    }));
  }, []);

  const rejectListing = useCallback<StoreCtx["rejectListing"]>((id, note) => {
    setState((s) => ({
      ...s,
      listings: s.listings.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "rejected",
              reviewed_at: new Date().toISOString(),
              reviewed_by: s.currentUserId,
              mod_notes: note,
            }
          : l,
      ),
    }));
  }, []);

  const placeBid = useCallback<StoreCtx["placeBid"]>((listingId, amountCents) => {
    const bid: Bid = {
      id: uid("b"),
      listing_id: listingId,
      bidder_id: state.currentUserId,
      amount_cents: amountCents,
      created_at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, bids: [...s.bids, bid] }));
    return bid;
  }, [state.currentUserId]);

  const buyNow = useCallback<StoreCtx["buyNow"]>((listingId) => {
    const listing = state.listings.find((l) => l.id === listingId);
    if (!listing) return null;
    const subtotal = listing.asking_price_cents ?? listing.buy_now_price_cents ?? 0;
    const shipping = listing.shipping_price_cents;
    const fees = marketplaceFee(subtotal);
    const order: Order = {
      id: uid("o"),
      listing_id: listing.id,
      buyer_id: state.currentUserId,
      seller_id: listing.seller_id,
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      platform_fee_cents: fees.platform_cents,
      total_cents: subtotal + shipping,
      seller_payout_cents: fees.seller_payout_cents,
      status: "paid",
      created_at: new Date().toISOString(),
    };
    setState((s) => ({
      ...s,
      orders: [order, ...s.orders],
      listings: s.listings.map((l) =>
        l.id === listing.id ? { ...l, status: "sold" } : l,
      ),
    }));
    return order;
  }, [state.listings, state.currentUserId]);

  const purchaseShippingLabel = useCallback<StoreCtx["purchaseShippingLabel"]>(
    (orderId, quote) => {
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "shipped",
                tracking_number:
                  quote.carrier.toUpperCase() +
                  Math.random().toString(36).slice(2, 14).toUpperCase(),
                shipping_label: {
                  ...quote,
                  tracking_number:
                    quote.carrier.toUpperCase() +
                    Math.random().toString(36).slice(2, 14).toUpperCase(),
                  purchased_at: new Date().toISOString(),
                },
              }
            : o,
        ),
      }));
    },
    [],
  );

  const proposeTrade = useCallback<StoreCtx["proposeTrade"]>((input) => {
    const listing = state.listings.find((l) => l.id === input.listingId);
    const proposer = state.currentUserId;
    const recipient = listing?.seller_id ?? "";
    const tradeId = uid("t");
    const msg: TradeMessage = {
      id: uid("m"),
      trade_id: tradeId,
      author_id: proposer,
      kind: "propose",
      body: input.note,
      offered_listing_ids: input.offered_listing_ids,
      offered_cash_cents: input.offered_cash_cents,
      created_at: new Date().toISOString(),
    };
    const trade: TradeProposal = {
      id: tradeId,
      listing_id: input.listingId,
      proposer_id: proposer,
      recipient_id: recipient,
      offered_listing_ids: input.offered_listing_ids,
      offered_cash_cents: input.offered_cash_cents,
      offered_note: input.note,
      history: [msg],
      status: "proposed",
      created_at: msg.created_at,
      updated_at: msg.created_at,
    };
    setState((s) => ({ ...s, trades: [trade, ...s.trades] }));
    return trade;
  }, [state.listings, state.currentUserId]);

  const respondToTrade = useCallback<StoreCtx["respondToTrade"]>(
    (tradeId, kind, body, counterPayload) => {
      setState((s) => {
        const trade = s.trades.find((t) => t.id === tradeId);
        if (!trade) return s;
        const msg: TradeMessage = {
          id: uid("m"),
          trade_id: tradeId,
          author_id: s.currentUserId,
          kind,
          body,
          offered_listing_ids: counterPayload?.offered_listing_ids,
          offered_cash_cents: counterPayload?.offered_cash_cents,
          created_at: new Date().toISOString(),
        };
        const nextStatus =
          kind === "accept"
            ? "accepted"
            : kind === "decline"
            ? "declined"
            : kind === "withdraw"
            ? "withdrawn"
            : kind === "counter"
            ? "countered"
            : trade.status;
        const updated: TradeProposal = {
          ...trade,
          history: [...trade.history, msg],
          status: nextStatus,
          offered_listing_ids:
            counterPayload?.offered_listing_ids ?? trade.offered_listing_ids,
          offered_cash_cents:
            counterPayload?.offered_cash_cents ?? trade.offered_cash_cents,
          updated_at: msg.created_at,
        };
        return {
          ...s,
          trades: s.trades.map((t) => (t.id === tradeId ? updated : t)),
        };
      });
    },
    [],
  );

  const acceptTrade = useCallback((tradeId: string) => {
    setState((s) => {
      const trade = s.trades.find((t) => t.id === tradeId);
      if (!trade) return s;
      // Mark both the listing-being-claimed and offered listings as traded.
      const involvedIds = new Set([trade.listing_id, ...trade.offered_listing_ids]);
      const acceptMsg: TradeMessage = {
        id: uid("m"),
        trade_id: tradeId,
        author_id: s.currentUserId,
        kind: "accept",
        body: "Trade accepted. Ship within 5 days.",
        created_at: new Date().toISOString(),
      };
      return {
        ...s,
        listings: s.listings.map((l) =>
          involvedIds.has(l.id) ? { ...l, status: "traded" } : l,
        ),
        trades: s.trades.map((t) =>
          t.id === tradeId
            ? {
                ...t,
                status: "accepted",
                history: [...t.history, acceptMsg],
                updated_at: acceptMsg.created_at,
              }
            : t,
        ),
      };
    });
  }, []);

  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setState(initialState);
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      ...state,
      setCurrentUser,
      addListing,
      approveListing,
      rejectListing,
      placeBid,
      buyNow,
      purchaseShippingLabel,
      proposeTrade,
      respondToTrade,
      acceptTrade,
      reset,
    }),
    [
      state,
      setCurrentUser,
      addListing,
      approveListing,
      rejectListing,
      placeBid,
      buyNow,
      purchaseShippingLabel,
      proposeTrade,
      respondToTrade,
      acceptTrade,
      reset,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useProfile(id: string): Profile | undefined {
  const { profiles } = useStore();
  return profiles.find((p) => p.id === id);
}

export function useListing(id: string): Listing | undefined {
  const { listings } = useStore();
  return listings.find((l) => l.id === id);
}

export function useListingBids(listingId: string): Bid[] {
  const { bids } = useStore();
  return bids
    .filter((b) => b.listing_id === listingId)
    .sort((a, b) => b.amount_cents - a.amount_cents);
}

export function useTopBid(listingId: string): Bid | undefined {
  return useListingBids(listingId)[0];
}
