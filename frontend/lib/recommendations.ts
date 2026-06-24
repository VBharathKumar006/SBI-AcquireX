import { AgentInsight, CustomerPreset, CustomerProfile, KycDocument, ProductRecommendation, RecoveryPlan } from "./types";

export const customerPresets: CustomerPreset[] = [
  {
    label: "First salary",
    profile: {
      name: "Aarav Sharma",
      age: 24,
      occupation: "Software Engineer",
      income: 900000,
      goal: "wealth creation and first salary account",
      riskAppetite: "medium"
    }
  },
  {
    label: "Education loan",
    profile: {
      name: "Meera Iyer",
      age: 20,
      occupation: "Student",
      income: 120000,
      goal: "education loan for college",
      riskAppetite: "low"
    }
  },
  {
    label: "Family saver",
    profile: {
      name: "Rohit Verma",
      age: 39,
      occupation: "Small Business Owner",
      income: 1500000,
      goal: "safe returns emergency fund and insurance",
      riskAppetite: "low"
    }
  },
  {
    label: "Growth investor",
    profile: {
      name: "Nisha Rao",
      age: 31,
      occupation: "Product Manager",
      income: 1800000,
      goal: "long term wealth retirement and tax planning",
      riskAppetite: "high"
    }
  }
];

export const kycDocuments: KycDocument[] = [
  { id: "pan", label: "PAN card", requiredFor: ["Savings", "Credit Card", "Deposit", "Investment", "Loan"] },
  { id: "aadhaar", label: "Aadhaar or identity proof", requiredFor: ["Savings", "Credit Card", "Deposit", "Investment", "Loan"] },
  { id: "address", label: "Address proof", requiredFor: ["Savings", "Credit Card", "Deposit", "Investment", "Loan"] },
  { id: "income", label: "Income proof", requiredFor: ["Credit Card", "Investment", "Loan"] },
  { id: "admission", label: "Admission letter", requiredFor: ["Loan"] },
  { id: "photo", label: "Passport-size photo", requiredFor: ["Savings", "Loan"] }
];

export const products = [
  {
    id: "savings-plus",
    name: "SBI Savings Plus Account",
    category: "Savings",
    goals: ["salary", "emergency", "first account"],
    risks: ["low", "medium", "high"],
    benefits: ["Auto-sweep facility", "Digital onboarding", "Easy liquidity"],
    documents: ["PAN card", "Aadhaar or identity proof", "Address proof", "Passport-size photo"]
  },
  {
    id: "simplysave-card",
    name: "SBI SimplySAVE Credit Card",
    category: "Credit Card",
    goals: ["rewards", "shopping", "salary"],
    risks: ["medium", "high"],
    benefits: ["Reward points", "Fuel surcharge waiver", "Spend-based offers"],
    documents: ["PAN card", "Aadhaar or identity proof", "Address proof", "Income proof"]
  },
  {
    id: "fixed-deposit",
    name: "SBI Fixed Deposit",
    category: "Deposit",
    goals: ["emergency", "safe returns", "retirement"],
    risks: ["low", "medium"],
    benefits: ["Capital safety", "Flexible tenure", "Predictable returns"],
    documents: ["PAN card", "Aadhaar or identity proof", "Address proof"]
  },
  {
    id: "mutual-fund-sip",
    name: "SBI Mutual Fund SIP",
    category: "Investment",
    goals: ["wealth", "education", "retirement"],
    risks: ["medium", "high"],
    benefits: ["Goal-based investing", "Automated monthly SIP", "Long-term wealth creation"],
    documents: ["PAN card", "Aadhaar or identity proof", "Address proof", "Income proof"]
  },
  {
    id: "education-loan",
    name: "SBI Student Loan",
    category: "Loan",
    goals: ["education", "college"],
    risks: ["low", "medium", "high"],
    benefits: ["Course-linked funding", "Flexible repayment", "Co-applicant support"],
    documents: ["PAN card", "Aadhaar or identity proof", "Address proof", "Income proof", "Admission letter"]
  },
  {
    id: "term-insurance",
    name: "SBI Life eShield Next",
    category: "Insurance",
    goals: ["insurance", "family", "protection", "tax"],
    risks: ["low", "medium", "high"],
    benefits: ["Family protection", "Digital policy journey", "Tax planning support"],
    documents: ["PAN card", "Aadhaar or identity proof", "Address proof", "Income proof"]
  }
];

