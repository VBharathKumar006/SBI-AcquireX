import { PlugZap, CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { IntegrationStatus as IntegrationStatusType } from "../lib/types";

type Props = {
  integrations: IntegrationStatusType[];
};

const statusConfig = {
  working: { icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-500/20", text: "text-emerald-700 dark:text-emerald-400", bar: "bg-emerald-500" },
  "adapter-ready": { icon: Wifi, bg: "bg-blue-50 dark:bg-sbi-blue/20", text: "text-sbi-blue dark:text-sbi-300", bar: "bg-sbi-cyan" },
  "not-configured": { icon: WifiOff, bg: "bg-slate-100 dark:bg-slate-700", text: "text-slate-600 dark:text-slate-400", bar: "bg-slate-400" }
};

export function IntegrationStatus({ integrations }: Props) {
  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
          <PlugZap className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Integration readiness</h2>
          <p className="text-xs text-[var(--text-secondary)]">Service adapter status</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {integrations.map((integration) => {
          const config = statusConfig[integration.status];
          const StatusIcon = config.icon;
          return (
            <div key={integration.name} className="rounded-lg border border-[var(--card-border)] p-3.5 transition-all hover:shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`rounded-md ${config.bg} p-1.5`}>
                    <StatusIcon className={`h-4 w-4 ${config.text}`} />
                  </div>
                  <p className="font-medium text-[var(--text-primary)]">{integration.name}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
                  {integration.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{integration.detail}</p>
              {(integration.endpoint || integration.envKey) && (
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                  {integration.endpoint && <p>API: <code className="rounded bg-[var(--background)] px-1 font-mono text-sbi-blue">{integration.endpoint}</code></p>}
                  {integration.envKey && <p>Key: <code className="rounded bg-[var(--background)] px-1 font-mono text-amber-600 dark:text-amber-400">{integration.envKey}</code></p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
