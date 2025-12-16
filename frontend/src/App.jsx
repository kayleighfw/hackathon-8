// src/App.jsx
import { useState } from "react";
import BurgerDashboard from "./BurgerDashboard";
import ReviewerDashboard from "./ReviewerDashboard";

function App() {
  const [activeTab, setActiveTab] = useState("burger");

  return (
    <div>
      <div style={{ background: "rgba(255, 255, 255, 0.95)", padding: "2rem", textAlign: "center", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" }}>
        <h1>📋 WMO Dashboard</h1>
        <div style={{ display: "flex", gap: "1rem", margin: "1.5rem auto", maxWidth: 600, flexWrap: "wrap" }}>
          <button 
            onClick={() => setActiveTab("burger")}
            style={{
              flex: 1,
              background: activeTab === "burger" ? "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)" : "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              padding: "0.9rem 1.8rem",
              boxShadow: activeTab === "burger" ? "0 8px 25px rgba(14, 165, 233, 0.5)" : "0 4px 15px rgba(14, 165, 233, 0.3)"
            }}
          >
            👤 Burger Portal
          </button>
          <button 
            onClick={() => setActiveTab("reviewer")}
            style={{
              flex: 1,
              background: activeTab === "reviewer" ? "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)" : "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              padding: "0.9rem 1.8rem",
              boxShadow: activeTab === "reviewer" ? "0 8px 25px rgba(14, 165, 233, 0.5)" : "0 4px 15px rgba(14, 165, 233, 0.3)"
            }}
          >
            🔍 Reviewer Dashboard
          </button>
        </div>
      </div>

      <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
        {activeTab === "burger" && <BurgerDashboard />}
        {activeTab === "reviewer" && <ReviewerDashboard />}
      </div>
    </div>
  );
}

export default App;
