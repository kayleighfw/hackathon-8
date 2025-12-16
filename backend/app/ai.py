def generate_proposal(application: dict) -> dict:
    """
    Simuleert AI-beslissing.
    """
    severity = application.get("severity", "laag")
    decision = "HUMAN_REVIEW" if severity == "hoog" else "AUTOMATISCH"
    explanation = (
        "Hoog risico, menselijke beoordeling vereist."
        if decision == "HUMAN_REVIEW"
        else "Laag risico, AI-ondersteuning voldoende."
    )

    flags = {}
    if "verboden" in application.get("description", "").lower():
        flags["forbidden_term"] = True

    return {"decision": decision, "explanation": explanation, "flags": flags}
