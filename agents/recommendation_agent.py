PRODUCTS = [
    ("SBI Savings Plus Account", "Savings", ["salary", "first account", "emergency"]),
    ("SBI SimplySAVE Credit Card", "Credit Card", ["rewards", "shopping", "salary"]),
    ("SBI Fixed Deposit", "Deposit", ["safe returns", "emergency", "retirement"]),
    ("SBI Mutual Fund SIP", "Investment", ["wealth", "education", "retirement"]),
    ("SBI Student Loan", "Loan", ["education", "college"]),
]


def recommend(profile):
    goal = profile.get("goal", "").lower()
    recommendations = []

    for name, category, keywords in PRODUCTS:
        score = 55 + (30 if any(keyword in goal for keyword in keywords) else 0)
        recommendations.append(
            {
                "name": name,
                "category": category,
                "fit_score": min(score, 98),
                "reason": f"Aligned with customer goal: {profile.get('goal')}",
            }
        )

    return sorted(recommendations, key=lambda item: item["fit_score"], reverse=True)[:3]

