import { useState } from "react";

function WardenDashboard({
  complaints,
  onLogout,
  onUpdateComplaint,
  onAssignTechnician,
  technicians
}) {

  const [activeFilter, setActiveFilter] =
    useState("ACTIVE");


  /* -----------------------------
     STATISTICS
  ----------------------------- */

  const totalComplaints =
    complaints.length;

  const openComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "OPEN"
    ).length;

  const pendingComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "PENDING"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "RESOLVED"
    ).length;

  const completedComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "COMPLETED"
    ).length;


  /* -----------------------------
     FILTER COMPLAINTS
  ----------------------------- */

  const filteredComplaints =
    complaints.filter((complaint) => {

      if (activeFilter === "ACTIVE") {
        return (
          complaint.status === "OPEN" ||
          complaint.status === "PENDING"
        );
      }

      if (activeFilter === "OPEN") {
        return complaint.status === "OPEN";
      }

      if (activeFilter === "PENDING") {
        return complaint.status === "PENDING";
      }

      if (activeFilter === "RESOLVED") {
        return complaint.status === "RESOLVED";
      }

      if (activeFilter === "COMPLETED") {
        return complaint.status === "COMPLETED";
      }

      return true;
    });


  /* -----------------------------
     SECTION TITLE
  ----------------------------- */

  const getSectionTitle = () => {

    if (activeFilter === "ACTIVE") {
      return "Active Complaints";
    }

    if (activeFilter === "OPEN") {
      return "Open Complaints";
    }

    if (activeFilter === "PENDING") {
      return "Pending Complaints";
    }

    if (activeFilter === "RESOLVED") {
      return "Resolved Complaints";
    }

    if (activeFilter === "COMPLETED") {
      return "Completed Complaints";
    }

    return "Complaints";
  };


  /* -----------------------------
     FILTER BUTTON
  ----------------------------- */

  const FilterButton = ({
    value,
    label,
    count
  }) => (

    <button
      className={
        activeFilter === value
          ? "filter-button active"
          : "filter-button"
      }
      onClick={() =>
        setActiveFilter(value)
      }
    >
      {label}

      <span className="filter-count">
        {count}
      </span>

    </button>

  );


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

            <h3>
              {totalComplaints}
            </h3>

            <p>
              Total Complaints
            </p>

          </div>


          <div className="stat-card">

            <h3>
              {openComplaints}
            </h3>

            <p>
              Open
            </p>

          </div>


          <div className="stat-card">

            <h3>
              {pendingComplaints}
            </h3>

            <p>
              Pending
            </p>

          </div>


          <div className="stat-card">

            <h3>
              {resolvedComplaints}
            </h3>

            <p>
              Resolved
            </p>

          </div>

        </div>


        {/* FILTERS */}

        <div className="complaint-filters">

          <FilterButton
            value="ACTIVE"
            label="Active"
            count={
              openComplaints +
              pendingComplaints
            }
          />

          <FilterButton
            value="OPEN"
            label="Open"
            count={openComplaints}
          />

          <FilterButton
            value="PENDING"
            label="Pending"
            count={pendingComplaints}
          />

          <FilterButton
            value="RESOLVED"
            label="Resolved"
            count={resolvedComplaints}
          />

          <FilterButton
            value="COMPLETED"
            label="Completed"
            count={completedComplaints}
          />

        </div>


        {/* SECTION TITLE */}

        <h3>
          {getSectionTitle()}
        </h3>


        {/* EMPTY STATE */}

        {filteredComplaints.length === 0 ? (

          <div className="empty-state">

            <p>
              {activeFilter === "ACTIVE" &&
                "There are no active complaints."
              }

              {activeFilter === "OPEN" &&
                "There are no open complaints."
              }

              {activeFilter === "PENDING" &&
                "There are no pending complaints."
              }

              {activeFilter === "RESOLVED" &&
                "There are no resolved complaints."
              }

              {activeFilter === "COMPLETED" &&
                "There are no completed complaints."
              }

            </p>

          </div>

        ) : (

          <div className="complaints-list">

            {filteredComplaints.map(
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

                      {complaint.status ===
                        "IN_PROGRESS"
                        ? "PENDING"
                        : complaint.status
                      }

                    </span>

                  </div>


                  {/* DETAILS */}

                  <p>
                    <strong>
                      Category:
                    </strong>{" "}

                    {complaint.category}

                  </p>


                  <p>

                    <strong>
                      Location:
                    </strong>{" "}

                    {complaint.hostelBlock}
                    {" - "}
                    {complaint.roomNumber}

                  </p>


                  <p>

                    <strong>
                      Description:
                    </strong>{" "}

                    {complaint.description}

                  </p>


                  {/* WARDEN CONTROLS */}

                  <div className="complaint-controls">

                    {/* PRIORITY */}

                    <div className="control-group">

                      <label>
                        Priority
                      </label>

                      <select
                        value={
                          complaint.priority
                        }
                        onChange={(event) =>
                          onUpdateComplaint(
                            complaint.id,
                            {
                              priority:
                                event.target.value
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

                      <label>
                        Technician
                      </label>

                      <select
                        value={
                          complaint.assignedTechnician ||
                          ""
                        }
                        onChange={(event) => {

                          const technicianId =
                            event.target.value === ""
                              ? null
                              : Number(
                                  event.target.value
                                );

                          onAssignTechnician(
                            complaint.id,
                            technicianId
                          );

                        }}
                      >

                        <option value="">
                          Unassigned
                        </option>

                        {technicians.map(
                          (tech) => (

                            <option
                              key={tech.id}
                              value={tech.id}
                            >
                              {tech.name} -{" "}
                              {tech.specialization}
                            </option>

                          )
                        )}

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


                  {/* RESOLUTION */}

                  {complaint.resolutionDetails && (

                    <p>

                      <strong>
                        Resolution:
                      </strong>{" "}

                      {complaint.resolutionDetails}

                    </p>

                  )}


                  {/* SUBMITTED */}

                  <p>

                    <strong>
                      Submitted:
                    </strong>{" "}

                    {complaint.createdAt}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default WardenDashboard;