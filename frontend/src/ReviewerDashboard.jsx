import { useEffect, useState } from "react";

export default function ReviewerDashboard() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  const fetchHighRisk = async () => {
    try {
      const res = await fetch("http://localhost:8000/high-risk-results");
      if (!res.ok) throw new Error("Kon high-risk aanvragen niet ophalen");

      const data = await res.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Backend niet bereikbaar");
    }
  };

  useEffect(() => {
    fetchHighRisk();
    const interval = setInterval(fetchHighRisk, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Reviewer Dashboard – High Risk Aanvragen</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {applications.length === 0 && !error && (
        <p>Geen high-risk aanvragen gevonden.</p>
      )}

      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            border: "2px solid #d32f2f",
            backgroundColor: "#fdecea",
            marginBottom: 16,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <p><strong>Token:</strong> {app.id}</p>
          <p><strong>Naam:</strong> {app.naam}</p>
          <p><strong>Email:</strong> {app.email}</p>
          <p><strong>Adres:</strong> {app.adres}</p>
          <p><strong>Leeftijdsgroep:</strong> {app.leeftijd_groep}</p>
          <p><strong>Type aanvraag:</strong> {app.type_aanvraag}</p>
          <p><strong>Beschrijving:</strong> {app.beschrijving}</p>

          <hr />

          <p>
            <strong>Risk Level:</strong>{" "}
            <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
              {app.riskLevel}
            </span>
          </p>

          <p>
            <strong>Urgency:</strong>{" "}
            <span style={{ color: "#f57c00", fontWeight: "bold" }}>
              {app.urgency}
            </span>
          </p>

          <p>
            <strong>Reasoning:</strong><br />
            <em>{app.reasoning}</em>
          </p>
        </div>
      ))}
    </div>
  );
}
