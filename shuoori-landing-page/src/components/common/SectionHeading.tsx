type SectionHeadingProps = {
    /** Full title text. The highlighted word(s) will be wrapped in gradient span. */
    title: string
    /** Specific word(s) that should be highlighted in teal-to-blue gradient. */
    highlight?: string | string[]
    subtitle?: string
    className?: string
    titleClassName?: string
    align?: "center" | "start"
    showBackdrop?: boolean
}

const SectionHeading = ({
    title,
    highlight,
    subtitle,
    className = "",
    titleClassName = "",
    align = "center",
    showBackdrop = true,
}: SectionHeadingProps) => {
    const alignClass = align === "center" ? "text-center" : "text-start"

    const renderTitle = () => {
        if (!highlight) {
            return (
                <span className="relative z-10 block text-[#1A1A1A]">
                    {title}
                </span>
            )
        }
        const highlights = Array.isArray(highlight) ? highlight : [highlight]
        const escaped = highlights.map((value) =>
            value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        )
        const regex = new RegExp(`(${escaped.join("|")})`, "g")
        const parts = title.split(regex)
        return (
            <>
                {parts.map((part, idx) =>
                    highlights.includes(part) ? (
                        <span
                            key={`${part}-${idx}`}
                            className="bg-gradient-to-l from-[#00A3A8] to-[#0461A8] bg-clip-text text-transparent inline-block"
                        >
                            {part}
                        </span>
                    ) : (
                        <span key={`text-${idx}`}>{part}</span>
                    )
                )}
            </>
        )
    }

    return (
        <div className={`${alignClass} ${className}`}>
            <h2 className={`text-4xl font-bold leading-tight text-text-base relative ${titleClassName}`}>
                {renderTitle()}
                {showBackdrop && (
                    <span className="absolute -inset-1 -z-10 block -rotate-1 rounded-sm bg-gradient-to-r from-[#00A3A8] to-[#0461A8] opacity-10" />
                )}
            </h2>
            {subtitle && (
                <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted">
                    {subtitle}
                </p>
            )}
        </div>
    )
}

export default SectionHeading
