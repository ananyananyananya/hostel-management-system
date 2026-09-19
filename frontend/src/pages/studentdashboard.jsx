import { useState } from "react";

function StudentDashboard({
  onLogout,
  onRaiseComplaint,
  complaints,
  onCompleteComplaint,
  onFollowUpComplaint
}) {

  const [activeFilter, setActiveFilter] =
    useState("ACTIVE");

  const [followUpText, setFollowUpText] =
    useState({});

  const [followUpOpen, setFollowUpOpen] =
    useState({});


  /*
    ACTIVE:
    OPEN + PENDING

    RESOLVED:
    Waiting for student verification

    COMPLETED:
    Student has verified the repair
  */

  const filteredComplaints =
    complaints.filter((complaint) => {

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
    });


  /* Open/close follow-up form */

  const toggleFollowUp = (complaintId) => {

    setFollowUpOpen({
      ...followUpOpen,
      [complaintId]:
        !followUpOpen[complaintId]
    });

  };


  /* Store follow-up text */

  const handleFollowUpTextChange = (
    complaintId,
    value
  ) => {

    setFollowUpText({
      ...followUpText,
      [complaintId]: value
    });

  };


  /* Submit follow-up */

  const handleSubmitFollowUp = (
    complaintId
  ) => {

    const reason =
      followUpText[complaintId]?.trim();

    if (!reason) {

      alert(
        "Please describe the issue before submitting a follow-up request."
      );

      return;
    }

    onFollowUpComplaint(
      complaintId,
      reason
    );

    // Close the form
    setFollowUpOpen({
      ...followUpOpen,
      [complaintId]: false
    });

    // Clear text
    setFollowUpText({
      ...followUpText,
      [complaintId]: ""
    });

  };


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
            Report a hostel maintenance issue
            and track its progress until it is
            completed.
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


        {/* COMPLAINTS */}

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

                      {complaint.status}

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


                  {/* RESOLVED */}

                  {complaint.status === "RESOLVED" && (

                    <div className="resolution-display">

                      <p>
                        <strong>
                          Resolution:
                        </strong>{" "}

                        {complaint.resolutionDetails ||
                          "No resolution details provided."
                        }

                      </p>


                      <div className="resolution-actions">

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


                        <button
                          className="secondary-button"
                          onClick={() =>
                            toggleFollowUp(
                              complaint.id
                            )
                          }
                        >
                          Request Follow-up
                        </button>

                      </div>


                      {/* FOLLOW-UP FORM */}

                      {followUpOpen[
                        complaint.id
                      ] && (

                        <div className="follow-up-section">

                          <h4>
                            Request Follow-up
                          </h4>

                          <p>
                            Tell us what is still
                            wrong with the issue.
                          </p>

                          <textarea
                            value={
                              followUpText[
                                complaint.id
                              ] || ""
                            }
                            onChange={(event) =>
                              handleFollowUpTextChange(
                                complaint.id,
                                event.target.value
                              )
                            }
                            placeholder="e.g. The fan is still making the same noise..."
                            rows="4"
                          />

                          <button
                            className="primary-button"
                            onClick={() =>
                              handleSubmitFollowUp(
                                complaint.id
                              )
                            }
                          >
                            Submit Follow-up
                          </button>

                        </div>

                      )}

                    </div>

                  )}


                  {/* COMPLETED */}

                  {complaint.status === "COMPLETED" && (

                    <div className="resolution-display">

                      <p>
                        <strong>
                          Resolution:
                        </strong>{" "}

                        {complaint.resolutionDetails ||
                          "No resolution details provided."
                        }

                      </p>

                      <p>
                        You have verified that the
                        issue has been resolved.
                      </p>

                    </div>

                  )}


                  {/* FOLLOW-UP NOTICE */}

                  {complaint.status === "PENDING" &&
                    complaint.followUpRequested && (

                    <div className="resolution-display">

                      <p>
                        <strong>
                          Follow-up requested:
                        </strong>{" "}

                        {complaint.followUpReason}

                      </p>

                      <p>
                        The issue has been sent back
                        for further attention.
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