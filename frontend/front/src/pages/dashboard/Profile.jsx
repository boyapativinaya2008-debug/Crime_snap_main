import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

import "../../styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
  });

  const [complaintsCount, setComplaintsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        // USER API
        const userRes = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(userRes.data);

        // COMPLAINTS API
        const compRes = await API.get("/complaints/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("COMPLAINTS:", compRes.data);

        setComplaintsCount(
          Array.isArray(compRes.data) ? compRes.data.length : 0
        );

      } catch (err) {
        console.log("PROFILE ERROR:", err.response?.data || err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="avatar">👤</div>

        <h1>{user.name}</h1>
        <p className="email">{user.email}</p>

        <div className="info">
          <div className="info-box">
            <h3>Role</h3>
            <p>User</p>
          </div>

          <div className="info-box">
            <h3>Complaints</h3>
            <p>{complaintsCount}</p>
          </div>

          <div className="info-box">
            <h3>Status</h3>
            <p>Active</p>
          </div>
        </div>

        <button className="profile-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}