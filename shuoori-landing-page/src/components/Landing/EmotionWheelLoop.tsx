import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import type { Locale } from "../../i18n"

type EmotionWheelLoopProps = {
    locale: Locale
}

type LocalizedLabel = {
    en: string
    ar: string
}

type OuterEmotion = {
    label: LocalizedLabel
    color: string
}

type EmotionDetail = {
    middle: LocalizedLabel
    middleColor: string
    outers: OuterEmotion[]
}

type EmotionGroup = {
    id: string
    label: LocalizedLabel
    color: string
    glow: string
    previewIndex: number
    details: EmotionDetail[]
}

const CORE_SEGMENT_CENTERS = [0, 60, 120, 180, 240, 300]
const DETAIL_SEGMENT_CENTERS = [0, 90, 180, 270]
const CORE_SEGMENT_SPAN = 52
const DETAIL_SEGMENT_SPAN = 90
const VIEWBOX_SIZE = 460
const CENTER = VIEWBOX_SIZE / 2

const label = (en: string, ar = en): LocalizedLabel => ({ en, ar })

const EMOTION_TONES: Record<string, { middle: string; outer: string }> = {
    love: { middle: "#F53B98", outer: "#D41C6E" },
    joy: { middle: "#56D9B1", outer: "#1E9A74" },
    surprise: { middle: "#FFD35D", outer: "#DDA015" },
    sadness: { middle: "#89B4FF", outer: "#3D78E5" },
    anger: { middle: "#FF988B", outer: "#E5503F" },
    fear: { middle: "#B5C2D4", outer: "#78889B" },
}

