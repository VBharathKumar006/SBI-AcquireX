export function buildFinancialPlan(profile) {
  const age = profile.age || 30;
  const income = profile.income || 500000;
  const risk = profile.riskAppetite || "medium";
  const retirementAge = 60;
  const workingYears = retirementAge - age;
  const monthlyIncome = income / 12;

  const retirementCorpus = Math.round(income * 0.7 * (retirementAge - age) * 1.5);
  const emergencyFund = Math.round(monthlyIncome * 6);
  const sipTarget = risk === "high"
    ? Math.round(monthlyIncome * 0.3)
    : risk === "medium"
      ? Math.round(monthlyIncome * 0.2)
      : Math.round(monthlyIncome * 0.1);

  const projections = [];
  let currentSavings = 0;
  for (let year = 1; year <= Math.min(workingYears, 10); year++) {
    const growth = risk === "high" ? 0.12 : risk === "medium" ? 0.08 : 0.06;
    currentSavings = (currentSavings + sipTarget * 12) * (1 + growth);
    projections.push({
      year: `Year ${year}`,
      age: age + year,
      projectedCorpus: Math.round(currentSavings),
      annualContribution: sipTarget * 12
    });
  }

  return {
    customerAge: age,
    monthlyIncome,
    riskProfile: risk,
    recommendations: [
      {
        category: "Emergency Fund",
        targetAmount: emergencyFund,
        suggestedProduct: "SBI Savings Plus Account",
        priority: "high"
      },
      {
        category: "Retirement Corpus",
        targetAmount: retirementCorpus,
        suggestedProduct: risk === "high" ? "SBI Mutual Fund SIP" : "SBI Fixed Deposit",
        priority: "high"
      },
      {
        category: risk === "high" ? "Wealth Building" : "Capital Preservation",
        targetAmount: Math.round(retirementCorpus * 0.4),
        suggestedProduct: risk === "high" ? "SBI Equity Fund" : "SBI Tax Saver FD",
        priority: "medium"
      }
    ],
    monthlySipTarget: sipTarget,
    projections,
    summary: `Based on your profile, set aside ₹${(sipTarget).toLocaleString("en-IN")}/month to build a ${risk}-risk portfolio targeting ₹${(retirementCorpus).toLocaleString("en-IN")} by age ${retirementAge}.`
  };
}
