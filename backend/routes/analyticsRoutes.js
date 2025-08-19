import express from "express";
import { getEmployeeAnalytics, getAdminAnalytics, getSuperAdminAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/employee", protect, getEmployeeAnalytics);
router.get("/admin", protect, getAdminAnalytics);
router.get("/superadmin", protect, getSuperAdminAnalytics);

export default router;
