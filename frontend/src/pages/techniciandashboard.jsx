function TechnicianDashboard({
  complaints,
  technicians,
  technicianId,
  onLogout,
  onUpdateComplaint
}) {
  const technician = technicians.find(
    (tech) => tech.id === technicianId
  );
  const assignedComplaints = complaints.filter(
    (complaint) =>
      complaint.assignedTechnician === technicianId
  );

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
            Assigned complaints:{" "}
            {assignedComplaints.length}
          </p>

        </div>


        {/* ASSIGNED COMPLAINTS */}

        <h3>My Assigned Complaints</h3>


        {assignedComplaints.length === 0 ? (

          <div className="empty-state">

            <p>
              You currently have no assigned complaints.
            </p>

          </div>

        ) : (

          <div className="complaints-list">

            {assignedComplaints.map((complaint) => (

              <div
                className="complaint-card"
                key={complaint.id}
              >

                <div className="complaint-header">

                  <h3>
                    {complaint.title}
                  </h3>

                  <span className="status-badge">
                    {complaint.status === "IN_PROGRESS"
                      ? "IN PROGRESS"
                      : complaint.status
                    }
                  </span>

                </div>


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


                {/* START WORK */}

                {complaint.status === "OPEN" && (

                  <button
                    className="primary-button"
                    onClick={() =>
                      onUpdateComplaint(
                        complaint.id,
                        {
                          status: "IN_PROGRESS"
                        }
                      )
                    }
                  >
                    Start Work
                  </button>

                )}


                {/* IN PROGRESS */}

                {complaint.status === "IN_PROGRESS" && (

                  <div className="resolution-section">

                    <h4>
                      Resolution Details
                    </h4>

                    <textarea
                      id={`resolution-${complaint.id}`}
                      placeholder="Describe the work performed..."
                      rows="4"
                    />

                    <button
                      className="primary-button"
                      onClick={() => {

                        const textarea =
                          document.getElementById(
                            `resolution-${complaint.id}`
                          );

                        const resolutionDetails =
                          textarea.value.trim();

                        if (!resolutionDetails) {
                          alert(
                            "Please enter resolution details before marking the complaint as resolved."
                          );

                          return;
                        }

                        onUpdateComplaint(
                          complaint.id,
                          {
                            status: "RESOLVED",
                            resolutionDetails:
                              resolutionDetails
                          }
                        );

                      }}
                    >
                      Mark as Resolved
                    </button>

                  </div>

                )}


                {/* RESOLUTION DETAILS */}

                {complaint.status === "RESOLVED" &&
                  complaint.resolutionDetails && (

                  <div className="resolution-display">

                    <p>
                      <strong>
                        Resolution:
                      </strong>{" "}
                      {complaint.resolutionDetails}
                    </p>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default TechnicianDashboard;