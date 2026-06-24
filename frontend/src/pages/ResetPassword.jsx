import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPass, setNewPass] = useState("");
  const { state } = useLocation();
  const nav = useNavigate();
  const API_URL = import.meta.env.API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!state?.email || !state?.otp) nav("/forgot-password");
  }, [state, nav]);

  const resetHandler = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/auth/reset-password`, {
        email: state.email,
        otp: state.otp,
        newPass,
      });

      alert("Password reset successful");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0b0b1a] to-black">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl text-white">
        <h2 className="text-2xl font-semibold mb-6">Reset Password </h2>

        <form onSubmit={resetHandler} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />

          <button className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded-xl">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}