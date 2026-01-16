import GlassCard from "./GlassCard"

export default function StatCard({ title, value, sub, accent = "from-white/5 to-white/0" }) {
    return (
        <GlassCard className="p-6 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} blur-2xl`} />
            <div className="relative z-10">
                <p className="text-gray-300 text-sm">{title}</p>
                <h3 className="text-2xl font-extrabold mt-2">{value}</h3>
                {sub ? <p className="text-gray-300 text-sm mt-1">{sub}</p> : null}
            </div>
        </GlassCard>
    )
}
