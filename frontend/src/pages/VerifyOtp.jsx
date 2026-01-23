import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const nav = useNavigate();

  const verifyHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/verifyPassword", {
        email: state.email,
        otp,
      });
      nav("/reset-password", { state: { email: state.email, otp } });
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0b1a] to-black">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl text-white">
        <h2 className="text-2xl font-semibold mb-6">Verify OTP </h2>

        <form onSubmit={verifyHandler} className="space-y-4">
          <input
            type="number"
            placeholder="Enter OTP"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded-xl">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
