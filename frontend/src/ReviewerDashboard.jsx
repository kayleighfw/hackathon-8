// src/ReviewerDashboard.jsx
import { useState, useEffect } from "react";

export default function ReviewerDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Voor demo hardcoded data; later fetch van backend of n8n webhook output
    const demoData = [
      {
        token: "d393f313-62a2-4544-ad67-0a53555910ff",
        ageGroup: "18",
        requestType: "huishoudelijke_hulp",
        severity: "Hoog",
        description: "ik heb hulp nodig",
        decision: "HUMAN_REVIEW",
        message: "Hoog risico, menselijke beoordeling vereist.",
        flags: {}
      },
      {
        token: "xxxx-xxxx",
        ageGroup: "75+",
        requestType: "rolstoel",
        severity: "Hoog",
        description: "Mag niet gebaseerd worden op ras",
        decision: "HUMAN_REVIEW",
        message: "Hoog risico, menselijke beoordeling vereist.",
        flags: { "forbidden_ras": true }
      }
    ];
    setApplications(demoData);
  }, []);

  return (
    <div>
      <h2>Reviewer Dashboard</h2>
      {applications.map((app) => (
        <div key={app.token} style={{ border: "1px solid gray", marginBottom: 10, padding: 10 }}>
          <p><strong>Token:</strong> {app.token}</p>
          <p><strong>Age Group:</strong> {app.ageGroup}</p>
          <p><strong>Request Type:</strong> {app.requestType}</p>
          <p><strong>Severity:</strong> {app.severity}</p>
          <p><strong>Description:</strong> {app.description}</p>
          <p><strong>Decision:</strong> {app.decision}</p>
          <p><strong>Message:</strong> {app.message}</p>

          {app.flags && Object.keys(app.flags).length > 0 && (
            <div style={{ color: "red" }}>
              <strong>Flags:</strong>
              <ul>
                {Object.entries(app.flags).map(([key, value]) => (
                  <li key={key}>{key}: {value.toString()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
