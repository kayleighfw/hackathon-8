from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

from .models import Application
from .ai import generate_proposal
from .fairness import check_fairness
from .audit import log_audit

# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    app_dict["citizenId"] = token

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
