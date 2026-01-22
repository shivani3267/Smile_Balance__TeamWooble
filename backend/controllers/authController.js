import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getBadges } from "../utils/badgeUtils.js";
import sendMail from "../config/sendEmail.js";
import Otp from "../models/otp.model.js";


export const signup = async (req, res, next) => {
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

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      token,
    });
  }  catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({
      message: "Signup failed",
      error: err.message,
      stack: err.stack
    });
  }
  
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
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
  }  catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
      stack: err.stack,
    });
  }
  
};
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "fullName email balance streak totalSmileCount todaySmileCount activity lastSmileTime"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ badges based on streak
    const badges = getBadges(user);

    res.status(200).json({
      message: "Profile fetched",
      user,
      badges,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//Forgot Password-------------------------------------------------
export const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.create({ email, otp });

    const message = `Your verification code for password reset is ${otp}`;
    await sendMail(email, "Reset Password", message);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


