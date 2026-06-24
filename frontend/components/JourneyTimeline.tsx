import { ClipboardCheck, FileCheck2, Handshake, MessageSquareText } from "lucide-react";

const steps = [
  {
    label: "Profile",
    detail: "Capture customer context, life stage, goals, and risk appetite.",
    icon: ClipboardCheck
  },
  {
    label: "Recommend",
    detail: "Rank SBI products using profile fit and financial intent.",
    icon: Handshake
  },
  {
    label: "Onboard",
    detail: "Guide KYC, form completion, and eligibility checks.",
    icon: FileCheck2
  },
  {
    label: "Engage",
    detail: "Recover drop-offs and trigger personalized follow-ups.",
    icon: MessageSquareText
  }
];

export function JourneyTimeline() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-sbi-ink">Customer journey</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="rounded-md border border-slate-200 p-3">
              <Icon className="h-5 w-5 text-sbi-blue" aria-hidden="true" />
              <p className="mt-3 font-medium text-slate-950">{step.label}</p>
              <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

