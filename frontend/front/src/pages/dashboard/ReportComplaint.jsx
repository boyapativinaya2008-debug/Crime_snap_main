import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

import "../../styles/report.css";
import bg from "../../assets/auth-bg.jpeg";

export default function ReportComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    image: null
  });

  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("⚠️ Please login first");
        setLoading(false);
        return;
      }

      if (!form.image) {
        setMessage("⚠️ Please upload evidence image");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("evidence", form.image);

      await API.post("/complaints", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLoading(false);
      setMessage("✅ Complaint submitted successfully!");

      setTimeout(() => {
        navigate("/dashboard/my-complaints");
      }, 1200);

    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage(err.response?.data?.msg || "❌ Failed to submit complaint");
    }
  };

  return (
    <div
      className="report-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="report-card">
        <h2>📢 Report Complaint</h2>

        {message && <div className="status-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Complaint Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Theft & Robbery">Theft & Robbery</option>
            <option value="Harassment & Bullying">Harassment & Bullying</option>
            <option value="Cybercrime">Cybercrime</option>
            <option value="Domestic Violence">Domestic Violence</option>
            <option value="Traffic Violations">Traffic Violations</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Describe the issue..."
            value={form.description}
            onChange={handleChange}
            required
          />

          <label className="upload-btn">
            📷 Upload Evidence
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </label>

          {/* FIXED IMAGE PREVIEW */}
          {preview && (
            <div className="preview-wrapper">
              <img src={preview} alt="preview" className="image-preview" />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "🚀 Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}