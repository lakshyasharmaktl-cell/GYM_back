import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Cloudinary storage (for when Cloudinary is configured correctly) ──────────
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gym-members",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// ── Local memory storage (safe fallback — no external calls) ─────────────────
const memoryStorage = multer.memoryStorage();

// ── Safe upload middleware: tries Cloudinary, never crashes the request ───────
const uploadCloud = multer({ storage: cloudinaryStorage });
const uploadMemory = multer({ storage: memoryStorage });

/**
 * Wraps upload.single() so errors don't crash the whole request.
 * If Cloudinary upload fails, req.file is left undefined and the
 * member is saved without a photo — the request still succeeds.
 */
const safeUpload = (fieldName) => (req, res, next) => {
  uploadCloud.single(fieldName)(req, res, (err) => {
    if (err) {
      console.warn("⚠️  Cloudinary upload failed (member saved without photo):", err.message);
      // Fall through without a file — member creation still works
      req.file = undefined;
    }
    next();
  });
};

const upload = { single: (fieldName) => safeUpload(fieldName) };

export { cloudinary, upload };