export function MetaRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line last:border-b-0">
      <span className="label">{label}</span>
      <span
        className={`font-mono text-[11px] font-bold tracking-wider ${
          accent ? "text-acid" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
