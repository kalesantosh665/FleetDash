import vehicleRoutes from "./routes/vehicleRoutes";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehicleRoutes);
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FleetDash Backend is running",
  });
});

export default app;