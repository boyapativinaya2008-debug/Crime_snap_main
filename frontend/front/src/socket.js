import { io } from "socket.io-client";

const socket = io("https://crime-snap-main-1.onrender.com", {
  transports: ["websocket"],
});

export default socket;