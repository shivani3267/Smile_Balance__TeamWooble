export default function InfoCard({ title, value, accent = "from-white/5 to-white/0" }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-black/25 p-4">
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} blur-2xl`} />
            <div className="relative z-10">
                <p className="text-xs text-gray-400">{title}</p>
                <p className="mt-1 font-extrabold">{value}</p>
            </div>
        </div>
    )
}
