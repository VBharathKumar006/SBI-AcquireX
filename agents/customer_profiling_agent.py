def build_profile(payload):
    return {
        "name": payload.get("name", "Customer").strip(),
        "age": int(payload.get("age", 18)),
        "occupation": payload.get("occupation", "Unknown").strip(),
        "income": int(payload.get("income", 0)),
        "goal": payload.get("goal", "general banking").strip(),
        "risk_appetite": payload.get("risk_appetite", "medium"),
    }

