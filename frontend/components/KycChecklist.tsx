import { CheckSquare, FileText } from "lucide-react";
import { KycDocument } from "../lib/types";

type Props = {
  documents: KycDocument[];
  requiredIds: string[];
  selectedIds: string[];
  progress: number;
  onToggle: (id: string) => void;
};

export function KycChecklist({ documents, requiredIds, selectedIds, progress, onToggle }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-sbi-blue" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-sbi-ink">KYC readiness</h2>
        </div>
        <span className="text-sm font-semibold text-sbi-blue">{progress}%</span>
      </div>
      <div className="mb-4 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {documents.map((document) => {
          const required = requiredIds.includes(document.id);
          const selected = selectedIds.includes(document.id);
          return (
            <button
              key={document.id}
              type="button"
              onClick={() => onToggle(document.id)}
              className={`flex items-start gap-3 rounded-md border p-3 text-left ${
                selected ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
              }`}
            >
              <CheckSquare className={selected ? "mt-0.5 h-5 w-5 text-emerald-600" : "mt-0.5 h-5 w-5 text-slate-400"} />
              <span>
                <span className="block text-sm font-semibold text-slate-950">{document.label}</span>
                <span className="mt-1 block text-xs text-slate-600">{required ? "Required for current journey" : "Optional later"}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

