function StudentDashboard({
  onLogout,
  onRaiseComplaint,
  complaints
}) {

  return (
    <div className="dashboard">

      <header className="navbar">

        <h1>Smart Hostel</h1>

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
          Welcome! Track and manage your hostel complaints.
        </p>

        <div className="welcome-card">

          <h3>Need something fixed?</h3>

          <p>
            Report a hostel maintenance issue and track its progress until its resolved.
          </p>

          <button
            className="primary-button"
            onClick={onRaiseComplaint}
          >
            + Raise a Complaint
          </button>

        </div>

        <h3>My Complaints</h3>

        {complaints.length === 0 ? (

          <div className="empty-state">
            <p>
              You haven't submitted any complaints yet.
            </p>
          </div>

        ) : (

          <div className="complaints-list">

            {complaints.map((complaint) => (

              <div
                className="complaint-card"
                key={complaint.id}
              >

                <h3>{complaint.title}</h3>

                <p>
                  <strong>Category:</strong>{" "}
                  {complaint.category}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {complaint.hostelBlock},{" "}
                  Room {complaint.roomNumber}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {complaint.status}
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

export default StudentDashboard;