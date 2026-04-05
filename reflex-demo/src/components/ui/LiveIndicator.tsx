"use client";

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D9488] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0D9488]" />
      </span>
      <span className="font-mono tabular-nums text-[#4B5563]">Live</span>
    </div>
  );
}

export function ConnectionDot({ label, status }: { label: string; status: string }) {
  const color = status === "connected" ? "bg-[#0D9488]" : status === "busy" ? "bg-[#D97706]" : "bg-[#DC2626]";
  return (
    <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
