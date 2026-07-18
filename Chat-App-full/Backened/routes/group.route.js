import express from "express";
import multer from "multer";
import secureRoute from "../middleware/secureRoute.js";
import {
  createGroup,
  getMyGroups,
  getGroupMessages,
  sendGroupMessage,
  addMember,
  leaveGroup,
} from "../controllers/group.controller.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg","image/png","image/gif","image/webp","video/mp4","video/webm","application/pdf"];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("File type not supported"), false);
  },
});

router.post("/create", secureRoute, createGroup);
router.get("/my-groups", secureRoute, getMyGroups);
router.get("/messages/:groupId", secureRoute, getGroupMessages);
router.post("/send/:groupId", secureRoute, upload.single("media"), sendGroupMessage);
router.post("/add-member/:groupId", secureRoute, addMember);
router.post("/leave/:groupId", secureRoute, leaveGroup);

export default router;
