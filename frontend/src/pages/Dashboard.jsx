import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
    getUser,
    getSmiles,
    calcStreakDays,
    sixHourWaitLeftMs,
} from "../utils/storage"

import { getAchievements } from "../utils/achievements"

export default function Dashboard() {
    const nav = useNavigate()

    const [data, setData] = useState({
        name: "Shivam",
        credits: 0,
        smiles: 0,
        streak: 0,
        todayCount: 0,
        nextIn: "Now ✅",
        activity: [],
        achievements: { unlocked: [], all: [], newlyUnlocked: [] },
    })

    const refresh = () => {
        const u = getUser() || {}
        const smilesArr = getSmiles()
        const streak = calcStreakDays()

        const todayKey = new Date().toISOString().slice(0, 10)

        const todayCount = smilesArr.filter((s) => {
            if (s.type === "withdraw") return false
            const d = new Date(s.date || s.time)
            if (isNaN(d)) return false
            return d.toISOString().slice(0, 10) === todayKey
        }).length

        const leftMs = sixHourWaitLeftMs()
        const mins = Math.ceil(leftMs / (60 * 1000))
        const hh = String(Math.floor(mins / 60)).padStart(2, "0")
        const mm = String(mins % 60).padStart(2, "0")
        const nextIn = leftMs === 0 ? "Now ✅" : `${hh}h ${mm}m`

        const activity = [...smilesArr]
            .slice(-6)
            .reverse()
            .map((s) => {
                const isWithdraw = s.type === "withdraw"
                return {
                    title: isWithdraw ? "Withdrawal Request" : "Smile Verified",
                    time: new Date(s.time || s.date).toLocaleString(),
                    amount: isWithdraw ? `-₹${s.amount}` : `+₹${s.creditsEarned ?? 10}`,
                    kind: isWithdraw ? "withdraw" : "smile",
                }
            })

        const ach = getAchievements()

        setData({
            name: u.name || "Shivam",
            credits: u.credits || 0,
            smiles: smilesArr.filter((s) => s.type !== "withdraw").length,
            streak,
            todayCount,
            nextIn,
            activity,
            achievements: ach,
        })
    }

    useEffect(() => {
        refresh()
        const timer = setInterval(refresh, 2000)
        const onStorage = () => refresh()
        window.addEventListener("storage", onStorage)

        return () => {
            clearInterval(timer)
            window.removeEventListener("storage", onStorage)
        }
    }, [])

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
            <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-yellow-300/25 to-orange-500/15 blur-3xl blob" />
            <div className="absolute top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-600/15 blur-3xl blob2" />
            <div className="absolute -bottom-56 left-24 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-emerald-400/18 to-cyan-500/10 blur-3xl blob" />
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative z-10 p-6 md:p-10 max-w-[1200px] mx-auto">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-gray-300 text-sm">Welcome back</p>
                        <h1 className="text-3xl md:text-4xl font-extrabold">{data.name}</h1>
                        <p className="text-gray-300 mt-2 text-sm">
                            AI-verified smiles update earnings instantly.
                        </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-300/40 to-fuchsia-500/30 border border-white/15" />
                </div>

                <div className="mt-8 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-8 glow-border">
                    <p className="text-gray-300">Total Earnings</p>
                    <h2 className="text-5xl font-extrabold mt-2">
                        <span className="text-green-300">₹</span>
                        <span className="bg-gradient-to-r from-green-200 to-emerald-400 bg-clip-text text-transparent">
                            {data.credits}
                        </span>
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <Badge label="AI Verified" />
                        <Badge label={`${data.smiles} Smiles`} />
                        <Badge label={`${data.streak} Day Streak`} />
                    </div>

                    <div className="mt-6 flex gap-3 flex-col md:flex-row">
                        <button
                            onClick={() => nav("/smile")}
                            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-extrabold hover:scale-[1.02] transition shadow-xl"
                        >
                            Give a Smile
                            <p className="text-xs font-medium opacity-80 mt-1">Earn +₹10</p>
                        </button>

                        <button
                            onClick={() => nav("/withdraw")}
                            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 text-black font-extrabold hover:scale-[1.02] transition shadow-xl"
                        >
                            Wallet
                            <p className="text-xs font-medium opacity-80 mt-1">
                                View transactions
                            </p>
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Today’s Limit"
                        value={`${data.todayCount}/2 Smiles`}
                        sub={`Next allowed: ${data.nextIn}`}
                        accent="from-yellow-300/25 to-orange-500/10"
                    />
                    <StatCard
                        title="Streak Power"
                        value={`${data.streak} Days`}
                        sub="Keep smiling daily"
                        accent="from-fuchsia-500/20 to-purple-600/10"
                    />
                    <StatCard
                        title="Total Smiles"
                        value={`${data.smiles}`}
                        sub="Consistency pays"
                        accent="from-emerald-400/18 to-cyan-500/10"
                    />
                </div>

                <div className="mt-8 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Recent Activity</h3>
                    </div>

                    <div className="mt-5 space-y-3">
                        {data.activity.length ? (
                            data.activity.map((a, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between bg-black/25 border border-white/10 rounded-2xl p-4 hover:bg-black/35 transition"
                                >
                                    <div>
                                        <p className="font-semibold">{a.title}</p>
                                        <p className="text-xs text-gray-300 mt-1">{a.time}</p>
                                    </div>
                                    <p
                                        className={`font-extrabold ${a.kind === "withdraw" ? "text-yellow-200" : "text-green-300"
                                            }`}
                                    >
                                        {a.amount}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-300">
                                No activity yet. Go to Smile Scan and earn your first reward
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6">
                    <h3 className="text-xl font-bold mb-4">Achievements</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.achievements.all.map((a) => {
                            const unlocked = data.achievements.unlocked.includes(a.id)

                            return (
                                <div
                                    key={a.id}
                                    className={`rounded-2xl p-4 text-center border transition ${unlocked
                                            ? "bg-gradient-to-br from-yellow-300/20 to-orange-400/10 border-yellow-300/30"
                                            : "bg-black/25 border-white/10 opacity-50"
                                        }`}
                                >
                                    <div className="text-3xl">{a.icon}</div>
                                    <p className="mt-2 font-bold text-sm">{a.title}</p>
                                    <p className="text-xs text-gray-300 mt-1">{a.desc}</p>
                                    {unlocked && (
                                        <p className="mt-2 text-xs text-green-300 font-semibold">
                                            Unlocked
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Badge({ label }) {
    return (
        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-gray-200">
            {label}
        </span>
    )
}

function StatCard({ title, value, sub, accent }) {
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
}
