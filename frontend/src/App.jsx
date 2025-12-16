// src/App.jsx
import { useState } from "react";
import BurgerDashboard from "./BurgerDashboard";
import ReviewerDashboard from "./ReviewerDashboard";

function App() {
  const [activeTab, setActiveTab] = useState("burger");

  return (
    <div style={{ padding: 20 }}>
      <h1>WMO Dashboard</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setActiveTab("burger")}>Burger Dashboard</button>
        <button onClick={() => setActiveTab("reviewer")} style={{ marginLeft: 10 }}>
          Reviewer Dashboard
        </button>
      </div>

      {activeTab === "burger" && <BurgerDashboard />}
      {activeTab === "reviewer" && <ReviewerDashboard />}
    </div>
  );
}

export default App;
