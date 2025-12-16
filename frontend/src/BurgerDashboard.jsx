import { useState } from "react";

export default function BurgerDashboard() {
  const [form, setForm] = useState({
    name: "",
    email: "",          // <-- nieuw veld voor e-mail
    address: "",
    ageGroup: "18-30",
    requestType: "",
    consentAI: true,
    description: ""
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async () => {
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
    setResponse(data); // data bevat { token, status, message }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>WMO Aanvraag</h2>

      <input
        name="name"
        placeholder="Naam"
        value={form.name}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        name="email"
        type="email"          // <-- type email
        placeholder="E-mailadres"
        value={form.email}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        name="address"
        placeholder="Adres"
        value={form.address}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <select
        name="ageGroup"
        value={form.ageGroup}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <option value="0-17">0-17</option>
        <option value="18-30">18-30</option>
        <option value="31-50">31-50</option>
        <option value="51-70">51-70</option>
        <option value="71+">71+</option>
      </select>

      <input
        name="requestType"
        placeholder="Type aanvraag"
        value={form.requestType}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label style={{ display: "block", marginBottom: 10 }}>
        <input
          type="checkbox"
          name="consentAI"
          checked={form.consentAI}
          onChange={handleChange}
        />{" "}
        AI Toestemming
      </label>

      <textarea
        name="description"
        placeholder="Beschrijving"
        value={form.description}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: 10 }}
      ></textarea>

      <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
        Verstuur
      </button>

      {response && (
        <div style={{ marginTop: 20, border: "1px solid gray", padding: 10 }}>
          <h3>Resultaat</h3>
          <p><strong>Message:</strong> {response.message}</p>
          {response.flags && Object.keys(response.flags).length > 0 && (
            <div>
              <strong>Flags:</strong>
              <ul>
                {Object.entries(response.flags).map(([key, value]) => (
                  <li key={key}>{key}: {String(value)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
