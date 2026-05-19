import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUser,
} from "react-icons/fa";

import API from "../api/api";

import "../styles/adminregister.css";
import bg from "../assets/auth-bg.jpeg";
import logo from "../assets/logo.png";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* INPUT */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  /* PASSWORD MATCH */
  const passwordsMatch =
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.adminCode
    ) {
      return setError("All fields are required.");
    }

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    if (!passwordsMatch) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        adminCode: form.adminCode,
        agree: true,
        role: "admin",
      });

      console.log("Admin register success:", res.data);

      setSuccess("✅ Admin account created successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        adminCode: "",
      });

      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (err) {
      console.error("Admin register error:", err);

      setError(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      {/* BACKGROUND */}
      <div
        className="auth-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* LOGO */}
      <div className="page-logo">
        <img src={logo} alt="logo" />
      </div>

      {/* LEFT */}
      <div className="auth-left">
        <div className="quote-box">
          <h1>Admin Registration</h1>
          <h1>Manage CrimeSnap System</h1>
          <p>
            <i>
              "Create admin accounts and manage complaints, officers and reports"
            </i>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-box">

          <h2>🛡️ Admin Register</h2>

          {error && <p className="auth-error-msg">{error}</p>}
          {success && <p className="auth-success-msg">{success}</p>}

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* PHONE */}
            <div className="input-group">
              <FaPhone className="input-icon" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password (Min 8 chars)"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* CONFIRM */}
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* ADMIN CODE */}
            <div className="input-group">
              <FaUserShield className="input-icon" />
              <input
                type="text"
                name="adminCode"
                placeholder="Admin Security Code"
                value={form.adminCode}
                onChange={handleChange}
              />
            </div>

            {/* MATCH TEXT */}
            {form.confirmPassword.length > 0 && (
              <p className={passwordsMatch ? "match" : "no-match"}>
                {passwordsMatch
                  ? "Passwords match ✔"
                  : "Passwords do not match ❌"}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="auth-btn"
              disabled={
                loading ||
                !passwordsMatch ||
                form.password.length < 8
              }
            >
              {loading ? "Processing..." : "Create Admin"}
            </button>

          </form>

          {/* LINK */}
          <div className="auth-link">
            Already have an admin account?{" "}
            <Link to="/admin/login">Login</Link>
          </div>

        </div>
      </div>
    </div>
  );
}