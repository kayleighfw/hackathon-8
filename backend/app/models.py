from pydantic import BaseModel

class Application(BaseModel):
    citizenId: str
    ageGroup: str
    requestType: str
    severity: str
    consentAI: bool
    description: str

class AIResult(BaseModel):
    decision: str
    explanation: str
    flags: dict
