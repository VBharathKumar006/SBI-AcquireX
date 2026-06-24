def plan_engagement(profile):
    topics = ["financial wellness", "product education", "life-event offers"]
    if profile.get("risk_appetite") == "high":
        topics.append("investment opportunities")

    return {
        "cadence": "monthly",
        "topics": topics,
        "personalization_key": profile.get("goal", "general banking"),
    }

