import express from "express";
import {
  signup,
  login,
  getProfile,
  handleForgotPassword,
  handleVerifyOtp,
  handleResetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// forgot password flow
router.post("/forgot-password", handleForgotPassword);
router.post("/verify-otp", handleVerifyOtp);
router.post("/reset-password", handleResetPassword);

// protected
router.get("/profile", protect, getProfile);

export default router;
