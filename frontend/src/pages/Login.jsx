import { useNavigate, Link } from "react-router-dom"

export default function Login() {
    const nav = useNavigate()

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
            { }
            <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-yellow-300/35 to-orange-500/20 blur-3xl blob" />
            <div className="absolute top-40 -right-28 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-fuchsia-500/25 to-purple-600/20 blur-3xl blob2" />
            <div className="absolute -bottom-40 left-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/15 blur-3xl blob" />

            { }
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-[980px] grid grid-cols-1 md:grid-cols-2 gap-6">
                    { }
                    <div className="p-6 md:p-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                            <span className="text-yellow-300">●</span>
                            <span className="text-xs text-gray-200">AI Verified • 2 Smiles/Day • Rewards</span>
                        </div>

                        <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
                            Your <span className="text-yellow-300">smile</span> is now
                            <br />
                            your <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">income</span>.
                        </h1>

                        <p className="mt-4 text-gray-300 max-w-md">
                            SmileBalance rewards genuine smiles using AI face & expression detection.
                            Build streaks. Earn credits. Withdraw when you hit the limit.
                        </p>

                        <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-xs text-gray-400">Daily limit</p>
                                <p className="text-lg font-bold">2 Smiles</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-xs text-gray-400">Gap</p>
                                <p className="text-lg font-bold">6 Hours</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-xs text-gray-400">Mood</p>
                                <p className="text-lg font-bold">Positive</p>
                            </div>
                        </div>
                    </div>

                    { }
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-10 glow-border">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Welcome back </h2>
                                <p className="text-gray-300 mt-1 text-sm">
                                    Login to continue your streak.
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-300/40 to-fuchsia-500/30 border border-white/15" />
                        </div>

                        <button
                            onClick={() => nav("/dashboard")}
                            className="mt-7 w-full py-4 rounded-2xl bg-white text-black font-bold hover:scale-[1.02] transition"
                        >
                            Continue with Google
                        </button>

                        <div className="mt-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/15" />
                            <span className="text-xs text-gray-300">or</span>
                            <div className="h-px flex-1 bg-white/15" />
                        </div>

                        { }
                        <div className="mt-6 space-y-3">
                            <input
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-yellow-300/50"
                                placeholder="Email address"
                            />
                            <input
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-yellow-300/50"
                                placeholder="Password"
                                type="password"
                            />

                            <button
                                onClick={() => nav("/dashboard")}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-extrabold hover:scale-[1.02] transition"
                            >
                                Login
                            </button>
                        </div>

                        <div className="mt-5 flex items-center justify-between text-sm">
                            <button className="text-gray-300 hover:text-white underline underline-offset-4">
                                Forgot password?
                            </button>
                            <Link
                                to="/signup"
                                className="text-yellow-200 hover:text-yellow-100 underline underline-offset-4"
                            >
                                Create account
                            </Link>
                        </div>

                        <p className="mt-6 text-xs text-gray-400">
                            By continuing, you agree to our Terms & Privacy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
