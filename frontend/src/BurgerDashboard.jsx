import { useState } from "react";

export default function BurgerDashboard() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ageGroup: "18-30",
    requestType: "",
    consentAI: true,
    description: ""
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://b98ae2a0a644.ngrok-free.app/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Er is iets misgegaan");
      }

      const data = await res.json();
      setResponse(data);
      setForm({
        name: "",
        email: "",
        address: "",
        ageGroup: "18-30",
        requestType: "",
        consentAI: true,
        description: ""
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <div style={{ 
        background: "white", 
        borderRadius: "12px", 
        padding: "2.5rem", 
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" 
      }}>
        <h2 style={{ textAlign: "center", marginTop: 0, color: "#1e293b" }}>📝 WMO Aanvraag Indienen</h2>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#1e293b" }}>Naam *</label>
          <input
            name="name"
            placeholder="Voer uw naam in"
            value={form.name}
            onChange={handleChange}
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#1e293b" }}>E-mailadres *</label>
          <input
            name="email"
            type="email"
            placeholder="uw.email@voorbeeld.nl"
            value={form.email}
            onChange={handleChange}
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#1e293b" }}>Adres *</label>
          <input
            name="address"
            placeholder="Straat, huisnummer, plaats"
            value={form.address}
            onChange={handleChange}
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#1e293b" }}>Leeftijdsgroep *</label>
          <select
            name="ageGroup"
            value={form.ageGroup}
            onChange={handleChange}
            style={{ width: "100%", boxSizing: "border-box" }}
          >
            <option value="0-17">0-17 jaar</option>
            <option value="18-30">18-30 jaar</option>
            <option value="31-50">31-50 jaar</option>
            <option value="51-70">51-70 jaar</option>
            <option value="71+">71+ jaar</option>
          </select>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#1e293b" }}>Type aanvraag *</label>
          <input
            name="requestType"
            placeholder="Bv. Huishoudelijke ondersteuning"
            value={form.requestType}
            onChange={handleChange}
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#1e293b" }}>Beschrijving *</label>
          <textarea
            name="description"
            placeholder="Beschrijf uw situatie en wat u nodig hebt..."
            value={form.description}
            onChange={handleChange}
            style={{ width: "100%", boxSizing: "border-box", minHeight: "120px", fontFamily: "inherit" }}
          />
        </div>

        <div style={{ 
          background: "#cffafe", 
          padding: "1rem", 
          borderRadius: "8px", 
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          border: "1px solid #06b6d4"
        }}>
          <input
            type="checkbox"
            name="consentAI"
            checked={form.consentAI}
            onChange={handleChange}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <label style={{ cursor: "pointer", margin: 0, color: "#1e293b" }}>
            Ik ga akkoord met AI-analyse van mijn aanvraag
          </label>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "1rem", 
            fontSize: "1.1rem",
            fontWeight: "700",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "⏳ Verzending..." : "✉️ Aanvraag Verzenden"}
        </button>

        {response && (
          <div style={{ 
            marginTop: "2rem", 
            background: "#d4edda", 
            border: "2px solid #28a745", 
            borderRadius: "8px", 
            padding: "1.5rem",
            color: "#155724"
          }}>
            <h3 style={{ marginTop: 0, color: "#155724" }}>✅ Aanvraag Succesvol Ingediend!</h3>
            <p><strong>Bericht:</strong> {response.message}</p>
            {response.token && <p><strong>Token:</strong> <code style={{background: "rgba(0,0,0,0.1)", padding: "0.25rem 0.5rem", borderRadius: "4px"}}>{response.token}</code></p>}
            {response.flags && Object.keys(response.flags).length > 0 && (
              <div>
                <strong>Verificatie:</strong>
                <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
                  {Object.entries(response.flags).map(([key, value]) => (
                    <li key={key}>{key}: {String(value) === "true" ? "✓" : "✗"}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
