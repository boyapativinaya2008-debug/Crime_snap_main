require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");

const socketModule = require("./src/socket/socket");
const initializeSocket = socketModule.initializeSocket;

const PORT = process.env.PORT || 3000;

connectDB();

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});