import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getBadges } from "../utils/badgeUtils.js";
import sendMail from "../config/sendEmail.js";
import Otp from "../models/otp.model.js";


export const signup = async (req, res) => {
  try {
    let { fullName, email, password } = req.body;

    fullName = fullName?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      isVerified: false,
    });

    await Otp.deleteMany({
      email,
      purpose: "email_verification",
    });

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.create({
      email,
      otp,
      purpose: "email_verification",
    });

    const message = `Your email verification OTP is ${otp}. This OTP will expire in 5 minutes.`;

    await sendMail(email, "Verify Your Email", message);

    res.status(201).json({
      message: "Signup successful. OTP sent to your email.",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
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
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before login",
      });
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

/*
  GET PROFILE
*/
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

/*
  FORGOT PASSWORD (SEND OTP)
*/
export const handleForgotPassword = async (req, res) => {
  let { email } = req.body;

  email = email?.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // delete old OTPs
    await Otp.deleteMany({ email, purpose: "forgot_password" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.create({ email, otp, purpose: "forgot_password" });

    const message = `Your verification code for password reset is ${otp}`;
    await sendMail(email, "Reset Password", message);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/*
  VERIFY OTP
*/
export const handleVerifyOtp = async (req, res) => {
  let { email, otp } = req.body;

  email = email?.trim().toLowerCase();

  try {
    console.log("VERIFY OTP BODY:", req.body);
    const record = await Otp.findOne({
      email,
      otp: Number(otp),
      purpose: "forgot_password",
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
  RESET PASSWORD
*/
export const handleResetPassword = async (req, res) => {
  let { email, otp, newPass } = req.body;

  email = email?.trim().toLowerCase();
  newPass = newPass?.trim();

  try {
    const record = await Otp.findOne({
      email,
      otp: Number(otp),
      purpose: "forgot_password",
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

   
    user.password = newPass;
    await user.save();

    await Otp.deleteMany({
      email,
      purpose: "forgot_password",
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const record = await Otp.findOne({
      email,
      otp: Number(otp),
      purpose: "email_verification",
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    await user.save();

    await Otp.deleteMany({
      email,
      purpose: "email_verification",
    });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};