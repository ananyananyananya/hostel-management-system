import { useState } from "react";

function WardenDashboard({
  complaints,
  onLogout,
  onUpdateComplaint,
  onAssignTechnician,
  technicians
}) {
  const [activeFilter, setActiveFilter] = useState("ACTIVE");

  const openComplaints = complaints.filter(c => c.status === "OPEN").length;
  const pendingComplaints = complaints.filter(c => c.status === "PENDING").length;
  const resolvedComplaints = complaints.filter(c => c.status === "RESOLVED").length;
  const completedComplaints = complaints.filter(c => c.status === "COMPLETED").length;

  const filteredComplaints = complaints.filter((complaint) => {
    if (activeFilter === "ACTIVE") return complaint.status === "OPEN" || complaint.status === "PENDING";
    if (activeFilter === "OPEN") return complaint.status === "OPEN";
    if (activeFilter === "PENDING") return complaint.status === "PENDING";
    if (activeFilter === "RESOLVED") return complaint.status === "RESOLVED";
    if (activeFilter === "COMPLETED") return complaint.status === "COMPLETED";
    return true;
  });

  const getSectionTitle = () => {
    const titles = {
      ACTIVE: "Action Required",
      OPEN: "Unassigned Complaints",
      PENDING: "Work in Progress",
      RESOLVED: "Awaiting Verification",
      COMPLETED: "Completed History"
    };
    return titles[activeFilter];
  };

  const getStatusClass = (status) => `status-badge status-${status.toLowerCase()}`;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Smart Hostel</h2>
          <span className="role-tag">Warden</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeFilter === "ACTIVE" ? "active" : ""}`} onClick={() => setActiveFilter("ACTIVE")}>
            Active
            <span className="filter-count">{openComplaints + pendingComplaints}</span>
          </button>
          <button className={`nav-item ${activeFilter === "OPEN" ? "active" : ""}`} onClick={() => setActiveFilter("OPEN")}>
            Unassigned
            <span className="filter-count">{openComplaints}</span>
          </button>
          <button className={`nav-item ${activeFilter === "PENDING" ? "active" : ""}`} onClick={() => setActiveFilter("PENDING")}>
            In Progress
            <span className="filter-count">{pendingComplaints}</span>
          </button>
          <button className={`nav-item ${activeFilter === "RESOLVED" ? "active" : ""}`} onClick={() => setActiveFilter("RESOLVED")}>
            To Verify
            <span className="filter-count">{resolvedComplaints}</span>
          </button>
          <button className={`nav-item ${activeFilter === "COMPLETED" ? "active" : ""}`} onClick={() => setActiveFilter("COMPLETED")}>
            Completed
            <span className="filter-count">{completedComplaints}</span>
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
            <h1>Warden Dashboard</h1>
            <p>Monitor operations and delegate maintenance jobs.</p>
          </header>

          <div className="stats-grid">
            <div className="stat-card">
              <p>Total Complaints</p>
              <h3>{complaints.length}</h3>
            </div>
            <div className="stat-card">
              <p>Unassigned</p>
              <h3>{openComplaints}</h3>
            </div>
            <div className="stat-card">
              <p>In Progress</p>
              <h3>{pendingComplaints}</h3>
            </div>
          </div>

          <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>{getSectionTitle()}</h2>

          {filteredComplaints.length === 0 ? (
            <div className="empty-state">
              No records found in this category.
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
                    <span><strong>Location:</strong> {complaint.hostelBlock} - {complaint.roomNumber}</span>
                    <span><strong>Submitted:</strong> {complaint.createdAt}</span>
                  </div>
                  
                  <div className="complaint-description">
                    {complaint.description}
                  </div>

                  <div className="complaint-controls">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Priority</label>
                      <select
                        value={complaint.priority}
                        onChange={(e) => onUpdateComplaint(complaint.id, { priority: e.target.value })}
                      >
                        <option value="PENDING">Select</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Assign Technician</label>
                      <select
                        value={complaint.assignedTechnician || ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? null : Number(e.target.value);
                          onAssignTechnician(complaint.id, val);
                        }}
                      >
                        <option value="">Unassigned</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name} - {tech.specialization}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {complaint.resolutionDetails && (
                    <div className="resolution-box">
                      <h4>Resolution Record</h4>
                      <p>{complaint.resolutionDetails}</p>
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

export default WardenDashboard;