import { useState } from "react"
import type { Locale } from "../../i18n"

type HeaderLink = {
    label: string
    href: string
}

type HeaderProps = {
    locale: Locale
    setLocale: (l: Locale) => void
    linkPrefix?: string
    showLocaleToggle?: boolean
    sticky?: boolean
    t?: (en: string, ar: string) => string
    navLinks?: HeaderLink[]
    ctaLabel?: string
    ctaHref?: string
    logoUrl?: string
    logoAlt?: string
    brandLabel?: string
}

const Header = ({
    locale,
    setLocale,
    linkPrefix = "",
    showLocaleToggle = true,
    sticky = true,
    t,
    navLinks,
    ctaLabel,
    ctaHref,
    logoUrl,
    logoAlt,
    brandLabel,
}: HeaderProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const isRtl = locale === "ar"
    const resolve = t ?? ((en: string, ar: string) => (isRtl ? ar : en))
    const nextLocaleLabel = locale === "en" ? "عربي" : "EN"
    const appUrl = ctaHref || "https://app.shuoori.com/"
    const actionLabel = ctaLabel || resolve("Get started free", "ابدأ مجاناً")
    const resolvedLogoUrl = logoUrl || "/logo.svg"
    const resolvedLogoAlt = logoAlt || "Shuoori"
    const resolvedBrandLabel = brandLabel || resolve("Shuoori", "شعوري")
    const links =
        navLinks?.length
            ? navLinks
            : [
                { label: resolve("Features", "الميزات"), href: `${linkPrefix}#features` },
                { label: resolve("How it works", "كيف يعمل"), href: `${linkPrefix}#how` },
                { label: resolve("Stories", "قصص"), href: `${linkPrefix}#stories` },
                { label: resolve("Pricing", "الأسعار"), href: `${linkPrefix}#pricing` },
                { label: resolve("FAQ", "الأسئلة الشائعة"), href: `${linkPrefix}#faq` },
            ]

    return (
        <header className={`${sticky ? "sticky" : "relative"} top-0 z-50 w-full bg-[#FCFBF8] transition-all duration-300`}>
            <div className={`mx-auto flex h-[82px] w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] items-center justify-between px-6 py-[8px] lg:px-[96px] ${isRtl ? "flex-row-reverse" : ""}`}>
                <a href="/" className="flex items-center gap-2">
                    <img src={resolvedLogoUrl} alt={resolvedLogoAlt} className="h-[66px] w-[56px] object-contain" />
                    <span className="text-[20px] font-semibold text-[#2EB8AA] tracking-tight">
                        {resolvedBrandLabel}
                    </span>
                </a>

                <nav className={`hidden items-center gap-[32px] text-[16px] font-medium text-[#4A5462] lg:flex ${isRtl ? "flex-row-reverse" : ""}`}>
                    {links.map((link) => (
                        <a key={`${link.href}-${link.label}`} href={link.href} className="hover:text-[#101827] transition-colors">
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className={`flex items-center gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {showLocaleToggle ? (
                        <button
                            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
                            className="inline-flex h-[36px] min-w-[56px] items-center justify-center rounded-[12px] border border-[#E4E6EA] bg-white px-[14px] text-[14px] font-medium leading-none text-[#4A5462] transition-colors hover:bg-gray-50"
                        >
                            <span className={`inline-flex items-center justify-center leading-none ${locale === "en" ? "-translate-y-[2px]" : "translate-y-0"}`}>
                                {nextLocaleLabel}
                            </span>
                        </button>
                    ) : null}

                    <button
                        className="hidden h-[36px] items-center justify-center rounded-[12px] bg-[#2EB8AA] px-[20px] text-[14px] font-semibold leading-none text-white transition-colors hover:bg-[#259b8f] lg:inline-flex"
                        onClick={() => window.location.href = appUrl}
                    >
                        <span className="inline-flex items-center justify-center leading-none">
                            {actionLabel}
                        </span>
                    </button>

                    <button
                        className="flex items-center justify-center p-2 text-[#4A5462] transition-colors hover:text-[#101827] lg:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        )}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 rtl:right-0 rtl:left-auto flex w-full flex-col gap-6 border-t border-[#E4E6EA] bg-[#FCFBF8] px-6 py-6 shadow-xl lg:hidden">
                    <nav className={`flex flex-col gap-6 text-[16px] font-medium text-[#4A5462] ${isRtl ? "text-right" : "text-left"}`}>
                        {links.map((link) => (
                            <a key={`${link.href}-${link.label}`} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#101827] transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <button
                        className="flex h-[44px] w-full items-center justify-center rounded-[12px] bg-[#2EB8AA] px-[12px] text-[16px] font-medium leading-none text-white transition-colors hover:bg-[#259b8f]"
                        onClick={() => window.location.href = appUrl}
                    >
                        <span className="inline-flex items-center justify-center leading-none">
                            {actionLabel}
                        </span>
                    </button>
                </div>
            )}
        </header>
    )
}

export default Header
