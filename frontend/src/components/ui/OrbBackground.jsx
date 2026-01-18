export default function OrbBackground() {
    return (
        <>
            { }
            <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-yellow-300/25 to-orange-500/15 blur-3xl blob" />
            <div className="absolute top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-600/15 blur-3xl blob2" />
            <div className="absolute -bottom-56 left-24 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-emerald-400/18 to-cyan-500/10 blur-3xl blob" />

            { }
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />
        </>
    )
}
