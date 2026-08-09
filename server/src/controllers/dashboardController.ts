import { Request, Response } from "express";
import Vehicle from "../models/Vehicle";

console.log("✅ dashboardController Loaded");

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  console.log("📊 Dashboard Stats API Called");

  try {
    const totalVehicles =
      await Vehicle.countDocuments();

    const runningVehicles =
      await Vehicle.countDocuments({
        status: "Running",
      });

    const stoppedVehicles =
      await Vehicle.countDocuments({
        status: "Stopped",
      });

    const vehicles = await Vehicle.find();

    const averageSpeed =
      vehicles.length > 0
        ? Math.round(
            vehicles.reduce(
              (sum, vehicle) => sum + vehicle.speed,
              0
            ) / vehicles.length
          )
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalVehicles,
        runningVehicles,
        stoppedVehicles,
        averageSpeed,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};