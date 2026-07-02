"use client";

import { useState } from "react";
import { API } from "../lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronDown, Loader2, Brain, Cpu } from "lucide-react";
import { CustomerProfile } from "../lib/types";

const AGENTS = [
  { id: "profile", label: "Customer Profiling Agent", color: "text-blue-600" },
  { id: "recommend", label: "Recommendation Agent", color: "text-emerald-600" },
  { id: "onboard", label: "Onboarding Agent", color: "text-purple-600" },
  { id: "recover", label: "Follow-up Agent", color: "text-amber-600" },
  { id: "engage", label: "Engagement Agent", color: "text-cyan-600" }
] as const;

type Props = {
  profile: CustomerProfile;
};

export function AgentReasoningLogs({ profile }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { reasoning: string; provider: string }>>({});
  const [loading, setLoading] = useState<string | null>(null);

  async function toggleAgent(id: string) {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);

    if (!results[id]) {
      setLoading(id);
      try {
        const res = await fetch(`${API.agents}/reasoning`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent: id, profile })
        });
        const data = await res.json();
        setResults((prev) => ({ ...prev, [id]: { reasoning: data.reasoning, provider: data.provider } }));
      } catch {
        setResults((prev) => ({ ...prev, [id]: { reasoning: "Failed to fetch agent reasoning. Ensure backend is running.", provider: "error" } }));
      } finally {
        setLoading(null);
      }
    }
  }

  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Agent reasoning</h2>
          <p className="text-xs text-[var(--text-secondary)]">Expand an agent to view its decision reasoning</p>
        </div>
      </div>

      <div className="space-y-2">
        {AGENTS.map((agent) => {
          const isOpen = expanded === agent.id;
          const result = results[agent.id];
          const isLoading = loading === agent.id;

          return (
            <div key={agent.id} className="rounded-lg border border-[var(--card-border)] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAgent(agent.id)}
                className="flex w-full items-center justify-between p-3.5 text-left transition-all hover:bg-[var(--background)]"
              >
                <div className="flex items-center gap-3">
                  <Bot className={`h-4 w-4 ${agent.color}`} />
                  <span className="text-sm font-medium text-[var(--text-primary)]">{agent.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {result && (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-[var(--text-muted)] dark:bg-slate-700">
                      <Cpu className="h-3 w-3" />
                      {result.provider === "gemini-1.5-flash" ? "Gemini" : "Fallback"}
                    </span>
                  )}
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sbi-blue" />
                  ) : (
                    <ChevronDown className={`h-4 w-4 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[var(--card-border)] bg-[var(--background)] p-3.5">
                      {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                          <Loader2 className="h-4 w-4 animate-spin" /> Querying agent...
                        </div>
                      ) : result ? (
                        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{result.reasoning}</p>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
