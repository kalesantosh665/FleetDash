import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import vehicleRoutes from "./routes/vehicleRoutes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Debug Middleware
app.use((req, res, next) => {
  console.log("================================");
  console.log(req.method, req.url);
  console.log("Authorization:", req.headers.authorization);
  console.log("================================");
  next();
});

console.log("✅ Registering Auth Routes");
app.use("/api/auth", authRoutes);

console.log("✅ Registering Vehicle Routes");
app.use("/api/vehicles", vehicleRoutes);

console.log("✅ Registering Dashboard Routes");
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FleetDash Backend is running",
  });
});

export default app;