import { useState } from "react";

import Login from "./pages/login";
import StudentDashboard from "./pages/studentdashboard";
import RaiseComplaint from "./pages/raisecomplaint";
import WardenDashboard from "./pages/wardendashboard";
import TechnicianDashboard from "./pages/techniciandashboard";

import "./App.css";


const technicians = [
  {
    id: 1,
    name: "Raj Kumar",
    specialization: "Electrical"
  },
  {
    id: 2,
    name: "Arjun Singh",
    specialization: "Plumbing"
  },
  {
    id: 3,
    name: "Priya Sharma",
    specialization: "General Maintenance"
  }
];


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [role, setRole] = useState("student");

  const [technicianId, setTechnicianId] = useState(null);

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [complaints, setComplaints] = useState([]);


  /* LOGIN */

  const handleLogin = (
    selectedRole,
    selectedTechnicianId
  ) => {

    setRole(selectedRole);

    setTechnicianId(
      selectedTechnicianId
    );

    setIsLoggedIn(true);

    setCurrentPage("dashboard");
  };


  /* LOGOUT */

  const handleLogout = () => {

    setIsLoggedIn(false);

    setCurrentPage("dashboard");

    setTechnicianId(null);
  };


  /* STUDENT */

  const handleRaiseComplaint = () => {

    setCurrentPage("raise-complaint");
  };


  const handleBackToDashboard = () => {

    setCurrentPage("dashboard");
  };


  const handleSubmitComplaint = (complaint) => {

    setComplaints([
      ...complaints,
      complaint
    ]);

    setCurrentPage("dashboard");
  };


  /* UPDATE COMPLAINT */

  const handleUpdateComplaint = (
    complaintId,
    updates
  ) => {

    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              ...updates
            }
          : complaint
      )
    );
  };

  const handleAssignTechnician = (
  complaintId,
  technicianId
) => {

  setComplaints(
    complaints.map((complaint) => {
      if (complaint.id !== complaintId) {
        return complaint;
      }

      return {
        ...complaint,
        assignedTechnician: technicianId,
        status:
          technicianId === null
            ? "OPEN"
            : "PENDING"
      };

    })
  );
};

const handleResolveComplaint = (
  complaintId,
  resolutionDetails
) => {

  setComplaints(
    complaints.map((complaint) => {

      if (complaint.id !== complaintId) {
        return complaint;
      }

      return {
        ...complaint,
        status: "RESOLVED",
        resolutionDetails: resolutionDetails
      };

    })
  );
};

const handleCompleteComplaint = (complaintId) => {

  setComplaints(
    complaints.map((complaint) => {

      if (complaint.id !== complaintId) {
        return complaint;
      }

      if (complaint.status !== "RESOLVED") {
        return complaint;
      }

      return {
        ...complaint,
        status: "COMPLETED"
      };

    })
  );
};

  /* NOT LOGGED IN */

  if (!isLoggedIn) {

    return (
      <Login
        onLogin={handleLogin}
        technicians={technicians}
      />
    );
  }


  /* STUDENT - RAISE COMPLAINT */

  if (
    role === "student" &&
    currentPage === "raise-complaint"
  ) {

    return (
      <RaiseComplaint
        onBack={
          handleBackToDashboard
        }
        onSubmit={
          handleSubmitComplaint
        }
      />
    );
  }


  /* WARDEN */

  if (role === "warden") {

    return (
      <WardenDashboard
        complaints={complaints}
        onLogout={handleLogout}
        onUpdateComplaint={handleUpdateComplaint}
        onAssignTechnician={handleAssignTechnician}
        technicians={technicians}
      />
    );
  }


  /* TECHNICIAN */

if (role === "technician") {

  return (
    <TechnicianDashboard
      complaints={complaints}
      technicians={technicians}
      technicianId={technicianId}
      onLogout={handleLogout}
      onResolveComplaint={
        handleResolveComplaint
      }
    />
  );
}


  /* STUDENT DASHBOARD */

  return (
    <StudentDashboard
      onLogout={handleLogout}
      onRaiseComplaint={handleRaiseComplaint}
      complaints={complaints}
      onCompleteComplaint={handleCompleteComplaint}
    />
  );
}


export default App;