"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { API } from "../../lib/config";
import { CardSkeleton } from "../../components/Skeleton";
import { TrendingUp, Target, IndianRupee } from "lucide-react";
import { LeadIntakeForm } from "../../components/LeadIntakeForm";
import { CustomerProfile } from "../../lib/types";

export default function PlannerPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(p: CustomerProfile) {
    setProfile(p);
    setLoading(true);
    try {
      const res = await fetch(API.recommendations.replace("/recommendations", "/planner"), {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p)
      });
      const data = await res.json();
      setPlan(data.plan);
    } finally { setLoading(false); }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">AI Financial Planner</h1>
      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Personalized financial roadmap with projections</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <LeadIntakeForm initialProfile={profile || { name: "", age: 25, occupation: "", income: 0, goal: "financial planning", riskAppetite: "medium" }} onSubmit={handleSubmit} />
        </div>
        <div>
          {loading ? <CardSkeleton /> : plan ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-sbi-blue" />
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">Financial Plan</h2>
                </div>
                <p className="mt-3 rounded-lg bg-cyan-50 p-3 text-sm dark:bg-cyan-500/10">{plan.summary}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {plan.recommendations.map((r: any) => (
                  <div key={r.category} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-card">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sbi-blue">{r.priority}</p>
                    <p className="mt-1 font-semibold text-[var(--text-primary)]">{r.category}</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">₹{(r.targetAmount || 0).toLocaleString('en-IN')}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{r.suggestedProduct}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> Projected Growth
                </h3>
                <div className="mt-4 space-y-3">
                  {plan.projections.map((p: any) => (
                    <div key={p.year} className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2.5 text-sm">
                      <span className="text-[var(--text-secondary)]">{p.year} (Age {p.age})</span>
                      <span className="font-semibold text-[var(--text-primary)]">₹{(p.projectedCorpus || 0).toLocaleString("en-IN")}</span>
                      <span className="text-xs text-[var(--text-muted)]">+₹{(p.annualContribution || 0).toLocaleString("en-IN")}/yr</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-card">
                <IndianRupee className="h-5 w-5 text-sbi-blue" />
                <p className="text-sm text-[var(--text-secondary)]">Suggested monthly SIP: <strong className="text-[var(--text-primary)]">₹{(plan.monthlySipTarget || 0).toLocaleString("en-IN")}</strong></p>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[var(--card-border)] text-sm text-[var(--text-muted)]">
              Submit a profile to generate your financial plan
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
