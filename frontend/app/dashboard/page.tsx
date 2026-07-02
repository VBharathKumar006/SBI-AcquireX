"use client";

import { useEffect, useState } from "react";
import { API } from "../../lib/config";
import { DashboardSkeleton } from "../../components/Skeleton";
import { motion } from "framer-motion";
import { Users, TrendingUp, Activity, Timer, BarChart3, PieChart, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPie, Pie, Cell } from "recharts";

const COLORS = ["#1f63b5", "#00a9e0", "#059669", "#d97706", "#7c3aed"];

type Analytics = {
  summary: { totalLeads: number; converted: number; conversionRate: number; dropOffRate: number; activeAgents: number; avgTimeToConvert: string };
  productDistribution: { name: string; count: number }[];
  weeklyTrends: { week: string; leads: number; converted: number }[];
  funnel: { stage: string; count: number }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch(API.analytics)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <DashboardSkeleton />;

  const { summary, productDistribution, weeklyTrends, funnel } = data;
  const cards = [
    { label: "Total leads", value: summary.totalLeads, icon: Users, color: "bg-blue-50 dark:bg-sbi-blue/20", textColor: "text-sbi-blue", change: "+18%" },
    { label: "Conversion rate", value: `${summary.conversionRate}%`, icon: TrendingUp, color: "bg-emerald-50 dark:bg-emerald-500/20", textColor: "text-emerald-600", change: "+5%" },
    { label: "Drop-off rate", value: `${summary.dropOffRate}%`, icon: Activity, color: "bg-amber-50 dark:bg-amber-500/20", textColor: "text-amber-600", change: "-3%" },
    { label: "Avg. time", value: summary.avgTimeToConvert, icon: Timer, color: "bg-purple-50 dark:bg-purple-500/20", textColor: "text-purple-600", change: "" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h1>
      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Real-time acquisition metrics and trends</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg ${card.color} p-2.5`}>
                  <Icon className={`h-5 w-5 ${card.textColor}`} />
                </div>
                {card.change && (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" /> {card.change}
                  </span>
                )}
              </div>
              <p className="mt-3 text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
              <p className="text-xs text-[var(--text-secondary)]">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card"
        >
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <BarChart3 className="h-4 w-4 text-sbi-blue" /> Weekly trends
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
                <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 8 }} />
                <Bar dataKey="leads" fill="#1f63b5" radius={[4, 4, 0, 0]} name="Leads" />
                <Bar dataKey="converted" fill="#00a9e0" radius={[4, 4, 0, 0]} name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card"
        >
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <PieChart className="h-4 w-4 text-purple-600" /> Product distribution
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RPie>
                <Pie data={productDistribution.length ? productDistribution : [{ name: "Savings", count: 1 }]}
                  dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }: any) => `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {productDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </RPie>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card"
      >
        <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
          <Activity className="h-4 w-4 text-emerald-600" /> Conversion funnel
        </h2>
        <div className="mt-4 space-y-3">
          {funnel.map((stage, i) => (
            <div key={stage.stage}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--text-primary)]">{stage.stage}</span>
                <span className="text-[var(--text-secondary)]">{stage.count}</span>
              </div>
              <div className="mt-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-sbi-blue to-sbi-cyan transition-all duration-500"
                  style={{ width: `${(stage.count / funnel[0].count) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
