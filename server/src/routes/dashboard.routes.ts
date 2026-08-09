import express from "express";
import { protect } from "../middleware/auth.middleware";
import { getDashboardStats } from "../controllers/dashboardController";

console.log("✅ dashboard.routes.ts Loaded");

const router = express.Router();

router.get(
  "/stats",
  protect,
  getDashboardStats
);

export default router;