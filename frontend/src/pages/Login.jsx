import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // same pattern as signup
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            nav("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
            <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-yellow-300/35 to-orange-500/20 blur-3xl blob" />
            <div className="absolute top-40 -right-28 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-fuchsia-500/25 to-purple-600/20 blur-3xl blob2" />
            <div className="absolute -bottom-40 left-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/15 blur-3xl blob" />

            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-[980px] grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT */}
                    <div className="p-6 md:p-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                            <span className="text-yellow-300">●</span>
                            <span className="text-xs text-gray-200">
                                AI Verified • 2 Smiles/Day • Rewards
                            </span>
                        </div>

                        <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
                            Your <span className="text-yellow-300">smile</span> is now
                            <br />
                            your{" "}
                            <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                                income
                            </span>.
                        </h1>

                        <p className="mt-4 text-gray-300 max-w-md">
                            SmileBalance rewards genuine smiles using AI face &
                            expression detection.
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-10 glow-border">
                        <h2 className="text-2xl font-bold">Welcome back</h2>
                        <p className="text-gray-300 mt-1 text-sm">
                            Login to continue your streak.
                        </p>

                        <div className="mt-6 space-y-3">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-yellow-300/50"
                                placeholder="Email address"
                            />

                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-yellow-300/50"
                                placeholder="Password"
                            />

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-extrabold hover:scale-[1.02] transition disabled:opacity-60"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </div>

                        <div className="mt-5 flex justify-between text-sm">
                            <button className="text-gray-300 underline">
                                Forgot password?
                            </button>
                            <Link
                                to="/signup"
                                className="text-yellow-200 underline"
                            >
                                Create account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
