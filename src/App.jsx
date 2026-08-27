import "./App.css";

function App() {
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo">
          <span>HC</span>
        </div>

        <h1>HostelCare</h1>
        <p className="subtitle">
          Smart Hostel Maintenance Management
        </p>

        <form>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your college email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label>Login as</label>

            <select>
              <option>Student</option>
              <option>Warden</option>
              <option>Technician</option>
            </select>
          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <p className="footer-text">
          Hostel Maintenance & Complaint Management System
        </p>

      </div>

    </div>
  );
}

export default App;