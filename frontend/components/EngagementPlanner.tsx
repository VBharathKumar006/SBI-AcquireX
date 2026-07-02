import { CalendarClock, Lightbulb, Gift, PiggyBank, Sparkles } from "lucide-react";
import { EngagementPlan } from "../lib/types";

type Props = {
  plan: EngagementPlan;
};

export function EngagementPlanner({ plan }: Props) {
  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/20">
            <CalendarClock className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Engagement plan</h2>
            <p className="text-xs text-[var(--text-secondary)]">{plan.cadence} cadence</p>
          </div>
        </div>
        <span className="rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:from-indigo-500/20 dark:to-blue-500/20 dark:text-indigo-400">
          {plan.cadence}
        </span>
      </div>

      <p className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
        <Sparkles className="h-4 w-4 text-sbi-cyan" />
        {plan.title}
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-[var(--card-border)] p-3.5">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
            <Gift className="h-4 w-4 text-sbi-blue" />
            Personalized offers
          </p>
          <ul className="mt-2 space-y-1.5">
            {plan.offers.map((offer) => (
              <li key={offer} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sbi-cyan" />
                {offer}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-[var(--card-border)] p-3.5">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
            <PiggyBank className="h-4 w-4 text-emerald-600" />
            Financial tips
          </p>
          <ul className="mt-2 space-y-1.5">
            {plan.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex gap-2.5 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 p-3.5 text-sm dark:from-sbi-blue/10 dark:to-cyan-500/10">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-sbi-blue" />
        <span className="text-[var(--text-secondary)]">{plan.lifeEventSuggestion}</span>
      </div>
    </section>
  );
}
