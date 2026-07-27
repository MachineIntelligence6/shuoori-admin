import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useSpring } from "framer-motion"
import {
    Heart,
    Smile,
    ShieldAlert,
    Flame,
    ThumbsUp,
    ThumbsDown,
    Sparkles,
    RotateCcw,
} from "lucide-react"

// A simple counter component that animates changes
function DynamicPercent({ value }: { value: number }) {
    const springValue = useSpring(value, { stiffness: 60, damping: 15 })
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        springValue.set(value)
    }, [value, springValue])

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest) + "%"
            }
        })
    }, [springValue])

    return <span ref={ref}>{Math.round(value)}%</span>
}

type InteractiveAnalyticsPreviewProps = {
    locale: string
    t: (en: string, ar: string) => string
}

export default function InteractiveAnalyticsPreview({ locale, t }: InteractiveAnalyticsPreviewProps) {
    const isRtl = locale === "ar"

    // Default starting counts representing the screenshot
    const defaultCounts = {
        love: 4,
        joy: 1,
        fear: 2,
        anger: 2,
    }

    const [counts, setCounts] = useState(defaultCounts)
    const [filter, setFilter] = useState<"positive" | "negative" | null>(null)
    const [hovered, setHovered] = useState<"love" | "joy" | "fear" | "anger" | null>(null)
    const [lastLogged, setLastLogged] = useState<"love" | "joy" | "fear" | "anger" | null>(null)
    const [particles, setParticles] = useState<{ id: number; emoji: string; x: number }[]>([])
    const [isAutoplay, setIsAutoplay] = useState(true)
    const [simulatedActive, setSimulatedActive] = useState<"love" | "joy" | "fear" | "anger" | null>(null)

    const total = counts.love + counts.joy + counts.fear + counts.anger

    const emotions = [
        { key: "love" as const, color: "#ff006e", label: t("Love", "الحب"), Icon: Heart, emoji: "💖" },
        { key: "joy" as const, color: "#10b57e", label: t("Joy", "الفرح"), Icon: Smile, emoji: "😊" },
        { key: "fear" as const, color: "#6b7280", label: t("Fear", "الخوف"), Icon: ShieldAlert, emoji: "🛡️" },
        { key: "anger" as const, color: "#dc2626", label: t("Anger", "الغضب"), Icon: Flame, emoji: "🔥" },
    ]

    // Calculate segments for the donut chart
    let cumulativePercent = 0
    const slices = emotions.map((emotion) => {
        const count = counts[emotion.key]
        const percent = total > 0 ? (count / total) * 100 : 0
        const startPercent = cumulativePercent
        cumulativePercent += percent
        return {
            ...emotion,
            count,
            percent,
            startPercent,
        }
    })

    // SVG parameters
    const r = 64
    const strokeWidth = 18
    const circumference = 2 * Math.PI * r // ~402.12
    const cx = 80
    const cy = 80

    // Particle emitter function
    const triggerLog = (key: "love" | "joy" | "fear" | "anger", isManual = true) => {
        if (isManual) {
            setIsAutoplay(false)
        }
        setCounts((prev) => ({
            ...prev,
            [key]: prev[key] + 1,
        }))
        setLastLogged(key)
        const id = Date.now() + Math.random()
        const emoji = emotions.find((e) => e.key === key)?.emoji || "✨"

        // Horizontal offset mappings for button positions
        const xOffsetMap = { love: -75, joy: 75, fear: -75, anger: 75 }
        const baseOffset = xOffsetMap[key] || 0
        const randomX = baseOffset + (Math.random() * 32 - 16)

        setParticles((prev) => [...prev, { id, emoji, x: randomX }])
    }

    const resetStats = () => {
        setCounts(defaultCounts)
        setLastLogged(null)
        setFilter(null)
        setHovered(null)
        setIsAutoplay(true)
    }

    // Autoplay simulation loop
    useEffect(() => {
        if (!isAutoplay) return

        const cycle = ["love", "joy", "fear", "anger"] as const
        let index = 0

        const interval = setInterval(() => {
            const nextMood = cycle[index]

            // Set simulated active state for visual button press effect
            setSimulatedActive(nextMood)
            setTimeout(() => {
                setSimulatedActive(null)
            }, 300)

            triggerLog(nextMood, false)

            index = (index + 1) % cycle.length
        }, 4000)

        return () => clearInterval(interval)
    }, [isAutoplay])

    // Dynamic AI Insights text based on dominant/last logged mood
    const getInsightText = () => {
        const mood = lastLogged || "default"
        switch (mood) {
            case "love":
                return t(
                    "Love dominates! Strong emotional connections trigger oxytocin, promoting heart health and lowering daily stress levels by up to 24%. Write down what sparked this connection!",
                    "مشاعر الحب طاغية! الروابط العاطفية القوية تفرز الأوكسيتوسين، مما يعزز صحة القلب ويخفض مستويات التوتر اليومي بنسبة تصل إلى ٢٤٪. اكتب ما الذي أثار هذا الارتباط!"
                )
            case "joy":
                return t(
                    "Joy index rising! Elevated happiness boosts dopamine, which expands cognitive flexibility and creative problem-solving. Use this positive energy to tackle a challenge!",
                    "مؤشر الفرح يرتفع! السعادة العالية تزيد الدوبامين، مما يوسع المرونة المعرفية وحل المشكلات الإبداعية. استغل هذه الطاقة الإيجابية لمواجهة التحديات!"
                )
            case "fear":
                return t(
                    "Anxiety/Fear is elevated. Remember, fear is a biological signal of alertness. Try a quick 4-7-8 breathing exercise to signal safety to your nervous system.",
                    "الخوف أو القلق مرتفع. تذكر أن الخوف هو إشارة بيولوجية لليقظة. جرب تمرين التنفس ٤-٧-٨ السريع لإرسال إشارة أمان لجهازك العصبي."
                )
            case "anger":
                return t(
                    "Anger is logged. Frustration is high-intensity energy. Channel it constructively into physical movement, or try a 2-minute unfiltered voice entry to vent safely.",
                    "تم تسجيل الغضب. الإحباط هو طاقة عالية الكثافة. وجهها بشكل بناء في النشاط البدني، أو جرب تسجيل تدوين صوتي سريع للتنفيس بأمان."
                )
            default:
                return t(
                    "Your positive ratio is at 72% this week. Consistently tracking helps identify behavioral triggers early. Try adding a log to see your trends adapt!",
                    "نسبة إيجابيتك هي ٧٢٪ هذا الأسبوع. يساعد التتبع المستمر في تحديد محفزات السلوك مبكراً. جرب إضافة تسجيل لرؤية اتجاهاتك تتكيف!"
                )
        }
    }

    // Determine the glow/border color of the card based on the hovered segment or active insight
    const getActiveThemeColor = () => {
        if (hovered) {
            return emotions.find((e) => e.key === hovered)?.color
        }
        if (lastLogged) {
            return emotions.find((e) => e.key === lastLogged)?.color
        }
        return "#2EB8AA"
    }

    return (
        <div className={`relative flex flex-col items-center justify-center w-full lg:max-w-[512px] flex-none gap-[24px] ${isRtl ? "text-right" : "text-left"}`}>

            {/* Flying Particles Container */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                <AnimatePresence>
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 1, y: 350, scale: 0.6, x: `calc(50% + ${p.x}px)` }}
                            animate={{ opacity: 0, y: 50, scale: 2.2, rotate: p.x * 2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.4, ease: "easeOut" }}
                            onAnimationComplete={() => {
                                setParticles((prev) => prev.filter((item) => item.id !== p.id))
                            }}
                            className="absolute pointer-events-none text-3xl"
                        >
                            {p.emoji}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Top Interactive Floating Badges */}
            <div className="flex flex-wrap items-center justify-center gap-[16px] z-20">
                <motion.div
                    whileHover={{ scale: 1.06, rotate: -16 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                        setFilter(filter === "positive" ? null : "positive")
                        setIsAutoplay(false)
                    }}
                    className={`cursor-pointer transition-all -rotate-[16deg] rounded-[14px] bg-white px-[20px] py-[14px] shadow-[0_12px_24px_rgba(16,24,39,0.08)] border-2 ${filter === "positive" ? "border-[#2EB8AA] shadow-[0_0_20px_rgba(46,184,170,0.25)]" : "border-transparent"
                        }`}
                >
                    <div className="flex items-center gap-[8px]">
                        <ThumbsUp className={`h-[24px] w-[24px] transition-colors ${filter === "positive" ? "text-[#2EB8AA] fill-[#2EB8AA]/10" : "text-[#2EB8AA]"}`} strokeWidth={2.5} />
                        <p className="text-[15px] font-bold leading-[20px] text-[#101827]">{t("72% Positive", "٪72 إيجابي")}</p>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.06, rotate: 16 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                        setFilter(filter === "negative" ? null : "negative")
                        setIsAutoplay(false)
                    }}
                    className={`cursor-pointer transition-all rotate-[16deg] rounded-[14px] bg-white px-[20px] py-[14px] shadow-[0_12px_24px_rgba(16,24,39,0.08)] border-2 ${filter === "negative" ? "border-[#f97316] shadow-[0_0_20px_rgba(249,115,22,0.25)]" : "border-transparent"
                        }`}
                >
                    <div className="flex items-center gap-[8px]">
                        <ThumbsDown className={`h-[24px] w-[24px] transition-colors ${filter === "negative" ? "text-[#f97316] fill-[#f97316]/10" : "text-[#f97316]"}`} strokeWidth={2.5} />
                        <p className="text-[15px] font-bold leading-[20px] text-[#101827]">{t("18% Negative", "٪18 سلبي")}</p>
                    </div>
                </motion.div>
            </div>

            {/* Main Interactive Card Container */}
            <motion.div
                animate={{
                    borderColor: getActiveThemeColor() + "33",
                    boxShadow: hovered
                        ? `0_20px_40px_${getActiveThemeColor()}1a`
                        : "0px 16px 36px rgba(16, 24, 39, 0.08)"
                }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[420px] rounded-[24px] bg-white p-[28px] border border-[#eaecf0] flex flex-col gap-[24px]"
            >
                {/* SVG Donut Chart Area */}
                <div className="relative flex justify-center items-center h-[180px]">
                    <svg viewBox="0 0 160 160" className="w-[180px] h-[180px] select-none">
                        <AnimatePresence>
                            {slices.map((slice) => {
                                const isDimmed =
                                    (filter === "positive" && !["love", "joy"].includes(slice.key)) ||
                                    (filter === "negative" && !["fear", "anger"].includes(slice.key))

                                const isFocused = hovered === slice.key || (hovered === null && lastLogged === slice.key)

                                return (
                                    <motion.circle
                                        key={slice.key}
                                        cx={cx}
                                        cy={cy}
                                        r={r}
                                        fill="transparent"
                                        stroke={slice.color}
                                        strokeWidth={isFocused ? strokeWidth + 4 : strokeWidth}
                                        strokeDasharray={`${(slice.percent / 100) * circumference} ${circumference}`}
                                        transform="rotate(-90 80 80)"
                                        style={{ transformOrigin: "80px 80px", cursor: "pointer" }}
                                        animate={{
                                            strokeDasharray: `${(slice.percent / 100) * circumference} ${circumference}`,
                                            strokeDashoffset: -(slice.startPercent / 100) * circumference,
                                            opacity: isDimmed ? 0.18 : 1,
                                            scale: isFocused ? 1.05 : 1,
                                        }}
                                        whileHover={{ scale: 1.05, strokeWidth: strokeWidth + 4 }}
                                        onHoverStart={() => {
                                            setHovered(slice.key)
                                            setIsAutoplay(false)
                                        }}
                                        onHoverEnd={() => setHovered(null)}
                                        onClick={() => triggerLog(slice.key, true)}
                                        transition={{ type: "spring", stiffness: 90, damping: 18 }}
                                    />
                                )
                            })}
                        </AnimatePresence>
                    </svg>

                    {/* Donut Center Dynamic Details */}
                    <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-[12px] font-semibold text-[#8e95a2] tracking-wider uppercase">
                            {hovered ? slices.find((s) => s.key === hovered)?.label : t("Total", "المجموع")}
                        </span>
                        <motion.span
                            key={hovered || "total"}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-[28px] font-black text-[#101827] leading-none my-1"
                        >
                            {hovered
                                ? counts[hovered]
                                : total}
                        </motion.span>
                        <span className="text-[11px] font-medium text-[#2EB8AA] bg-[#F2FBF9] px-2 py-0.5 rounded-full">
                            {hovered
                                ? `${Math.round((counts[hovered] / total) * 100)}%`
                                : t("Most: Love", "الأغلب: الحب")}
                        </span>
                    </div>
                </div>

                {/* Emotion Legend Layout */}
                <div className="flex items-start gap-[8px] justify-between">
                    {slices.map((slice) => {
                        const isFocused = hovered === slice.key
                        const isDimmed =
                            (filter === "positive" && !["love", "joy"].includes(slice.key)) ||
                            (filter === "negative" && !["fear", "anger"].includes(slice.key))

                        return (
                            <motion.div
                                key={slice.key}
                                animate={{
                                    scale: isFocused ? 1.05 : 1,
                                    opacity: isDimmed ? 0.4 : 1,
                                }}
                                className="flex flex-1 flex-col items-center gap-[4px] cursor-pointer"
                                onHoverStart={() => {
                                    setHovered(slice.key)
                                    setIsAutoplay(false)
                                }}
                                onHoverEnd={() => setHovered(null)}
                                onClick={() => triggerLog(slice.key, true)}
                            >
                                <div className="flex items-center gap-[4px] sm:gap-[6px]">
                                    <slice.Icon className="h-[13px] w-[13px]" style={{ color: slice.color }} strokeWidth={2.5} />
                                    <p className="text-[12px] sm:text-[13px] font-semibold text-[#6A727F] truncate max-w-[50px]">{slice.label}</p>
                                </div>
                                <p className="text-[13px] font-bold leading-none" style={{ color: slice.color }}>
                                    <DynamicPercent value={slice.percent} />
                                </p>
                            </motion.div>
                        )
                    })}
                </div>

                <div className="h-[1px] bg-[#eaecf0] w-full" />

                {/* Interactive Simulator Section */}
                <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[6px] text-[#1c6964]">
                            <Sparkles className="h-[15px] w-[15px]" />
                            <p className="text-[12px] font-bold uppercase tracking-wider">
                                {t("Interactive Mood Simulator", "محاكي المشاعر التفاعلي")}
                            </p>
                        </div>

                        {/* Reset Stats trigger */}
                        {(counts.love !== defaultCounts.love || counts.joy !== defaultCounts.joy || counts.fear !== defaultCounts.fear || counts.anger !== defaultCounts.anger) && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1, rotate: -45 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={resetStats}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Reset simulation"
                            >
                                <RotateCcw className="h-[15px] w-[15px]" />
                            </motion.button>
                        )}
                    </div>

                    {/* Interactive Log Buttons */}
                    <div className="grid grid-cols-2 gap-[8px]">
                        {emotions.map((em) => {
                            const isSimulatedPressed = simulatedActive === em.key
                            return (
                                <motion.button
                                    key={em.key}
                                    whileHover={{ y: -3, scale: 1.02, boxShadow: `0px 4px 12px ${em.color}15` }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => triggerLog(em.key, true)}
                                    animate={isSimulatedPressed ? { scale: 0.93, backgroundColor: "#f3f4f6", borderColor: em.color } : { scale: 1, backgroundColor: "#ffffff", borderColor: "#e4e6ea" }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center justify-center gap-[8px] rounded-[12px] border py-[10px] px-[12px] transition-colors"
                                >
                                    <span className="text-[16px]">{em.emoji}</span>
                                    <span className="text-[13px] font-bold text-[#101827]">
                                        {t(`+ ${em.label}`, `+ ${em.label}`)}
                                    </span>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>

                {/* Interactive AI Recommendation Insight */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={lastLogged || "default"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-[16px] bg-[#f8f9fb] p-[16px] border border-[#eaecf0] flex flex-col gap-[8px]"
                    >
                        <div className="flex items-center gap-[6px] text-[#2eb8aa]">
                            <Sparkles className="h-[15px] w-[15px] fill-[#2eb8aa]/20" />
                            <h4 className="text-[12px] font-bold tracking-wide uppercase">
                                {lastLogged
                                    ? t(`${emotions.find(e => e.key === lastLogged)?.label} Insight`, `رؤية ${emotions.find(e => e.key === lastLogged)?.label}`)
                                    : t("AI wellness feedback", "بصيرة الذكاء الاصطناعي")}
                            </h4>
                        </div>
                        <p className="text-[13px] leading-[20px] text-[#4a5462]">
                            {getInsightText()}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
