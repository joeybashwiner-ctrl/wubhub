export function money(cents: number | null | undefined): string {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

export function moneyTerse(cents: number | null | undefined): string {
  if (cents == null) return "—";
  const v = cents / 100;
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function timeUntil(iso: string): { label: string; ending: boolean } {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return { label: "ended", ending: true };
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const ending = ms < 60 * 60 * 1000;
  if (d > 0) return { label: `${d}d ${h}h`, ending };
  if (h > 0) return { label: `${h}h ${m}m`, ending };
  return { label: `${m}m ${sec}s`, ending: true };
}

export function categoryLabel(c: string): string {
  return c.replace(/_/g, " ");
}

export function authenticityLabel(a: string): string {
  switch (a) {
    case "official_artist": return "OFFICIAL ARTIST";
    case "festival_vendor_unofficial": return "FESTIVAL VENDOR";
    case "fan_made": return "FAN MADE";
    default: return "UNKNOWN";
  }
}

export function conditionLabel(c: string): string {
  switch (c) {
    case "new_with_tags": return "NWT";
    case "like_new": return "LIKE NEW";
    case "good": return "GOOD";
    case "fair": return "FAIR";
    default: return c;
  }
}
