// src/BurgerDashboard.jsx
import { useState } from "react";

export default function BurgerDashboard() {
  const [form, setForm] = useState({
    citizenId: "",
    ageGroup: "",
    requestType: "",
    severity: "laag",
    consentAI: true,
    description: ""
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>WMO Aanvraag</h2>
      <input name="citizenId" placeholder="Citizen ID" onChange={handleChange} />
      <input name="ageGroup" placeholder="Leeftijdsgroep" onChange={handleChange} />
      <input name="requestType" placeholder="Type aanvraag" onChange={handleChange} />
      <select name="severity" onChange={handleChange}>
        <option value="laag">Laag</option>
        <option value="hoog">Hoog</option>
      </select>
      <label>
        <input
          type="checkbox"
          name="consentAI"
          checked={form.consentAI}
          onChange={(e) => setForm({ ...form, consentAI: e.target.checked })}
        /> AI Toestemming
      </label>
      <textarea name="description" placeholder="Beschrijving" onChange={handleChange}></textarea>
      <br />
      <button onClick={handleSubmit}>Verstuur</button>

      {response && (
        <div style={{ marginTop: 20, border: "1px solid gray", padding: 10 }}>
          <h3>Resultaat</h3>
          <p><strong>Token:</strong> {response.token}</p>
          <p><strong>Decision:</strong> {response.decision}</p>
          <p><strong>Message:</strong> {response.message}</p>
        </div>
      )}
    </div>
  );
}
