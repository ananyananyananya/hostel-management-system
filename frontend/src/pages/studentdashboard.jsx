import { useState } from "react";

function StudentDashboard({
  onLogout,
  onRaiseComplaint,
  complaints,
  onCompleteComplaint,
  onFollowUpComplaint
}) {
  const [activeFilter, setActiveFilter] = useState("ACTIVE");
  const [followUpText, setFollowUpText] = useState({});
  const [followUpOpen, setFollowUpOpen] = useState({});

  const filteredComplaints = complaints.filter((complaint) => {
    if (activeFilter === "ACTIVE") return complaint.status === "OPEN" || complaint.status === "PENDING";
    if (activeFilter === "RESOLVED") return complaint.status === "RESOLVED";
    if (activeFilter === "COMPLETED") return complaint.status === "COMPLETED";
    return true;
  });

  const toggleFollowUp = (complaintId) => {
    setFollowUpOpen({ ...followUpOpen, [complaintId]: !followUpOpen[complaintId] });
  };

  const handleFollowUpTextChange = (complaintId, value) => {
    setFollowUpText({ ...followUpText, [complaintId]: value });
  };

  const handleSubmitFollowUp = (complaintId) => {
    const reason = followUpText[complaintId]?.trim();
    if (!reason) {
      alert("Please describe the issue before submitting a follow-up request.");
      return;
    }
    onFollowUpComplaint(complaintId, reason);
    setFollowUpOpen({ ...followUpOpen, [complaintId]: false });
    setFollowUpText({ ...followUpText, [complaintId]: "" });
  };

  const getStatusClass = (status) => `status-badge status-${status.toLowerCase()}`;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Smart Hostel</h2>
          <span className="role-tag">Student</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeFilter === "ACTIVE" ? "active" : ""}`} onClick={() => setActiveFilter("ACTIVE")}>
            Active
          </button>
          <button className={`nav-item ${activeFilter === "RESOLVED" ? "active" : ""}`} onClick={() => setActiveFilter("RESOLVED")}>
            Needs Verification
          </button>
          <button className={`nav-item ${activeFilter === "COMPLETED" ? "active" : ""}`} onClick={() => setActiveFilter("COMPLETED")}>
            Completed
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="primary-button full-width" onClick={onRaiseComplaint}>
            + New Complaint
          </button>
          <button className="nav-item logout-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-container">
          <header className="page-header">
            <h1>
              {activeFilter === "ACTIVE" && "Active Complaints"}
              {activeFilter === "RESOLVED" && "Review Resolutions"}
              {activeFilter === "COMPLETED" && "Completed History"}
            </h1>
            <p>Track and manage your hostel maintenance requests.</p>
          </header>

          {filteredComplaints.length === 0 ? (
            <div className="empty-state">
              No {activeFilter.toLowerCase()} complaints to display.
            </div>
          ) : (
            <div className="complaints-list">
              {filteredComplaints.map((complaint) => (
                <div className="complaint-card" key={complaint.id}>
                  <div className="complaint-header">
                    <h3>{complaint.title}</h3>
                    <span className={getStatusClass(complaint.status)}>{complaint.status}</span>
                  </div>
                  
                  <div className="complaint-meta">
                    <span><strong>Category:</strong> {complaint.category}</span>
                    <span><strong>Room:</strong> {complaint.hostelBlock} - {complaint.roomNumber}</span>
                    <span><strong>Date:</strong> {complaint.createdAt}</span>
                  </div>
                  
                  <div className="complaint-description">
  {complaint.description}
</div>

{complaint.imageUrl && (
  <div className="complaint-image">
    <p>
      <strong>Attached Image</strong>
    </p>

    <img
      src={complaint.imageUrl}
      alt={`Attachment for ${complaint.title}`}
    />
  </div>
)}

                  {complaint.status === "RESOLVED" && (
                    <div className="resolution-box">
                      <h4>Resolution Provided</h4>
                      <p>{complaint.resolutionDetails || "No details provided."}</p>
                      
                      <div className="resolution-actions">
                        <button className="primary-button" onClick={() => onCompleteComplaint(complaint.id)}>
                          Accept & Complete
                        </button>
                        <button className="secondary-button" onClick={() => toggleFollowUp(complaint.id)}>
                          Follow Up
                        </button>
                      </div>

                      {followUpOpen[complaint.id] && (
                        <div className="form-group" style={{ marginTop: '16px' }}>
                          <textarea
                            value={followUpText[complaint.id] || ""}
                            onChange={(e) => handleFollowUpTextChange(complaint.id, e.target.value)}
                            placeholder="Explain what is still wrong..."
                            rows="3"
                          />
                          <button className="primary-button" onClick={() => handleSubmitFollowUp(complaint.id)}>
                            Submit Follow-up
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {complaint.status === "COMPLETED" && (
                    <div className="resolution-box">
                      <h4>Resolution Verified</h4>
                      <p>{complaint.resolutionDetails || "Issue was resolved."}</p>
                    </div>
                  )}

                  {complaint.status === "PENDING" && complaint.followUpRequested && (
                    <div className="resolution-box">
                      <h4>Follow-up Requested</h4>
                      <p>{complaint.followUpReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;