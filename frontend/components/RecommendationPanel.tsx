import { ArrowRight, BadgeIndianRupee } from "lucide-react";
import { ProductRecommendation } from "../lib/types";

type Props = {
  recommendations: ProductRecommendation[];
};

export function RecommendationPanel({ recommendations }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <BadgeIndianRupee className="h-5 w-5 text-sbi-blue" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-sbi-ink">Recommended products</h2>
      </div>

      <div className="space-y-3">
        {recommendations.map((item) => (
          <article key={item.id} className="rounded-md border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sbi-blue">{item.category}</p>
                <h3 className="mt-1 font-semibold text-slate-950">{item.name}</h3>
              </div>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-sbi-blue">
                {item.fitScore}%
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{item.reason}</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sbi-blue">
              {item.nextStep}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

