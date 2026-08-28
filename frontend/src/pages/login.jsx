function login({ onLogin }) {

  const handleSubmit = (event) => {
    event.preventDefault();

    const role = event.target.role.value;

    onLogin(role);
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>Smart Hostel</h1>

        <p className="subtitle">
          Hostel Complaint Management System
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your college email ID"
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              required
            />

          </div>

          <div className="form-group">

            <label>Login as</label>

            <select name="role" defaultValue="select">

              <option value="select" disabled>
                Select Role
              </option>

              <option value="student">
                Student
              </option>

              <option value="warden">
                Warden
              </option>

            </select>

          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account? <span>Register</span>
        </p>

      </div>

    </div>
  );
}

export default login;