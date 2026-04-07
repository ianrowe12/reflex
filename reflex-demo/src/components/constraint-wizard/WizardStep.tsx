"use client";

import clsx from "clsx";

/* ------------------------------------------------------------------ */
/*  Step indicator circle                                              */
/* ------------------------------------------------------------------ */

interface StepCircleProps {
  stepNumber: number;
  status: "completed" | "current" | "upcoming";
}

function StepCircle({ stepNumber, status }: StepCircleProps) {
  return (
    <div
      className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-headline font-semibold shrink-0 transition-colors",
        status === "completed" && "bg-accent text-white",
        status === "current" &&
          "bg-accent text-white ring-4 ring-accent/20",
        status === "upcoming" &&
          "bg-surface-card text-text-muted border-2 border-surface-border",
      )}
    >
      {status === "completed" ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 7.5L5.5 10L11 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        stepNumber
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step indicator bar (horizontal, 5 steps)                           */
/* ------------------------------------------------------------------ */

const STEP_LABELS = ["Unit", "Type", "Constraint", "Severity", "Confirm"];

interface StepIndicatorProps {
  currentStep: number; // 1-based
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-between w-full px-2">
      {STEP_LABELS.map((label, idx) => {
        const step = idx + 1;
        const status: StepCircleProps["status"] =
          step < currentStep
            ? "completed"
            : step === currentStep
              ? "current"
              : "upcoming";

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <StepCircle stepNumber={step} status={status} />
              <span
                className={clsx(
                  "text-[10px] font-body uppercase tracking-wider",
                  status === "upcoming"
                    ? "text-text-muted"
                    : "text-accent font-medium",
                )}
              >
                {label}
              </span>
            </div>

            {/* Connecting line (not after the last step) */}
            {idx < STEP_LABELS.length - 1 && (
              <div
                className={clsx(
                  "flex-1 h-0.5 mx-2 mt-[-12px] self-start translate-y-[16px]",
                  step < currentStep ? "bg-accent" : "bg-surface-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Selection button grid                                              */
/* ------------------------------------------------------------------ */

export interface SelectionOption {
  id: string;
  label: string;
}

interface SelectionGridProps {
  options: SelectionOption[];
  selectedId: string | undefined;
  onSelect: (id: string, label: string) => void;
  buttonHeight?: string; // Tailwind h-* class, default h-16 (64px)
}

export function SelectionGrid({
  options,
  selectedId,
  onSelect,
  buttonHeight = "h-16",
}: SelectionGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id, opt.label)}
          className={clsx(
            "rounded border text-sm font-body font-medium transition-colors cursor-pointer",
            buttonHeight,
            opt.id === selectedId
              ? "border-accent bg-accent-muted text-accent"
              : "border-surface-border bg-surface-card text-text-primary hover:border-text-muted hover:bg-surface-hover",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Completed-steps summary row                                        */
/* ------------------------------------------------------------------ */

interface CompletedSummaryProps {
  labels: { step: string; value: string }[];
}

export function CompletedSummary({ labels }: CompletedSummaryProps) {
  if (labels.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-body text-text-secondary bg-surface-hover rounded px-3 py-2 border border-surface-border">
      {labels.map((l, i) => (
        <span key={l.step} className="flex items-center gap-1 whitespace-nowrap">
          <span className="font-medium text-text-primary">{l.step}:</span>
          <span>{l.value}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-accent shrink-0"
            aria-hidden="true"
          >
            <path
              d="M2.5 6.5L5 9L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {i < labels.length - 1 && (
            <span className="text-surface-border ml-1">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
