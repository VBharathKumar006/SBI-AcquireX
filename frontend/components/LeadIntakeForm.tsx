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
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-sbi-ink">Lead intake</h2>
          <p className="mt-1 text-sm text-slate-600">Capture customer context for agent routing.</p>
        </div>
        <Sparkles className="h-5 w-5 text-sbi-cyan" aria-hidden="true" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Name
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={profile.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Age
          <input
            type="number"
            min={18}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={profile.age}
            onChange={(event) => update("age", Number(event.target.value))}
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Occupation
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={profile.occupation}
            onChange={(event) => update("occupation", event.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Annual income
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={profile.income}
            onChange={(event) => update("income", Number(event.target.value))}
          />
        </label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">
          Financial goal
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={profile.goal}
            onChange={(event) => update("goal", event.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Risk appetite
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
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
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-sbi-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Run agents
      </button>
    </form>
  );
}
