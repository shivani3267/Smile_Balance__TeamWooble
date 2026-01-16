export default function PrimaryButton({ className = "", children, ...props }) {
    return (
        <button
            className={[
                "px-6 py-4 rounded-2xl font-extrabold transition shadow-xl",
                "hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </button>
    )
}
