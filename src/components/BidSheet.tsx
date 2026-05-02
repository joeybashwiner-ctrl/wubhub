"use client";

import { useEffect, useState } from "react";
import { money } from "@/lib/format";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "00", "⌫"];

export function BidSheet({
  open,
  onClose,
  currentBidCents,
  minNextCents,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  currentBidCents: number;
  minNextCents: number;
  onConfirm: (cents: number) => void;
}) {
  const [amountWhole, setAmountWhole] = useState(() =>
    Math.ceil(minNextCents / 100),
  );

  useEffect(() => {
    if (open) setAmountWhole(Math.ceil(minNextCents / 100));
  }, [open, minNextCents]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      else if (e.key === "Backspace") setAmountWhole((v) => Math.floor(v / 10));
      else if (e.key === "Enter") submit();
      else if (/^\d$/.test(e.key)) setAmountWhole((v) => v * 10 + parseInt(e.key));
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const amountCents = amountWhole * 100;
  const valid = amountCents >= minNextCents;

  function press(k: string) {
    if (k === "⌫") setAmountWhole((v) => Math.floor(v / 10));
    else if (k === "00") setAmountWhole((v) => v * 100);
    else setAmountWhole((v) => v * 10 + parseInt(k));
  }

  function submit() {
    if (valid) onConfirm(amountCents);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full sm:max-w-md bg-bg border-t-2 border-acid pt-3 pb-8 animate-wub-sheet-up"
        role="dialog"
        aria-modal
      >
        {/* drag handle */}
        <div className="w-9 h-1 bg-line mx-auto mb-4" />
        <div className="px-5">
          <div className="flex items-baseline justify-between">
            <h2 className="display text-2xl">PLACE YOUR MAX BID</h2>
            <button
              className="label hover:text-acid"
              onClick={onClose}
              aria-label="Close"
            >
              CLOSE
            </button>
          </div>
          <p className="label mt-1 normal-case text-muted">
            PROXY BIDDING · WE ONLY BID UP TO YOUR MAX
          </p>

          {/* Big amount display */}
          <div className="mt-5 px-4 py-5 bg-black border-2 border-acid text-center rounded-card">
            <div className="label text-acid">YOUR MAX BID</div>
            <div className="mono-price text-6xl text-acid mt-1" data-testid="bid-amount-display">
              {money(amountCents)}
            </div>
            <div className="label mt-1 text-muted">
              MIN {money(minNextCents)} · CURRENT {money(currentBidCents)}
            </div>
          </div>

          {/* Keypad */}
          <div className="mt-5 grid grid-cols-3 gap-px bg-line">
            {KEYS.map((k) => (
              <button
                key={k}
                onClick={() => press(k)}
                className="bg-bg py-5 font-mono text-2xl font-bold hover:bg-surface active:bg-raised"
                data-testid={`keypad-${k}`}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-surface label normal-case text-muted leading-relaxed">
            ⓘ APPLE PAY ON FILE WILL BE CHARGED {money(amountCents)} ONLY IF YOU WIN. NO HOLD UNTIL AUCTION ENDS.
          </div>

          <button
            className="btn btn-primary w-full mt-4 h-14 text-base"
            onClick={submit}
            disabled={!valid}
            data-testid="confirm-bid-btn"
          >
            CONFIRM BID · {money(amountCents)}
          </button>
        </div>
      </div>
    </div>
  );
}
