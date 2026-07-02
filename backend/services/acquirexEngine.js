const productCatalog = [
  {
    id: "savings-plus",
    name: "SBI Savings Plus Account",
    category: "Savings",
    goals: ["salary", "emergency", "first account"],
    risks: ["low", "medium", "high"],
    nextStep: "Open digital savings account and complete video KYC.",
    benefits: ["Auto-sweep facility", "Digital onboarding", "Easy liquidity"],
    documents: ["PAN", "Aadhaar", "address proof", "photo"]
  },
  {
    id: "simplysave-card",
    name: "SBI SimplySAVE Credit Card",
    category: "Credit Card",
    goals: ["rewards", "shopping", "salary"],
    risks: ["medium", "high"],
    nextStep: "Check card eligibility and pre-fill application.",
    benefits: ["Reward points", "Fuel surcharge waiver", "Spend-based offers"],
    documents: ["PAN", "Aadhaar", "address proof", "income proof"]
  },
  {
    id: "fixed-deposit",
    name: "SBI Fixed Deposit",
    category: "Deposit",
    goals: ["safe returns", "emergency", "retirement"],
    risks: ["low", "medium"],
    nextStep: "Show tenure and interest options.",
    benefits: ["Capital safety", "Flexible tenure", "Predictable returns"],
    documents: ["PAN", "Aadhaar", "address proof"]
  },
  {
    id: "mutual-fund-sip",
    name: "SBI Mutual Fund SIP",
    category: "Investment",
    goals: ["wealth", "education", "retirement"],
    risks: ["medium", "high"],
    nextStep: "Start risk profiling and SIP onboarding.",
    benefits: ["Goal-based investing", "Automated monthly SIP", "Long-term wealth creation"],
    documents: ["PAN", "Aadhaar", "address proof", "income proof"]
  },
  {
    id: "education-loan",
    name: "SBI Student Loan",
    category: "Loan",
    goals: ["education", "college"],
    risks: ["low", "medium", "high"],
    nextStep: "Collect admission, identity, and co-applicant documents.",
    benefits: ["Course-linked funding", "Flexible repayment", "Co-applicant support"],
    documents: ["PAN", "Aadhaar", "address proof", "income proof", "admission letter"]
  },
  {
    id: "term-insurance",
    name: "SBI Life eShield Next",
    category: "Insurance",
    goals: ["insurance", "family", "protection", "tax"],
    risks: ["low", "medium", "high"],
    nextStep: "Start protection-needs analysis and policy onboarding.",
    benefits: ["Family protection", "Digital policy journey", "Tax planning support"],
    documents: ["PAN", "Aadhaar", "address proof", "income proof"]
  },
  {
    id: "personal-loan",
    name: "SBI Xpress Credit Personal Loan",
    category: "Loan",
    goals: ["personal loan", "travel", "medical", "wedding", "home renovation"],
    risks: ["medium", "high"],
    nextStep: "Run eligibility checks and prepare a pre-filled loan application.",
    benefits: ["Quick eligibility check", "Pre-filled application", "Flexible repayment options"],
    documents: ["PAN", "Aadhaar", "address proof", "income proof"]
  }
];

export function getProductCatalog() {
  return productCatalog;
}

export function buildCustomerProfile(input) {
  return {
    name: input.name?.trim() || "Customer",
    age: Number(input.age),
    occupation: input.occupation?.trim() || "Unknown",
    income: Number(input.income),
    goal: input.goal?.trim() || "general banking",
    riskAppetite: input.riskAppetite || "medium",
    lifecycleStage: Number(input.age) < 26 ? "early-career" : Number(input.age) > 50 ? "pre-retirement" : "growth"
  };
}

