const { Server } = require("socket.io");

const initializeSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {

    console.log(`User Connected: ${socket.id}`);

    socket.on("disconnect", () => {

      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initializeSocket;