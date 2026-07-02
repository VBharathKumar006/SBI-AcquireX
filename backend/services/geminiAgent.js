export async function callGemini(prompt, systemInstruction = "") {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return deterministicFallback(prompt);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 512 }
    };

    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      provider: "gemini-1.5-flash",
      reasoning: text,
      raw: data
    };
  } catch (err) {
    return deterministicFallback(prompt, `Gemini API call failed: ${err.message}`);
  }
}

function deterministicFallback(prompt, errorNote = "") {
  const lower = prompt.toLowerCase();

  let reasoning;
  if (lower.includes("profile")) {
    reasoning = "Profiling agent analyzed the customer's age, occupation, income, and risk appetite. Identified customer lifecycle stage and financial goals.";
  } else if (lower.includes("recommend")) {
    reasoning = "Recommendation agent matched customer goals against SBI product catalog. Ranked by fit score based on goal alignment, risk compatibility, income, and lifecycle stage.";
  } else if (lower.includes("onboard") || lower.includes("kyc")) {
    reasoning = "Onboarding agent identified required KYC documents and eligibility checks. Prioritized steps based on product category and regulatory requirements.";
  } else if (lower.includes("recover") || lower.includes("follow")) {
    reasoning = "Follow-up agent evaluated idle duration and paused stage. Determined risk level and optimal channel for re-engagement based on urgency.";
  } else if (lower.includes("engage")) {
    reasoning = "Engagement agent scheduled personalized offers and tips based on customer profile, lifecycle stage, and financial goals.";
  } else {
    reasoning = "Agent processed the request using deterministic fallback logic. No Gemini API key configured.";
  }

  return {
    provider: "deterministic-fallback",
    reasoning,
    note: errorNote || "GEMINI_API_KEY not configured. Enable it for AI-powered reasoning."
  };
}

export const agentPrompts = {
  profile: (profile) => ({
    prompt: `Analyze this customer profile: Name: ${profile.name}, Age: ${profile.age}, Occupation: ${profile.occupation}, Income: ${profile.income}, Goal: ${profile.goal}, Risk: ${profile.riskAppetite}. Identify the customer's lifecycle stage, key financial needs, and risk profile.`,
    system: "You are SBI AcquireX Customer Profiling Agent. Analyze customer data and provide structured insights."
  }),
  recommend: (profile) => ({
    prompt: `Based on this customer profile, recommend the top 3 SBI products: Age ${profile.age}, Occupation ${profile.occupation}, Income ${profile.income}, Goal "${profile.goal}", Risk appetite "${profile.riskAppetite}". Available products: Savings, Credit Card, Fixed Deposit, Mutual Fund SIP, Education Loan, Insurance, Personal Loan.`,
    system: "You are SBI AcquireX Recommendation Agent. Suggest personalized banking products."
  }),
  onboard: (profile, docs) => ({
    prompt: `Customer ${profile.name} needs onboarding for ${profile.goal}. Uploaded documents: ${docs.join(", ") || "none"}. List the remaining KYC steps and eligibility checks required.`,
    system: "You are SBI AcquireX Onboarding Agent. Guide customers through KYC and account opening."
  }),
  recover: (profile, stage, hours) => ({
    prompt: `Customer ${profile.name} paused at "${stage}" stage, idle for ${hours} hours. Goal: ${profile.goal}. Determine the risk level and draft a personalized recovery message.`,
    system: "You are SBI AcquireX Follow-up Agent. Recover abandoned onboarding journeys."
  }),
  engage: (profile) => ({
    prompt: `Customer ${profile.name} (${profile.age}, ${profile.occupation}) has goal: ${profile.goal}, risk: ${profile.riskAppetite}. Suggest 3 engagement offers, 3 financial tips, and one life-event based suggestion.`,
    system: "You are SBI AcquireX Engagement Agent. Drive long-term customer engagement."
  })
};