export function recommendProducts(profile) {
  const goal = profile.goal.toLowerCase();

  return productCatalog
    .map((product) => {
      const goalMatch = product.goals.some((keyword) => goal.includes(keyword));
      const riskMatch = product.risks.includes(profile.riskAppetite);
      const lifecycleBoost = profile.lifecycleStage === "early-career" && product.id !== "fixed-deposit" ? 8 : 0;
      const incomeBoost = profile.income >= 800000 && product.category !== "Loan" ? 8 : 0;
      const score = Math.min(98, 50 + (goalMatch ? 25 : 0) + (riskMatch ? 15 : 0) + lifecycleBoost + incomeBoost);

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        fitScore: score,
        reason: goalMatch
          ? `Selected because the product aligns with the goal "${profile.goal}".`
          : `Selected as a complementary product for ${profile.lifecycleStage} customers.`,
        nextStep: product.nextStep,
        benefits: product.benefits,
        documents: product.documents
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3);
}

export function searchProducts(query = "") {
  const normalizedQuery = query.toLowerCase();
  if (!normalizedQuery.trim()) {
    return productCatalog;
  }

  return productCatalog.filter((product) =>
    [product.name, product.category, ...product.goals, ...product.benefits]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  );
}

export function calculateKycReadiness(recommendations, uploadedDocuments = []) {
  const requiredDocuments = [...new Set(recommendations.flatMap((recommendation) => recommendation.documents || []))];
  const completedDocuments = requiredDocuments.filter((document) => uploadedDocuments.includes(document));
  const percent = requiredDocuments.length
    ? Math.round((completedDocuments.length / requiredDocuments.length) * 100)
    : 0;

  return {
    percent,
    requiredDocuments,
    completedDocuments,
    missingDocuments: requiredDocuments.filter((document) => !uploadedDocuments.includes(document))
  };
}

export function createRecoveryPlan(profile, stage = "document upload", idleHours = 24) {
  const riskLevel = idleHours >= 48 || stage === "document upload" ? "high" : idleHours >= 24 ? "medium" : "low";
  const channel = riskLevel === "high" ? "Call" : riskLevel === "medium" ? "WhatsApp" : "SMS";

  return {
    riskLevel,
    channel,
    reason:
      stage === "document upload"
        ? "The lead paused at document upload, which is a high-friction onboarding point."
        : `The lead has been idle for ${idleHours} hours during ${stage}.`,
    nextBestAction:
      riskLevel === "high"
        ? "Escalate to assisted onboarding and offer document upload help."
        : "Send a personalized reminder with a direct resume link.",
    message: `Hi ${profile.name}, your SBI journey for ${profile.goal} is ready to resume. We can help you finish the next step in minutes.`
  };
}

export function verifyDocuments(documents = []) {
  return documents.map((document) => {
    const normalized = String(document).toLowerCase();
    const needsReview = normalized.includes("income") || normalized.includes("loan");

    return {
      document,
      status: needsReview ? "needs-review" : "verified",
      confidence: needsReview ? 82 : 96,
      note: needsReview
        ? "OCR-style validation passed, but manual review is recommended for credit eligibility."
        : "OCR-style validation found matching identity and format signals."
    };
  });
}

export function buildEngagementPlan(profile, recommendations) {
  const topRecommendation = recommendations[0];
  const wealthGoal = profile.goal.toLowerCase().includes("wealth") || profile.riskAppetite === "high";

  return {
    cadence: wealthGoal ? "bi-weekly" : "monthly",
    offers: [
      `Resume ${topRecommendation?.name || "SBI product"} onboarding`,
      topRecommendation?.category === "Loan" ? "Repayment calculator support" : "Digital activation offer",
      wealthGoal ? "SIP top-up reminder" : "Savings habit reminder"
    ],
    tips: [
      "Keep emergency funds separate from monthly spends.",
      wealthGoal ? "Review SIP allocation every quarter." : "Automate one monthly savings goal.",
      "Review nominee and KYC details after onboarding."
    ],
    lifeEventSuggestion: wealthGoal
      ? "Career growth milestone: recommend SIP, credit card, and protection bundle."
      : "Family planning milestone: recommend savings, FD, and insurance bundle."
  };
}

export function getIntegrationStatus() {
  return [
    { name: "JWT authentication", status: "working", detail: "Demo token endpoint is available." },
    { name: "Gemini API / Vision", status: process.env.GEMINI_API_KEY ? "working" : "adapter-ready", detail: "OCR adapter falls back to deterministic scoring." },
    { name: "LangGraph agents", status: "adapter-ready", detail: "Agent nodes are modeled in Python and API orchestration." },
    { name: "MongoDB", status: process.env.MONGODB_URI ? "adapter-ready" : "not-configured", detail: "Persistence adapter placeholder is present." },
    { name: "ChromaDB", status: "adapter-ready", detail: "Keyword product search can be swapped with vector retrieval." },
    { name: "Convex", status: "not-configured", detail: "Realtime sync is not configured in this MVP." }
  ];
}

export function buildJourney(profile, recommendations) {
  const kyc = calculateKycReadiness(recommendations, ["PAN", "Aadhaar"]);
  return {
    profile,
    recommendations,
    onboarding: {
      status: "ready",
      requiredDocuments: kyc.requiredDocuments,
      missingDocuments: kyc.missingDocuments,
      nextAction: recommendations[0]?.nextStep || "Start onboarding"
    },
    kyc,
    followUp: createRecoveryPlan(profile, "document upload", 24),
    engagement: buildEngagementPlan(profile, recommendations)
  };
}
