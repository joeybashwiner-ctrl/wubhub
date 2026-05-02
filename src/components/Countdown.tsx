"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function useCountdown(targetIso: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  if (!targetIso) return { h: 0, m: 0, s: 0, ms: 0, ended: true, hot: false };
  const ms = Math.max(0, new Date(targetIso).getTime() - now);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { h, m, s, ms, ended: ms === 0, hot: h === 0 && m < 30 };
}

export function GlitchCountdown({ targetIso }: { targetIso: string | null | undefined }) {
  const { h, m, s, hot, ended } = useCountdown(targetIso);
  if (ended) {
    return (
      <div className="font-mono text-2xl font-bold tracking-tight text-muted">ENDED</div>
    );
  }
  return (
    <div
      className={`font-mono text-3xl font-bold tracking-tight ${hot ? "text-hot" : "text-ink"}`}
      style={{
        textShadow: hot ? "2px 0 0 #C8FF00, -2px 0 0 #ff00ff" : "none",
      }}
    >
      {pad(h)}:{pad(m)}:{pad(s)}
    </div>
  );
}
