import { useNavigate, Link } from "react-router-dom"

export default function Signup() {
    const nav = useNavigate()

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
            {/* Animated Orbs */}
            <div className="absolute -top-28 right-10 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-emerald-400/20 to-green-500/10 blur-3xl blob" />
            <div className="absolute top-32 -left-28 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-yellow-300/25 to-orange-500/15 blur-3xl blob2" />
            <div className="absolute -bottom-48 right-24 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-600/15 blur-3xl blob" />

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-[980px] grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left: Signup Card */}
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-10 glow-border">
                        <h2 className="text-2xl font-bold">Create your account 🚀</h2>
                        <p className="text-gray-300 mt-2 text-sm">
                            Start earning with verified smiles — frontend demo.
                        </p>

                        <button
                            onClick={() => nav("/dashboard")}
                            className="mt-7 w-full py-4 rounded-2xl bg-white text-black font-bold hover:scale-[1.02] transition"
                        >
                            Sign up with Google
                        </button>

                        <div className="mt-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/15" />
                            <span className="text-xs text-gray-300">or</span>
                            <div className="h-px flex-1 bg-white/15" />
                        </div>

                        <div className="mt-6 space-y-3">
                            <input
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-emerald-300/50"
                                placeholder="Full name"
                            />
                            <input
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-emerald-300/50"
                                placeholder="Email address"
                            />
                            <input
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-emerald-300/50"
                                placeholder="Create password"
                                type="password"
                            />

                            <button
                                onClick={() => nav("/dashboard")}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 text-black font-extrabold hover:scale-[1.02] transition"
                            >
                                Create Account
                            </button>
                        </div>

                        <div className="mt-5 text-sm text-gray-300">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-yellow-200 hover:text-yellow-100 underline underline-offset-4"
                            >
                                Login
                            </Link>
                        </div>

                        <p className="mt-6 text-xs text-gray-400">
                            AI will verify smiles. 2 submissions/day with 6-hour gap.
                        </p>
                    </div>

                    {/* Right: Hype Panel */}
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                            Build a <span className="text-yellow-300">streak</span>.
                            <br />
                            Earn <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">rewards</span>.
                            <br />
                            Spread <span className="text-fuchsia-300">hope</span>.
                        </h1>

                        <p className="mt-4 text-gray-300 max-w-md">
                            A minimal, positive habit that pays you back. Your dashboard tracks
                            smile history, streaks, and earnings.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-xs text-gray-400">Verification</p>
                                <p className="text-lg font-bold">AI Smile Scan</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-xs text-gray-400">Rewards</p>
                                <p className="text-lg font-bold">Credits → Cash</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-xs text-gray-400">Motivation</p>
                                <p className="text-lg font-bold">Streak System</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-xs text-gray-400">Protection</p>
                                <p className="text-lg font-bold">Daily Limits</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
