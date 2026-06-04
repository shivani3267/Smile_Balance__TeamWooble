import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  purpose: {
    type: String,
    enum: ["email_verification", "forgot_password"],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;