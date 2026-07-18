import express from "express";
import {
  login,
  signup,
  logout,
    verifyOTP,
  AllUsers,
} from "../controllers/user.controller.js";
import secureRoute from "../middleware/secureRoute.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.get("/AllUsers", secureRoute, AllUsers);
export default router;
