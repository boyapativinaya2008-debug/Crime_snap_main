const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: [
        "https://crimesnap.netlify.app",
        "https://crimesnap1411.netlify.app",
        "https://crimesnap1517.netlify.app"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // optional join room
    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return io;
};

/* ================= EXPORT IO FOR CONTROLLERS ================= */
const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};