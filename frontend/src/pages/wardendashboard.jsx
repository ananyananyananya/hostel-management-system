function wardendashboard({ complaints, onLogout }) {
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

  return (
    <div className="dashboard">

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

        {/* Statistics */}

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
            <p>In Progress</p>
          </div>

          <div className="stat-card">
            <h3>{resolvedComplaints}</h3>
            <p>Resolved</p>
          </div>

        </div>

        {/* Complaints */}

        <h3>All Complaints</h3>

        {complaints.length === 0 ? (

          <div className="empty-state">
            <p>
              No complaints have been submitted yet.
            </p>
          </div>

        ) : (

          <div className="complaints-list">

            {complaints.map((complaint) => (

              <div
                className="complaint-card"
                key={complaint.id}
              >

                <div className="complaint-header">

                  <h3>{complaint.title}</h3>

                  <span className="status-badge">
                    {complaint.status}
                  </span>

                </div>

                <p>
                  <strong>Category:</strong>{" "}
                  {complaint.category}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {complaint.hostelBlock}{"-"}{complaint.roomNumber}
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

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default wardendashboard;