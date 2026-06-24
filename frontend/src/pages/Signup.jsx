import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../utils/axiosInstance.js"

export default function Signup() {
    const nav = useNavigate()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSignup = async () => {
        setError("")

        if (!fullName || !email || !password) {
            setError("All fields are required")
            return
        }

        try {
            setLoading(true)

            const res = await api.get(`/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Signup failed")
            }

            // Store token securely
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            nav("/dashboard")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
            {/* Background */}
            <div className="absolute -top-28 right-10 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-emerald-400/20 to-green-500/10 blur-3xl blob" />
            <div className="absolute top-32 -left-28 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-yellow-300/25 to-orange-500/15 blur-3xl blob2" />
            <div className="absolute -bottom-48 right-24 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-600/15 blur-3xl blob" />

            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-[980px] grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Signup Card */}
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-10">
                        <h2 className="text-2xl font-bold">Create your account 🚀</h2>

                        {error && (
                            <p className="mt-4 text-red-400 text-sm">{error}</p>
                        )}

                        <div className="mt-6 space-y-3">
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none"
                                placeholder="Full name"
                            />

                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none"
                                placeholder="Email address"
                            />

                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none"
                                placeholder="Create password"
                                type="password"
                            />

                            <button
                                onClick={handleSignup}
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 text-black font-extrabold hover:scale-[1.02] transition disabled:opacity-60"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </div>

                        <div className="mt-5 text-sm text-gray-300">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-yellow-200 underline"
                            >
                                Login
                            </Link>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold">
                            Earn with your <span className="text-yellow-300">Smile</span>
                        </h1>
                        <p className="mt-4 text-gray-300 max-w-md">
                            AI verified smiles, daily limits, and secure rewards.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

