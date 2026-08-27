function studentdashboard({ onLogout, onRaiseComplaint }) {
  return (
    <div className="dashboard">

      <header className="navbar">

        <div>
          <h1>Smart Hostel</h1>
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>

      <main className="dashboard-content">

        <h2>Student Dashboard</h2>

        <p className="dashboard-subtitle">
          Welcome! Track and manage your hostel maintenance complaints.
        </p>

        <div className="welcome-card">

          <h3>Need something fixed?</h3>

          <p>
            Report a hostel maintenance issue and track its progress
            until it is resolved.
          </p>

          <button
            className="primary-button"
            onClick={onRaiseComplaint}
          >
            + Raise a Complaint
          </button>

        </div>

        <h3>My Complaints</h3>

        <div className="empty-state">
          <p>You haven't submitted any complaints yet.</p>
        </div>

      </main>

    </div>
  );
}

export default studentdashboard;