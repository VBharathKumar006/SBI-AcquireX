"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserRound,
  FileText,
  Camera,
  PenLine,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Upload,
  ShieldCheck
} from "lucide-react";

const STEPS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "video-kyc", label: "Video KYC", icon: Camera },
  { id: "esign", label: "E-Sign", icon: PenLine },
  { id: "complete", label: "Complete", icon: CheckCircle2 }
];

type Props = {
  profile: { name: string; age: number; occupation: string; income: number };
  selectedDocs: string[];
  onToggleDoc: (id: string) => void;
  onComplete: () => void;
};

export function KycWizard({ profile, selectedDocs, onToggleDoc, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [videoDone, setVideoDone] = useState(false);
  const [esignDone, setEsignDone] = useState(false);

  const current = STEPS[step];
  const progress = ((step) / (STEPS.length - 1)) * 100;
  const isLast = step === STEPS.length - 1;

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else onComplete();
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/20">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Onboarding wizard</h2>
          <p className="text-xs text-[var(--text-secondary)]">Step {step + 1} of {STEPS.length}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.id} className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                  done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : active
                      ? "border-sbi-blue bg-sbi-blue/10 text-sbi-blue"
                      : "border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-700"
                }`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`mt-1.5 text-[10px] font-medium ${
                  active ? "text-sbi-blue" : "text-[var(--text-muted)]"
                }`}>{s.label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-sbi-blue transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[240px]"
        >
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Review customer profile</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Name", value: profile.name },
                  { label: "Age", value: profile.age },
                  { label: "Occupation", value: profile.occupation },
                  { label: "Annual income", value: `\u20B9${(profile.income || 0).toLocaleString("en-IN")}` }
                ].map((f) => (
                  <div key={f.label} className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3.5 py-2.5">
                    <p className="text-xs text-[var(--text-muted)]">{f.label}</p>
                    <p className="mt-0.5 font-medium text-[var(--text-primary)]">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Upload required documents</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {["pan", "aadhaar", "address", "income", "photo"].map((doc) => {
                  const selected = selectedDocs.includes(doc);
                  return (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => onToggleDoc(doc)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                        selected
                          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-500/10"
                          : "border-[var(--card-border)] bg-[var(--background)] hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                        selected ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 dark:bg-slate-700"
                      }`}>
                        {selected ? <CheckCircle2 className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                      </div>
                      <span className="text-sm capitalize text-[var(--text-primary)]">{doc} {doc === "pan" ? "card" : doc === "aadhaar" ? "card" : "proof"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="rounded-full bg-cyan-50 p-4 dark:bg-cyan-500/20">
                <Camera className="h-8 w-8 text-sbi-cyan" />
              </div>
              <p className="mt-4 font-semibold text-[var(--text-primary)]">Video KYC verification</p>
              <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">Verify identity through a secure video call with an SBI representative.</p>
              <button
                type="button"
                onClick={() => setVideoDone(true)}
                className={`mt-4 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                  videoDone
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-sbi-blue text-white hover:bg-sbi-600"
                }`}
              >
                {videoDone ? "Completed" : "Start video KYC"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="rounded-full bg-purple-50 p-4 dark:bg-purple-500/20">
                <PenLine className="h-8 w-8 text-purple-600" />
              </div>
              <p className="mt-4 font-semibold text-[var(--text-primary)]">E-Sign agreement</p>
              <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">Digitally sign the account opening form and terms & conditions.</p>
              <button
                type="button"
                onClick={() => setEsignDone(true)}
                className={`mt-4 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                  esignDone
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-sbi-blue text-white hover:bg-sbi-600"
                }`}
              >
                {esignDone ? "Signed" : "Click to e-sign"}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="rounded-full bg-emerald-50 p-4 dark:bg-emerald-500/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="mt-4 text-lg font-bold text-[var(--text-primary)]">Onboarding complete!</p>
              <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">
                All steps completed. Welcome to SBI, {profile.name}!
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Account reference: SBIAQX-{Date.now().toString(36).toUpperCase()}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--card-border)] pt-4">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <button
          type="button"
          onClick={next}
          disabled={(step === 2 && !videoDone) || (step === 3 && !esignDone)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-sbi-blue to-sbi-cyan px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:opacity-40"
        >
          {isLast ? "Finish" : "Continue"} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
