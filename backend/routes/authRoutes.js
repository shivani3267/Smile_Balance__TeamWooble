import express from "express";
import { signup, login, getProfile, handleForgotPassword, handleVerifyOtp, handleResetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotPassword",handleForgotPassword)
router.post("/verifyPassword",handleVerifyOtp);
router.patch("/changepassword",protect,handleResetPassword)

// protected
router.get("/profile", protect, getProfile);

export default router;
