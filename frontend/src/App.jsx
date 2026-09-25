import { useEffect, useState } from "react";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";

import Login from "./pages/login";
import Signup from "./pages/signup";
import StudentDashboard from "./pages/studentdashboard";
import RaiseComplaint from "./pages/raisecomplaint";
import WardenDashboard from "./pages/wardendashboard";
import TechnicianDashboard from "./pages/techniciandashboard";

import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const API_URL =
  `${API_BASE_URL}/complaints`;

  const getAuthToken = async () => {
  const { tokens } = await fetchAuthSession();

  const accessToken = tokens?.accessToken?.toString();

  if (!accessToken) {
    throw new Error("No authenticated session found.");
  }

  return accessToken;
};

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
const [role, setRole] = useState(null);
const [technicianId, setTechnicianId] = useState(null);
const [currentPage, setCurrentPage] = useState("dashboard");
const [showSignup, setShowSignup] = useState(false);
const [authLoading, setAuthLoading] = useState(true);

  const [complaints, setComplaints] =
    useState([]);


  /* ==============================
     LOAD COMPLAINTS FROM AWS
  ============================== */

useEffect(() => {
  if (!isLoggedIn) {
    return;
  }

  const loadComplaints = async () => {
    try {
      const token = await getAuthToken();

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Failed to fetch complaints"
        );
      }

      const data = await response.json();

      console.log("Complaints loaded from AWS:", data);

      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  loadComplaints();
}, [isLoggedIn]);

  useEffect(() => {
  const restoreSession = async () => {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();

      const groups =
        session.tokens?.idToken?.payload?.["cognito:groups"] || [];

      let userRole = null;

      if (groups.includes("STUDENT")) {
        userRole = "student";
      } else if (groups.includes("WARDEN")) {
        userRole = "warden";
      } else if (groups.includes("TECHNICIAN")) {
        userRole = "technician";
      }

      if (userRole) {
        setRole(userRole);
        setTechnicianId(
          userRole === "technician" ? 1 : null
        );
        setIsLoggedIn(true);
      }
    } catch (error) {
      // No authenticated Cognito session exists.
      console.log("No active Cognito session.");
    } finally {
      setAuthLoading(false);
    }
  };

  restoreSession();
}, []);


  /* ==============================
     LOGIN
  ============================== */

const handleLogin = (selectedRole, selectedTechnicianId) => {
  setRole(selectedRole);
  setTechnicianId(selectedTechnicianId);
  setIsLoggedIn(true);
  setShowSignup(false);
  setCurrentPage("dashboard");
};


  /* ==============================
     LOGOUT
  ============================== */

const handleLogout = async () => {
  try {
    await signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }

  setIsLoggedIn(false);
  setRole(null);
  setCurrentPage("dashboard");
  setTechnicianId(null);
};


  /* ==============================
     STUDENT NAVIGATION
  ============================== */

  const handleRaiseComplaint = () => {

    setCurrentPage(
      "raise-complaint"
    );
  };


  const handleBackToDashboard = () => {

    setCurrentPage("dashboard");
  };


  /* ==============================
     CREATE COMPLAINT
     
     TEMPORARY:
     Adds complaint to React state.

     Later:
     POST → API Gateway → Lambda → DynamoDB
  ============================== */

  const handleSubmitComplaint = (
    complaint
  ) => {

    setComplaints(
      [
        ...complaints,
        complaint
      ]
    );

    setCurrentPage("dashboard");
  };


  /* ==============================
     UPDATE COMPLAINT

     Currently used for:
     - changing priority

     Later this will become:
     PUT → API Gateway → Lambda
  ============================== */

const updateComplaintOnServer = async (complaintId, updates) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_URL}/${complaintId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.error || "Failed to update complaint"
      );
    }

    const updatedComplaint = await response.json();

    setComplaints((currentComplaints) =>
      currentComplaints.map((complaint) =>
        complaint.id === complaintId
          ? updatedComplaint
          : complaint
      )
    );

    return updatedComplaint;
  } catch (error) {
    console.error("Complaint update error:", error);

    alert(
      error.message ||
        "Failed to update complaint. Please try again."
    );

    return null;
  }
};

const handleUpdateComplaint = (
  complaintId,
  updates
) => {

  return updateComplaintOnServer(
    complaintId,
    updates
  );
};


/* WARDEN: assign technician */

const handleAssignTechnician = (
  complaintId,
  technicianId
) => {

  return updateComplaintOnServer(
    complaintId,
    {
      assignedTechnician:
        technicianId,

      status:
        technicianId === null
          ? "OPEN"
          : "PENDING"
    }
  );
};


/* TECHNICIAN: resolve */

const handleResolveComplaint = (
  complaintId,
  resolutionDetails
) => {

  return updateComplaintOnServer(
    complaintId,
    {
      status: "RESOLVED",

      resolutionDetails:
        resolutionDetails
    }
  );
};


/* STUDENT: complete */

const handleCompleteComplaint = (
  complaintId
) => {

  return updateComplaintOnServer(
    complaintId,
    {
      status: "COMPLETED"
    }
  );
};


/* STUDENT: follow-up */

const handleFollowUpComplaint = (
  complaintId,
  followUpReason
) => {

  return updateComplaintOnServer(
    complaintId,
    {
      status: "PENDING",

      followUpRequested: true,

      followUpReason:
        followUpReason
    }
  );
};


  /* ==============================
     NOT LOGGED IN
  ============================== */
if (authLoading) {
  return <div>Loading...</div>;
}

if (!isLoggedIn && showSignup) {
  return (
    <Signup
      onBackToLogin={() => setShowSignup(false)}
    />
  );
}

if (!isLoggedIn) {
  return (
    <Login
      onLogin={handleLogin}
      onGoToSignup={() => setShowSignup(true)}
    />
  );
}

  if (!isLoggedIn) {

    return (
      <Login
        onLogin={handleLogin}
        technicians={technicians}
      />
    );

  }

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


  /* ==============================
     WARDEN DASHBOARD
  ============================== */

  if (role === "warden") {

    return (
      <WardenDashboard

        complaints={
          complaints
        }

        onLogout={
          handleLogout
        }

        onUpdateComplaint={
          handleUpdateComplaint
        }

        onAssignTechnician={
          handleAssignTechnician
        }

        technicians={
          technicians
        }

      />
    );

  }


  /* ==============================
     TECHNICIAN DASHBOARD
  ============================== */

  if (role === "technician") {

    return (
      <TechnicianDashboard

        complaints={
          complaints
        }

        technicians={
          technicians
        }

        technicianId={
          technicianId
        }

        onLogout={
          handleLogout
        }

        onResolveComplaint={
          handleResolveComplaint
        }

      />
    );

  }


  /* ==============================
     STUDENT DASHBOARD
  ============================== */

  return (
    <StudentDashboard

      onLogout={
        handleLogout
      }

      onRaiseComplaint={
        handleRaiseComplaint
      }

      complaints={
        complaints
      }

      onCompleteComplaint={
        handleCompleteComplaint
      }

      onFollowUpComplaint={
        handleFollowUpComplaint
      }

    />
  );
}


export default App;