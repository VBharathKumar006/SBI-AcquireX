import { BarChart3 } from "lucide-react";
import { ProductRecommendation } from "../lib/types";

type Props = {
  recommendations: ProductRecommendation[];
};

export function ProductExplorer({ recommendations }: Props) {
  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/20">
          <BarChart3 className="h-4 w-4 text-purple-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Product comparison</h2>
          <p className="text-xs text-[var(--text-secondary)]">Side-by-side feature analysis</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--card-border)] text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <th className="py-2.5 pr-4 font-semibold">Product</th>
              <th className="py-2.5 pr-4 font-semibold">Fit</th>
              <th className="py-2.5 pr-4 font-semibold">Benefits</th>
              <th className="py-2.5 font-semibold">Documents</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((item) => (
              <tr key={item.id} className="border-b border-[var(--card-border)] align-top last:border-0">
                <td className="py-3.5 pr-4">
                  <p className="font-semibold text-[var(--text-primary)]">{item.name}</p>
                  <p className="text-xs text-sbi-blue">{item.category}</p>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-sbi-cyan to-sbi-blue"
                        style={{ width: `${item.fitScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">{item.fitScore}%</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-sm text-[var(--text-secondary)]">
                  {(item.benefits || []).join(", ")}
                </td>
                <td className="py-3.5 text-sm text-[var(--text-secondary)]">
                  {(item.documents || []).slice(0, 3).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
