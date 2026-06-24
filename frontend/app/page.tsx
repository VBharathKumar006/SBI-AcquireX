"use client";

import { useMemo, useState } from "react";
import { AgentStatus } from "../components/AgentStatus";
import { JourneyTimeline } from "../components/JourneyTimeline";
import { KycChecklist } from "../components/KycChecklist";
import { LeadIntakeForm } from "../components/LeadIntakeForm";
import { ProductExplorer } from "../components/ProductExplorer";
import { RecommendationPanel } from "../components/RecommendationPanel";
import { RecoveryPlanner } from "../components/RecoveryPlanner";
import { SegmentSwitcher } from "../components/SegmentSwitcher";
import {
  buildAgentInsights,
  calculateKycProgress,
  createRecoveryPlan,
  customerPresets,
  generateRecommendations,
  kycDocuments
} from "../lib/recommendations";
import { CustomerProfile } from "../lib/types";

const initialProfile: CustomerProfile = {
  name: "Aarav Sharma",
  age: 24,
  occupation: "Software Engineer",
  income: 900000,
  goal: "wealth creation and first salary account",
  riskAppetite: "medium"
};

export default function Home() {
  const [profile, setProfile] = useState<CustomerProfile>(initialProfile);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(["pan", "aadhaar"]);
  const [pausedStage, setPausedStage] = useState("document upload");
  const [idleHours, setIdleHours] = useState(32);
  const recommendations = useMemo(() => generateRecommendations(profile), [profile]);
  const insights = useMemo(() => buildAgentInsights(profile), [profile]);
  const kycProgress = useMemo(
    () => calculateKycProgress(selectedDocuments, recommendations),
    [selectedDocuments, recommendations]
  );
  const recoveryPlan = useMemo(
    () => createRecoveryPlan(profile, pausedStage, idleHours),
    [profile, pausedStage, idleHours]
  );

  function toggleDocument(id: string) {
    setSelectedDocuments((current) =>
      current.includes(id) ? current.filter((documentId) => documentId !== id) : [...current, id]
    );
  }

  return (
    <main className="min-h-screen">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sbi-blue">SBI AcquireX</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-bold text-sbi-ink md:text-5xl">
              Agentic customer acquisition for personalized banking journeys
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md border border-slate-200 px-4 py-3">
              <p className="text-xl font-bold text-sbi-blue">5</p>
              <p className="text-xs text-slate-600">Agents</p>
            </div>
            <div className="rounded-md border border-slate-200 px-4 py-3">
              <p className="text-xl font-bold text-sbi-blue">30%</p>
              <p className="text-xs text-slate-600">Drop-off goal</p>
            </div>
            <div className="rounded-md border border-slate-200 px-4 py-3">
              <p className="text-xl font-bold text-sbi-blue">24/7</p>
              <p className="text-xs text-slate-600">Follow-up</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <SegmentSwitcher presets={customerPresets} onSelect={setProfile} />
          <LeadIntakeForm initialProfile={profile} onSubmit={setProfile} />
          <JourneyTimeline />
          <KycChecklist
            documents={kycDocuments}
            requiredIds={kycProgress.requiredIds}
            selectedIds={selectedDocuments}
            progress={kycProgress.percent}
            onToggle={toggleDocument}
          />
        </div>
        <div className="space-y-5">
          <RecommendationPanel recommendations={recommendations} />
          <ProductExplorer recommendations={recommendations} />
          <RecoveryPlanner
            stage={pausedStage}
            idleHours={idleHours}
            plan={recoveryPlan}
            onStageChange={setPausedStage}
            onIdleHoursChange={setIdleHours}
          />
          <AgentStatus insights={insights} />
        </div>
      </div>
    </main>
  );
}
