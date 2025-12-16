from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
import requests

from .models import Application

N8N_WEBHOOK_URL = "https://senneines.app.n8n.cloud/webhook-test/risk-assessment"

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory opslag (voor demo)
high_risk_store = {}


# --------------------------------------------------
# 1️⃣ Burger dient aanvraag in
# --------------------------------------------------
@app.post("/applications")
def submit_application(app_data: Application):
    if not app_data.consentAI:
        raise HTTPException(status_code=400, detail="Geen toestemming voor AI")

    token = str(uuid4())

    application_payload = {
        "id": token,
        "naam": app_data.name,
        "email": app_data.email,
        "adres": app_data.address,
        "leeftijd_groep": app_data.ageGroup,
        "type_aanvraag": app_data.requestType,
        "beschrijving": app_data.description,
    }

    # ✅ Sla volledige aanvraag alvast op
    high_risk_store[token] = application_payload

    # 🔁 Stuur aanvraag naar n8n (alleen analyse)
    try:
        requests.post(N8N_WEBHOOK_URL, json=application_payload, timeout=5)
    except requests.RequestException:
        pass  # n8n mag falen zonder impact

    return {
        "token": token,
        "status": "submitted",
        "message": "Aanvraag ontvangen"
    }


# --------------------------------------------------
# 2️⃣ n8n stuurt risk-analyse terug
# --------------------------------------------------
@app.post("/high-risk-result")
def receive_high_risk(result: dict):
    """
    Verwacht payload van n8n:
    {
      id,
      riskLevel,
      urgency,
      reasoning
    }
    """
    token = result.get("id")
    if not token:
        raise HTTPException(status_code=400, detail="Missing id")

    if token not in high_risk_store:
        raise HTTPException(status_code=404, detail="Application not found")

    # ✅ Merge risk info met bestaande aanvraag
    high_risk_store[token].update({
        "riskLevel": result.get("riskLevel"),
        "urgency": result.get("urgency"),
        "reasoning": result.get("reasoning"),
    })

    return {"status": "received"}


# --------------------------------------------------
# 3️⃣ Reviewer haalt complete lijst op
# --------------------------------------------------
@app.get("/high-risk-results")
def get_high_risk_results():
    """
    Retourneert COMPLETE records:
    - aanvraaggegevens
    - + riskLevel / urgency / reasoning
    """
    return list(high_risk_store.values())
