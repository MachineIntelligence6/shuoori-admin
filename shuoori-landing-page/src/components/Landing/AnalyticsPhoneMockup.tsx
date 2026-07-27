import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useSpring } from "framer-motion"

type Props = {
    locale: string
    t: (en: string, ar: string) => string
}

// Animated ring counter
function AnimatedNumber({ value, decimals = 2 }: { value: number; decimals?: number }) {
    const spring = useSpring(value, { stiffness: 60, damping: 15 })
    const ref = useRef<HTMLSpanElement>(null)
    useEffect(() => { spring.set(value) }, [value, spring])
    useEffect(() =>
        spring.on("change", (v) => {
            if (ref.current) ref.current.textContent = v.toFixed(decimals)
        }),
        [spring, decimals]
    )
    return <span ref={ref}>{value.toFixed(decimals)}</span>
}

const TABS_EN = ["Emotions", "Factors", "Indicators"]
const TABS_AR = ["المشاعر", "العوامل", "المؤشرات"]
const FILTERS_EN = ["W", "M", "Y", "All"]
const FILTERS_AR = ["أسبوع", "شهر", "سنة", "الكل"]

const NAV = [
    { icon: "📊", labelEn: "Analytics", labelAr: "التحليل", active: true },
    { icon: "📖", labelEn: "Journal", labelAr: "اليومية", active: false },
    { icon: "➕", labelEn: "Track", labelAr: "تتبع", active: false, center: true },
    { icon: "🔔", labelEn: "Notif", labelAr: "إشعارات", active: false },
    { icon: "👤", labelEn: "Profile", labelAr: "حسابي", active: false },
]

void NAV

const INDICATORS = [
    { labelEn: "Severity", labelAr: "الشدة", color: "#6366f1", value: 5.0 },
    { labelEn: "Contrast", labelAr: "التباين", color: "#6366f1", value: 0.0 },
    { labelEn: "Change", labelAr: "التغيير", color: "#f97316", value: 0.0 },
    { labelEn: "Places", labelAr: "الأماكن", color: "#10b981", value: 0.0 },
    { labelEn: "Diversity", labelAr: "التنوع", color: "#ef4444", value: 0.0 },
]

// Mini donut for indicator cards
function MiniDonut({ color, pct = 80 }: { color: string; pct?: number }) {
    const r = 12
    const circ = 2 * Math.PI * r
    return (
        <svg width={32} height={32} viewBox="0 0 32 32">
            <circle cx={16} cy={16} r={r} fill="none" stroke="#f1f3f5" strokeWidth={4} />
            <circle
                cx={16} cy={16} r={r}
                fill="none"
                stroke={color}
                strokeWidth={4}
                strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                strokeDashoffset={circ * 0.25}
                strokeLinecap="round"
                transform="rotate(-90 16 16)"
            />
        </svg>
    )
}

