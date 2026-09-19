import { useState } from "react";

function Login({ onLogin, technicians }) {

  const [role, setRole] = useState("student");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [technicianId, setTechnicianId] = useState(
    technicians[0]?.id || ""
  );


  const handleSubmit = (event) => {

    event.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    if (role === "technician" && !technicianId) {
      alert("Please select a technician.");
      return;
    }

    const selectedTechnicianId =
      role === "technician"
        ? Number(technicianId)
        : null;

    onLogin(
      role,
      selectedTechnicianId
    );
  };


  const handleRoleChange = (event) => {

    const selectedRole = event.target.value;

    setRole(selectedRole);

    // Reset technician selection when changing roles
    if (selectedRole !== "technician") {
      setTechnicianId(
        technicians[0]?.id || ""
      );
    }
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

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
            />

          </div>


          {/* ROLE */}

          <div className="form-group">

            <label htmlFor="role">
              Login as
            </label>

            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
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


          {/* TECHNICIAN */}

          {role === "technician" && (

            <div className="form-group">

              <label htmlFor="technician">
                Technician
              </label>

              <select
                id="technician"
                value={technicianId}
                onChange={(event) =>
                  setTechnicianId(
                    event.target.value
                  )
                }
              >

                {technicians.map((tech) => (

                  <option
                    key={tech.id}
                    value={tech.id}
                  >
                    {tech.name} -{" "}
                    {tech.specialization}
                  </option>

                ))}

              </select>

            </div>

          )}


          {/* LOGIN */}

          <button type="submit">
            Login
          </button>

        </form>


        <p className="register-text">
          Don't have an account?{" "}
          <span>Register</span>
        </p>

      </div>

    </div>
  );
}

export default Login;