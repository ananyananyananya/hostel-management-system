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

  const technician = technicians.find((tech) => tech.id === technicianId);
  const assignedComplaints = complaints.filter((c) => c.assignedTechnician === technicianId);
  
  const activeComplaints = assignedComplaints.filter((c) => c.status === "PENDING");
  const completedComplaints = assignedComplaints.filter((c) => c.status === "RESOLVED" || c.status === "COMPLETED");
  
  const displayedComplaints = activeFilter === "ACTIVE" ? activeComplaints : completedComplaints;

  const handleResolve = (complaintId) => {
    const resolution = resolutionText[complaintId]?.trim();
    if (!resolution) {
      alert("Please enter resolution details.");
      return;
    }
    onResolveComplaint(complaintId, resolution);
  };

  const getStatusClass = (status) => `status-badge status-${status.toLowerCase()}`;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Smart Hostel</h2>
          <span className="role-tag">Technician</span>
        </div>
        
        <div style={{ padding: '0 8px 16px 8px', color: 'var(--slate)', fontSize: '14px', fontWeight: '500' }}>
          {technician?.name}
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '400', marginTop: '4px' }}>
            {technician?.specialization}
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeFilter === "ACTIVE" ? "active" : ""}`} onClick={() => setActiveFilter("ACTIVE")}>
            Pending Tasks
            <span className="filter-count">{activeComplaints.length}</span>
          </button>
          <button className={`nav-item ${activeFilter === "COMPLETED" ? "active" : ""}`} onClick={() => setActiveFilter("COMPLETED")}>
            Completed Repairs
            <span className="filter-count">{completedComplaints.length}</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item logout-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-container">
          <header className="page-header">
            <h1>{activeFilter === "ACTIVE" ? "Your Tasks" : "Completed Repairs"}</h1>
            <p>Manage your assigned maintenance jobs.</p>
          </header>

          {displayedComplaints.length === 0 ? (
            <div className="empty-state">
              You have no {activeFilter === "ACTIVE" ? "pending tasks" : "completed jobs"}.
            </div>
          ) : (
            <div className="complaints-list">
              {displayedComplaints.map((complaint) => (
                <div className="complaint-card" key={complaint.id}>
                  <div className="complaint-header">
                    <h3>{complaint.title}</h3>
                    <span className={getStatusClass(complaint.status === "PENDING" ? "PENDING" : complaint.status)}>
                      {complaint.status === "PENDING" ? "PENDING" : complaint.status}
                    </span>
                  </div>
                  
                  <div className="complaint-meta">
                    <span><strong>Priority:</strong> {complaint.priority}</span>
                    <span><strong>Location:</strong> {complaint.hostelBlock} - {complaint.roomNumber}</span>
                    <span><strong>Reported:</strong> {complaint.createdAt}</span>
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

                  {complaint.status === "PENDING" && (
                    <div className="resolution-section">
                      <div className="form-group">
                        <label>Repair Details</label>
                        <textarea
                          value={resolutionText[complaint.id] || ""}
                          onChange={(e) => setResolutionText({ ...resolutionText, [complaint.id]: e.target.value })}
                          placeholder="What did you fix?"
                          rows="3"
                        />
                        <button className="primary-button" onClick={() => handleResolve(complaint.id)}>
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  )}

                  {(complaint.status === "RESOLVED" || complaint.status === "COMPLETED") && (
                    <div className="resolution-box">
                      <h4>Your Resolution</h4>
                      <p>{complaint.resolutionDetails}</p>
                      <p style={{ marginTop: '8px', fontSize: '12px' }}>
                        {complaint.status === "RESOLVED" ? "Awaiting student verification." : "Verified by student."}
                      </p>
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

export default TechnicianDashboard;