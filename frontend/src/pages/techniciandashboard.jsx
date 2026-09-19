import { useState } from "react";

function TechnicianDashboard({
  complaints,
  technicians,
  technicianId,
  onLogout,
  onResolveComplaint
}) {

  const [activeFilter, setActiveFilter] = useState("ACTIVE");

  const [resolutionText, setResolutionText] = useState({});

  const technician = technicians.find(
    (tech) => tech.id === technicianId
  );

  // Only complaints assigned to this technician
  const assignedComplaints = complaints.filter(
    (complaint) =>
      complaint.assignedTechnician === technicianId
  );

  // Active = technician still has work to do
  const activeComplaints = assignedComplaints.filter(
    (complaint) =>
      complaint.status === "PENDING"
  );

  // Completed = technician has finished the repair
  const completedComplaints = assignedComplaints.filter(
    (complaint) =>
      complaint.status === "RESOLVED" ||
      complaint.status === "COMPLETED"
  );

  const displayedComplaints =
    activeFilter === "ACTIVE"
      ? activeComplaints
      : completedComplaints;


  const handleResolutionChange = (
    complaintId,
    value
  ) => {

    setResolutionText({
      ...resolutionText,
      [complaintId]: value
    });

  };


  const handleResolve = (complaintId) => {

    const resolution =
      resolutionText[complaintId]?.trim();

    if (!resolution) {

      alert(
        "Please enter the resolution details before marking the complaint as resolved."
      );

      return;
    }

    onResolveComplaint(
      complaintId,
      resolution
    );

  };


  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <header className="navbar">

        <h1>Smart Hostel</h1>

        <div className="navbar-right">

          <span>
            Technician: {technician?.name}
          </span>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>


      <main className="dashboard-content">

        <h2>Technician Dashboard</h2>

        <p className="dashboard-subtitle">
          View and resolve your assigned maintenance complaints.
        </p>


        {/* TECHNICIAN INFO */}

        <div className="welcome-card">

          <h3>
            Welcome, {technician?.name}
          </h3>

          <p>
            Specialization:{" "}
            {technician?.specialization}
          </p>

          <p>
            Active assignments:{" "}
            {activeComplaints.length}
          </p>

          <p>
            Completed repairs:{" "}
            {completedComplaints.length}
          </p>

        </div>


        {/* FILTERS */}

        <div className="complaint-filters">

          <button
            className={
              activeFilter === "ACTIVE"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setActiveFilter("ACTIVE")
            }
          >
            Active
          </button>

          <button
            className={
              activeFilter === "COMPLETED"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setActiveFilter("COMPLETED")
            }
          >
            Completed
          </button>

        </div>


        {/* SECTION TITLE */}

        <h3>
          {activeFilter === "ACTIVE"
            ? "Active Assignments"
            : "Completed Repairs"
          }
        </h3>


        {/* COMPLAINTS */}

        {displayedComplaints.length === 0 ? (

          <div className="empty-state">

            <p>
              {activeFilter === "ACTIVE"
                ? "You have no active assignments."
                : "You have no completed repairs."
              }
            </p>

          </div>

        ) : (

          <div className="complaints-list">

            {displayedComplaints.map(
              (complaint) => (

                <div
                  className="complaint-card"
                  key={complaint.id}
                >

                  {/* HEADER */}

                  <div className="complaint-header">

                    <h3>
                      {complaint.title}
                    </h3>

                    <span className="status-badge">

                      {complaint.status === "PENDING"
                        ? "PENDING"
                        : complaint.status
                      }

                    </span>

                  </div>


                  {/* DETAILS */}

                  <p>
                    <strong>Category:</strong>{" "}
                    {complaint.category}
                  </p>


                  <p>
                    <strong>Location:</strong>{" "}
                    {complaint.hostelBlock}{" - "}
                    {complaint.roomNumber}
                  </p>


                  <p>
                    <strong>Description:</strong>{" "}
                    {complaint.description}
                  </p>


                  <p>
                    <strong>Priority:</strong>{" "}
                    {complaint.priority}
                  </p>


                  <p>
                    <strong>Submitted:</strong>{" "}
                    {complaint.createdAt}
                  </p>


                  {/* RESOLVE ACTIVE COMPLAINT */}

                  {complaint.status === "PENDING" && (

                    <div className="resolution-section">

                      <h4>
                        Resolution Details
                      </h4>

                      <textarea
                        value={
                          resolutionText[
                            complaint.id
                          ] || ""
                        }
                        onChange={(event) =>
                          handleResolutionChange(
                            complaint.id,
                            event.target.value
                          )
                        }
                        placeholder="Describe the repair work performed..."
                        rows="4"
                      />

                      <button
                        className="primary-button"
                        onClick={() =>
                          handleResolve(
                            complaint.id
                          )
                        }
                      >
                        Mark as Resolved
                      </button>

                    </div>

                  )}


                  {/* RESOLVED COMPLAINT */}

                  {complaint.status === "RESOLVED" && (

                    <div className="resolution-display">

                      <p>
                        <strong>
                          Resolution:
                        </strong>{" "}
                        {complaint.resolutionDetails}
                      </p>

                      <p>
                        Waiting for student verification.
                      </p>

                    </div>

                  )}


                  {/* COMPLETED COMPLAINT */}

                  {complaint.status === "COMPLETED" && (

                    <div className="resolution-display">

                      <p>
                        <strong>
                          Resolution:
                        </strong>{" "}
                        {complaint.resolutionDetails}
                      </p>

                      <p>
                        Student has verified the repair.
                      </p>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default TechnicianDashboard;