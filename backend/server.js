require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const initializeSocket = require("./src/socket/socket");

const PORT = process.env.PORT || 3000;

/* ================= DATABASE ================= */
connectDB();

/* ================= SERVER ================= */
const server = http.createServer(app);

/* ================= SOCKET ================= */
initializeSocket(server);

/* ================= START SERVER ================= */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});