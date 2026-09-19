import { useState } from "react";

function StudentDashboard({
  onLogout,
  onRaiseComplaint,
  complaints,
  onCompleteComplaint
}) {

  const [activeFilter, setActiveFilter] = useState("ACTIVE");


  /*
    ACTIVE:
    OPEN + PENDING

    RESOLVED:
    Waiting for student verification

    COMPLETED:
    Student has verified the repair
  */

  const filteredComplaints = complaints.filter(
    (complaint) => {

      if (activeFilter === "ACTIVE") {
        return (
          complaint.status === "OPEN" ||
          complaint.status === "PENDING"
        );
      }

      if (activeFilter === "RESOLVED") {
        return complaint.status === "RESOLVED";
      }

      if (activeFilter === "COMPLETED") {
        return complaint.status === "COMPLETED";
      }

      return true;
    }
  );


  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <header className="navbar">

        <h1>Smart Hostel</h1>

        <div className="navbar-right">

          <span>Student</span>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>


      <main className="dashboard-content">

        <h2>Student Dashboard</h2>

        <p className="dashboard-subtitle">
          Track your hostel maintenance complaints.
        </p>


        {/* RAISE COMPLAINT */}

        <div className="welcome-card">

          <h3>Need something fixed?</h3>

          <p>
            Report a hostel maintenance issue and
            track its progress until it is completed.
          </p>

          <button
            className="primary-button"
            onClick={onRaiseComplaint}
          >
            + Raise a Complaint
          </button>

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
              activeFilter === "RESOLVED"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setActiveFilter("RESOLVED")
            }
          >
            Resolved
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

          {activeFilter === "ACTIVE" &&
            "Active Complaints"
          }

          {activeFilter === "RESOLVED" &&
            "Resolved Complaints"
          }

          {activeFilter === "COMPLETED" &&
            "Completed Complaints"
          }

        </h3>


        {/* COMPLAINT LIST */}

        {filteredComplaints.length === 0 ? (

          <div className="empty-state">

            <p>

              {activeFilter === "ACTIVE" &&
                "You have no active complaints."
              }

              {activeFilter === "RESOLVED" &&
                "No complaints are waiting for verification."
              }

              {activeFilter === "COMPLETED" &&
                "You have no completed complaints."
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
                    <strong>Submitted:</strong>{" "}
                    {complaint.createdAt}
                  </p>


                  {/* TECHNICIAN RESOLUTION */}

                  {complaint.status === "RESOLVED" && (

                    <div className="resolution-display">

                      <p>
                        <strong>
                          Resolution:
                        </strong>{" "}

                        {complaint.resolutionDetails
                          || "No resolution details provided."
                        }

                      </p>

                      <button
                        className="primary-button"
                        onClick={() =>
                          onCompleteComplaint(
                            complaint.id
                          )
                        }
                      >
                        Mark as Completed
                      </button>

                    </div>

                  )}


                  {/* COMPLETED */}

                  {complaint.status === "COMPLETED" && (

                    <div className="resolution-display">

                      <p>
                        <strong>
                          Resolution:
                        </strong>{" "}

                        {complaint.resolutionDetails
                          || "No resolution details provided."
                        }

                      </p>

                      <p>
                        You have verified that the
                        issue has been resolved.
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

export default StudentDashboard;