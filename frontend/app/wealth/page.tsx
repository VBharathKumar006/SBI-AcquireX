"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { API } from "../../lib/config";
import { CardSkeleton } from "../../components/Skeleton";
import { Wallet, PieChart, RefreshCw } from "lucide-react";
import { LeadIntakeForm } from "../../components/LeadIntakeForm";
import { Cell, PieChart as RPie, Pie, ResponsiveContainer, Tooltip } from "recharts";
import { CustomerProfile } from "../../lib/types";

const COLORS = ["#1f63b5", "#00a9e0", "#059669", "#d97706"];

export default function WealthPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [wealth, setWealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(p: CustomerProfile) {
    setProfile(p);
    setLoading(true);
    try {
      const res = await fetch(API.recommendations.replace("/recommendations", "/wealth"), {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p)
      });
      const data = await res.json();
      setWealth(data.wealth);
    } finally { setLoading(false); }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Wealth Management</h1>
      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Portfolio tracking and investment recommendations</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <LeadIntakeForm initialProfile={profile || { name: "", age: 30, occupation: "", income: 0, goal: "wealth management", riskAppetite: "medium" }} onSubmit={handleSubmit} />
        </div>
        <div>
          {loading ? <CardSkeleton /> : wealth ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-sbi-blue" />
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">Portfolio</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                    ₹{(wealth.portfolioValue || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">{wealth.dashboardSummary}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-card">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <PieChart className="h-4 w-4 text-purple-600" /> Allocation
                  </h3>
                  <div className="mt-2 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <RPie>
                        <Pie data={Object.entries(wealth.assetAllocation || {}).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {Object.keys(wealth.assetAllocation || {}).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </RPie>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-card">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <RefreshCw className="h-4 w-4 text-amber-600" /> Rebalance
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {(wealth.rebalanceSuggestions || []).map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-card">
                <div className="border-b border-[var(--card-border)] p-4">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Holdings</h3>
                </div>
                <div className="divide-y divide-[var(--card-border)]">
                  {(wealth.holdings || []).map((h: any) => (
                    <div key={h.name} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{h.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{h.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">₹{(h.value || 0).toLocaleString("en-IN")}</p>
                        <p className="text-xs text-emerald-600">{h.returns}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[var(--card-border)] text-sm text-[var(--text-muted)]">
              Submit a profile to view your wealth portfolio
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
