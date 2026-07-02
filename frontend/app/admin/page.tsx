"use client";

import { useEffect, useState } from "react";
import { API } from "../../lib/config";
import { CardSkeleton } from "../../components/Skeleton";
import { motion } from "framer-motion";
import { Bot, Users, Activity, AlertTriangle, Play, ArrowUpRight, UserPlus, RefreshCw } from "lucide-react";

type Journey = {
  id: string;
  createdAt: string;
  profile: { name: string; goal: string; riskAppetite: string };
  followUp: { riskLevel: string; channel: string };
  onboarding: { status: string; nextAction: string };
};

export default function AdminPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchJourneys() {
    fetch(API.leads)
      .then((r) => r.json())
      .then((data) => { setJourneys(data.leads); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { fetchJourneys(); }, []);

  async function intervene(id: string, action: string) {
    await fetch(`${API.journey(id)}/intervene`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    fetchJourneys();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Agent Monitoring</h1>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Active journeys and manual intervention controls</p>
        </div>
        <button onClick={fetchJourneys} className="flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-700">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active journeys", value: journeys.length, icon: Users, color: "bg-blue-50 dark:bg-sbi-blue/20", text: "text-sbi-blue" },
          { label: "At risk", value: journeys.filter((j) => j.followUp?.riskLevel === "high").length, icon: AlertTriangle, color: "bg-red-50 dark:bg-red-500/20", text: "text-red-600" },
          { label: "Agents online", value: 5, icon: Bot, color: "bg-emerald-50 dark:bg-emerald-500/20", text: "text-emerald-600" }
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${card.color} p-2.5`}>
                  <Icon className={`h-5 w-5 ${card.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-card">
        <div className="border-b border-[var(--card-border)] p-4">
          <h2 className="font-semibold text-[var(--text-primary)]">Active journeys</h2>
        </div>
        {loading ? (
          <div className="space-y-3 p-4">
            <CardSkeleton />
          </div>
        ) : journeys.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Activity className="h-8 w-8 text-[var(--text-muted)]" />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">No journeys recorded yet. Submit a lead intake form to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--card-border)]">
            {journeys.map((journey) => (
              <div key={journey.id} className="flex items-center justify-between p-4 transition-all hover:bg-[var(--background)]">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--text-primary)]">{journey.profile?.name || "Unknown"}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      journey.followUp?.riskLevel === "high"
                        ? "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        : journey.followUp?.riskLevel === "medium"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    }`}>{journey.followUp?.riskLevel || "unknown"}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{journey.profile?.goal || "No goal set"}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{journey.id} &middot; {new Date(journey.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => intervene(journey.id, "resume")}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-sbi-blue transition-all hover:bg-blue-50 dark:hover:bg-sbi-blue/20">
                    <Play className="h-3 w-3" /> Resume
                  </button>
                  <button onClick={() => intervene(journey.id, "escalate")}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-amber-600 transition-all hover:bg-amber-50 dark:hover:bg-amber-500/20">
                    <ArrowUpRight className="h-3 w-3" /> Escalate
                  </button>
                  <button onClick={() => intervene(journey.id, "reassign")}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-purple-600 transition-all hover:bg-purple-50 dark:hover:bg-purple-500/20">
                    <UserPlus className="h-3 w-3" /> Reassign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
