import { ScanSearch, ShieldCheck, AlertTriangle, FileX } from "lucide-react";
import { DocumentVerificationResult } from "../lib/types";

type Props = {
  results: DocumentVerificationResult[];
};

const statusConfig = {
  verified: { icon: ShieldCheck, bg: "bg-emerald-50 dark:bg-emerald-500/20", text: "text-emerald-700 dark:text-emerald-400", label: "Verified" },
  "needs-review": { icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-500/20", text: "text-amber-700 dark:text-amber-400", label: "Needs review" },
  missing: { icon: FileX, bg: "bg-slate-100 dark:bg-slate-700", text: "text-slate-600 dark:text-slate-400", label: "Missing" }
};

export function DocumentVerification({ results }: Props) {
  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-500/20">
          <ScanSearch className="h-4 w-4 text-sbi-cyan" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Document verification</h2>
          <p className="text-xs text-[var(--text-secondary)]">Gemini Vision-powered analysis</p>
        </div>
      </div>
      <div className="space-y-3">
        {results.map((result) => {
          const config = statusConfig[result.status];
          const StatusIcon = config.icon;
          return (
            <div key={result.document} className="rounded-lg border border-[var(--card-border)] p-3.5 transition-all hover:shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-md ${config.bg} p-1.5`}>
                    <StatusIcon className={`h-4 w-4 ${config.text}`} />
                  </div>
                  <p className="font-medium text-[var(--text-primary)]">{result.document}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
                  {config.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{result.note}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className={`h-1.5 rounded-full ${
                      result.confidence >= 90 ? "bg-emerald-500" : result.confidence >= 70 ? "bg-amber-500" : "bg-slate-400"
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--text-muted)]">{result.confidence}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
