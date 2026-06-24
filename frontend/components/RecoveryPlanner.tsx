import { BellRing, Clock3 } from "lucide-react";
import { RecoveryPlan } from "../lib/types";

type Props = {
  stage: string;
  idleHours: number;
  plan: RecoveryPlan;
  onStageChange: (stage: string) => void;
  onIdleHoursChange: (hours: number) => void;
};

export function RecoveryPlanner({ stage, idleHours, plan, onStageChange, onIdleHoursChange }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <BellRing className="h-5 w-5 text-sbi-blue" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-sbi-ink">Drop-off recovery</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Paused stage
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={stage}
            onChange={(event) => onStageChange(event.target.value)}
          >
            <option value="profile review">Profile review</option>
            <option value="product selection">Product selection</option>
            <option value="document upload">Document upload</option>
            <option value="video KYC">Video KYC</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Idle hours
          <input
            type="number"
            min={1}
            max={96}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={idleHours}
            onChange={(event) => onIdleHoursChange(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-950">Risk: {plan.riskLevel}</p>
          <p className="inline-flex items-center gap-1 text-sm font-medium text-sbi-blue">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {plan.channel}
          </p>
        </div>
        <p className="mt-2 text-sm text-slate-600">{plan.reason}</p>
        <p className="mt-3 text-sm font-medium text-slate-800">{plan.nextBestAction}</p>
        <p className="mt-3 rounded-md bg-white p-3 text-sm text-slate-700">{plan.message}</p>
      </div>
    </section>
  );
}

