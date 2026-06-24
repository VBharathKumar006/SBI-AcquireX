from customer_profiling_agent import build_profile
from engagement_agent import plan_engagement
from followup_agent import create_followup
from onboarding_agent import prepare_onboarding
from recommendation_agent import recommend


def run_acquirex(payload):
    profile = build_profile(payload)
    recommendations = recommend(profile)
    onboarding = prepare_onboarding(profile, recommendations[0])

    return {
        "profile": profile,
        "recommendations": recommendations,
        "onboarding": onboarding,
        "followup": create_followup(profile),
        "engagement": plan_engagement(profile),
    }


if __name__ == "__main__":
    sample = {
        "name": "Aarav Sharma",
        "age": 24,
        "occupation": "Software Engineer",
        "income": 900000,
        "goal": "wealth creation and first salary account",
        "risk_appetite": "medium",
    }
    print(run_acquirex(sample))

