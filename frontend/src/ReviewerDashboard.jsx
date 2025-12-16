import { useEffect, useState } from "react";

export default function ReviewerDashboard() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHighRisk = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/high-risk-results");
      if (!res.ok) throw new Error("Kon high-risk aanvragen niet ophalen");

      const data = await res.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("⚠️ Backend niet bereikbaar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighRisk();
    const interval = setInterval(fetchHighRisk, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level) => {
    if (!level) return "#d32f2f";
    const lower = level.toLowerCase();
    if (lower.includes("critical")) return "#b71c1c";
    if (lower.includes("high")) return "#d32f2f";
    if (lower.includes("medium")) return "#f57c00";
    return "#fbc02d";
  };

  return (
    <div style={{ maxWidth: 1000, margin: "auto" }}>
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "2rem",
        marginBottom: "2rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, color: "#1e293b" }}>🔍 High-Risk Aanvragen</h2>
          <button 
            onClick={fetchHighRisk}
            disabled={loading}
            style={{ 
              padding: "0.75rem 1.5rem",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "⏳ Laden..." : "🔄 Vernieuwen"}
          </button>
        </div>

        {error && (
          <div style={{
            background: "#ffebee",
            border: "2px solid #d32f2f",
            color: "#c62828",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem"
          }}>
            {error}
          </div>
        )}

        {applications.length === 0 && !error && (
          <div style={{
            background: "#e8f5e9",
            border: "2px solid #4caf50",
            color: "#2e7d32",
            padding: "1.5rem",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ margin: 0, fontSize: "1.1rem" }}>✅ Geen high-risk aanvragen gevonden</p>
          </div>
        )}

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {applications.map((app, index) => (
            <div
              key={app.id}
              style={{
                border: `3px solid ${getRiskColor(app.riskLevel)}`,
                background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
                borderRadius: "12px",
                padding: "1.5rem",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(211, 47, 47, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div>
                  <h3 style={{ margin: "0 0 1rem 0", color: "#1e293b" }}>📋 #{index + 1}</h3>
                  <p style={{ margin: "0.5rem 0" }}><strong>Token:</strong> <code style={{background: "#e0e0e0", padding: "0.25rem 0.5rem", borderRadius: "4px"}}>{app.id}</code></p>
                  <p style={{ margin: "0.5rem 0" }}><strong>👤 Naam:</strong> {app.naam}</p>
                  <p style={{ margin: "0.5rem 0" }}><strong>📧 Email:</strong> <a href={`mailto:${app.email}`}>{app.email}</a></p>
                  <p style={{ margin: "0.5rem 0" }}><strong>📍 Adres:</strong> {app.adres}</p>
                  <p style={{ margin: "0.5rem 0" }}><strong>👨 Leeftijd:</strong> {app.leeftijd_groep}</p>
                  <p style={{ margin: "0.5rem 0" }}><strong>📝 Type:</strong> {app.type_aanvraag}</p>
                </div>
                <div>
                  <div style={{
                    background: "white",
                    padding: "1.25rem",
                    borderRadius: "8px",
                    border: `2px solid ${getRiskColor(app.riskLevel)}`
                  }}>
                    <p style={{ margin: "0 0 1rem 0" }}>
                      <strong>⚠️ Risk Level:</strong><br/>
                      <span style={{ 
                        color: getRiskColor(app.riskLevel), 
                        fontWeight: "bold",
                        fontSize: "1.3rem"
                      }}>
                        {app.riskLevel}
                      </span>
                    </p>
                    <p style={{ margin: "0 0 1rem 0" }}>
                      <strong>🚨 Urgency:</strong><br/>
                      <span style={{ 
                        color: getRiskColor(app.urgency), 
                        fontWeight: "bold",
                        fontSize: "1.1rem"
                      }}>
                        {app.urgency}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <hr style={{ margin: "1.5rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

              <div>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600", color: "#1e293b" }}>💬 Analyse & Aanbeveling:</p>
                <p style={{ 
                  margin: "0.5rem 0", 
                  padding: "1rem",
                  background: "white",
                  borderRadius: "6px",
                  borderLeft: `4px solid ${getRiskColor(app.riskLevel)}`,
                  fontStyle: "italic",
                  color: "#424242"
                }}>
                  {app.reasoning}
                </p>
              </div>

              {app.beschrijving && (
                <div>
                  <p style={{ margin: "1rem 0 0.5rem 0", fontWeight: "600", color: "#1e293b" }}>📄 Beschrijving:</p>
                  <p style={{ 
                    margin: "0.5rem 0", 
                    padding: "1rem",
                    background: "#f9f9f9",
                    borderRadius: "6px",
                    color: "#424242",
                    lineHeight: "1.5"
                  }}>
                    {app.beschrijving}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
