"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AgentStatus } from "../components/AgentStatus";
import { DocumentVerification } from "../components/DocumentVerification";
import { EngagementPlanner } from "../components/EngagementPlanner";
import { IntegrationStatus } from "../components/IntegrationStatus";
import { JourneyTimeline } from "../components/JourneyTimeline";
import { KycWizard } from "../components/KycWizard";
import { FileUploader } from "../components/FileUploader";
import { AgentReasoningLogs } from "../components/AgentReasoningLogs";
import { LeadIntakeForm } from "../components/LeadIntakeForm";
import { ProductExplorer } from "../components/ProductExplorer";
import { RecommendationPanel } from "../components/RecommendationPanel";
import { RecoveryPlanner } from "../components/RecoveryPlanner";
import { SegmentSwitcher } from "../components/SegmentSwitcher";
import {
  buildAgentInsights,
  buildEngagementPlan,
  createRecoveryPlan,
  customerPresets,
  generateRecommendations,
  integrationStatuses,
  verifyDocuments
} from "../lib/recommendations";
import { CustomerProfile } from "../lib/types";
import { Activity, TrendingUp, Users, Zap } from "lucide-react";

const initialProfile: CustomerProfile = {
  name: "Aarav Sharma",
  age: 24,
  occupation: "Software Engineer",
  income: 900000,
  goal: "wealth creation and first salary account",
  riskAppetite: "medium"
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function Home() {
  const [profile, setProfile] = useState<CustomerProfile>(initialProfile);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(["pan", "aadhaar"]);
  const [pausedStage, setPausedStage] = useState("document upload");
  const [idleHours, setIdleHours] = useState(32);
  const recommendations = useMemo(() => generateRecommendations(profile), [profile]);
  const insights = useMemo(() => buildAgentInsights(profile), [profile]);
  const recoveryPlan = useMemo(
    () => createRecoveryPlan(profile, pausedStage, idleHours),
    [profile, pausedStage, idleHours]
  );
  const verificationResults = useMemo(
    () => verifyDocuments(selectedDocuments, recommendations),
    [selectedDocuments, recommendations]
  );
  const engagementPlan = useMemo(
    () => buildEngagementPlan(profile, recommendations),
    [profile, recommendations]
  );

  function toggleDocument(id: string) {
    setSelectedDocuments((current) =>
      current.includes(id) ? current.filter((documentId) => documentId !== id) : [...current, id]
    );
  }

  const Section = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
    <motion.section
      id={id}
      variants={sectionVariants}
      className={`scroll-mt-20 ${className}`}
    >
      {children}
    </motion.section>
  );

  const SectionTitle = ({ label, description }: { label: string; description?: string }) => (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{label}</h2>
      {description && <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{description}</p>}
    </div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* Overview */}
      <Section id="overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={sectionVariants} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-sbi-blue/20">
                <Zap className="h-5 w-5 text-sbi-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">5</p>
                <p className="text-xs text-[var(--text-secondary)]">Active Agents</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={sectionVariants} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2.5 dark:bg-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">&lt;30%</p>
                <p className="text-xs text-[var(--text-secondary)]">Drop-off Goal</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={sectionVariants} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2.5 dark:bg-purple-500/20">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">24/7</p>
                <p className="text-xs text-[var(--text-secondary)]">Follow-up</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={sectionVariants} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2.5 dark:bg-amber-500/20">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">4</p>
                <p className="text-xs text-[var(--text-secondary)]">Customer Segments</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Customer Profile */}
      <Section id="profile" className="mt-10">
        <SectionTitle label="Customer Profile" description="Select a segment or enter customer details manually." />
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={sectionVariants}>
            <SegmentSwitcher presets={customerPresets} onSelect={setProfile} />
          </motion.div>
          <motion.div variants={sectionVariants}>
            <LeadIntakeForm initialProfile={profile} onSubmit={setProfile} />
          </motion.div>
        </div>
      </Section>

      {/* Product Discovery */}
      <Section id="products" className="mt-10">
        <SectionTitle label="Product Discovery" description="AI-recommended products and comparison based on customer profile." />
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={sectionVariants}>
            <RecommendationPanel recommendations={recommendations} />
          </motion.div>
          <motion.div variants={sectionVariants}>
            <ProductExplorer recommendations={recommendations} />
          </motion.div>
        </div>
      </Section>

        {/* Onboarding Journey */}
      <Section id="onboarding" className="mt-10">
        <SectionTitle label="Onboarding Journey" description="Guided multi-step KYC wizard with real document upload." />
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={sectionVariants}>
            <KycWizard
              profile={profile}
              selectedDocs={selectedDocuments}
              onToggleDoc={toggleDocument}
              onComplete={() => alert("Onboarding complete! All steps finished.")}
            />
          </motion.div>
          <div className="space-y-6">
            <motion.div variants={sectionVariants}>
              <JourneyTimeline />
            </motion.div>
            <motion.div variants={sectionVariants}>
              <FileUploader />
            </motion.div>
            <motion.div variants={sectionVariants}>
              <DocumentVerification results={verificationResults} />
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Recovery & Engagement */}
      <Section id="recovery" className="mt-10">
        <SectionTitle label="Recovery & Engagement" description="Drop-off recovery simulator and post-onboarding engagement plan." />
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={sectionVariants}>
            <RecoveryPlanner
              stage={pausedStage}
              idleHours={idleHours}
              plan={recoveryPlan}
              onStageChange={setPausedStage}
              onIdleHoursChange={setIdleHours}
            />
          </motion.div>
          <motion.div variants={sectionVariants}>
            <EngagementPlanner plan={engagementPlan} />
          </motion.div>
        </div>
      </Section>

        {/* Agent Workspace */}
      <Section id="agents" className="mt-10">
        <SectionTitle label="Agent Workspace" description="Status, insights, and reasoning from each AI agent." />
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={sectionVariants}>
            <AgentStatus insights={insights} />
          </motion.div>
          <motion.div variants={sectionVariants}>
            <AgentReasoningLogs profile={profile} />
          </motion.div>
        </div>
      </Section>

      {/* Integrations */}
      <Section id="integrations" className="mt-10">
        <SectionTitle label="Integration Readiness" description="Service adapter status and configuration." />
        <motion.div variants={sectionVariants}>
          <IntegrationStatus integrations={integrationStatuses} />
        </motion.div>
      </Section>

      <footer className="mt-12 border-t border-[var(--section-gap)] py-6 text-center text-sm text-[var(--text-muted)]">
        SBI AcquireX &mdash; Team Alpha &mdash; SBI Global Fintech Fest 2026
      </footer>
    </motion.div>
  );
}
