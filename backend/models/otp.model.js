import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1m", // auto delete after 1 minute
  },
});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;