const EMOTION_GROUPS: EmotionGroup[] = [
    {
        id: "love",
        label: label("Love", "الحب"),
        color: "#FF0A78",
        glow: "rgba(255, 10, 120, 0.28)",
        previewIndex: 3,
        details: [
            {
                middle: label("Affectionate", "حنون"),
                middleColor: "#FF78B2",
                outers: [
                    { label: label("Secure", "آمن"), color: "#F868A8" },
                    { label: label("Warm", "دافئ"), color: "#FB72AF" },
                    { label: label("Tender", "رقيق"), color: "#F95E9F" },
                    { label: label("Caring", "مهتم"), color: "#F76AA7" },
                ],
            },
            {
                middle: label("Longing", "مشتاق"),
                middleColor: "#FF7FBA",
                outers: [
                    { label: label("Trusting", "واثق"), color: "#F47AB2" },
                    { label: label("Drawn", "منجذب"), color: "#F783B8" },
                    { label: label("Attached", "مرتبط"), color: "#EF6EA9" },
                    { label: label("Yearning", "متلهف"), color: "#F887BD" },
                ],
            },
            {
                middle: label("Desire", "رغبة"),
                middleColor: "#FF73AE",
                outers: [
                    { label: label("Content", "مكتف"), color: "#F76CA8" },
                    { label: label("Passionate", "شغوف"), color: "#F963A1" },
                    { label: label("Attracted", "منجذب"), color: "#FB7AB3" },
                    { label: label("Craving", "متلهف"), color: "#F45C9C" },
                ],
            },
            {
                middle: label("Peaceful", "مسالم"),
                middleColor: "#FF0A78",
                outers: [
                    { label: label("Calm", "هادئ"), color: "#FF0A78" },
                    { label: label("Safe", "مطمئن"), color: "#FA3A90" },
                    { label: label("Rested", "مرتاح"), color: "#F85A9E" },
                    { label: label("Soothed", "مهدأ"), color: "#F44193" },
                ],
            },
        ],
    },
    {
        id: "joy",
        label: label("Joy", "الفرح"),
        color: "#34D6A3",
        glow: "rgba(52, 214, 163, 0.24)",
        previewIndex: 0,
        details: [
            {
                middle: label("Cheerful", "مبتهج"),
                middleColor: "#7EE7C7",
                outers: [
                    { label: label("Delighted", "مسرور"), color: "#90EFD1" },
                    { label: label("Bright", "مشرق"), color: "#7EE7C7" },
                    { label: label("Upbeat", "مرتفع"), color: "#6FDFBC" },
                    { label: label("Smiling", "مبتسم"), color: "#5FDCB3" },
                ],
            },
            {
                middle: label("Playful", "مرح"),
                middleColor: "#57DEB7",
                outers: [
                    { label: label("Energetic", "نشيط"), color: "#6FE6C0" },
                    { label: label("Lively", "حيوي"), color: "#61DEB5" },
                    { label: label("Silly", "مرِح"), color: "#4FD7AC" },
                    { label: label("Free", "حر"), color: "#45D5A7" },
                ],
            },
            {
                middle: label("Hopeful", "متفائل"),
                middleColor: "#5DE1B6",
                outers: [
                    { label: label("Optimistic", "إيجابي"), color: "#7EE9C8" },
                    { label: label("Encouraged", "مشجع"), color: "#6FE2BE" },
                    { label: label("Open", "منفتح"), color: "#59DDB2" },
                    { label: label("Positive", "إيجابي"), color: "#48D4A6" },
                ],
            },
            {
                middle: label("Proud", "فخور"),
                middleColor: "#21C894",
                outers: [
                    { label: label("Inspired", "ملهم"), color: "#46D9A8" },
                    { label: label("Confident", "واثق"), color: "#3BD19F" },
                    { label: label("Worthy", "مستحق"), color: "#33CA98" },
                    { label: label("Accomplished", "منجز"), color: "#28C18F" },
                ],
            },
        ],
    },
    {
        id: "surprise",
        label: label("Surprise", "الدهشة"),
        color: "#FFC52E",
        glow: "rgba(255, 197, 46, 0.22)",
        previewIndex: 1,
        details: [
            {
                middle: label("Curious", "فضولي"),
                middleColor: "#FFD968",
                outers: [
                    { label: label("Intrigued", "مهتم"), color: "#FFE188" },
                    { label: label("Interested", "منجذب"), color: "#FFDB73" },
                    { label: label("Engaged", "منخرط"), color: "#FFD45A" },
                    { label: label("Exploring", "مستكشف"), color: "#FFD968" },
                ],
            },
            {
                middle: label("Amazed", "مندهش"),
                middleColor: "#FFD14A",
                outers: [
                    { label: label("Awakened", "منتبه"), color: "#FFD96E" },
                    { label: label("Astonished", "مذهول"), color: "#FFD45A" },
                    { label: label("Impressed", "مبهر"), color: "#FFCF46" },
                    { label: label("Wide-eyed", "مندهش"), color: "#FFD867" },
                ],
            },
            {
                middle: label("Startled", "مفزوع"),
                middleColor: "#FFC52E",
                outers: [
                    { label: label("Speechless", "مبهوت"), color: "#FFD25A" },
                    { label: label("Shocked", "مصدوم"), color: "#FFCB3D" },
                    { label: label("Alarmed", "منبّه"), color: "#FFC52E" },
                    { label: label("Jolted", "مرتبك"), color: "#FFC943" },
                ],
            },
            {
                middle: label("Wondering", "متسائل"),
                middleColor: "#FFBE1A",
                outers: [
                    { label: label("Alert", "يقظ"), color: "#FFCF52" },
                    { label: label("Questioning", "متسائل"), color: "#FFC93D" },
                    { label: label("Reflective", "متأمل"), color: "#FFBE1A" },
                    { label: label("Searching", "باحث"), color: "#FFC83A" },
                ],
            },
        ],
    },
    {
        id: "sadness",
        label: label("Sadness", "الحزن"),
        color: "#5F9CFF",
        glow: "rgba(95, 156, 255, 0.22)",
        previewIndex: 1,
        details: [
            {
                middle: label("Lonely", "وحيد"),
                middleColor: "#88B7FF",
                outers: [
                    { label: label("Isolated", "منعزل"), color: "#A6CBFF" },
                    { label: label("Unseen", "غير مرئي"), color: "#93BFFF" },
                    { label: label("Left out", "مستبعد"), color: "#84B4FF" },
                    { label: label("Empty", "فارغ"), color: "#74ABFF" },
                ],
            },
            {
                middle: label("Tired", "مرهق"),
                middleColor: "#6EA7FF",
                outers: [
                    { label: label("Drained", "مستنزف"), color: "#8BB8FF" },
                    { label: label("Weary", "متعب"), color: "#7FB0FF" },
                    { label: label("Heavy", "ثقيل"), color: "#709EFF" },
                    { label: label("Spent", "مستهلك"), color: "#6596FF" },
                ],
            },
            {
                middle: label("Disappointed", "خيبة"),
                middleColor: "#74ACFF",
                outers: [
                    { label: label("Let down", "مخذول"), color: "#96C0FF" },
                    { label: label("Discouraged", "محبط"), color: "#84B7FF" },
                    { label: label("Deflated", "منكسر"), color: "#75ABFF" },
                    { label: label("Regretful", "نادم"), color: "#699FFF" },
                ],
            },
            {
                middle: label("Grieving", "مثقل"),
                middleColor: "#4C8FF7",
                outers: [
                    { label: label("Vulnerable", "هش"), color: "#72ABFF" },
                    { label: label("Heartbroken", "مكسور"), color: "#619EFF" },
                    { label: label("Mourning", "حزين"), color: "#538EFA" },
                    { label: label("Fragile", "ضعيف"), color: "#4788F3" },
                ],
            },
        ],
    },
    {
        id: "anger",
        label: label("Anger", "الغضب"),
        color: "#FF7A6B",
        glow: "rgba(255, 122, 107, 0.24)",
        previewIndex: 2,
        details: [
            {
                middle: label("Frustrated", "محبط"),
                middleColor: "#FFA194",
                outers: [
                    { label: label("Blocked", "مقيد"), color: "#FFB1A7" },
                    { label: label("Stuck", "عالق"), color: "#FFA89D" },
                    { label: label("Impatient", "غير صبور"), color: "#FF9A8D" },
                    { label: label("Pressured", "مضغوط"), color: "#FF9285" },
                ],
            },
            {
                middle: label("Irritated", "منزعج"),
                middleColor: "#FF8B7F",
                outers: [
                    { label: label("Annoyed", "متضايق"), color: "#FFA79E" },
                    { label: label("Bothered", "منزعج"), color: "#FF988E" },
                    { label: label("Agitated", "متوتر"), color: "#FF8B7F" },
                    { label: label("Provoked", "مستفز"), color: "#FF8376" },
                ],
            },
            {
                middle: label("Jealous", "غيور"),
                middleColor: "#FF978B",
                outers: [
                    { label: label("Threatened", "مهدد"), color: "#FFB9B0" },
                    { label: label("Insecure", "متردد"), color: "#FFA398" },
                    { label: label("Possessive", "متملك"), color: "#FF9488" },
                    { label: label("Suspicious", "شكاك"), color: "#FF877C" },
                ],
            },
            {
                middle: label("Resentful", "حاقد"),
                middleColor: "#FF6B5D",
                outers: [
                    { label: label("Bitter", "مرير"), color: "#FF8A7E" },
                    { label: label("Wronged", "مظلوم"), color: "#FF7C6E" },
                    { label: label("Hardened", "متصلب"), color: "#FF6E61" },
                    { label: label("Unforgiving", "لا يسامح"), color: "#FF6456" },
                ],
            },
        ],
    },
    {
        id: "fear",
        label: label("Fear", "الخوف"),
        color: "#9BAAC4",
        glow: "rgba(155, 170, 196, 0.22)",
        previewIndex: 0,
        details: [
            {
                middle: label("Anxious", "قلق"),
                middleColor: "#B8C3D7",
                outers: [
                    { label: label("Unsafe", "غير آمن"), color: "#CAD3E1" },
                    { label: label("Nervous", "متوتر"), color: "#BDC8DB" },
                    { label: label("Uneasy", "غير مرتاح"), color: "#B0BDD1" },
                    { label: label("On edge", "حذر"), color: "#A7B5CB" },
                ],
            },
            {
                middle: label("Insecure", "متردد"),
                middleColor: "#A8B6CD",
                outers: [
                    { label: label("Exposed", "مكشوف"), color: "#BFCADC" },
                    { label: label("Small", "ضئيل"), color: "#B3C0D4" },
                    { label: label("Doubtful", "مرتاب"), color: "#A8B6CD" },
                    { label: label("Self-conscious", "متحفظ"), color: "#9EACC4" },
                ],
            },
            {
                middle: label("Worried", "مهموم"),
                middleColor: "#B0BDD1",
                outers: [
                    { label: label("Uncertain", "غير متيقن"), color: "#C9D3E1" },
                    { label: label("Concerned", "قلق"), color: "#BDC8D9" },
                    { label: label("Restless", "قلق"), color: "#AFBCCE" },
                    { label: label("Hesitant", "متردد"), color: "#A6B2C5" },
                ],
            },
            {
                middle: label("Overwhelmed", "مرتبك"),
                middleColor: "#98A8C1",
                outers: [
                    { label: label("Shaken", "مهزوز"), color: "#B2C0D4" },
                    { label: label("Flooded", "غارق"), color: "#A6B4C8" },
                    { label: label("Panicked", "مذعور"), color: "#98A8C1" },
                    { label: label("Overloaded", "محمّل"), color: "#8F9EB8" },
                ],
            },
        ],
    },
]

