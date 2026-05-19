import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaUserShield,
} from "react-icons/fa";

import api from "../api/api";

import "../styles/adminlogin.css";

import bg from "../assets/auth-bg.jpeg";
import logo from "../assets/logo.png";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPass, setShowPass] =
    useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    if (
      !form.email ||
      !form.password
    ) {

      return setError(
        "All fields are required."
      );
    }

    try {

      setLoading(true);

      const res =
        await api.post(
          "/admin/login",
          form
        );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      navigate(
        "/admin/dashboard"
      );

    } catch (err) {

      setError(

        err.response?.data
          ?.message ||

        err.response?.data
          ?.msg ||

        "Login failed"

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
        style={{
          backgroundImage:
            `url(${bg})`,
        }}
      ></div>

      {/* LOGO */}

      <div className="page-logo">

        <img
          src={logo}
          alt="logo"
        />

      </div>

      {/* LEFT SIDE */}

      <div className="auth-left">

        <div className="quote-box">

          <h1>
            Admin Control Panel
          </h1>

          <h1>
            Secure City Monitoring
          </h1>

          <p>
            <i>
              "Manage complaints,
              officers, reports,
              and civic operations
              in real-time"
            </i>
          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="auth-right">

        <div className="auth-box">

          <h2>
            <FaUserShield />
            {" "}
            Admin Login
          </h2>

          {/* ERROR */}

          {error && (

            <p className="auth-error-msg">

              {error}

            </p>

          )}

          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
          >

            {/* EMAIL */}

            <div className="input-group">

              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={form.email}
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="input-group">

              <FaLock className="input-icon" />

              <input
                type={
                  showPass
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                required
              />

              <span
                className="show-pass"
                onClick={() =>
                  setShowPass(
                    !showPass
                  )
                }
              >

                {showPass
                  ? "🙈"
                  : "👁️"}

              </span>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >

              {loading
                ? "Signing In..."
                : "Login as Admin"}

            </button>

          </form>

          {/* LINKS */}

          <div className="auth-link">

            Don't have an admin
            account?{" "}

            <Link to="/admin/register">

              Register

            </Link>

          </div>

          <div className="auth-link">

            Are you a user?{" "}

            <Link to="/login">

              User Login

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}