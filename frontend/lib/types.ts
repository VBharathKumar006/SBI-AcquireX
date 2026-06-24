export type CustomerProfile = {
  name: string;
  age: number;
  occupation: string;
  income: number;
  goal: string;
  riskAppetite: "low" | "medium" | "high";
};

export type ProductRecommendation = {
  id: string;
  name: string;
  category: string;
  fitScore: number;
  reason: string;
  nextStep: string;
  benefits?: string[];
  documents?: string[];
};

export type AgentInsight = {
  agent: string;
  status: "ready" | "working" | "completed";
  insight: string;
};

export type JourneyStage = "lead" | "profiled" | "recommended" | "kyc" | "converted";

export type KycDocument = {
  id: string;
  label: string;
  requiredFor: string[];
};

export type RecoveryPlan = {
  riskLevel: "low" | "medium" | "high";
  reason: string;
  nextBestAction: string;
  message: string;
  channel: "SMS" | "WhatsApp" | "Email" | "Call";
};

export type CustomerPreset = {
  label: string;
  profile: CustomerProfile;
};