function polarToCartesian(radius: number, angle: number) {
    const radians = ((angle - 90) * Math.PI) / 180

    return {
        x: CENTER + radius * Math.cos(radians),
        y: CENTER + radius * Math.sin(radians),
    }
}

function createArcPath(innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
    const startOuter = polarToCartesian(outerRadius, startAngle)
    const endOuter = polarToCartesian(outerRadius, endAngle)
    const startInner = polarToCartesian(innerRadius, endAngle)
    const endInner = polarToCartesian(innerRadius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

    return [
        `M ${startOuter.x} ${startOuter.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
        `L ${startInner.x} ${startInner.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
        "Z",
    ].join(" ")
}

function createLabelTransform(angle: number, radius: number) {
    const { x, y } = polarToCartesian(radius, angle)
    let rotation = angle

    if (rotation > 90 && rotation < 270) {
        rotation -= 180
    }

    return { x, y, rotation }
}

function getLocalizedLabel(localized: LocalizedLabel, isRtl: boolean) {
    return isRtl ? localized.ar : localized.en
}

function getMotionOffset(angle: number, distance: number) {
    const radians = ((angle - 90) * Math.PI) / 180

    return {
        x: Math.cos(radians) * -distance,
        y: Math.sin(radians) * -distance,
    }
}

export default function EmotionWheelLoop({ locale }: EmotionWheelLoopProps) {
    const isRtl = locale === "ar"
    const [activeIndex, setActiveIndex] = useState(0)
    const [selectedDetailIndex, setSelectedDetailIndex] = useState<number | null>(null)
    const [phase, setPhase] = useState<"core" | "middle">("core")
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const coreTimeoutRef = useRef<number | null>(null)
    const middleTimeoutRef = useRef<number | null>(null)
    const cycleTimeoutRef = useRef<number | null>(null)
    const resumeTimeoutRef = useRef<number | null>(null)

    const activeEmotion = EMOTION_GROUPS[activeIndex]
    const activeTones = EMOTION_TONES[activeEmotion.id]

    const clearTimers = () => {
        if (coreTimeoutRef.current) window.clearTimeout(coreTimeoutRef.current)
        if (middleTimeoutRef.current) window.clearTimeout(middleTimeoutRef.current)
        if (cycleTimeoutRef.current) window.clearTimeout(cycleTimeoutRef.current)
        if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current)
    }

    const startAutoplay = (startIndex: number) => {
        clearTimers()

        const nextEmotion = EMOTION_GROUPS[startIndex]

        setIsAutoPlaying(true)
        setActiveIndex(startIndex)
        setSelectedDetailIndex(null)
        setPhase("core")

        coreTimeoutRef.current = window.setTimeout(() => {
            setPhase("middle")
        }, 1500)

        middleTimeoutRef.current = window.setTimeout(() => {
            setSelectedDetailIndex(nextEmotion.previewIndex)
        }, 2800)

        cycleTimeoutRef.current = window.setTimeout(() => {
            startAutoplay((startIndex + 1) % EMOTION_GROUPS.length)
        }, 5800)
    }

    useEffect(() => {
        if (isAutoPlaying) {
            startAutoplay(activeIndex)
        } else {
            clearTimers()
        }

        return clearTimers
    }, [isAutoPlaying])

    useEffect(() => clearTimers, [])

    const scheduleResume = () => {
        if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current)
        resumeTimeoutRef.current = window.setTimeout(() => {
            setIsAutoPlaying(true)
        }, 7000)
    }

    const pauseForInteraction = () => {
        setIsAutoPlaying(false)
        clearTimers()
        scheduleResume()
    }

    const handleCoreClick = (index: number) => {
        pauseForInteraction()
        setActiveIndex(index)
        setSelectedDetailIndex(null)
        setPhase("middle")
    }

    const handleMiddleClick = (index: number) => {
        pauseForInteraction()
        setSelectedDetailIndex(index)
    }

    const handleReset = () => {
        pauseForInteraction()
        setSelectedDetailIndex(null)
        setPhase("core")
    }

    return (
        <div className="relative flex w-full max-w-[480px] items-center justify-center">
            <motion.div
                animate={{ y: [0, -5, 0, 2, 0], rotate: [0, -0.25, 0.2, 0], scale: [1, 1.008, 1, 0.996, 1] }}
                transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
                className="relative h-[315px] w-full sm:h-[360px] lg:h-[400px]"
            >
                <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className="h-full w-full overflow-visible">
                    <defs>
                        <filter id="wheelShadow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="rgba(16,24,39,0.10)" />
                        </filter>
                        <filter id="hubShadow" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="rgba(16,24,39,0.12)" />
                        </filter>
                    </defs>

                    <g filter="url(#wheelShadow)">
                        <circle cx={CENTER} cy={CENTER} r="180" fill="#FFFFFF" opacity="0.58" />
                    </g>

                    <AnimatePresence>
                        {phase === "middle" && (
                            <motion.g
                                key={`${activeEmotion.id}-middle`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.24, ease: "easeOut" }}
                            >
                                {activeEmotion.details.map((detail, index) => {
                                    const angle = DETAIL_SEGMENT_CENTERS[index]
                                    const path = createArcPath(118, 180, angle - DETAIL_SEGMENT_SPAN / 2, angle + DETAIL_SEGMENT_SPAN / 2)
                                    const labelTransform = createLabelTransform(angle, 149)
                                    const offset = getMotionOffset(angle, 12)
                                    const isSelected = selectedDetailIndex !== null && index === selectedDetailIndex
                                    const showPreview = selectedDetailIndex === null && index === activeEmotion.previewIndex

                                    return (
                                        <motion.g
                                            key={`${activeEmotion.id}-${detail.middle.en}`}
                                            className="cursor-pointer"
                                            onClick={() => handleMiddleClick(index)}
                                            initial={{ opacity: 0, x: offset.x, y: offset.y, scale: 0.96 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{ opacity: 0, x: offset.x, y: offset.y, scale: 0.96 }}
                                            whileHover={{ scale: isSelected ? 1.045 : 1.02 }}
                                            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
                                            style={{ transformOrigin: `${labelTransform.x}px ${labelTransform.y}px` }}
                                        >
                                            <motion.path
                                                d={path}
                                                stroke="#FCFBF8"
                                                strokeWidth="2.5"
                                                animate={{
                                                    fill: isSelected || showPreview
                                                        ? activeTones.outer
                                                        : activeTones.middle,
                                                    fillOpacity: 1
                                                }}
                                                style={isSelected || showPreview ? { filter: `drop-shadow(0 10px 18px ${activeTones.middle}50)` } : undefined}
                                            />
                                            <text
                                                x={labelTransform.x}
                                                y={labelTransform.y}
                                                fill="#FFFFFF"
                                                fontSize={isRtl ? 12 : 14}
                                                fontWeight="700"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontFamily="IBM Plex Sans, Inter, system-ui, sans-serif"
                                                transform={`rotate(${labelTransform.rotation} ${labelTransform.x} ${labelTransform.y})`}
                                            >
                                                {getLocalizedLabel(detail.middle, isRtl)}
                                            </text>
                                        </motion.g>
                                    )
                                })}
                            </motion.g>
                        )}
                    </AnimatePresence>

                    {EMOTION_GROUPS.map((emotion, index) => {
                        const angle = CORE_SEGMENT_CENTERS[index]
                        const path = createArcPath(74, 112, angle - CORE_SEGMENT_SPAN / 2, angle + CORE_SEGMENT_SPAN / 2)
                        const labelTransform = createLabelTransform(angle, 94)
                        const isActive = index === activeIndex

                        return (
                            <motion.g
                                key={emotion.id}
                                className="cursor-pointer"
                                onClick={() => handleCoreClick(index)}
                                whileHover={{ scale: 1.03, opacity: 1 }}
                                animate={{
                                    scale: isActive && phase !== "core" ? 1.035 : 1,
                                    opacity: isActive ? 1 : phase === "middle" ? 0.45 : 0.72,
                                }}
                                transition={{
                                    scale: { type: "spring", stiffness: 260, damping: 18 },
                                    opacity: { duration: 0.24, ease: "easeOut" },
                                }}
                                style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
                            >
                                <path
                                    d={path}
                                    fill={emotion.color}
                                    style={isActive ? { filter: `drop-shadow(0 8px 16px ${emotion.glow})` } : undefined}
                                />
                                <text
                                    x={labelTransform.x}
                                    y={labelTransform.y}
                                    fill="#FFFFFF"
                                    fontSize={isRtl ? 11 : 12}
                                    fontWeight="700"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontFamily="IBM Plex Sans, Inter, system-ui, sans-serif"
                                    transform={`rotate(${labelTransform.rotation} ${labelTransform.x} ${labelTransform.y})`}
                                >
                                    {getLocalizedLabel(emotion.label, isRtl)}
                                </text>
                            </motion.g>
                        )
                    })}

                    <motion.g
                        className="cursor-pointer"
                        onClick={handleReset}
                        animate={{ scale: phase === "middle" ? 1.02 : 1 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
                    >
                        <circle cx={CENTER} cy={CENTER} r="56" fill="#FFFFFF" opacity="0.24" />
                        <circle cx={CENTER} cy={CENTER} r="52" fill="#FFFFFF" filter="url(#hubShadow)" />
                        <circle cx={CENTER} cy={CENTER} r="48" fill="#FFFFFF" />
                        <circle cx={CENTER} cy={CENTER} r="46" fill="#FFFEFE" stroke="#E8ECF2" strokeWidth="1.5" />
                        <foreignObject x={CENTER - 40} y={CENTER - 25} width="80" height="50">
                            <div className="flex h-full items-center justify-center text-center text-[12px] font-semibold leading-[1.15] text-[#283244]">
                                {isRtl ? "كيف تشعر؟" : "How do you feel?"}
                            </div>
                        </foreignObject>
                    </motion.g>
                </svg>
            </motion.div>
        </div>
    )
}
