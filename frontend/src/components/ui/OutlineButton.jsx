export default function OutlineButton({ className = "", children, ...props }) {
    return (
        <button
            className={[
                "px-4 py-2 rounded-2xl bg-white/10 border border-white/15",
                "font-extrabold hover:bg-white/15 transition",
                "disabled:opacity-40",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </button>
    )
}
