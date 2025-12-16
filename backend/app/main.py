from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from datetime import datetime
from pydantic import BaseModel

# ---------------------------
# MODELS
# ---------------------------
class Application(BaseModel):
    citizenId: str
    ageGroup: str
    requestType: str
    severity: str
    consentAI: bool
    description: str

# ---------------------------
# STUB AI
# ---------------------------
def generate_proposal(application: dict) -> dict:
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

# ---------------------------
# FAIRNESS CHECK
# ---------------------------
FORBIDDEN_TERMS = ["religie", "ras", "nationaliteit", "geslacht"]

def check_fairness(description: str) -> dict:
    flags = {}
    for term in FORBIDDEN_TERMS:
        if term.lower() in description.lower():
            flags[f"forbidden_{term}"] = True
    return flags

# ---------------------------
# AUDIT LOG (print voor nu)
# ---------------------------
def log_audit(token: str, application: dict, ai_result: dict):
    print("=== AUDIT LOG ===")
    print(f"Token: {token}")
    print(f"CitizenId (pseudoniem): {application.get('citizenId')}")
    print(f"Severity: {application.get('severity')}")
    print(f"Decision: {ai_result['decision']}")
    print(f"Explanation: {ai_result['explanation']}")
    print(f"Flags: {ai_result['flags']}")
    print(f"Timestamp: {datetime.utcnow()}")
    print("=================")

# ---------------------------
# FASTAPI APP
# ---------------------------
app = FastAPI()

# CORS instellen zodat React frontend kan fetchen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # voor testen
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/applications")
def submit_application(app_data: Application):
    if not app_data.consentAI:
        raise HTTPException(status_code=400, detail="Geen toestemming voor AI")

    # Pseudonimiseer citizenId
    token = str(uuid4())
    app_dict = app_data.dict()
    app_dict["citizenId"] = token  # vervang voor privacy

    # AI voorstel
    ai_result = generate_proposal(app_dict)

    # Fairness-check
    flags = check_fairness(app_data.description)
    ai_result["flags"].update(flags)

    # Audit log
    log_audit(token, app_dict, ai_result)

    return {
        "token": token,
        "decision": ai_result["decision"],
        "message": ai_result["explanation"],
        "flags": ai_result["flags"],
    }
