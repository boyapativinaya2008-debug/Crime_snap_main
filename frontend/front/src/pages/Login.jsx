import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaUserShield } from "react-icons/fa";

import API from "../api/api";

import "../styles/auth.css";
import bg from "../assets/auth-bg.jpeg";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        ...form,
        role,
      });

      // save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      {/* BACKGROUND */}
      <div className="auth-bg" style={{ backgroundImage: `url(${bg})` }}></div>

      {/* LOGO */}
      <div className="page-logo">
        <img src={logo} alt="logo" />
      </div>

      {/* LEFT */}
      <div className="auth-left">
        <div className="quote-box">
          <h1>Welcome Back 👋</h1>
          <p>
            Your voice can improve your city. Login to continue reporting issues.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-box">

          {/* ROLE TOGGLE */}
          <div className="role-toggle">

            <button
              type="button"
              className={role === "user" ? "role-btn active" : "role-btn"}
              onClick={() => setRole("user")}
            >
              <FaUser /> User
            </button>

            <button
              type="button"
              className={role === "admin" ? "role-btn active" : "role-btn"}
              onClick={() => setRole("admin")}
            >
              <FaUserShield /> Admin
            </button>

          </div>

          <h2>{role === "admin" ? "Admin Login" : "User Login"}</h2>

          {/* ERROR */}
          {error && <p className="auth-error-msg">{error}</p>}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* BUTTON */}
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : `Login as ${role}`}
            </button>

          </form>

          {/* LINKS */}
          {role === "user" && (
            <div className="auth-link">
              New user? <Link to="/register">Register</Link>
            </div>
          )}

          {role === "admin" && (
            <div className="auth-link">
              New admin? <Link to="/admin/register">Register</Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}