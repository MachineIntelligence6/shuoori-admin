import type { ReactNode } from "react"

type ButtonVariant = "filled" | "outline"
type ButtonSize = "md" | "lg"

type ButtonProps = {
    children: ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    onClick?: () => void
    className?: string
    style?: React.CSSProperties
    type?: "button" | "submit" | "reset"
}

/**
 * Filled: gradient bg + blue box-shadow
 * Outline: gradient border via ::before pseudo, transparent bg with subtle tint
 */
const Button = ({
    children,
    variant = "filled",
    size = "md",
    onClick,
    className = "",
    style,
    type = "button",
}: ButtonProps) => {
    const sizeClasses =
        size === "lg" ? "h-14 px-8 py-0 text-base" : "h-11 px-6 py-0 text-sm"

    if (variant === "filled") {
        return (
            <button
                type={type}
                onClick={onClick}
                className={`bg-gradient-to-r from-[#00A3A8] to-[#0461A8] inline-flex items-center justify-center rounded-lg font-semibold leading-none text-white transition-opacity hover:opacity-90 ${sizeClasses} ${className}`}
                style={{ boxShadow: "0px 4px 32.9px 0px rgba(4, 97, 168, 0.15)", ...style }}
            >
                <span className="btn-label inline-flex items-center gap-2">{children}</span>
            </button>
        )
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`border-[1.5px] border-[#00A3A8] text-[#00A3A8] bg-transparent inline-flex items-center rounded-lg font-semibold leading-none transition-opacity hover:opacity-80 ${sizeClasses} ${className}`}
            style={style}
        >
            <span className="btn-label inline-flex items-center gap-2">{children}</span>
        </button>
    )
}

export default Button
