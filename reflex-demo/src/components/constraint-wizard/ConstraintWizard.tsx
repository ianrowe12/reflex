"use client";

import { useState, useCallback, useEffect } from "react";
import clsx from "clsx";
import { X, Camera, Mic, ChevronLeft, ChevronRight } from "lucide-react";
import type { Constraint, WizardState } from "@/types";
import {
  wizardUnits,
  wizardTypes,
  wizardConstraints,
} from "@/data/mock-data";
import {
  StepIndicator,
  SelectionGrid,
  CompletedSummary,
} from "./WizardStep";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ConstraintWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Severity / Duration options                                        */
/* ------------------------------------------------------------------ */

const SEVERITIES = [
  { id: "5", label: "5%" },
  { id: "10", label: "10%" },
  { id: "15", label: "15%" },
  { id: "20", label: "20%" },
  { id: "25", label: "25%" },
  { id: "custom", label: "Custom" },
];

const DURATIONS = [
  { id: "this-shift", label: "This Shift" },
  { id: "24-hours", label: "24 Hours" },
  { id: "until-cleared", label: "Until Cleared" },
  { id: "custom", label: "Custom" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function labelForUnit(id: string | undefined): string {
  return wizardUnits.find((u) => u.id === id)?.label ?? "";
}

function labelForType(id: string | undefined): string {
  return wizardTypes.find((t) => t.id === id)?.label ?? "";
}

function labelForConstraint(
  unitId: string | undefined,
  constraintId: string | undefined,
): string {
  if (!unitId || !constraintId) return "";
  return (
    wizardConstraints[unitId]?.find((c) => c.id === constraintId)?.label ?? ""
  );
}

function durationLabel(id: string | undefined): string {
  return DURATIONS.find((d) => d.id === id)?.label ?? "";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConstraintWizard({ isOpen, onClose }: ConstraintWizardProps) {
  const [state, setState] = useState<WizardState>({
    step: 1,
    severity: 15,
    duration: "until-cleared",
  });

  // Track whether the modal is animating in so we can apply the entrance class
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay so the browser paints the initial (hidden) frame first
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
  }, [isOpen]);

  /* Reset when closed */
  const handleClose = useCallback(() => {
    setVisible(false);
    // Let the fade-out finish before truly closing
    setTimeout(() => {
      setState({ step: 1, severity: 15, duration: "until-cleared" });
      onClose();
    }, 150);
  }, [onClose]);

  /* Navigation helpers */
  const goTo = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const manualDescriptionLength =
    state.manualDescription?.trim().length ?? 0;

  const canContinue =
    (state.step === 1 && !!state.unit) ||
    (state.step === 2 && !!state.type) ||
    (state.step === 3 &&
      (state.type === "manual"
        ? manualDescriptionLength >= 20
        : !!state.constraint)) ||
    (state.step === 4 && state.severity !== undefined && !!state.duration);

  /* Mock submit — constructs a Constraint object and logs it. A future
     agent can wire this into a real store; for now ConstraintPanel reads
     from static mock data, so we just verify the shape. */
  const handleSubmit = useCallback(() => {
    const isManual = state.type === "manual";
    const submitted: Constraint = {
      id: `c-${Date.now()}`,
      unit: labelForUnit(state.unit),
      equipment: isManual
        ? state.manualTitle?.trim() || "Manual Constraint"
        : labelForConstraint(state.unit, state.constraint),
      severity: `${state.severity ?? 0}%`,
      age: "Just now",
      status: "active",
      description: isManual ? state.manualDescription?.trim() : undefined,
      manual: isManual ? true : undefined,
    };
    console.log("[ConstraintWizard] submitted constraint:", submitted);
    handleClose();
  }, [state, handleClose]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  /* ---- Build completed-steps summary ---- */
  const summaryLabels: { step: string; value: string }[] = [];
  if (state.step > 1 && state.unit)
    summaryLabels.push({ step: "S1", value: labelForUnit(state.unit) });
  if (state.step > 2 && state.type)
    summaryLabels.push({ step: "S2", value: labelForType(state.type) });
  if (state.step > 3) {
    if (state.type === "manual" && state.manualDescription) {
      const trimmedTitle = state.manualTitle?.trim();
      const preview =
        trimmedTitle ||
        (state.manualDescription.length > 36
          ? `${state.manualDescription.slice(0, 36).trim()}…`
          : state.manualDescription);
      summaryLabels.push({ step: "S3", value: preview });
    } else if (state.constraint) {
      summaryLabels.push({
        step: "S3",
        value: labelForConstraint(state.unit, state.constraint),
      });
    }
  }
  if (state.step > 4 && state.severity !== undefined)
    summaryLabels.push({
      step: "S4",
      value: `${state.severity}% / ${durationLabel(state.duration)}`,
    });

  /* ---- Step title ---- */
  const stepTitles: Record<number, string> = {
    1: "Select Unit",
    2: "Select Type",
    3: state.type === "manual" ? "Describe Constraint" : "Select Constraint",
    4: "Set Constraint Severity",
    5: "Confirm Constraint",
  };

  return (
    /* Backdrop */
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-150",
        visible ? "opacity-100" : "opacity-0",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Constraint Wizard"
    >
      {/* Modal card */}
      <div
        className={clsx(
          "relative w-full max-w-2xl bg-white rounded shadow-elevated mx-4 transition-transform duration-150",
          visible ? "scale-100" : "scale-95",
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
          aria-label="Close wizard"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-6 pt-5 flex flex-col gap-5">
          {/* Step indicator */}
          <StepIndicator currentStep={state.step} />

          {/* Completed summary */}
          <CompletedSummary labels={summaryLabels} />

          {/* Step heading */}
          <h2 className="text-lg font-headline font-semibold text-[#111827]">
            {stepTitles[state.step]}
          </h2>

          {/* ---- Step 1: Select Unit ---- */}
          {state.step === 1 && (
            <SelectionGrid
              options={wizardUnits}
              selectedId={state.unit}
              onSelect={(id) => {
                setState((prev) => ({
                  ...prev,
                  unit: id,
                  constraint: undefined, // reset downstream
                  step: 2,
                }));
              }}
            />
          )}

          {/* ---- Step 2: Select Type ---- */}
          {state.step === 2 && (
            <SelectionGrid
              options={wizardTypes}
              selectedId={state.type}
              onSelect={(id) => {
                setState((prev) => ({
                  ...prev,
                  type: id,
                  constraint: id === "manual" ? undefined : prev.constraint,
                  manualDescription:
                    id === "manual" ? prev.manualDescription : undefined,
                  manualTitle: id === "manual" ? prev.manualTitle : undefined,
                  step: 3,
                }));
              }}
            />
          )}

          {/* ---- Step 3: Select Constraint (predefined) ---- */}
          {state.step === 3 && state.type !== "manual" && (
            <SelectionGrid
              options={
                state.unit && wizardConstraints[state.unit]
                  ? wizardConstraints[state.unit]
                  : []
              }
              selectedId={state.constraint}
              onSelect={(id) => {
                setState((prev) => ({ ...prev, constraint: id, step: 4 }));
              }}
            />
          )}

          {/* ---- Step 3: Describe Constraint (manual) ---- */}
          {state.step === 3 && state.type === "manual" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="wizard-manual-title"
                  className="text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF]"
                >
                  Short Title (optional)
                </label>
                <input
                  id="wizard-manual-title"
                  type="text"
                  value={state.manualTitle ?? ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      manualTitle: e.target.value,
                    }))
                  }
                  placeholder="e.g. P-101 bearing concern"
                  maxLength={80}
                  className="h-10 px-3 rounded border border-[#E5E7EB] bg-white text-sm font-body text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0D9488] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="wizard-manual-description"
                  className="text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF]"
                >
                  Describe the Constraint
                </label>
                <textarea
                  id="wizard-manual-description"
                  value={state.manualDescription ?? ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      manualDescription: e.target.value,
                    }))
                  }
                  placeholder="e.g. Pump P-101 is making unusual vibrations, suspect bearing failure within 24 hours..."
                  rows={6}
                  className="px-3 py-2 rounded border border-[#E5E7EB] bg-white text-sm font-body text-[#111827] placeholder:text-[#9CA3AF] resize-none focus:outline-none focus:border-[#0D9488] transition-colors"
                />
                <div className="flex items-center justify-between text-[10px] font-body">
                  <span className="text-[#9CA3AF]">Minimum 20 characters</span>
                  <span
                    className={clsx(
                      "font-mono",
                      manualDescriptionLength >= 20
                        ? "text-[#0D9488]"
                        : "text-[#9CA3AF]",
                    )}
                  >
                    {manualDescriptionLength} / 20
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ---- Step 4: Set Severity ---- */}
          {state.step === 4 && (
            <div className="flex flex-col gap-5">
              <p className="text-sm font-body text-[#4B5563] -mt-2">
                How much should capacity be reduced?
              </p>

              {/* Severity buttons */}
              <div className="grid grid-cols-3 gap-3">
                {SEVERITIES.map((s) => {
                  const isSelected =
                    s.id === "custom"
                      ? ![5, 10, 15, 20, 25].includes(state.severity ?? -1)
                      : String(state.severity) === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        if (s.id !== "custom") {
                          setState((prev) => ({
                            ...prev,
                            severity: Number(s.id),
                          }));
                        }
                      }}
                      className={clsx(
                        "h-16 rounded border text-sm font-mono font-medium transition-colors cursor-pointer",
                        isSelected
                          ? "border-[#0D9488] bg-[#F0FDFA] text-[#0D9488]"
                          : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#9CA3AF] hover:bg-[#F9FAFB]",
                      )}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF]">
                  Model Duration
                </span>
                <div className="grid grid-cols-4 gap-3">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() =>
                        setState((prev) => ({ ...prev, duration: d.id }))
                      }
                      className={clsx(
                        "h-12 rounded border text-xs font-body font-medium transition-colors cursor-pointer",
                        state.duration === d.id
                          ? "border-[#0D9488] bg-[#F0FDFA] text-[#0D9488]"
                          : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#9CA3AF] hover:bg-[#F9FAFB]",
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional attachments */}
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 h-10 rounded border border-[#E5E7EB] text-xs font-body text-[#4B5563] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                >
                  <Camera size={14} />
                  Add Photo
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 h-10 rounded border border-[#E5E7EB] text-xs font-body text-[#4B5563] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                >
                  <Mic size={14} />
                  Voice Note
                </button>
              </div>
            </div>
          )}

          {/* ---- Step 5: Confirm ---- */}
          {state.step === 5 && (
            <div className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2 text-sm font-body text-[#111827]">
                <li className="flex items-center gap-2">
                  <span className="text-[#4B5563] w-24 shrink-0">Unit:</span>
                  <span className="font-medium">
                    {labelForUnit(state.unit)}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-[#0D9488] ml-auto shrink-0"
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
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4B5563] w-24 shrink-0">Type:</span>
                  <span className="font-medium">
                    {labelForType(state.type)}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-[#0D9488] ml-auto shrink-0"
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
                </li>
                {state.type === "manual" ? (
                  <li className="flex flex-col gap-2 p-3 rounded border border-[#E5E7EB] bg-[#F9FAFB]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF]">
                        Manual Description
                      </span>
                      <span className="text-[10px] font-headline uppercase tracking-wider text-[#0D9488] bg-[#F0FDFA] border border-[#0D9488]/30 rounded px-1.5 py-0.5">
                        Manual
                      </span>
                    </div>
                    {state.manualTitle?.trim() && (
                      <span className="text-sm font-headline font-semibold text-[#111827]">
                        {state.manualTitle.trim()}
                      </span>
                    )}
                    <p className="text-sm font-body text-[#111827] whitespace-pre-wrap">
                      {state.manualDescription}
                    </p>
                  </li>
                ) : (
                  <li className="flex items-center gap-2">
                    <span className="text-[#4B5563] w-24 shrink-0">
                      Constraint:
                    </span>
                    <span className="font-medium">
                      {labelForConstraint(state.unit, state.constraint)}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="text-[#0D9488] ml-auto shrink-0"
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
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <span className="text-[#4B5563] w-24 shrink-0">
                    Severity:
                  </span>
                  <span className="font-medium font-mono">
                    -{state.severity}% capacity
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-[#0D9488] ml-auto shrink-0"
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
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#4B5563] w-24 shrink-0">
                    Duration:
                  </span>
                  <span className="font-medium">
                    {durationLabel(state.duration)}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-[#0D9488] ml-auto shrink-0"
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
                </li>
              </ul>
            </div>
          )}

          {/* ---- Navigation footer ---- */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
            {/* Back */}
            {state.step > 1 ? (
              <button
                type="button"
                onClick={() => goTo(state.step - 1)}
                className="flex items-center gap-1 text-sm font-body text-[#4B5563] hover:text-[#111827] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            ) : (
              <span />
            )}

            {/* Continue / Submit */}
            {state.step === 5 ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full ml-4 h-14 rounded bg-[#0D9488] text-white text-sm font-headline font-semibold hover:bg-[#0F766E] transition-colors cursor-pointer"
              >
                Submit Constraint
              </button>
            ) : (
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => goTo(state.step + 1)}
                className={clsx(
                  "flex items-center gap-1 h-10 px-5 rounded text-sm font-headline font-semibold transition-colors cursor-pointer",
                  canContinue
                    ? "bg-[#0D9488] text-white hover:bg-[#0F766E]"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed",
                )}
              >
                Continue to Review
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
