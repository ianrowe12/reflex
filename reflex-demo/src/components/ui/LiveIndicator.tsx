"use client";

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-text-muted">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-healthy opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-status-healthy" />
      </span>
      <span className="font-mono tabular-nums text-text-secondary">Live</span>
    </div>
  );
}

export function ConnectionDot({ label, status }: { label: string; status: string }) {
  const color =
    status === "connected"
      ? "bg-status-healthy"
      : status === "busy"
        ? "bg-status-warning"
        : "bg-status-critical";
  return (
    <div className="flex items-center gap-1 text-xs text-text-muted">
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
