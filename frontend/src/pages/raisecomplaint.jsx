import { useState } from "react";

function RaiseComplaint({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    hostelBlock: "",
    roomNumber: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const complaint = {
      id: Date.now(),
      ...formData,
      status: "OPEN",
      priority: "PENDING",
      assignedTechnician: null,
      resolutionDetails: "",
      followUpRequested: false,
      followUpReason: "",
      followUpCount: 0,
      createdAt: new Date().toLocaleString(),
    };
    onSubmit(complaint);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Smart Hostel</h2>
          <span className="role-tag">Student</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-container" style={{ maxWidth: '600px' }}>
          <header className="page-header">
            <h1>New Complaint</h1>
            <p>Provide details about the issue so we can assign the right technician.</p>
          </header>

          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', padding: '32px', borderRadius: '8px' }}>
            <div className="form-group">
              <label>Complaint Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Bathroom tap leaking"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Furniture">Furniture</option>
                <option value="Internet">Internet / Wi-Fi</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hostel Block</label>
              <select name="hostelBlock" value={formData.hostelBlock} onChange={handleChange} required>
                <option value="">Select block</option>
                <option value="LH A">LH-A</option>
                <option value="LH B">LH-B</option>
                <option value="LH C">LH-C</option>
              </select>
            </div>

            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 302"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide any helpful details..."
                rows="4"
                required
              />
            </div>

            <button type="submit" className="primary-button full-width" style={{ marginTop: '16px' }}>
              Submit Request
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RaiseComplaint;