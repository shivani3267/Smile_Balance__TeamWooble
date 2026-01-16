export default function Badge({ label }) {
    return (
        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-gray-200">
            {label}
        </span>
    )
}
