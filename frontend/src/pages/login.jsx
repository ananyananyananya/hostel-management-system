function Login({ onLogin, technicians }) {

  const handleSubmit = (event) => {

    event.preventDefault();

    const role = event.target.role.value;

    let technicianId = null;

    if (role === "technician") {
      technicianId = Number(
        event.target.technician.value
      );
    }

    onLogin(role, technicianId);
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>Smart Hostel</h1>

        <p className="subtitle">
          Hostel Maintenance Management System
        </p>


        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              required
            />

          </div>


          {/* ROLE */}

          <div className="form-group">

            <label>Login as</label>

            <select
              name="role"
              defaultValue="student"
            >

              <option value="student">
                Student
              </option>

              <option value="warden">
                Warden
              </option>

              <option value="technician">
                Technician
              </option>

            </select>

          </div>


          {/* TECHNICIAN SELECTION */}

          <div className="form-group">

            <label>Technician</label>

            <select
              name="technician"
              defaultValue="1"
            >

              {technicians.map((tech) => (

                <option
                  key={tech.id}
                  value={tech.id}
                >
                  {tech.name} - {tech.specialization}
                </option>

              ))}

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

export default Login;