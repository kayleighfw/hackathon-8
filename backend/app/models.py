from pydantic import BaseModel

class Application(BaseModel):
    name: str
    address: str
    citizenId: str = ""  # wordt vervangen door token
    ageGroup: str
    requestType: str
    severity: str
    consentAI: bool
    description: str
