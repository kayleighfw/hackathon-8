from datetime import datetime

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
