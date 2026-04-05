import type { Priority, ConstraintStatus } from "@/types";
import clsx from "clsx";

const priorityStyles: Record<Priority, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-amber-100 text-amber-700 border-amber-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  advisory: "bg-gray-100 text-gray-600 border-gray-200",
};

const priorityLabels: Record<Priority, string> = {
  critical: "▲ CRITICAL",
  high: "▲ HIGH",
  medium: "○ MEDIUM",
  advisory: "— ADVISORY",
};

const statusStyles: Record<ConstraintStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  monitoring: "bg-blue-100 text-blue-700",
  temporary: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<ConstraintStatus, string> = {
  active: "ACTIVE",
  monitoring: "MONITORING",
  temporary: "TEMPORARY",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-headline uppercase tracking-wide border",
        priorityStyles[priority]
      )}
    >
      {priorityLabels[priority]}
    </span>
  );
}

export function ConstraintStatusBadge({ status }: { status: ConstraintStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-headline uppercase tracking-wide",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function TriggerPill({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
      {type}
    </span>
  );
}
