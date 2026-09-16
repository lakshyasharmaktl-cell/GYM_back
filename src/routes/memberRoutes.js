import express from "express";
import {
  addMember,
  getMembers,
  getMemberById,
  updateMember,
  renewMembership,
  deleteMember,
  getDueMembers,
} from "../controllers/memberController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(protect, adminOnly);

router.post("/", upload.single("photo"), addMember);
router.get("/", getMembers);
router.get("/dues", getDueMembers);
router.get("/:id", getMemberById);
router.put("/:id", upload.single("photo"), updateMember);
router.put("/:id/renew", renewMembership);
router.delete("/:id", deleteMember);

export default router;