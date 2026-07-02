export function buildWealthPlan(profile) {
  const risk = profile.riskAppetite || "medium";
  const income = profile.income || 500000;

  const allocation = risk === "high"
    ? { equity: 60, debt: 20, gold: 10, cash: 10 }
    : risk === "medium"
      ? { equity: 40, debt: 35, gold: 15, cash: 10 }
      : { equity: 20, debt: 50, gold: 20, cash: 10 };

  const portfolioValue = Math.round(income * (risk === "high" ? 2.5 : risk === "medium" ? 1.8 : 1.2));

  return {
    portfolioValue,
    assetAllocation: allocation,
    holdings: [
      { name: "SBI Bluechip Fund", type: "Equity", value: Math.round(portfolioValue * allocation.equity / 100 * 0.5), returns: "12.4% 1Y" },
      { name: "SBI Midcap Fund", type: "Equity", value: Math.round(portfolioValue * allocation.equity / 100 * 0.3), returns: "15.1% 1Y" },
      { name: "SBI Small Cap Fund", type: "Equity", value: Math.round(portfolioValue * allocation.equity / 100 * 0.2), returns: "18.3% 1Y" },
      { name: "SBI Corporate Bond Fund", type: "Debt", value: Math.round(portfolioValue * allocation.debt / 100 * 0.6), returns: "7.8% 1Y" },
      { name: "SBI Gilt Fund", type: "Debt", value: Math.round(portfolioValue * allocation.debt / 100 * 0.4), returns: "6.9% 1Y" },
      { name: "SBI Gold ETF", type: "Gold", value: Math.round(portfolioValue * allocation.gold / 100), returns: "9.2% 1Y" }
    ],
    rebalanceSuggestions: risk === "high"
      ? ["Consider increasing mid-cap allocation by 5%", "Reduce cash holding to 5% and deploy into equity"]
      : risk === "medium"
        ? ["Maintain current allocation — rebalance quarterly", "Review debt fund duration"]
        : ["Increase debt allocation by 5% for stability", "Consider adding SBI Short Term Fund"],
    monthlyReviewDate: "15th of every month",
    dashboardSummary: `Portfolio value: ₹${(portfolioValue).toLocaleString("en-IN")} with ${allocation.equity}% equity exposure. Recommended rebalance: quarterly.`
  };
}
