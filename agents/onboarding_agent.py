def prepare_onboarding(profile, recommendation):
    return {
        "status": "ready",
        "customer": profile["name"],
        "selected_product": recommendation["name"],
        "required_documents": ["PAN", "Aadhaar", "address proof", "income proof"],
        "next_action": "Start assisted KYC and pre-fill application details.",
    }

