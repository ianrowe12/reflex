"use client";

import { useState } from "react";
import { ChevronDown, FileText, BookOpen, Video, Rocket, Wrench, ScrollText } from "lucide-react";

/* ---------- FAQ Data ---------- */
const FAQ_ITEMS = [
  {
    question: "How does Reflex generate recommendations?",
    answer:
      "Reflex combines a linear programming (LP) optimization model with real-time market data (EIA, OPIS, Platts) and live process data from the PI historian. The LP model evaluates thousands of operating scenarios every 60 seconds to identify margin-improving moves. An AI layer (Claude Haiku) then translates raw LP outputs into plain-language recommendations with contextual explanations for operators.",
  },
  {
    question: "What should I do when I see a recommendation?",
    answer:
      'Each recommendation has three actions: Acknowledge (you accept it and will act), Add Constraint (you flag an operational reason it can\'t be implemented), or Dismiss (you choose not to act). Acknowledging a recommendation logs it to the shift handover trail. If you add a constraint, the LP model will respect that constraint in future solves. All actions are recorded in the audit log for compliance.',
  },
  {
    question: "How do I add a constraint?",
    answer:
      'Use the 5-step constraint wizard: (1) Select the unit, (2) Choose the constraint type (rate limit, quality bound, equipment status, etc.), (3) Pick the specific constraint, (4) Set severity and duration, (5) Confirm. Temporary constraints expire automatically. You can also add constraints directly from a recommendation card by clicking "Add Constraint."',
  },
  {
    question: "What is Shadow Mode?",
    answer:
      "Shadow Mode is Reflex's trust-building phase. During Shadow Mode, the system generates recommendations but does not send them to operators or trigger any automated actions. Instead, recommendations are logged and scored against actual operator decisions to build a track record. Once confidence and accuracy thresholds are met (typically 80%+ alignment over 30 days), the system can transition to Advisory Mode.",
  },
  {
    question: "How often does the system update?",
    answer:
      "Sensor data is read from the PI historian every 30–60 seconds. The LP model re-solves on each cycle (typically 2–5 seconds). Market data refreshes vary by source: EIA updates daily, OPIS updates multiple times per day, and Platts publishes during trading windows. The AI recommendation layer runs after each LP solve, so operators see near-real-time guidance.",
  },
  {
    question: "What happens if the LP model fails to solve?",
    answer:
      "If the LP model returns an infeasible solution, Reflex performs Irreducible Infeasible Set (IIS) analysis to identify conflicting constraints and suggests which constraints to relax. The system falls back to the last feasible solution and alerts the shift supervisor. An infeasibility event is logged with full diagnostics. In rare cases of solver timeout, the system uses the best incumbent solution found within the time limit.",
  },
  {
    question: "How is margin impact calculated?",
    answer:
      "Margin impact is calculated as the delta between the current operating point and the LP-optimized operating point, valued at current market prices. For example, if the LP recommends increasing FCC feed rate by 2,000 bbl/d and the incremental margin is $1.85/bbl, the daily margin impact would be $3,700. All values use the latest market prices and account for utility costs, yield shifts, and product quality giveaway.",
  },
  {
    question: "Who can I contact for support?",
    answer:
      "For operational issues, contact your site's Reflex administrator or the shift supervisor on duty. For technical issues, submit a support ticket using the form on this page or email reflex-support@constellation.com. For urgent issues (system down, safety concerns), call the 24/7 support line at +1 (800) 555-0142. Response times: Critical — 15 minutes, High — 1 hour, Medium — 4 hours, Low — next business day.",
  },
];

/* ---------- Documentation Links ---------- */
const DOC_LINKS = [
  { icon: Rocket, label: "Getting Started", description: "Quick start guide for new users" },
  { icon: BookOpen, label: "Operator Handbook", description: "Complete reference for daily operations" },
  { icon: ScrollText, label: "API Reference", description: "REST API and webhook documentation" },
  { icon: Wrench, label: "Troubleshooting Guide", description: "Common issues and solutions" },
  { icon: FileText, label: "Release Notes (v2.1.0)", description: "Latest features and fixes" },
  { icon: Video, label: "Training Videos", description: "Step-by-step video walkthroughs" },
];

