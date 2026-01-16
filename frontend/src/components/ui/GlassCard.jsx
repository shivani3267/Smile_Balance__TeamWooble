

export default function GlassCard({ className = "", children }) {
    return (
        <div
            className={[
                "bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl",
                "shadow-2xl",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    )
}
