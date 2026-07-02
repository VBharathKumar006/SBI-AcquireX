import { ClipboardCheck, FileCheck2, Handshake, MessageSquareText, ArrowRight } from "lucide-react";

const steps = [
  {
    label: "Profile",
    detail: "Capture customer context, life stage, goals, and risk appetite.",
    icon: ClipboardCheck,
    color: "text-blue-600 bg-blue-50 dark:bg-sbi-blue/20"
  },
  {
    label: "Recommend",
    detail: "Rank SBI products using profile fit and financial intent.",
    icon: Handshake,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/20"
  },
  {
    label: "Onboard",
    detail: "Guide KYC, form completion, and eligibility checks.",
    icon: FileCheck2,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-500/20"
  },
  {
    label: "Engage",
    detail: "Recover drop-offs and trigger personalized follow-ups.",
    icon: MessageSquareText,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-500/20"
  }
];

export function JourneyTimeline() {
  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">Customer journey</h2>
      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">End-to-end acquisition pipeline</p>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="relative">
              <div className={`rounded-lg ${step.color} p-3`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-3 font-semibold text-[var(--text-primary)]">{step.label}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{step.detail}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-3 hidden h-5 w-5 text-[var(--text-muted)] md:block" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
