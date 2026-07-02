const commands = {
  "check balance": { action: "balance_check", response: "Your SBI Savings Plus account balance is ₹1,42,350." },
  "recent transactions": { action: "transaction_history", response: "Your last 3 transactions: ₹2,000 spent at Amazon, ₹15,000 salary credit, ₹500 UPI transfer." },
  "send money": { action: "transfer", response: "Please say the recipient name and amount to transfer." },
  "pay bill": { action: "bill_pay", response: "Your electricity bill of ₹1,200 is due on 10th July. Shall I pay it?" },
  "card status": { action: "card_info", response: "Your SBI SimplySAVE card is active. Available limit: ₹85,000. Last used: 28th June." },
  "sip details": { action: "sip_info", response: "Your SIP of ₹5,000 in SBI Bluechip Fund is active. Next payment: 5th July." },
  "loan status": { action: "loan_info", response: "Your Education Loan balance is ₹3,20,000. EMI: ₹4,500/month. Next due: 10th July." },
  "help": { action: "help", response: "You can say: check balance, recent transactions, send money, pay bill, card status, sip details, loan status." }
};

export function processVoiceCommand(transcript) {
  const normalized = transcript.toLowerCase().trim();
  const matched = Object.entries(commands).find(([key]) => normalized.includes(key));

  if (matched) {
    return matched[1];
  }

  return {
    action: "unknown",
    response: "I didn't understand that. Try saying: check balance, recent transactions, send money, or help."
  };
}

export function getAvailableCommands() {
  return Object.entries(commands).map(([command, config]) => ({
    command,
    description: config.response.slice(0, 60) + "..."
  }));
}
