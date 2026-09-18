import express from "express";
import {
  addPayment,
  getMemberPayments,
  getAllPayments,
  deletePayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getAllPayments);
router.post("/:memberId", addPayment);
router.get("/:memberId", getMemberPayments);
router.delete("/delete/:paymentId", deletePayment);

export default router;