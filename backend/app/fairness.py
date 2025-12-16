FORBIDDEN_TERMS = ["religie", "ras", "nationaliteit", "geslacht"]

def check_fairness(description: str) -> dict:
    flags = {}
    for term in FORBIDDEN_TERMS:
        if term.lower() in description.lower():
            flags[f"forbidden_{term}"] = True
    return flags
