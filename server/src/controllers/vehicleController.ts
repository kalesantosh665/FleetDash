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
export const addVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
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