/* ---------- System Status ---------- */
const SYSTEM_STATUS = [
  { name: "API Gateway", status: "operational" as const, detail: "99.9% uptime" },
  { name: "Database", status: "operational" as const, detail: "Healthy" },
  { name: "AI Engine", status: "operational" as const, detail: "p99: 1.2s" },
  { name: "Market Feed", status: "degraded" as const, detail: "Intermittent delays" },
  { name: "Task Scheduler", status: "operational" as const, detail: "All jobs running" },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketPriority, setTicketPriority] = useState("Medium");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleSubmitTicket = () => {
    setTicketSubmitted(true);
    setTicketSubject("");
    setTicketDescription("");
    setTicketPriority("Medium");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-[#111827]">Help &amp; Support</h1>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[3fr_2fr] gap-5">
        {/* Left: FAQ */}
        <div className="flex flex-col gap-0">
          <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] divide-y divide-[#E5E7EB]">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                >
                  <span className="text-sm font-headline font-medium text-[#111827] pr-4">{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#9CA3AF] shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3">
                    <p className="text-sm font-body text-[#4B5563] leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Documentation */}
          <div>
            <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
              Documentation
            </h2>
            <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] divide-y divide-[#E5E7EB]">
              {DOC_LINKS.map((doc) => (
                <a
                  key={doc.label}
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors group"
                >
                  <doc.icon className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#0D9488] shrink-0 transition-colors" />
                  <div className="min-w-0">
                    <p className="text-sm font-headline font-medium text-[#0D9488] group-hover:underline">{doc.label}</p>
                    <p className="text-xs font-body text-[#9CA3AF]">{doc.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Submit a Ticket */}
          <div>
            <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
              Submit a Ticket
            </h2>
            <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
              {ticketSubmitted ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="h-10 w-10 rounded-full bg-[#F0FDFA] flex items-center justify-center">
                    <svg className="h-5 w-5 text-[#0D9488]" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-headline font-medium text-[#111827]">Ticket submitted successfully</p>
                  <p className="text-xs font-mono text-[#0D9488]">Reference: SUP-2847</p>
                  <button
                    onClick={() => setTicketSubmitted(false)}
                    className="mt-2 text-xs font-headline font-medium text-[#4B5563] hover:text-[#111827] transition-colors cursor-pointer"
                  >
                    Submit another ticket
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-1 block">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Brief description of the issue"
                      className="w-full px-3 py-2 rounded border border-[#E5E7EB] text-sm font-body text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-1 block">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      placeholder="Describe the issue in detail..."
                      className="w-full px-3 py-2 rounded border border-[#E5E7EB] text-sm font-body text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-1 block">
                      Priority
                    </label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-[#E5E7EB] text-sm font-body text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488]"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSubmitTicket}
                    className="self-start px-4 py-2 rounded bg-[#0D9488] text-white text-sm font-headline font-medium hover:bg-[#0F766E] transition-colors cursor-pointer"
                  >
                    Submit Ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: System Status */}
      <div>
        <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
          System Status
        </h2>
        <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <div className="grid grid-cols-5 gap-4">
            {SYSTEM_STATUS.map((svc) => (
              <div key={svc.name} className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      svc.status === "operational" ? "bg-[#0D9488]" : "bg-[#D97706] animate-pulse"
                    }`}
                  />
                  <span className="text-sm font-headline font-medium text-[#111827]">{svc.name}</span>
                </div>
                <span
                  className={`text-xs font-body ${
                    svc.status === "operational" ? "text-[#0D9488]" : "text-[#D97706]"
                  }`}
                >
                  {svc.status === "operational" ? "Operational" : "Degraded"}
                </span>
                <span className="text-xs font-mono text-[#9CA3AF]">{svc.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
