import express from "express";
import {
  createMembership,
  getMemberships,
  updateMembership,
  deleteMembership,
} from "../controllers/membershipController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.post("/", createMembership);
router.get("/", getMemberships);
router.put("/:id", updateMembership);
router.delete("/:id", deleteMembership);

export default router;