import { Link, useNavigate } from "react-router-dom"
import OrbBackground from "../components/ui/OrbBackground"
import GlassCard from "../components/ui/GlassCard"
import Badge from "../components/ui/Badge"
import StatCard from "../components/ui/StatCard"
import PrimaryButton from "../components/ui/PrimaryButton"
import TopBar from "../components/layout/TopBar"

export default function Dashboard() {
    const nav = useNavigate()

    // Demo data (frontend-only)
    const user = {
        name: "Shivam",
        balance: 240,
        smiles: 24,
        streak: 7,
        todaySmiles: 1, // out of 2
        nextSmileIn: "02h 18m", // fake timer for UI
    }

    const activity = [
        { title: "Smile Verified", time: "Today • 6:10 PM", amount: "+₹10" },
        { title: "Smile Verified", time: "Yesterday • 9:05 AM", amount: "+₹10" },
        { title: "Withdrawal Request", time: "Jan 12 • 3:22 PM", amount: "₹100" },
    ]

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
            {/* Animated Orbs */}
            <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-yellow-300/25 to-orange-500/15 blur-3xl blob" />
            <div className="absolute top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-600/15 blur-3xl blob2" />
            <div className="absolute -bottom-56 left-24 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-emerald-400/18 to-cyan-500/10 blur-3xl blob" />

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative z-10 p-6 md:p-10 max-w-[1200px] mx-auto">
                <TopBar />
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-300 text-sm">Welcome back</p>
                        <h1 className="text-3xl md:text-4xl font-extrabold">
                            {user.name} 👋
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/withdraw"
                            className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
                        >
                            Wallet
                        </Link>
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-300/40 to-fuchsia-500/30 border border-white/15" />
                    </div>
                </div>

                {/* Hero Wallet Card */}
                <div className="mt-8 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-8 glow-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-gray-300">Total Earnings</p>
                            <h2 className="text-5xl font-extrabold mt-2">
                                <span className="text-green-300">₹</span>
                                <span className="bg-gradient-to-r from-green-200 to-emerald-400 bg-clip-text text-transparent">
                                    {user.balance}
                                </span>
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <Badge label="AI Verified" />
                                <Badge label={`${user.smiles} Smiles`} />
                                <Badge label={`🔥 ${user.streak} Day Streak`} />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => nav("/smile")}
                                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-extrabold hover:scale-[1.02] transition shadow-xl"
                            >
                                😊 Give a Smile
                                <p className="text-xs font-medium opacity-80 mt-1">
                                    Earn +₹10 (demo)
                                </p>
                            </button>

                            <button
                                onClick={() => nav("/withdraw")}
                                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 text-black font-extrabold hover:scale-[1.02] transition shadow-xl"
                            >
                                💰 Withdraw
                                <p className="text-xs font-medium opacity-80 mt-1">
                                    Min ₹100
                                </p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Today’s Limit"
                        value={`${user.todaySmiles}/2 Smiles`}
                        sub={`Next smile in ${user.nextSmileIn}`}
                        accent="from-yellow-300/25 to-orange-500/10"
                    />
                    <StatCard
                        title="Streak Power"
                        value={`${user.streak} Days 🔥`}
                        sub="Keep smiling daily"
                        accent="from-fuchsia-500/20 to-purple-600/10"
                    />
                    <StatCard
                        title="Smile History"
                        value={`${user.smiles} Total`}
                        sub="Consistency pays"
                        accent="from-emerald-400/18 to-cyan-500/10"
                    />
                </div>

                {/* Activity */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Recent Activity</h3>
                            <button className="text-sm text-gray-300 hover:text-white underline underline-offset-4">
                                View all
                            </button>
                        </div>

                        <div className="mt-5 space-y-3">
                            {activity.map((a, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between bg-black/25 border border-white/10 rounded-2xl p-4 hover:bg-black/35 transition"
                                >
                                    <div>
                                        <p className="font-semibold">{a.title}</p>
                                        <p className="text-xs text-gray-300 mt-1">{a.time}</p>
                                    </div>
                                    <p
                                        className={`font-extrabold ${a.amount.startsWith("+")
                                            ? "text-green-300"
                                            : "text-yellow-200"
                                            }`}
                                    >
                                        {a.amount}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Motivation Card */}
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 glow-border">
                        <h3 className="text-xl font-bold">Today’s Mission</h3>
                        <p className="text-gray-300 mt-2">
                            Smile twice today and keep the streak alive.
                        </p>

                        <div className="mt-5 bg-black/25 border border-white/10 rounded-2xl p-4">
                            <p className="text-sm text-gray-300">Progress</p>
                            <div className="mt-3 w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-300 to-orange-400"
                                    style={{ width: `${(user.todaySmiles / 2) * 100}%` }}
                                />
                            </div>
                            <p className="mt-3 text-sm">
                                {user.todaySmiles === 2
                                    ? "✅ Limit reached. Come back tomorrow!"
                                    : `✅ ${2 - user.todaySmiles} smile left today`}
                            </p>
                        </div>

                        <button
                            onClick={() => nav("/smile")}
                            className="mt-6 w-full py-4 rounded-2xl bg-white text-black font-extrabold hover:scale-[1.02] transition"
                        >
                            Start AI Scan ✨
                        </button>

                        <p className="mt-4 text-xs text-gray-400">
                            Frontend demo — AI + rewards logic will be added next.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ---------------- Components (inside same file for simplicity) ---------------- */

/* function Badge({ label }) {
    return (
        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-gray-200">
            {label}
        </span>
    )
} */

/* function StatCard({ title, value, sub, accent }) {
    return (
        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} blur-2xl`} />
            <div className="relative z-10">
                <p className="text-gray-300 text-sm">{title}</p>
                <h3 className="text-2xl font-extrabold mt-2">{value}</h3>
                <p className="text-gray-300 text-sm mt-1">{sub}</p>
            </div>
        </div>
    )
} */
