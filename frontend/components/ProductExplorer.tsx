import { BarChart3 } from "lucide-react";
import { ProductRecommendation } from "../lib/types";

type Props = {
  recommendations: ProductRecommendation[];
};

export function ProductExplorer({ recommendations }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-sbi-blue" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-sbi-ink">Product comparison</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Fit</th>
              <th className="py-2 pr-4">Benefits</th>
              <th className="py-2">Documents</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 align-top last:border-0">
                <td className="py-3 pr-4">
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <p className="text-xs text-sbi-blue">{item.category}</p>
                </td>
                <td className="py-3 pr-4">
                  <div className="h-2 w-24 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-sbi-cyan" style={{ width: `${item.fitScore}%` }} />
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-700">{item.fitScore}%</p>
                </td>
                <td className="py-3 pr-4 text-slate-600">{(item.benefits || []).join(", ")}</td>
                <td className="py-3 text-slate-600">{(item.documents || []).slice(0, 3).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

