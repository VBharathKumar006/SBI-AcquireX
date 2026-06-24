import { UsersRound } from "lucide-react";
import { CustomerPreset, CustomerProfile } from "../lib/types";

type Props = {
  presets: CustomerPreset[];
  onSelect: (profile: CustomerProfile) => void;
};

export function SegmentSwitcher({ presets, onSelect }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <UsersRound className="h-5 w-5 text-sbi-blue" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-sbi-ink">Customer segments</h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelect(preset.profile)}
            className="rounded-md border border-slate-200 px-3 py-3 text-left hover:border-sbi-cyan hover:bg-cyan-50"
          >
            <span className="block text-sm font-semibold text-slate-950">{preset.label}</span>
            <span className="mt-1 block text-xs text-slate-600">{preset.profile.goal}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