export default function AnalyticsPhoneMockup({ locale, t }: Props) {
    const isRtl = locale === "ar"
    const [activeTab, setActiveTab] = useState(0)
    const [activeFilter, setActiveFilter] = useState(0)
    const [total, setTotal] = useState(1)
    const [pct, setPct] = useState(100)

    // Slowly animate the total up over time to feel alive
    useEffect(() => {
        const id = setInterval(() => {
            setTotal(prev => {
                const next = prev < 12 ? prev + 1 : 1
                setPct(Math.max(30, 100 - (next - 1) * 7))
                return next
            })
        }, 2800)
        return () => clearInterval(id)
    }, [])

    const tabs = isRtl ? TABS_AR : TABS_EN
    const filters = isRtl ? FILTERS_AR : FILTERS_EN

    // Donut params
    const r = 68
    const sw = 14
    const circ = 2 * Math.PI * r
    const filled = (pct / 100) * circ

    return (
        <div className="relative flex flex-col items-center justify-center w-full lg:max-w-[420px] flex-none">
            {/* Phone frame */}
            <div
                className="relative w-[300px] sm:w-[320px] rounded-[40px] overflow-hidden shadow-[0_32px_80px_rgba(16,24,39,0.18),0_0_0_8px_#e8ebf0,0_0_0_9px_#d0d5dd]"
                style={{ background: "#ffffff" }}
            >
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-3 pb-1 bg-white">
                    <span className="text-[12px] font-bold text-[#101827]">10:01</span>
                    <div className="flex items-center gap-1">
                        {/* Signal bars */}
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                            <rect x="0" y="8" width="3" height="4" rx="1" fill="#101827" />
                            <rect x="5" y="5" width="3" height="7" rx="1" fill="#101827" />
                            <rect x="10" y="2" width="3" height="10" rx="1" fill="#101827" />
                            <rect x="15" y="0" width="3" height="12" rx="1" fill="#d0d5dd" />
                        </svg>
                        {/* WiFi */}
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                            <path d="M8 9.5L10 12H6L8 9.5Z" fill="#101827" />
                            <path d="M4 6.5C5.5 5 6.7 4.5 8 4.5C9.3 4.5 10.5 5 12 6.5" stroke="#101827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            <path d="M1 3.5C3.2 1.5 5.5 0.5 8 0.5C10.5 0.5 12.8 1.5 15 3.5" stroke="#101827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                        {/* Battery */}
                        <div className="flex items-center gap-[1px]">
                            <div className="relative w-[20px] h-[11px] rounded-[2px] border border-[#101827]">
                                <div className="absolute inset-[1px] right-[2px] rounded-[1px] bg-[#101827]" style={{ right: 2 }} />
                            </div>
                            <div className="w-[2px] h-[5px] rounded-r-[1px] bg-[#101827]" />
                        </div>
                        <span className="text-[10px] font-semibold text-[#101827] ml-0.5">4G</span>
                    </div>
                </div>

                {/* App Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#f1f3f5]">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2EB8AA] to-[#6366f1] flex items-center justify-center text-white font-bold text-[13px]">S</div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10b981] border-2 border-white" />
                    </div>
                    <div>
                        <p className="text-[14px] font-bold text-[#101827] leading-none">{t("Analytics", "التحليلات")}</p>
                        <p className="text-[11px] text-[#6a727f] mt-[2px]">{t("Discover your emotional patterns", "اكتشف أنماطك العاطفية")}</p>
                    </div>
                </div>

                {/* Tab bar */}
                <div className="flex bg-white border-b border-[#f1f3f5]">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(i)}
                            className="flex-1 py-2 text-[11px] font-semibold transition-all relative"
                            style={{ color: activeTab === i ? "#2EB8AA" : "#9ca3af" }}
                        >
                            {tab}
                            {activeTab === i && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2EB8AA] rounded-t-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Period filter row */}
                <div className="flex items-center gap-[6px] px-4 pt-3 pb-1 bg-white">
                    {filters.map((f, i) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(i)}
                            className="px-3 py-[4px] rounded-full text-[11px] font-semibold transition-all"
                            style={{
                                background: activeFilter === i ? "#f0fdfb" : "transparent",
                                color: activeFilter === i ? "#2EB8AA" : "#9ca3af",
                                border: activeFilter === i ? "1px solid #2EB8AA" : "1px solid transparent",
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Date range */}
                <p className="px-4 py-1 text-[11px] text-[#9ca3af] font-medium">
                    {t("May 26, 2026 – Jun 1, 2026", "٢٦ مايو ٢٠٢٦ – ١ يونيو ٢٠٢٦")}
                </p>

                {/* Scrollable content area */}
                <div className="px-4 pb-2 bg-white flex flex-col gap-3">

                    {/* Emotion Distribution */}
                    <div>
                        <p className="text-[13px] font-bold text-[#101827] mb-2">{t("Emotion Distribution", "توزيع المشاعر")}</p>
                        <div className="flex flex-col items-center gap-1">
                            {/* Large donut */}
                            <div className="relative">
                                <svg width={168} height={168} viewBox="0 0 168 168">
                                    {/* Track */}
                                    <circle cx={84} cy={84} r={r} fill="none" stroke="#f1f5f9" strokeWidth={sw} />
                                    {/* Animated fill */}
                                    <motion.circle
                                        cx={84} cy={84} r={r}
                                        fill="none"
                                        stroke="#2EB8AA"
                                        strokeWidth={sw}
                                        strokeLinecap="round"
                                        animate={{ strokeDasharray: `${filled} ${circ}` }}
                                        initial={{ strokeDasharray: `0 ${circ}` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        style={{ strokeDashoffset: circ * 0.25, transform: "rotate(-90deg)", transformOrigin: "84px 84px" }}
                                    />
                                </svg>
                                {/* Center label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] text-[#9ca3af] font-medium">{t("Total", "المجموع")}</span>
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={total}
                                            initial={{ scale: 0.7, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 1.2, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-[26px] font-black text-[#101827] leading-none"
                                        >
                                            {total}
                                        </motion.span>
                                    </AnimatePresence>
                                    <span className="text-[10px] text-[#4a5462] font-medium">{t("The most: Joy", "الأغلب: الفرح")}</span>
                                </div>
                            </div>

                            {/* Legend dot */}
                            <div className="flex flex-col items-center gap-[1px]">
                                <div className="w-2 h-2 rounded-full bg-[#2EB8AA]" />
                                <span className="text-[10px] font-bold text-[#2EB8AA]">Joy</span>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={pct}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[11px] font-bold text-[#101827]"
                                    >
                                        {pct}%
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Scientific Indicators */}
                    <div>
                        <p className="text-[13px] font-bold text-[#101827] mb-2">{t("Scientific Indicators", "المؤشرات العلمية")}</p>
                        <div className="grid grid-cols-3 gap-[6px]">
                            {INDICATORS.slice(0, 3).map((ind, i) => (
                                <motion.div
                                    key={ind.labelEn}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col items-start gap-1 rounded-[10px] bg-[#f8f9fb] p-[8px]"
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <span className="text-[13px] font-bold text-[#101827]">
                                            <AnimatedNumber value={ind.value} decimals={2} />
                                        </span>
                                        <MiniDonut color={ind.color} pct={i === 0 ? 72 : 20} />
                                    </div>
                                    <span className="text-[10px] text-[#9ca3af] font-medium leading-none">
                                        {t(ind.labelEn, ind.labelAr)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-[6px] mt-[6px]">
                            {INDICATORS.slice(3).map((ind, i) => (
                                <motion.div
                                    key={ind.labelEn}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (i + 3) * 0.1 }}
                                    className="flex flex-col items-start gap-1 rounded-[10px] bg-[#f8f9fb] p-[8px]"
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <span className="text-[13px] font-bold text-[#101827]">
                                            <AnimatedNumber value={ind.value} decimals={2} />
                                        </span>
                                        <MiniDonut color={ind.color} pct={15} />
                                    </div>
                                    <span className="text-[10px] text-[#9ca3af] font-medium leading-none">
                                        {t(ind.labelEn, ind.labelAr)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Nav */}
                <div className="flex items-end bg-white border-t border-[#f1f3f5] pb-4 pt-2">
                    {/* Analytics */}
                    <button className="flex flex-1 flex-col items-center gap-[3px]">
                        <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                            <rect x="0" y="10" width="4" height="8" rx="1.5" fill="#2EB8AA" />
                            <rect x="6" y="6" width="4" height="12" rx="1.5" fill="#2EB8AA" />
                            <rect x="12" y="2" width="4" height="16" rx="1.5" fill="#2EB8AA" />
                            <rect x="18" y="5" width="4" height="13" rx="1.5" fill="#2EB8AA" />
                        </svg>
                        <span className="text-[9px] font-semibold text-[#2EB8AA]">{isRtl ? "التحليل" : "Analytics"}</span>
                    </button>

                    {/* Journal */}
                    <button className="flex flex-1 flex-col items-center gap-[3px]">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect x="2" y="1" width="16" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
                            <path d="M6 6.5H14M6 10H14M6 13.5H11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-[9px] font-semibold text-[#9ca3af]">{isRtl ? "اليومية" : "Journal"}</span>
                    </button>

                    {/* Track - multicolor ring */}
                    <button className="flex flex-1 flex-col items-center gap-[3px]">
                        <div className="relative -mt-5">
                            <svg width="46" height="46" viewBox="0 0 46 46">
                                {/* White background circle */}
                                <circle cx="23" cy="23" r="22" fill="white" />
                                {/* Multicolor ring segments */}
                                {/* Green top-right */}
                                <circle cx="23" cy="23" r="18" fill="none" stroke="#10b981" strokeWidth="4"
                                    strokeDasharray="28.3 84.8" strokeDashoffset="0"
                                    transform="rotate(-90 23 23)" strokeLinecap="round" />
                                {/* Blue right-bottom */}
                                <circle cx="23" cy="23" r="18" fill="none" stroke="#3b82f6" strokeWidth="4"
                                    strokeDasharray="28.3 84.8" strokeDashoffset="-28.3"
                                    transform="rotate(-90 23 23)" strokeLinecap="round" />
                                {/* Red bottom-left */}
                                <circle cx="23" cy="23" r="18" fill="none" stroke="#ef4444" strokeWidth="4"
                                    strokeDasharray="28.3 84.8" strokeDashoffset="-56.6"
                                    transform="rotate(-90 23 23)" strokeLinecap="round" />
                                {/* Yellow left-top */}
                                <circle cx="23" cy="23" r="18" fill="none" stroke="#f59e0b" strokeWidth="4"
                                    strokeDasharray="26.3 84.8" strokeDashoffset="-84.9"
                                    transform="rotate(-90 23 23)" strokeLinecap="round" />
                                {/* Plus sign */}
                                <line x1="23" y1="15" x2="23" y2="31" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="15" y1="23" x2="31" y2="23" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-[9px] font-semibold text-[#9ca3af]">{isRtl ? "تتبع" : "Track"}</span>
                    </button>

                    {/* Notification */}
                    <button className="flex flex-1 flex-col items-center gap-[3px]">
                        <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                            <path d="M10 1C10 1 4 4 4 11V15L2 17V18H18V17L16 15V11C16 4 10 1 10 1Z" stroke="#9ca3af" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                            <path d="M8 18C8 19.1 8.9 20 10 20C11.1 20 12 19.1 12 18" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                        <span className="text-[9px] font-semibold text-[#9ca3af]">{isRtl ? "إشعارات" : "Notification"}</span>
                    </button>

                    {/* Profile */}
                    <button className="flex flex-1 flex-col items-center gap-[3px]">
                        <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                            <circle cx="10" cy="7" r="4" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
                            <path d="M2 20C2 16.7 5.6 14 10 14C14.4 14 18 16.7 18 20" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                        <span className="text-[9px] font-semibold text-[#9ca3af]">{isRtl ? "حسابي" : "Profile"}</span>
                    </button>
                </div>

                {/* iOS home indicator */}
                <div className="flex justify-center pb-2 bg-white">
                    <div className="w-[100px] h-[4px] rounded-full bg-[#101827]" />
                </div>
            </div>

            {/* Soft ambient glow behind phone */}
            <div
                className="absolute -z-10 w-[260px] h-[260px] rounded-full blur-[80px] opacity-30"
                style={{ background: "radial-gradient(circle, #2EB8AA 0%, transparent 70%)" }}
            />
        </div>
    )
}
