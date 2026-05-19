import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

import "../../styles/dashboardHome.css";

export default function DashboardHome() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "User",
    email: ""
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem("token");

        // USER
        const userRes = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(userRes.data);

        // COMPLAINTS
        const complaintRes = await API.get("/complaints/my", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const complaints = complaintRes.data;

        const total = complaints.length;
        const pending = complaints.filter(c => c.status === "Pending").length;
        const resolved = complaints.filter(c => c.status === "Resolved").length;

        setStats({ total, pending, resolved });

      } catch (err) {
        console.log("Dashboard error:", err.response?.data || err);
      }
    };

    fetchData();

  }, []);

  return (
    <div className="home-container">

      <div className="home-card">

        {/* HEADER */}
        <div className="top-section">

          <div>
            <h1>👋 Welcome, {user.name}</h1>
            <p className="subtitle">
              Manage complaints and improve your city smarter.
            </p>
          </div>

          <div
            className="profile-circle"
            onClick={() => navigate("/dashboard/profile")}
          >
            👤
          </div>

        </div>

        {/* STATS */}
        <div className="stats-row">

          <div className="mini-card">
            <h2>{stats.total}</h2>
            <p>Total Complaints</p>
          </div>

          <div className="mini-card">
            <h2>{stats.pending}</h2>
            <p>Pending Cases</p>
          </div>

          <div className="mini-card">
            <h2>{stats.resolved}</h2>
            <p>Resolved Cases</p>
          </div>

        </div>

        {/* FEATURES */}
        <div className="card-grid">

          <div className="stat-card" onClick={() => navigate("/dashboard/report")}>
            📢 <h3>Report Complaint</h3>
          </div>

          <div className="stat-card" onClick={() => navigate("/dashboard/my-complaints")}>
            📄 <h3>My Complaints</h3>
          </div>

          <div className="stat-card" onClick={() => navigate("/dashboard/track-status")}>
            📊 <h3>Track Status</h3>
          </div>

          <div className="stat-card" onClick={() => navigate("/dashboard/profile")}>
            👤 <h3>My Profile</h3>
          </div>

        </div>

      </div>

    </div>
  );
}