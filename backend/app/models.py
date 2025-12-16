from pydantic import BaseModel, EmailStr

class Application(BaseModel):
    name: str
    email: EmailStr          # <-- correct type voor e-mail
    address: str
    citizenId: str = ""      # wordt vervangen door token
    ageGroup: str
    requestType: str
    consentAI: bool
    description: str
