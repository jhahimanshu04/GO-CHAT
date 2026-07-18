import express from "express";
import multer from "multer";
import secureRoute from "../middleware/secureRoute.js";
import { sendMessage, getMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Use memory storage so we can pipe buffer to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "video/mp4", "video/webm", "video/ogg",
      "application/pdf",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported"), false);
    }
  },
});

router.post("/send/:id", secureRoute, upload.single("media"), sendMessage);
router.get("/get/:id", secureRoute, getMessage);

export default router;
