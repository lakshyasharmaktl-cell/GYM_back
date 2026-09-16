import express from "express";
import { registerAdmin, loginAdmin, getAdminProfile } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin); // ⚠️ ek baar use karke hata dena ya protect karna
router.post("/login", loginAdmin);
router.get("/profile", protect, getAdminProfile);

export default router;