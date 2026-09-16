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

// Smart upload: only invoke Cloudinary when request is multipart (has a file)
const smartUpload = (fieldName) => (req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    upload.single(fieldName)(req, res, next);
  } else {
    next(); // JSON body — already parsed by express.json(), skip multer entirely
  }
};

router.post("/", smartUpload("photo"), addMember);
router.get("/", getMembers);
router.get("/dues", getDueMembers);
router.get("/:id", getMemberById);
router.put("/:id", smartUpload("photo"), updateMember);
router.put("/:id/renew", renewMembership);
router.delete("/:id", deleteMember);

export default router;