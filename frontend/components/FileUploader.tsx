"use client";

import { useState, useRef, useCallback } from "react";
import { API } from "../lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

type UploadResult = {
  document: string;
  type: string;
  status: "verified" | "needs-review" | "unrecognized";
  confidence: number;
  size: string;
  note: string;
};

type Props = {
  onUploadComplete?: (result: UploadResult) => void;
};

export function FileUploader({ onUploadComplete }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await fetch(API.upload, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setResults((prev) => [data.analysis, ...prev]);
        onUploadComplete?.(data.analysis);
      }
    } catch {
      setResults((prev) => [{
        document: file.name,
        type: "unknown",
        status: "unrecognized",
        confidence: 0,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        note: "Upload failed. Check backend connection."
      }, ...prev]);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all ${
          dragOver
            ? "border-sbi-blue bg-blue-50 dark:bg-sbi-blue/10"
            : "border-[var(--card-border)] bg-[var(--background)] hover:border-sbi-cyan"
        }`}
      >
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onSelect} />
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-sbi-blue" />
        ) : (
          <Upload className="h-8 w-8 text-[var(--text-muted)]" />
        )}
        <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
          {uploading ? "Uploading..." : "Drop a document here or click to browse"}
        </p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">PDF, JPG, PNG or WEBP (max 10MB)</p>
      </div>

      <AnimatePresence>
        {results.map((result, i) => (
          <motion.div
            key={`${result.document}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mt-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`rounded-md p-1.5 ${
                  result.status === "verified"
                    ? "bg-emerald-50 dark:bg-emerald-500/20"
                    : "bg-amber-50 dark:bg-amber-500/20"
                }`}>
                  {result.status === "verified"
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    : <AlertTriangle className="h-4 w-4 text-amber-600" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{result.document}</p>
                  <p className="text-xs text-[var(--text-muted)]">{result.size} &middot; {result.type}</p>
                </div>
              </div>
              <button onClick={() => setResults((prev) => prev.filter((_, j) => j !== i))} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-700">
                <div className={`h-1.5 rounded-full ${
                  result.confidence >= 80 ? "bg-emerald-500" : "bg-amber-500"
                }`} style={{ width: `${result.confidence}%` }} />
              </div>
              <span className="text-xs font-semibold text-[var(--text-muted)]">{result.confidence}%</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                result.status === "verified"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
              }`}>{result.status}</span>
            </div>
            <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{result.note}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
