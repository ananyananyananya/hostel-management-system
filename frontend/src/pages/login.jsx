import { useState } from "react";

function Login({ onLogin, technicians }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [technicianId, setTechnicianId] = useState(technicians[0]?.id || "");

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
    const selectedTechnicianId = role === "technician" ? Number(technicianId) : null;
    onLogin(role, selectedTechnicianId);
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);
    if (selectedRole !== "technician") {
      setTechnicianId(technicians[0]?.id || "");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Smart Hostel</h1>
        <p>Log in to manage your workspace.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Login as</label>
            <select id="role" value={role} onChange={handleRoleChange}>
              <option value="student">Student</option>
              <option value="warden">Warden</option>
              <option value="technician">Technician</option>
            </select>
          </div>
          
          {role === "technician" && (
            <div className="form-group">
              <label htmlFor="technician">Select Profile</label>
              <select
                id="technician"
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
              >
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} - {tech.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <button className="primary-button full-width" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;