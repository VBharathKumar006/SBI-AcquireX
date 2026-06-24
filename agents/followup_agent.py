def create_followup(profile):
    return {
        "trigger_after_hours": 24,
        "channel": "sms",
        "message": f"Hi {profile['name']}, your SBI onboarding is ready to resume.",
    }

