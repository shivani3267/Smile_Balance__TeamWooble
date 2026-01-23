import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getBadges } from "../utils/badgeUtils.js";
import sendMail from "../config/sendEmail.js";
import Otp from "../models/otp.model.js";

/*
   SIGNUP */
  
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ fullName, email, password });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/*
   LOGIN
*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET PROFILE
========================= */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "fullName email balance streak totalSmileCount todaySmileCount activity lastSmileTime"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const badges = getBadges(user);

    res.status(200).json({
      message: "Profile fetched",
      user,
      badges,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   FORGOT PASSWORD (SEND OTP)
========================= */
export const handleForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // delete old OTPs
    await Otp.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.create({ email, otp });

    const message = `Your verification code for password reset is ${otp}`;
    await sendMail(email, "Reset Password", message);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   VERIFY OTP
========================= */
export const handleVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({
      email,
      otp: Number(otp), // 🔥 FIX
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*RESET PASSWORD */
export const handleResetPassword = async (req, res) => {
  const { email, otp, newPass } = req.body;

  const record = await Otp.findOne({
    email,
    otp: Number(otp),
  });

  if (!record) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  user.password = newPass; // 🔥 NO bcrypt here
  await user.save();       // pre-save hook hashes it

  await Otp.deleteMany({ email });

  res.status(200).json({ message: "Password reset successful" });
};
