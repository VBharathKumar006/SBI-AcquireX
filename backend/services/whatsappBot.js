const templates = {
  welcome: "Welcome to SBI Banking! 🏦 I'm your AI assistant. How can I help you today?",
  balance: "Your SBI Savings Account balance is ₹{balance}. Last transaction: ₹{amount} on {date}.",
  kyc_reminder: "📋 Reminder: Complete your KYC to unlock full banking features. Upload documents here: {link}",
  recovery: "🔔 Hi {name}, you left off at {stage}. Continue your application here: {link}",
  offer: "🎉 Exclusive offer: Get up to ₹{cashback} cashback with SBI {card} Credit Card. Apply now!",
  sip_reminder: "📊 Your SBI SIP of ₹{amount} is scheduled for {date}. Ensure sufficient balance.",
  loan_offer: "💰 Pre-approved loan of ₹{limit} available at {rate}% p.a. Check eligibility now."
};

export function generateWhatsAppMessage(template, variables = {}) {
  let message = templates[template] || templates.welcome;
  Object.entries(variables).forEach(([key, val]) => {
    message = message.replace(`{${key}}`, val);
  });
  return message;
}

export function getWhatsAppTemplates() {
  return Object.entries(templates).map(([id, text]) => ({ id, text, variables: text.match(/{(\w+)}/g)?.map((v) => v.slice(1, -1)) || [] }));
}

export function simulateConversation(intent) {
  const intents = {
    balance: { response: "Your SBI Savings Plus balance is ₹1,42,350 as of today.", quickReplies: ["Recent transactions", "Mini statement", "Transfer funds"] },
    kyc: { response: "You need to complete KYC. Required: PAN card, Aadhaar, Address proof. Upload via SBI AcquireX dashboard.", quickReplies: ["Upload documents", "Check status", "Need help"] },
    loan: { response: "SBI offers Education Loans, Personal Loans, and Home Loans. Your pre-approved limit is ₹5,00,000.", quickReplies: ["Check eligibility", "Apply now", "Calculate EMI"] },
    sip: { response: "Your active SIP: SBI Bluechip Fund — ₹5,000/month. Next deduction: 5th July.", quickReplies: ["Top-up SIP", "Pause SIP", "New SIP"] },
    support: { response: "Connecting you to a relationship manager. Estimated wait time: 2 minutes.", quickReplies: ["Talk to agent", "FAQs", "Callback request"] }
  };
  return intents[intent] || intents.support;
}
