function login({ onLogin }) {
  return (
    <div className="login-page">
      <div className="login-box">

        <h1>Smart Hostel</h1>

        <p className="subtitle">
          Hostel Maintenance Management System
        </p>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <button onClick={onLogin}>
          Login
        </button>

        <p className="register-text">
          Don't have an account? <span>Register</span>
        </p>

      </div>
    </div>
  );
}

export default login;