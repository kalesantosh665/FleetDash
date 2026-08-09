import express from "express";

import {
  getVehicles,
  getVehicle,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";

import { protect } from "../middleware/auth.middleware";
console.log("✅ vehicleRoutes Loaded");
const router = express.Router();

// Protected Routes
router.get("/", protect, getVehicles);
router.get("/:id", protect, getVehicle);

router.post("/", protect, addVehicle);
router.put("/:id", protect, updateVehicle);
router.delete("/:id", protect, deleteVehicle);

export default router;