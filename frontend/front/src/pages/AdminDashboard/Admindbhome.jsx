import { useEffect, useState } from "react";
import API from "../../api/api";
import socket from "../../socket";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "../../styles/adminreports.css";

export default function Admindbhome() {

  const [stats, setStats] = useState({
    reports: 0,
    users: 0,
    officers: 0,
    locations: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */

  const fetchDashboardData = async () => {

    try {

      const [
        complaintsRes,
        usersRes,
        officersRes,
        locationsRes,
      ] = await Promise.all([

        API.get("/admin/complaints"),

        API.get("/admin/users"),

        API.get("/admin/officers"),

        API.get("/admin/locations"),

      ]);

      const complaints =
        complaintsRes.data;

      const users =
        usersRes.data;

      const officers =
        officersRes.data;

      const locations =
        locationsRes.data;

      /* CATEGORY COUNTS */

      const categoryCount = {};

      complaints.forEach((item) => {

        const category =
          item.category || "Other";

        categoryCount[category] =
          (categoryCount[category] || 0) + 1;

      });

      /* STATS */

      setStats({

        reports:
          complaints.length,

        users:
          users.length,

        officers:
          officers.length,

        locations:
          locations.length,

      });

      /* BAR CHART */

      setChartData([

        {
          name: "Reports",
          value:
            complaints.length,
        },

        {
          name: "Users",
          value:
            users.length,
        },

        {
          name: "Officers",
          value:
            officers.length,
        },

        {
          name: "Locations",
          value:
            locations.length,
        },

      ]);

      /* PIE CHART */

      const pieData =
        Object.keys(
          categoryCount
        ).map((key) => ({

          name: key,

          value:
            categoryCount[key],

        }));

      setCategoryData(
        pieData
      );

    } catch (err) {

      console.log(
        "Dashboard error:",
        err.response?.data || err
      );

    }
  };

  /* =========================
     SOCKET + INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchDashboardData();

    const handleUpdate = () => {

      fetchDashboardData();

    };

    socket.on(
      "new-complaint",
      handleUpdate
    );

    socket.on(
      "status-updated",
      handleUpdate
    );

    socket.on(
      "complaint-assigned",
      handleUpdate
    );

    return () => {

      socket.off(
        "new-complaint",
        handleUpdate
      );

      socket.off(
        "status-updated",
        handleUpdate
      );

      socket.off(
        "complaint-assigned",
        handleUpdate
      );

    };

  }, []);

  /* =========================
     DASHBOARD CARDS
  ========================= */

  const cards = [

    {
      title: "Total Reports",
      value: stats.reports,
    },

    {
      title: "Users",
      value: stats.users,
    },

    {
      title: "Officers",
      value: stats.officers,
    },

    {
      title: "Locations",
      value: stats.locations,
    },

  ];

  /* =========================
     PIE CHART COLORS
  ========================= */

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#ca8a04",
    "#9333ea",
    "#0891b2",
  ];

  return (

    <div className="admin-page">

      <h1>
        Admin Dashboard
      </h1>

      {/* CARDS */}

      <div className="dashboard-cards">

        {cards.map((card, index) => (

          <div
            className="dashboard-card"
            key={index}
          >

            <h2>
              {card.value}
            </h2>

            <p>
              {card.title}
            </p>

          </div>

        ))}

      </div>

      {/* CHARTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "30px",
          marginTop: "40px",
        }}
      >

        {/* BAR CHART */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >

          <h2>
            System Usage
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={chartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#2563eb"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* PIE CHART */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >

          <h2>
            Complaint Categories
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >

                {categoryData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}