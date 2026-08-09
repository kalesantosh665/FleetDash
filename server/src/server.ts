import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import {
  publisher,
  subscriber,
} from "./config/redis";
import app from "./app";
import connectDB from "./config/db";
import { initializeFleetSocket } from "./socket/fleet.socket";
import { redisClient } from "./config/redis";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();
await publisher.connect();
await subscriber.connect();
await import("./workers/vehicle.worker");
    // Create HTTP Server
    const server = http.createServer(app);

    // Create Socket.io Server
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Initialize Fleet Socket
    initializeFleetSocket(io);

    // Start Server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();