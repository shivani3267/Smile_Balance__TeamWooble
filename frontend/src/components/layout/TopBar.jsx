import OutlineButton from "../ui/OutlineButton"

export default function TopBar({ kicker, title, subtitle, onBack, right }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                {kicker ? <p className="text-gray-300 text-sm">{kicker}</p> : null}
                <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
                {subtitle ? <p className="text-gray-300 mt-2 text-sm max-w-xl">{subtitle}</p> : null}
            </div>

            <div className="flex items-center gap-3">
                {right}
                {onBack ? <OutlineButton onClick={onBack}>← Back</OutlineButton> : null}
            </div>
        </div>
    )
}
