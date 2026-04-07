"use client";

import { useState } from "react";
import clsx from "clsx";
import { ConstraintStatusBadge } from "@/components/ui/StatusBadge";
import { constraints, handoverEvents } from "@/data/mock-data";
import type { ConstraintStatus } from "@/types";

type Tab = "constraints" | "overrides" | "handover";

const leftBorderColor: Record<ConstraintStatus, string> = {
  active: "border-l-amber-500",
  monitoring: "border-l-blue-500",
  temporary: "border-l-gray-400",
};

const dotColor: Record<string, string> = {
  action: "bg-accent",
  constraint: "bg-amber-500",
  deferral: "bg-blue-500",
  routine: "bg-text-muted",
};

export function ConstraintPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("constraints");

  const tabs: { id: Tab; label: string }[] = [
    { id: "constraints", label: "ACTIVE CONSTRAINTS" },
    { id: "overrides", label: "ACTIVE OVERRIDES" },
    { id: "handover", label: "SHIFT HANDOVER" },
  ];

  return (
    <div className="bg-surface-card rounded border border-surface-border shadow-card">
      {/* Tab bar */}
      <div className="flex border-b border-surface-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "flex-1 px-3 py-3 text-xs font-headline uppercase tracking-wider text-center transition-colors cursor-pointer",
              activeTab === tab.id
                ? "text-accent border-b-2 border-accent font-semibold"
                : "text-text-muted hover:text-text-secondary",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Constraints tab */}
        {activeTab === "constraints" && (
          <div className="flex flex-col gap-3">
            {constraints.map((c) => (
              <div
                key={c.id}
                className={clsx(
                  "border border-surface-border rounded border-l-4 p-3",
                  leftBorderColor[c.status],
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-headline font-semibold text-text-primary">
                      {c.unit}
                    </span>
                    <span className="text-xs font-body text-text-secondary">
                      {c.equipment}
                    </span>
                  </div>
                  <ConstraintStatusBadge status={c.status} />
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-text-primary">{c.severity}</span>
                  <span className="text-text-muted">{c.age}</span>
                </div>
                {c.description && (
                  <p className="text-xs font-body text-text-secondary mt-1.5">
                    {c.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Overrides tab */}
        {activeTab === "overrides" && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm font-body text-text-muted">
              No active overrides
            </p>
          </div>
        )}

        {/* Handover tab */}
        {activeTab === "handover" && (
          <div className="flex flex-col gap-0">
            {handoverEvents.map((event, i) => (
              <div key={i} className="flex gap-3 py-2.5">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center pt-1">
                  <div
                    className={clsx(
                      "w-2 h-2 rounded-full shrink-0",
                      dotColor[event.type] ?? "bg-text-muted",
                    )}
                  />
                  {i < handoverEvents.length - 1 && (
                    <div className="w-px flex-1 bg-surface-border mt-1" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="font-mono tabular-nums text-xs text-text-muted mr-2">
                    {event.timestamp}
                  </span>
                  <span className="text-xs font-body text-text-secondary">
                    {event.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer button */}
      <div className="px-4 pb-4">
        <button
          type="button"
          className="w-full py-2.5 rounded border border-accent text-xs font-headline font-semibold uppercase tracking-wider text-accent hover:bg-accent-muted transition-colors cursor-pointer"
        >
          + LOG NEW CONSTRAINT
        </button>
      </div>
    </div>
  );
}
