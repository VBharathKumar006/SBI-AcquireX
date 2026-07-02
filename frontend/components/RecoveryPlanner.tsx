import { BellRing, Clock3, AlertTriangle } from "lucide-react";
import { RecoveryPlan } from "../lib/types";

type Props = {
  stage: string;
  idleHours: number;
  plan: RecoveryPlan;
  onStageChange: (stage: string) => void;
  onIdleHoursChange: (hours: number) => void;
};

const riskColors = {
  low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  medium: "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  high: "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
};

const channelIcons = {
  SMS: BellRing,
  WhatsApp: BellRing,
  Email: BellRing,
  Call: BellRing
};

export function RecoveryPlanner({ stage, idleHours, plan, onStageChange, onIdleHoursChange }: Props) {
  const ChannelIcon = channelIcons[plan.channel];

  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/20">
          <BellRing className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Drop-off recovery</h2>
          <p className="text-xs text-[var(--text-secondary)]">Follow-up agent simulator</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Paused stage
          <select
            className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue"
            value={stage}
            onChange={(event) => onStageChange(event.target.value)}
          >
            <option value="profile review">Profile review</option>
            <option value="product selection">Product selection</option>
            <option value="document upload">Document upload</option>
            <option value="video KYC">Video KYC</option>
          </select>
        </label>
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Idle hours
          <input
            type="number"
            min={1}
            max={96}
            className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue"
            value={idleHours}
            onChange={(event) => onIdleHoursChange(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-4 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColors[plan.riskLevel]}`}>
              {plan.riskLevel.toUpperCase()} risk
            </span>
          </div>
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-sbi-blue">
            <ChannelIcon className="h-4 w-4" />
            {plan.channel}
          </p>
        </div>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">{plan.reason}</p>
        <div className="mt-3 flex items-center gap-2 rounded-md bg-[var(--card-bg)] p-3 text-sm">
          <Clock3 className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          <span className="text-[var(--text-secondary)]">{plan.nextBestAction}</span>
        </div>
        <div className="mt-3 rounded-lg border border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-3 text-sm italic text-[var(--text-secondary)]">
          &ldquo;{plan.message}&rdquo;
        </div>
      </div>
    </section>
  );
}
