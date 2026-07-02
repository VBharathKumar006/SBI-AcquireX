"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API } from "../../lib/config";
import { Smartphone, CheckCircle2, XCircle, Link2, ShieldCheck, ArrowRight } from "lucide-react";

export default function YonoPage() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch(API.base + "/api/yono/status").then((r) => r.json()).then(setStatus);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">SBI YONO Integration</h1>
      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Connect AcquireX with the YONO banking ecosystem</p>

      <div className="mt-6 grid gap-6">
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sbi-blue to-sbi-cyan text-white shadow-sm">
              <Smartphone className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">YONO App</h2>
              <p className="text-sm text-[var(--text-secondary)]">SBI&apos;s integrated digital banking platform</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2">
              {status?.connected ? (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                  <XCircle className="h-4 w-4" /> Not connected
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <Link2 className="h-5 w-5 text-sbi-blue" /> Available Features
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(status?.features || ["Single sign-on", "Account summary", "Transaction sync", "Product sync"]).map((f: string) => (
              <div key={f} className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-[var(--text-primary)]">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <ShieldCheck className="h-5 w-5 text-amber-600" /> Setup Required
          </h3>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status?.setupGuide || "Add SBI YONO API credentials in .env file: YONO_CLIENT_ID, YONO_CLIENT_SECRET"}
          </p>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Once configured, AcquireX can push customer journeys to YONO and sync account/product data in real-time.
          </p>
        </div>

        <div className="rounded-xl border border-dashed border-[var(--card-border)] bg-[var(--background)] p-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">YONO integration is ready for production configuration.</p>
          <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sbi-blue px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-sbi-600">
            Configure now <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
