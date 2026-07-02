"use client";

import { FormEvent, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { CustomerProfile } from "../lib/types";

type Props = {
  initialProfile: CustomerProfile;
  onSubmit: (profile: CustomerProfile) => void;
};

export function LeadIntakeForm({ initialProfile, onSubmit }: Props) {
  const [profile, setProfile] = useState<CustomerProfile>(initialProfile);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  function update<K extends keyof CustomerProfile>(key: K, value: CustomerProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(profile);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Lead intake</h2>
          <p className="text-xs text-[var(--text-secondary)]">Capture customer context for agent routing.</p>
        </div>
        <span className="rounded-lg bg-gradient-to-br from-sbi-blue to-sbi-cyan p-2 text-white shadow-sm">
          <Sparkles className="h-4 w-4" />
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Name
          <input
            className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue"
            value={profile.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Age
          <input
            type="number"
            min={18}
            className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue"
            value={profile.age}
            onChange={(event) => update("age", Number(event.target.value))}
          />
        </label>
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Occupation
          <input
            className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue"
            value={profile.occupation}
            onChange={(event) => update("occupation", event.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Annual income
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue"
            value={profile.income}
            onChange={(event) => update("income", Number(event.target.value))}
          />
        </label>
        <label className="text-sm font-medium text-[var(--text-primary)] md:col-span-2">
          Financial goal
          <input
            className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue"
            value={profile.goal}
            onChange={(event) => update("goal", event.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Risk appetite
          <select
            className="mt-1 w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-sbi-blue focus:outline-none focus:ring-1 focus:ring-sbi-blue"
            value={profile.riskAppetite}
            onChange={(event) => update("riskAppetite", event.target.value as CustomerProfile["riskAppetite"])}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sbi-blue to-sbi-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Run agents
      </button>
    </form>
  );
}
