import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000",
  {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  }
);

export default socket;