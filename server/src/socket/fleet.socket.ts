import { Server, Socket } from "socket.io";
import { subscriber } from "../config/redis";
import { getAlerts } from "../services/alert.service";

let subscribed = false;

export function initializeFleetSocket(io: Server) {
  if (!subscribed) {
    subscribed = true;

    // ==========================
    // Vehicle Updates
    // ==========================
    subscriber.subscribe(
      "fleet-updates",
      (message) => {
        try {
          console.log("📥 fleet-updates RECEIVED");

          const vehicles = JSON.parse(message);

          console.log(
            "Vehicles:",
            vehicles.length,
          );

          io.emit(
            "vehicles-update",
            vehicles,
          );
        } catch (err) {
          console.error(
            "Vehicle Parse Error:",
            err,
          );
        }
      },
    );

    // ==========================
    // Alert Updates
    // ==========================
    subscriber.subscribe(
      "fleet-alerts",
      (message) => {
        try {
          const alerts = JSON.parse(message);

          console.log(
            `🚨 Broadcasting ${alerts.length} alerts`,
          );

          io.emit(
            "alerts-update",
            alerts,
          );
        } catch (err) {
          console.error(
            "Alert Parse Error:",
            err,
          );
        }
      },
    );

    console.log(
      "📡 Redis Subscriber Started",
    );
  }

  // ==========================
  // Socket Connection
  // ==========================
  io.on(
    "connection",
    (socket: Socket) => {
      console.log(
        "✅ Client Connected:",
        socket.id,
      );

      // Send current active alerts
      // to a newly connected client
      socket.emit(
        "alerts-update",
        getAlerts(),
      );

      console.log(
        `🚨 Sent ${getAlerts().length} existing alerts to ${socket.id}`,
      );

      socket.on(
        "client-ready",
        () => {
          socket.emit("welcome", {
            message:
              "Welcome to FleetDash 🚛",
            time:
              new Date().toLocaleTimeString(),
          });

          console.log(
            "🚚 Client Ready:",
            socket.id,
          );
        },
      );

      socket.on(
        "disconnect",
        () => {
          console.log(
            "❌ Client Disconnected:",
            socket.id,
          );
        },
      );
    },
  );
}