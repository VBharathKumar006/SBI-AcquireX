"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { UserRound, Mail, CalendarDays, LogOut, Sparkles, FileText } from "lucide-react";
import { useAuth } from "../../lib/auth-context";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-sbi-blue border-t-transparent" /></div>;
  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sbi-blue to-sbi-cyan text-lg font-bold text-white shadow-sm">
            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{user.name}</h1>
            <p className="text-sm text-[var(--text-secondary)]">Team Alpha &middot; SBI GFF 2026</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3.5">
            <Mail className="h-4 w-4 text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-primary)]">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3.5">
            <CalendarDays className="h-4 w-4 text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-secondary)]">Member since today</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3.5">
            <FileText className="h-4 w-4 text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-secondary)]">0 journeys completed</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sbi-blue to-sbi-cyan px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md">
            <Sparkles className="h-4 w-4" /> Go to dashboard
          </button>
          <button onClick={() => { logout(); router.push("/login"); }}
            className="flex items-center gap-2 rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-all hover:bg-slate-100 dark:hover:bg-slate-700">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </motion.div>
  );
}
