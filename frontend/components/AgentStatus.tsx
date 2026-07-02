import { Bot, CheckCircle2, CircleDot } from "lucide-react";
import { AgentInsight } from "../lib/types";

type Props = {
  insights: AgentInsight[];
};

export function AgentStatus({ insights }: Props) {
  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Agent workspace</h2>
          <p className="text-xs text-[var(--text-secondary)]">Multi-agent AI pipeline status</p>
        </div>
      </div>

      <div className="relative space-y-0">
        {insights.map((item, index) => {
          const completed = item.status === "completed";
          const Icon = completed ? CheckCircle2 : CircleDot;
          return (
            <div key={item.agent} className="relative flex gap-4 pb-6 last:pb-0">
              {index < insights.length - 1 && (
                <div className="absolute left-[18px] top-8 h-full w-px bg-gradient-to-b from-emerald-300 to-slate-200 dark:from-emerald-600 dark:to-slate-700" />
              )}
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                completed
                  ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-500/20"
                  : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700"
              }`}>
                <Icon className={`h-5 w-5 ${completed ? "text-emerald-600" : "text-slate-400 dark:text-slate-500"}`} />
              </div>
              <div className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3.5 transition-all hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${completed ? "text-emerald-700 dark:text-emerald-400" : "text-[var(--text-primary)]"}`}>
                    {item.agent}
                  </p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    completed
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.insight}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
