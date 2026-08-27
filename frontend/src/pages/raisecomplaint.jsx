import { useState } from "react";

function raisecomplaint({ onBack, onSubmit }) {

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    hostelBlock: "",
    roomNumber: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const complaint = {
      id: Date.now(),
      ...formData,
      status: "OPEN",
      priority: "PENDING",
      createdAt: new Date().toLocaleString(),
    };

    onSubmit(complaint);
  };

  return (
    <div className="dashboard">

      <header className="navbar">
        <h1>Smart Hostel</h1>

        <button
          className="logout-button"
          onClick={onBack}
        >
          Back
        </button>
      </header>

      <main className="dashboard-content">

        <h2>Raise a Complaint</h2>

        <p className="dashboard-subtitle">
          Provide details about the maintenance issue.
        </p>

        <form
          className="complaint-form"
          onSubmit={handleSubmit}
        >

          {/* Complaint Title */}

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

          {/* Category */}

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >

              <option value="">
                Select a category
              </option>

              <option value="Plumbing">
                Plumbing
              </option>

              <option value="Electrical">
                Electrical
              </option>

              <option value="Furniture">
                Furniture
              </option>

              <option value="Internet">
                Internet / Wi-Fi
              </option>

              <option value="Cleaning">
                Cleaning
              </option>

              <option value="Other">
                Other
              </option>

            </select>
          </div>

          {/* Description */}

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              rows="5"
              required
            />
          </div>

          {/* Hostel Block */}

          <div className="form-group">
            <label>Hostel Block</label>

            <select
              name="hostelBlock"
              value={formData.hostelBlock}
              onChange={handleChange}
              required
            >

              <option value="">
                Select hostel block
              </option>

              <option value="Block A">
                Block A
              </option>

              <option value="Block B">
                Block B
              </option>

              <option value="Block C">
                Block C
              </option>

            </select>
          </div>

          {/* Room Number */}

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

          {/* Submit */}

          <button
            type="submit"
            className="primary-button"
          >
            Submit Complaint
          </button>

        </form>

      </main>

    </div>
  );
}

export default raisecomplaint;