import { Bot, CheckCircle2, CircleDot } from "lucide-react";
import { AgentInsight } from "../lib/types";

type Props = {
  insights: AgentInsight[];
};

export function AgentStatus({ insights }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Bot className="h-5 w-5 text-sbi-blue" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-sbi-ink">Agent workspace</h2>
      </div>

      <div className="space-y-3">
        {insights.map((item) => {
          const completed = item.status === "completed";
          const Icon = completed ? CheckCircle2 : CircleDot;
          return (
            <div key={item.agent} className="flex gap-3 rounded-md border border-slate-200 p-3">
              <Icon className={completed ? "mt-0.5 h-5 w-5 text-emerald-600" : "mt-0.5 h-5 w-5 text-slate-400"} />
              <div>
                <p className="font-medium text-slate-950">{item.agent}</p>
                <p className="mt-1 text-sm text-slate-600">{item.insight}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

