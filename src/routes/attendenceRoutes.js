import express from "express";
import {
  markAttendance,
  getMemberAttendance,
  getTodayAttendance,
} from "../controllers/attendenceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.post("/", markAttendance);
router.get("/today", getTodayAttendance);
router.get("/:memberId", getMemberAttendance);

export default router;