import { useState } from "react";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import RaiseComplaint from "./pages/RaiseComplaint";
import WardenDashboard from "./pages/WardenDashboard";

import "./App.css";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [role, setRole] = useState("student");

  const [currentPage, setCurrentPage] = useState("dashboard");

  const [complaints, setComplaints] = useState([]);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  const handleRaiseComplaint = () => {
    setCurrentPage("raise-complaint");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleSubmitComplaint = (complaint) => {

    setComplaints([
      ...complaints,
      complaint,
    ]);

    setCurrentPage("dashboard");
  };

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  if (
    role === "student" &&
    currentPage === "raise-complaint"
  ) {
    return (
      <RaiseComplaint
        onBack={handleBackToDashboard}
        onSubmit={handleSubmitComplaint}
      />
    );
  }

  if (role === "warden") {
    return (
      <WardenDashboard
        complaints={complaints}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <StudentDashboard
      onLogout={handleLogout}
      onRaiseComplaint={handleRaiseComplaint}
      complaints={complaints}
    />
  );
}

export default App;