export function generateRecommendations(profile: CustomerProfile): ProductRecommendation[] {
  const normalizedGoal = profile.goal.toLowerCase();

  return products
    .map((product) => {
      const goalMatch = product.goals.some((goal) => normalizedGoal.includes(goal));
      const riskMatch = product.risks.includes(profile.riskAppetite);
      const incomeBoost = profile.income > 750000 && product.category !== "Loan" ? 8 : 0;
      const ageBoost = profile.age < 26 && product.id === "education-loan" ? 12 : 0;
      const fitScore = 52 + (goalMatch ? 24 : 0) + (riskMatch ? 16 : 0) + incomeBoost + ageBoost;

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        fitScore: Math.min(fitScore, 98),
        reason: goalMatch
          ? `Matches ${profile.name || "the customer"}'s stated goal: ${profile.goal}.`
          : `Useful adjacent product for ${profile.occupation || "this profile"}.`,
        nextStep:
          product.category === "Loan"
            ? "Check eligibility and collect education or income documents."
            : "Start assisted onboarding and complete KYC.",
        benefits: product.benefits,
        documents: product.documents
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3);
}

export function calculateKycProgress(selectedDocumentIds: string[], recommendations: ProductRecommendation[]) {
  const requiredLabels = new Set(recommendations.flatMap((recommendation) => recommendation.documents || []));
  const requiredIds = kycDocuments
    .filter((document) => requiredLabels.has(document.label))
    .map((document) => document.id);
  const completed = requiredIds.filter((id) => selectedDocumentIds.includes(id)).length;
  const total = requiredIds.length || kycDocuments.length;

  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    requiredIds
  };
}

export function createRecoveryPlan(profile: CustomerProfile, stage: string, idleHours: number): RecoveryPlan {
  const riskLevel = idleHours >= 48 || stage === "document upload" ? "high" : idleHours >= 24 ? "medium" : "low";
  const reason =
    stage === "document upload"
      ? "The customer paused at document upload, which is a common high-friction point."
      : `The customer has been idle for ${idleHours} hours during ${stage}.`;
  const channel = riskLevel === "high" ? "Call" : riskLevel === "medium" ? "WhatsApp" : "SMS";
  const nextBestAction =
    riskLevel === "high"
      ? "Route to assisted onboarding and offer document help."
      : "Send a personalized reminder with a direct resume link.";

  return {
    riskLevel,
    reason,
    nextBestAction,
    channel,
    message: `Hi ${profile.name || "there"}, your SBI ${profile.goal || "banking"} journey is ready to resume. We can help you finish the next step in minutes.`
  };
}

export function buildAgentInsights(profile: CustomerProfile): AgentInsight[] {
  return [
    {
      agent: "Customer Profiling Agent",
      status: "completed",
      insight: `${profile.age || 0}-year-old ${profile.occupation || "customer"} with ${profile.riskAppetite} risk appetite.`
    },
    {
      agent: "Recommendation Agent",
      status: "completed",
      insight: `Prioritized products around ${profile.goal || "the customer's financial goal"}.`
    },
    {
      agent: "Onboarding Agent",
      status: "ready",
      insight: "Ready to begin KYC, eligibility checks, and assisted form filling."
    },
    {
      agent: "Follow-up Agent",
      status: "ready",
      insight: "Will trigger reminders if onboarding is abandoned."
    },
    {
      agent: "Engagement Agent",
      status: "ready",
      insight: "Can schedule life-event based offers after onboarding."
    }
  ];
}
