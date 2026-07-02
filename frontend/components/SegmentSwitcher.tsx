import { UsersRound } from "lucide-react";
import { CustomerPreset, CustomerProfile } from "../lib/types";

type Props = {
  presets: CustomerPreset[];
  onSelect: (profile: CustomerProfile) => void;
};

export function SegmentSwitcher({ presets, onSelect }: Props) {
  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-sbi-blue/20">
          <UsersRound className="h-4 w-4 text-sbi-blue" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Customer segments</h2>
          <p className="text-xs text-[var(--text-secondary)]">Quick-select predefined profiles</p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelect(preset.profile)}
            className="rounded-lg border border-[var(--card-border)] px-3 py-3 text-left transition-all hover:border-sbi-cyan hover:bg-cyan-50 dark:hover:bg-sbi-blue/10"
          >
            <span className="block text-sm font-semibold text-[var(--text-primary)]">{preset.label}</span>
            <span className="mt-1 block text-xs text-[var(--text-secondary)]">{preset.profile.goal}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
