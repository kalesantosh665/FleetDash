import { Request, Response } from "express";
import Vehicle from "../models/Vehicle";

// GET ALL
export const getVehicles = async (
  req: Request,
  res: Response
) => {
  console.log("🚗 getVehicles Called");

  try {
    const vehicles = await Vehicle.find();

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};

// GET SINGLE
export const getVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicle = await Vehicle.findOne({
  id: Number(req.params.id),
});

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
    });
  }
};

// CREATE
// CREATE
// CREATE VEHICLE
export const addVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("🚛 ADD VEHICLE REQUEST:");
    console.log(req.body);

    // Find the highest existing vehicle ID
    const lastVehicle = await Vehicle.findOne()
      .sort({ id: -1 })
      .select("id");

    const nextId = lastVehicle
      ? lastVehicle.id + 1
      : 1;

    const vehicle = await Vehicle.create({
      id: nextId,

      name: req.body.name,
      driver: req.body.driver,

      lat: Number(req.body.lat) || 18.5204,
      lng: Number(req.body.lng) || 73.8567,

      speed: Number(req.body.speed) || 0,

      status:
        req.body.status === "Running"
          ? "Running"
          : "Stopped",

      fuel: Number(req.body.fuel) || 100,
      battery: Number(req.body.battery) || 100,

      route: [],
    });

    console.log("✅ VEHICLE CREATED:", vehicle);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });

  } catch (err: any) {
    console.error("❌ ADD VEHICLE ERROR:");
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        err?.message || "Failed to create vehicle",
    });
  }
};

// UPDATE
export const updateVehicle = async (
  req: Request,
  res: Response
) => {
  try {
 const vehicle = await Vehicle.findOneAndUpdate(
  { id: Number(req.params.id) },
  req.body,
  {
    new: true,
    runValidators: true,
  }
);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
    });
  }
};

// DELETE
export const deleteVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      id: Number(req.params.id),
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
};