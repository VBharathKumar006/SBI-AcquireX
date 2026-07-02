import { ArrowRight, BadgeIndianRupee, Star } from "lucide-react";
import { ProductRecommendation } from "../lib/types";

type Props = {
  recommendations: ProductRecommendation[];
};

export function RecommendationPanel({ recommendations }: Props) {
  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-sbi-blue/20">
          <BadgeIndianRupee className="h-4 w-4 text-sbi-blue" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Recommended products</h2>
          <p className="text-xs text-[var(--text-secondary)]">Personalized AI-powered suggestions</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((item, index) => (
          <article
            key={item.id}
            className="rounded-lg border border-[var(--card-border)] p-4 transition-all hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  index === 0 ? "bg-amber-500" : index === 1 ? "bg-slate-400" : "bg-amber-700"
                }`}>
                  <Star className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-sbi-blue">{item.category}</p>
                  <h3 className="mt-0.5 font-semibold text-[var(--text-primary)]">{item.name}</h3>
                </div>
              </div>
              <span className="rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 px-3 py-1 text-sm font-bold text-sbi-blue dark:from-sbi-blue/20 dark:to-cyan-500/20">
                {item.fitScore}%
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{item.reason}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sbi-blue transition-colors hover:text-sbi-600">
              {item.nextStep}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
