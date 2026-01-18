import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUser, setUser, getSmiles, setSmiles } from "../utils/storage"

const MIN_WITHDRAW = 100

export default function Withdraw() {
    const nav = useNavigate()

    const [credits, setCredits] = useState(0)
    const [smiles, setSmilesState] = useState([])
    const [upi, setUpi] = useState("")
    const [amount, setAmount] = useState("")
    const [msg, setMsg] = useState("")

    const refresh = () => {
        const u = getUser()
        const s = getSmiles()
        setCredits(u.credits || 0)
        setSmilesState(s)
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

    const tx = useMemo(() => {

        return [...smiles].slice().reverse()
    }, [smiles])

    const withdrawable = credits >= MIN_WITHDRAW

    const doWithdraw = () => {
        setMsg("")

        const amt = Number(amount)
        if (!upi.trim()) return setMsg(" Enter UPI ID")
        if (!Number.isFinite(amt) || amt <= 0) return setMsg(" Enter valid amount")
        if (amt < MIN_WITHDRAW) return setMsg(` Minimum withdrawal is ₹{MIN_WITHDRAW}`)
        if (amt > credits) return setMsg(" Amount exceeds available balance")


        const u = getUser()
        u.credits = (u.credits || 0) - amt
        if (u.credits < 0) u.credits = 0
        setUser(u)


        const s = getSmiles()
        s.push({
            type: "withdraw",
            time: Date.now(),
            upi,
            amount: amt,
            creditsEarned: 0,
        })
        setSmiles(s)

        setAmount("")
        setMsg(" Withdrawal request submitted. Balance updated.")
        refresh()
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
            { }
            <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-emerald-400/18 to-cyan-500/10 blur-3xl blob" />
            <div className="absolute top-24 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-yellow-300/22 to-orange-500/12 blur-3xl blob2" />
            <div className="absolute -bottom-56 left-20 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-fuchsia-500/18 to-purple-600/12 blur-3xl blob" />

            { }
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative z-10 p-6 md:p-10 max-w-[1200px] mx-auto">
                { }
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-300 text-sm">Wallet</p>
                        <h1 className="text-3xl md:text-4xl font-extrabold">Your Balance 💳</h1>
                        <p className="text-gray-300 mt-2 text-sm">
                            Live data from localStorage • Credits are treated as ₹ (demo)
                        </p>
                    </div>

                    <button
                        onClick={() => nav("/dashboard")}
                        className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
                    >
                        ← Back
                    </button>
                </div>

                { }
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    { }
                    <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-8 glow-border relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-yellow-300/10 blur-2xl" />

                        <div className="relative z-10">
                            <p className="text-gray-300">Available Balance</p>
                            <h2 className="text-5xl md:text-6xl font-extrabold mt-2">
                                <span className="text-green-300">₹</span>
                                <span className="bg-gradient-to-r from-green-200 to-emerald-400 bg-clip-text text-transparent">
                                    {credits}
                                </span>
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <Badge label={`${credits} Credits`} />
                                <Badge label={`Min withdraw ₹${MIN_WITHDRAW}`} />
                                <Badge label="Instant (Demo)" />
                            </div>

                            {/* Conversion */}
                            <div className="mt-7 bg-black/25 border border-white/10 rounded-2xl p-5">
                                <p className="text-sm text-gray-300">Conversion</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-gray-200 font-semibold">1 Credit</p>
                                    <p className="text-gray-400">=</p>
                                    <p className="text-green-300 font-extrabold">₹1</p>
                                </div>
                                <p className="mt-3 text-xs text-gray-400">
                                    Demo conversion for hackathon UI.
                                </p>
                            </div>
                        </div>
                    </div>

                    { }
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6">
                        <h3 className="text-xl font-bold">Withdraw</h3>
                        <p className="text-gray-300 text-sm mt-2">
                            Frontend demo: creates a wallet transaction and updates balance.
                        </p>

                        <div className="mt-5 space-y-3">
                            <input
                                value={upi}
                                onChange={(e) => setUpi(e.target.value)}
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-emerald-300/50"
                                placeholder="UPI ID (e.g. name@paytm)"
                            />
                            <input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-emerald-300/50"
                                placeholder="Amount (₹)"
                                inputMode="numeric"
                            />
                        </div>

                        <button
                            onClick={doWithdraw}
                            className={`mt-5 w-full py-4 rounded-2xl font-extrabold transition ${withdrawable
                                ? "bg-gradient-to-r from-emerald-300 to-green-400 text-black hover:scale-[1.02]"
                                : "bg-white/10 text-gray-400 cursor-not-allowed"
                                }`}
                            disabled={!withdrawable}
                        >
                            Withdraw Now
                        </button>

                        {msg ? (
                            <p className="mt-4 text-sm font-semibold">{msg}</p>
                        ) : null}

                        <div className="mt-4 bg-black/25 border border-white/10 rounded-2xl p-4">
                            <p className="text-sm text-gray-300">Status</p>
                            <p className="mt-2 text-sm">
                                {credits >= MIN_WITHDRAW ? (
                                    <span className="text-green-300 font-semibold">
                                        Eligible to withdraw
                                    </span>
                                ) : (
                                    <span className="text-yellow-200 font-semibold">
                                        Need ₹{MIN_WITHDRAW - credits} more
                                    </span>
                                )}
                            </p>
                            <p className="mt-2 text-xs text-gray-400">
                                This is UI-only. Add backend later for real payouts.
                            </p>
                        </div>
                    </div>
                </div>

                { }
                <div className="mt-6 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Transactions</h3>
                        <span className="text-xs text-gray-400">Latest first</span>
                    </div>

                    <div className="mt-5 space-y-3">
                        {tx.length ? (
                            tx.map((t, idx) => {
                                const isWithdraw = t.type === "withdraw"
                                const amountText = isWithdraw
                                    ? `-₹${t.amount}`
                                    : `+₹${t.creditsEarned ?? 10}`
                                const title = isWithdraw ? "Withdrawal Request" : "Smile Verified"
                                const time = new Date(t.time).toLocaleString()

                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-black/25 border border-white/10 rounded-2xl p-4 hover:bg-black/35 transition"
                                    >
                                        <div>
                                            <p className="font-semibold">{title}</p>
                                            <p className="text-xs text-gray-300 mt-1">{time}</p>
                                            {isWithdraw && t.upi ? (
                                                <p className="text-xs text-gray-400 mt-1">UPI: {t.upi}</p>
                                            ) : null}
                                        </div>

                                        <p className={`font-extrabold ${isWithdraw ? "text-yellow-200" : "text-green-300"}`}>
                                            {amountText}
                                        </p>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-gray-300">
                                No transactions yet. Go to Smile Scan and earn your first reward
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 flex flex-col md:flex-row gap-3">
                    <button
                        onClick={() => nav("/smile")}
                        className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-extrabold hover:scale-[1.01] transition"
                    >
                        Earn More Credits
                    </button>
                    <button
                        onClick={() => nav("/dashboard")}
                        className="flex-1 py-4 rounded-2xl bg-white/10 border border-white/15 font-extrabold hover:bg-white/15 transition"
                    >
                        Back to Dashboard
                    </button>
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
