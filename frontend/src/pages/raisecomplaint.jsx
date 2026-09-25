import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const COMPLAINTS_URL =
  `${API_BASE_URL}/complaints`;

const PROFILE_URL =
  `${API_BASE_URL}/users/me`;

const PRESIGN_URL =
  `${API_BASE_URL}/uploads/presign`;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


function RaiseComplaint({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [profile, setProfile] = useState(null);

  const [profileLoading, setProfileLoading] =
    useState(true);

  const [profileError, setProfileError] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  // ==========================================
  // LOAD STUDENT PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const { tokens } =
          await fetchAuthSession();

        const accessToken =
          tokens?.accessToken?.toString();

        if (!accessToken) {
          throw new Error(
            "No authenticated session found."
          );
        }

        const response = await fetch(
          PROFILE_URL,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData =
            await response
              .json()
              .catch(() => ({}));

          throw new Error(
            errorData.error ||
              "Failed to load student profile."
          );
        }

        const data =
          await response.json();

        setProfile(data);

      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );

        setProfileError(
          error.message ||
            "Could not load your profile."
        );

      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);


  // ==========================================
  // FORM HANDLING
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      })
    );
  };


  // ==========================================
  // IMAGE SELECTION
  // ==========================================

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      alert(
        "Please select a JPEG, PNG, or WebP image."
      );

      event.target.value = "";
      setSelectedFile(null);

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert(
        "Image must be smaller than 5 MB."
      );

      event.target.value = "";
      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  };


  // ==========================================
  // SUBMIT COMPLAINT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      // ---------------------------------------
      // Get Cognito token
      // ---------------------------------------

      const { tokens } =
        await fetchAuthSession();

      const accessToken =
        tokens?.accessToken?.toString();

      if (!accessToken) {
        throw new Error(
          "No authenticated session found. Please log in again."
        );
      }


      // ---------------------------------------
      // Upload image if one was selected
      // ---------------------------------------

      let imageKey = null;

      if (selectedFile) {
        console.log(
          "Requesting S3 upload URL..."
        );

        // Ask Lambda for a presigned URL.
        const presignResponse =
          await fetch(
            PRESIGN_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${accessToken}`,
              },

              body: JSON.stringify({
                fileName:
                  selectedFile.name,

                contentType:
                  selectedFile.type,
              }),
            }
          );

        if (!presignResponse.ok) {
          const errorData =
            await presignResponse
              .json()
              .catch(() => ({}));

          throw new Error(
            errorData.error ||
              "Failed to prepare image upload."
          );
        }

        const {
          uploadUrl,
          key,
        } =
          await presignResponse.json();


        console.log(
          "Uploading image to S3..."
        );

        // Upload directly to S3.
        const uploadResponse =
          await fetch(
            uploadUrl,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  selectedFile.type,
              },

              body: selectedFile,
            }
          );

        if (!uploadResponse.ok) {
          throw new Error(
            "Image upload failed."
          );
        }

        imageKey = key;

        console.log(
          "Image uploaded successfully:",
          imageKey
        );
      }


      // ---------------------------------------
      // Create complaint
      // ---------------------------------------

      const complaintPayload = {
        title: formData.title,

        category: formData.category,

        description:
          formData.description,

        imageKey: imageKey,
      };


      const response =
        await fetch(
          COMPLAINTS_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${accessToken}`,
            },

            body:
              JSON.stringify(
                complaintPayload
              ),
          }
        );


      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          errorData.error ||
            "Failed to submit complaint."
        );
      }


      const complaint =
        await response.json();


      console.log(
        "Complaint created:",
        complaint
      );


      onSubmit(complaint);

    } catch (error) {

      console.error(
        "Complaint submission error:",
        error
      );

      alert(
        error.message ||
          "Failed to submit complaint. Please try again."
      );

    } finally {

      setIsSubmitting(false);

    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Smart Hostel</h2>
          <span className="role-tag">Student View</span>
        </div>
        <div className="sidebar-bottom">
          <button className="secondary-button full-width" onClick={onBack}>
            Back to Dashboard
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-container">
          <header className="page-header">
            <h1>Raise a Complaint</h1>
            <p>Provide details about the maintenance issue.</p>
          </header>

          {/* ================================= */}
          {/* PROFILE INFORMATION */}
          {/* ================================= */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Hostel Block</label>
              {profileLoading ? (
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Loading...</p>
              ) : profileError ? (
                <p className="error-message" style={{ margin: 0 }}>{profileError}</p>
              ) : (
                <input 
                  type="text" 
                  value={profile?.hostelBlock || "N/A"} 
                  readOnly 
                  style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-muted)' }} 
                />
              )}
            </div>
            
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Room Number</label>
              {profileLoading ? (
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Loading...</p>
              ) : profileError ? (
                <p className="error-message" style={{ margin: 0 }}>{profileError}</p>
              ) : (
                <input 
                  type="text" 
                  value={profile?.roomNumber || "N/A"} 
                  readOnly 
                  style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-muted)' }} 
                />
              )}
            </div>
          </div>

          {/* ================================= */}
          {/* COMPLAINT FORM */}
          {/* ================================= */}
          <form className="complaint-form" onSubmit={handleSubmit}>
            
            {/* TITLE */}
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

            {/* CATEGORY */}
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Furniture">Furniture</option>
                <option value="Internet">Internet / Wi-Fi</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* DESCRIPTION */}
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

            {/* IMAGE */}
            <div className="form-group">
              <label>Attach Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                style={{ padding: '8px 12px' }}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', margin: '8px 0 0 0' }}>
                Optional. JPEG, PNG, or WebP. Maximum size: 5 MB.
              </p>
              {selectedFile && (
                <p style={{ fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="primary-button"
              disabled={
                isSubmitting ||
                profileLoading ||
                !!profileError ||
                !profile?.hostelBlock ||
                !profile?.roomNumber
              }
            >
              {isSubmitting
                ? selectedFile
                  ? "Uploading & Submitting..."
                  : "Submitting..."
                : "Submit Complaint"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}


export default RaiseComplaint;