import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (!state?.email) {
      nav("/signup");
    }
  }, [state, nav]);

  const verifyHandler = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/verify-email", {
        email: state.email,
        otp,
      });

      alert("Email verified successfully. Please login.");
      nav("/login");
    } catch (err) {
        console.log("VERIFY EMAIL ERROR:", err.response?.data);
        alert(err.response?.data?.message || "Verification failed");
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0b1a] to-black">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl text-white">
        <h2 className="text-2xl font-semibold mb-6">Verify Email</h2>

        <form onSubmit={verifyHandler} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded-xl">
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
}