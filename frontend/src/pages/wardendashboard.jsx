import { useState } from "react";

function WardenDashboard({
  complaints,
  onLogout,
  onUpdateComplaint,
  technicians
}) {

  const [activeFilter, setActiveFilter] = useState("ACTIVE");

  const totalComplaints = complaints.length;

  const openComplaints = complaints.filter(
    (complaint) => complaint.status === "OPEN"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "IN_PROGRESS"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "RESOLVED"
  ).length;

  /*
    ACTIVE = everything that is not resolved
    OPEN = only OPEN complaints
    PENDING = only IN_PROGRESS complaints
    RESOLVED = only RESOLVED complaints
  */

  const filteredComplaints = complaints.filter((complaint) => {

    if (activeFilter === "ACTIVE") {
      return complaint.status !== "RESOLVED";
    }

    if (activeFilter === "OPEN") {
      return complaint.status === "OPEN";
    }

    if (activeFilter === "PENDING") {
      return complaint.status === "IN_PROGRESS";
    }

    if (activeFilter === "RESOLVED") {
      return complaint.status === "RESOLVED";
    }

    return true;
  });

  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <header className="navbar">

        <h1>Smart Hostel</h1>

        <div className="navbar-right">

          <span>Warden</span>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>


      <main className="dashboard-content">

        <h2>Warden Dashboard</h2>

        <p className="dashboard-subtitle">
          Monitor and manage hostel maintenance complaints.
        </p>


        {/* STATISTICS */}

        <div className="stats-container">

          <div className="stat-card">
            <h3>{totalComplaints}</h3>
            <p>Total Complaints</p>
          </div>

          <div className="stat-card">
            <h3>{openComplaints}</h3>
            <p>Open</p>
          </div>

          <div className="stat-card">
            <h3>{inProgressComplaints}</h3>
            <p>Pending</p>
          </div>

          <div className="stat-card">
            <h3>{resolvedComplaints}</h3>
            <p>Resolved</p>
          </div>

        </div>


        {/* FILTERS */}

        <div className="complaint-filters">

          <button
            className={
              activeFilter === "ACTIVE"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => setActiveFilter("ACTIVE")}
          >
            Active
          </button>

          <button
            className={
              activeFilter === "OPEN"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => setActiveFilter("OPEN")}
          >
            Open
          </button>

          <button
            className={
              activeFilter === "PENDING"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => setActiveFilter("PENDING")}
          >
            Pending
          </button>

          <button
            className={
              activeFilter === "RESOLVED"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => setActiveFilter("RESOLVED")}
          >
            Resolved
          </button>

        </div>


        {/* CURRENT SECTION TITLE */}

        <h3>
          {activeFilter === "ACTIVE" && "Active Complaints"}
          {activeFilter === "OPEN" && "Open Complaints"}
          {activeFilter === "PENDING" && "Pending Complaints"}
          {activeFilter === "RESOLVED" && "Resolved Complaints"}
        </h3>


        {/* COMPLAINTS */}

        {filteredComplaints.length === 0 ? (

          <div className="empty-state">

            <p>
              {activeFilter === "RESOLVED"
                ? "No resolved complaints."
                : "No complaints in this category."
              }
            </p>

          </div>

        ) : (

          <div className="complaints-list">

            {filteredComplaints.map((complaint) => (

              <div
                className="complaint-card"
                key={complaint.id}
              >

                <div className="complaint-header">

                  <h3>{complaint.title}</h3>

                  <span className="status-badge">
                    {complaint.status === "IN_PROGRESS"
                      ? "PENDING"
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


                {/* WARDEN CONTROLS */}

                <div className="complaint-controls">


                  {/* STATUS */}

                  <div className="control-group">

                    <label>Status</label>

                    <select
                      value={complaint.status}
                      onChange={(event) =>
                        onUpdateComplaint(
                          complaint.id,
                          {
                            status: event.target.value
                          }
                        )
                      }
                    >

                      <option value="OPEN">
                        Open
                      </option>

                      <option value="IN_PROGRESS">
                        Pending
                      </option>

                      <option value="RESOLVED">
                        Resolved
                      </option>

                    </select>

                  </div>


                  {/* PRIORITY */}

                  <div className="control-group">

                    <label>Priority</label>

                    <select
                      value={complaint.priority}
                      onChange={(event) =>
                        onUpdateComplaint(
                          complaint.id,
                          {
                            priority: event.target.value
                          }
                        )
                      }
                    >

                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="LOW">
                        Low
                      </option>

                      <option value="MEDIUM">
                        Medium
                      </option>

                      <option value="HIGH">
                        High
                      </option>

                      <option value="CRITICAL">
                        Critical
                      </option>

                    </select>

                  </div>


                  {/* TECHNICIAN */}

                  <div className="control-group">

                    <label>Technician</label>

                    <select
                      value={
                        complaint.assignedTechnician || ""
                      }
                      onChange={(event) =>
                        onUpdateComplaint(
                          complaint.id,
                          {
                            assignedTechnician:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value)
                          }
                        )
                      }
                    >

                      <option value="">
                        Unassigned
                      </option>

                      {technicians.map((tech) => (

                        <option
                          key={tech.id}
                          value={tech.id}
                        >
                          {tech.name} -{" "}
                          {tech.specialization}
                        </option>

                      ))}

                    </select>

                  </div>

                </div>


                {/* ASSIGNED TECHNICIAN */}

                {complaint.assignedTechnician && (

                  <p>
                    <strong>
                      Assigned Technician:
                    </strong>{" "}

                    {
                      technicians.find(
                        (tech) =>
                          tech.id ===
                          complaint.assignedTechnician
                      )?.name
                    }

                  </p>

                )}


                {/* SUBMITTED */}

                <p>
                  <strong>Submitted:</strong>{" "}
                  {complaint.createdAt}
                </p>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default WardenDashboard;