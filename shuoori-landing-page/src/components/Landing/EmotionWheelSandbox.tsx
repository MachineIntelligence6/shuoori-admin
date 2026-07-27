import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect } from "react"
import type { Locale } from "../../i18n"

type EmotionWheelSandboxProps = {
    locale: Locale
    t: (en: string, ar: string) => string
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
    emoji: string
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
        emoji: "💖",
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
        emoji: "😊",
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
        emoji: "😲",
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
        emoji: "😢",
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
        emoji: "😡",
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
        emoji: "😨",
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

type Particle = {
    id: number
    emoji: string
    x: number
    y: number
    size: number
}

const EMOTION_BGS: Record<string, string> = {
    love: "#FFA2C7",
    joy: "#68E1BC",
    surprise: "#FFD366",
    sadness: "#94C0FF",
    anger: "#FFA399",
    fear: "#BDCADA",
}

const SLIDER_LABELS: Record<string, { left: LocalizedLabel; right: LocalizedLabel }> = {
    love: { left: label("WARM", "دافئ"), right: label("ADORING", "شغوف") },
    joy: { left: label("FLAT", "عادي"), right: label("ECSTATIC", "سعيد جداً") },
    surprise: { left: label("CURIOUS", "فضولي"), right: label("ASTONISHED", "مندهش جداً") },
    sadness: { left: label("APATHETIC", "مكتئب"), right: label("GRIEVING", "حزين جداً") },
    anger: { left: label("ANNOYED", "منزعج"), right: label("FURIOUS", "غاضب جداً") },
    fear: { left: label("UNEASY", "قلق"), right: label("TERRIFIED", "خائف جداً") },
}

const ACTIVITIES = [
    { en: "Work", ar: "العمل" },
    { en: "Study", ar: "الدراسة" },
    { en: "Exercise", ar: "الرياضة" },
    { en: "Eating", ar: "الأكل" },
    { en: "Watching TV", ar: "مشاهدة التلفاز" },
    { en: "Using Phone", ar: "استخدام الهاتف" },
    { en: "Reading", ar: "القراءة" },
    { en: "Relaxing", ar: "الاسترخاء" },
    { en: "Shopping", ar: "التسوق" },
    { en: "Travel", ar: "السفر" },
    { en: "Other", ar: "آخر" }
]

const LOCATIONS = [
    { en: "Home", ar: "المنزل" },
    { en: "Work", ar: "العمل" },
    { en: "School/University", ar: "المدرسة/الجامعة" },
    { en: "Transport", ar: "المواصلات" },
    { en: "Restaurant/Cafe", ar: "المطعم/المقهى" },
    { en: "Park/Open Area", ar: "حديقة/مساحة مفتوحة" },
    { en: "Mall", ar: "المركز التجاري" },
    { en: "Relative's Home", ar: "منزل قريب" },
    { en: "Friend's Home", ar: "منزل صديق" },
    { en: "Gym", ar: "الصالة الرياضية" },
    { en: "Other", ar: "آخر" }
]

const PEOPLE = [
    { en: "Alone", ar: "بمفردي" },
    { en: "With Family", ar: "مع العائلة" },
    { en: "With Partner/Spouse", ar: "مع الشريك/الزوج" },
    { en: "With Friends", ar: "مع الأصدقاء" },
    { en: "With Coworkers", ar: "مع زملاء العمل" },
    { en: "With Classmates", ar: "مع زملاء الدراسة" },
    { en: "With Relatives", ar: "مع الأقارب" },
    { en: "With Strangers", ar: "مع الغرباء" },
    { en: "Other", ar: "آخر" }
]

export default function EmotionWheelSandbox({ locale, t }: EmotionWheelSandboxProps) {
    const isRtl = locale === "ar"
    
    // Selection state
    const [activeIndex, setActiveIndex] = useState<number | null>(null) // Start with Neutral / No selection pre-selected
    const [selectedDetailIndex, setSelectedDetailIndex] = useState<number | null>(null)
    const [intensityValue, setIntensityValue] = useState(50) // 0 to 100 continuous range
    const intensity = intensityValue < 33 ? "light" : intensityValue < 66 ? "medium" : "strong"
    const [isLogged, setIsLogged] = useState(false)
    const [particles, setParticles] = useState<Particle[]>([])
    const [isAutoplay, setIsAutoplay] = useState(true)
    const [autoplayStep, setAutoplayStep] = useState(0)
    const [autoplayCoreIndex, setAutoplayCoreIndex] = useState(0)

    const [step, setStep] = useState(0) // 0: selection, 1: activity, 2: location, 3: people, 4: details
    const [selectedActivities, setSelectedActivities] = useState<string[]>([])
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
    const [selectedPeople, setSelectedPeople] = useState<string[]>([])
    const [journalText, setJournalText] = useState("")
    const [isListening, setIsListening] = useState(false)
    const [recognition, setRecognition] = useState<any>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRec) {
                const rec = new SpeechRec()
                rec.continuous = true
                rec.interimResults = false
                rec.lang = isRtl ? "ar-SA" : "en-US"

                rec.onresult = (event: any) => {
                    const resultIndex = event.resultIndex
                    const transcript = event.results[resultIndex][0].transcript
                    setJournalText((prev) => prev + (prev ? " " : "") + transcript)
                }

                rec.onerror = (event: any) => {
                    console.error("Speech recognition error:", event.error)
                    setIsListening(false)
                }

                rec.onend = () => {
                    setIsListening(false)
                }

                setRecognition(rec)
            }
        }
    }, [isRtl])

    useEffect(() => {
        return () => {
            if (recognition) {
                try {
                    recognition.stop()
                } catch (e) {}
            }
        }
    }, [recognition])

    const toggleListening = () => {
        setIsAutoplay(false)
        if (!recognition) {
            if (isListening) {
                setIsListening(false)
            } else {
                setIsListening(true)
                setTimeout(() => {
                    setJournalText((prev) => 
                        prev + (prev ? " " : "") + (isRtl ? "أشعر براحة وسعادة شديدة الآن." : "I am feeling really relaxed and happy right now.")
                    )
                    setIsListening(false)
                }, 1500)
            }
            return
        }

        if (isListening) {
            try {
                recognition.stop()
            } catch (e) {}
            setIsListening(false)
        } else {
            try {
                recognition.start()
                setIsListening(true)
            } catch (err) {
                console.error(err)
                setIsListening(false)
            }
        }
    }

    const activeEmotion = activeIndex !== null ? EMOTION_GROUPS[activeIndex] : null
    const activeDetail = activeEmotion && selectedDetailIndex !== null ? activeEmotion.details[selectedDetailIndex] : null
    const activeTones = activeEmotion ? EMOTION_TONES[activeEmotion.id] : null

    // Determine the current visual phase
    const phase = activeIndex !== null ? "middle" : "core"

    const getSliderText = () => {
        if (!activeEmotion) {
            if (intensityValue < 33) return isRtl ? "غير سار" : "Unpleasant"
            if (intensityValue >= 66) return isRtl ? "سار" : "Pleasant"
            return isRtl ? "متعادل" : "Neutral"
        }
        if (activeDetail) {
            return getLocalizedLabel(activeDetail.middle, isRtl)
        }
        return getLocalizedLabel(activeEmotion.label, isRtl)
    }

    // Autoplay Loop
    useEffect(() => {
        if (!isAutoplay) return

        const interval = setInterval(() => {
            setAutoplayStep((prev) => {
                const next = (prev + 1) % 8
                if (next === 0) {
                    setAutoplayCoreIndex((core) => (core + 1) % EMOTION_GROUPS.length)
                }
                return next
            })
        }, 2200)

        return () => clearInterval(interval)
    }, [isAutoplay])

    useEffect(() => {
        if (!isAutoplay) return

        if (autoplayStep === 0) {
            setIsLogged(false)
            setActiveIndex(null)
            setSelectedDetailIndex(null)
            setStep(0)
            setSelectedActivities([])
            setSelectedLocation(null)
            setSelectedPeople([])
            setJournalText("")
            setParticles([])
        } else if (autoplayStep === 1) {
            setActiveIndex(autoplayCoreIndex)
        } else if (autoplayStep === 2) {
            setSelectedDetailIndex(EMOTION_GROUPS[autoplayCoreIndex].previewIndex)
        } else if (autoplayStep === 3) {
            setStep(1)
            setSelectedActivities([isRtl ? "الاسترخاء" : "Relaxing"])
        } else if (autoplayStep === 4) {
            setStep(2)
            setSelectedLocation(isRtl ? "المنزل" : "Home")
        } else if (autoplayStep === 5) {
            setStep(3)
            setSelectedPeople([isRtl ? "مع الأصدقاء" : "With Friends"])
        } else if (autoplayStep === 6) {
            setStep(4)
            setJournalText(isRtl ? "أشعر براحة وسعادة شديدة الآن." : "I am feeling really relaxed and happy right now.")
        } else if (autoplayStep === 7) {
            setIsLogged(true)
            const activeEmoji = EMOTION_GROUPS[autoplayCoreIndex].emoji
            const newParticles = Array.from({ length: 18 }).map((_, i) => ({
                id: Date.now() + i,
                emoji: activeEmoji,
                x: Math.random() * 200 - 100,
                y: Math.random() * -100 - 150,
                size: Math.random() * 20 + 20
            }))
            setParticles(newParticles)
        }
    }, [autoplayStep, isAutoplay, autoplayCoreIndex, isRtl])

    // Device Tilt Tilt parallax
    const [tilt, setTilt] = useState({ x: 0, y: 0 })
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setTilt({ x: x * 10, y: y * -10 })
    }
    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 })
    }

    const handleCoreClick = (index: number) => {
        setIsAutoplay(false)
        setActiveIndex(index)
        setSelectedDetailIndex(null)
    }

    const handleMiddleClick = (index: number) => {
        setIsAutoplay(false)
        setSelectedDetailIndex(index)
    }

    const handleReset = () => {
        setIsAutoplay(false)
        if (recognition && isListening) {
            try {
                recognition.stop()
            } catch (e) {}
        }
        setIsListening(false)
        setActiveIndex(null)
        setSelectedDetailIndex(null)
        setStep(0)
        setSelectedActivities([])
        setSelectedLocation(null)
        setSelectedPeople([])
        setJournalText("")
    }

    const handleBack = () => {
        setIsAutoplay(false)
        if (step > 0) {
            setStep(step - 1)
        }
    }

    const handleContinue = () => {
        setIsAutoplay(false)
        if (step < 4) {
            setStep(step + 1)
        } else {
            handleSaveEntry()
        }
    }

    const handleSaveEntry = () => {
        setIsAutoplay(false)
        setIsLogged(true)
        
        // Spawn emojis
        const activeEmoji = activeEmotion?.emoji ?? "✨"
        const newParticles = Array.from({ length: 18 }).map((_, i) => ({
            id: Date.now() + i,
            emoji: activeEmoji,
            x: Math.random() * 200 - 100,
            y: Math.random() * -100 - 150,
            size: Math.random() * 20 + 20
        }))
        setParticles(newParticles)
    }

    const handleLogAnother = () => {
        setIsAutoplay(false)
        if (recognition && isListening) {
            try {
                recognition.stop()
            } catch (e) {}
        }
        setIsListening(false)
        setIsLogged(false)
        setActiveIndex(null)
        setSelectedDetailIndex(null)
        setIntensityValue(50)
        setStep(0)
        setSelectedActivities([])
        setSelectedLocation(null)
        setSelectedPeople([])
        setJournalText("")
        setParticles([])
    }

    return (
        <div 
            className="relative flex w-full justify-center perspective-[1000px] py-4"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Phone Container */}
            <motion.div 
                animate={{ rotateY: tilt.x, rotateX: tilt.y }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                onMouseEnter={() => setIsAutoplay(false)}
                className="relative w-[320px] h-[660px] rounded-[48px] border-[12px] border-[#0c1319] bg-[#0c1319] shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col select-none ring-1 ring-white/10"
            >
                {/* Dynamic Island */}
                <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-[#0c1319] rounded-full z-[100] flex items-center justify-center">
                    <div className="w-[10px] h-[10px] bg-[#1a232c] rounded-full absolute left-[15px]" />
                </div>

                {/* Main Screen */}
                <div 
                    className="flex-1 bg-[#FCFBF8] rounded-[36px] overflow-hidden flex flex-col relative pt-[24px] pb-[16px] px-5"
                    dir={isRtl ? "rtl" : "ltr"}
                >
                    {activeEmotion && (
                        <div 
                            className="absolute inset-0 pointer-events-none z-0"
                            style={{ 
                                backgroundColor: EMOTION_BGS[activeEmotion.id],
                                opacity: step > 0 ? 0.65 : 0.15 + (intensityValue / 100) * 0.85,
                                transition: "background-color 300ms ease"
                            }}
                        />
                    )}
                    
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-[11px] font-bold text-[#101827] px-2 mb-2 relative z-50">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.17 19.57 10.53 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                            </svg>
                            <div className="w-5 h-2.5 border border-current rounded-sm p-[1px] flex items-center">
                                <div className="h-full w-3.5 bg-current rounded-2xs" />
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isLogged ? (
                            <motion.div 
                                key="logger"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col justify-between relative z-10"
                            >
                                {step === 0 ? (
                                    <>
                                        {/* Top group: Header + Title */}
                                        <div className="relative flex w-full items-center justify-center pt-2 pb-4">
                                            <h2 className="text-[17px] font-bold text-[#283244] text-center max-w-[200px] leading-tight">
                                                {isRtl ? "اختر كيف تشعر الآن" : "Choose how you're feeling right now"}
                                            </h2>
                                            <button 
                                                onClick={handleReset}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 hover:scale-105 active:scale-95 transition-transform"
                                                aria-label="Close"
                                            >
                                                <svg className="w-3.5 h-3.5 text-[#283244]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Emotion Wheel Container */}
                                        <div className="flex-1 flex items-center justify-center relative min-h-[220px] py-2">
                                            {activeEmotion && (
                                                <div
                                                    className="pointer-events-none absolute inset-[15%] rounded-full blur-[40px] transition-all duration-700"
                                                    style={{
                                                        background: `radial-gradient(circle, ${activeEmotion.glow} 0%, rgba(255,255,255,0) 70%)`,
                                                    }}
                                                />
                                            )}

                                            <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className="w-[210px] h-[210px] overflow-visible">
                                                <defs>
                                                    <filter id="wheelShadow" x="-30%" y="-30%" width="160%" height="160%">
                                                        <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="rgba(16,24,39,0.06)" />
                                                    </filter>
                                                    <filter id="hubShadow" x="-30%" y="-30%" width="160%" height="160%">
                                                        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="rgba(16,24,39,0.08)" />
                                                    </filter>
                                                </defs>

                                                <g filter="url(#wheelShadow)">
                                                    <circle cx={CENTER} cy={CENTER} r="180" fill="#FFFFFF" opacity="0.6" />
                                                </g>

                                                {/* Middle Ring */}
                                                <AnimatePresence>
                                                    {activeEmotion && phase === "middle" && (
                                                        <motion.g
                                                            key={`${activeEmotion.id}-middle`}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {activeEmotion.details.map((detail, index) => {
                                                                const angle = DETAIL_SEGMENT_CENTERS[index]
                                                                const path = createArcPath(118, 180, angle - DETAIL_SEGMENT_SPAN / 2, angle + DETAIL_SEGMENT_SPAN / 2)
                                                                const labelTransform = createLabelTransform(angle, 149)
                                                                const offset = getMotionOffset(angle, 10)
                                                                const isSelected = index === selectedDetailIndex
                                                                
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
                                                                        whileHover={{ scale: 1.02 }}
                                                                        transition={{ duration: 0.28, ease: "easeOut" }}
                                                                        style={{ transformOrigin: `${labelTransform.x}px ${labelTransform.y}px` }}
                                                                    >
                                                                        <motion.path
                                                                            d={path}
                                                                            stroke="#FCFBF8"
                                                                            strokeWidth="2.5"
                                                                            animate={{
                                                                                fill: isSelected
                                                                                    ? activeTones?.outer
                                                                                    : activeTones?.middle,
                                                                                fillOpacity: isSelected
                                                                                    ? 0.35 + (intensityValue / 100) * 0.65
                                                                                    : 1
                                                                            }}
                                                                            transition={{ duration: 0.2 }}
                                                                        />
                                                                        <text
                                                                            x={labelTransform.x}
                                                                            y={labelTransform.y}
                                                                            fill="#FFFFFF"
                                                                            fontSize={isRtl ? 14 : 15}
                                                                            fontWeight="700"
                                                                            textAnchor="middle"
                                                                            dominantBaseline="middle"
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

                                                {/* Core Ring */}
                                                {EMOTION_GROUPS.map((emotion, index) => {
                                                    const angle = CORE_SEGMENT_CENTERS[index]
                                                    const path = createArcPath(74, 112, angle - CORE_SEGMENT_SPAN / 2, angle + CORE_SEGMENT_SPAN / 2)
                                                    const labelTransform = createLabelTransform(angle, 94)
                                                    const isActive = index === activeIndex

                                                    return (
                                                        <g
                                                            key={emotion.id}
                                                            className="cursor-pointer"
                                                            onClick={() => handleCoreClick(index)}
                                                        >
                                                            <motion.path
                                                                d={path}
                                                                fill={emotion.color}
                                                                animate={{
                                                                    scale: isActive ? 1.025 : 1,
                                                                    opacity: isActive ? 1 : activeIndex !== null ? 0.45 : 0.85,
                                                                }}
                                                                transition={{ duration: 0.2 }}
                                                                style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
                                                            />
                                                            <text
                                                                x={labelTransform.x}
                                                                y={labelTransform.y}
                                                                fill="#FFFFFF"
                                                                fontSize={12}
                                                                fontWeight="700"
                                                                textAnchor="middle"
                                                                dominantBaseline="middle"
                                                                transform={`rotate(${labelTransform.rotation} ${labelTransform.x} ${labelTransform.y})`}
                                                            >
                                                                {getLocalizedLabel(emotion.label, isRtl)}
                                                            </text>
                                                        </g>
                                                    )
                                                })}

                                                {/* Center Hub */}
                                                <g className="cursor-pointer" onClick={handleReset}>
                                                    <circle cx={CENTER} cy={CENTER} r="54" fill="#FFFFFF" opacity="0.25" />
                                                    <circle cx={CENTER} cy={CENTER} r="50" fill="#FFFFFF" filter="url(#hubShadow)" />
                                                    <circle cx={CENTER} cy={CENTER} r="46" fill="#FFFFFF" />
                                                    <foreignObject x={CENTER - 36} y={CENTER - 20} width="72" height="40">
                                                        <div className="flex h-full items-center justify-center text-center text-[10px] font-bold leading-tight text-[#283244]">
                                                            {isRtl ? "كيف تشعر؟" : "How do you feel?"}
                                                        </div>
                                                    </foreignObject>
                                                </g>
                                            </svg>
                                        </div>

                                        {/* Bottom controls group */}
                                        <div className="flex flex-col gap-[18px] mt-auto w-full">
                                            {/* Bold feeling name */}
                                            <div className="text-center py-1">
                                                <span className="text-[20px] font-extrabold text-[#283244]">
                                                    {getSliderText()}
                                                </span>
                                            </div>

                                            {/* Slider */}
                                            <div className="flex flex-col gap-2 w-full px-2">
                                                <div className="relative w-full flex items-center">
                                                    <input 
                                                        type="range" 
                                                        min="0" 
                                                        max="100" 
                                                        value={intensityValue}
                                                        onChange={(e) => {
                                                            setIsAutoplay(false)
                                                            setIntensityValue(parseInt(e.target.value))
                                                        }}
                                                        className="w-full appearance-none h-2.5 rounded-full outline-none cursor-pointer"
                                                        style={{
                                                            background: activeEmotion ? "rgba(255,255,255,0.45)" : "#E4E6EA",
                                                        }}
                                                    />
                                                    <style>{`
                                                        input[type='range']::-webkit-slider-thumb {
                                                            -webkit-appearance: none;
                                                            appearance: none;
                                                            width: 24px;
                                                            height: 24px;
                                                            border-radius: 50%;
                                                            background: #FFFFFF;
                                                            cursor: pointer;
                                                            box-shadow: 0 4px 8px rgba(0,0,0,0.12);
                                                            border: 1.5px solid ${activeEmotion ? activeEmotion.color : "#E4E6EA"};
                                                            transition: transform 0.15s ease;
                                                        }
                                                        input[type='range']::-webkit-slider-thumb:hover {
                                                            transform: scale(1.1);
                                                        }
                                                        input[type='range']::-moz-range-thumb {
                                                            width: 24px;
                                                            height: 24px;
                                                            border-radius: 50%;
                                                            background: #FFFFFF;
                                                            cursor: pointer;
                                                            box-shadow: 0 4px 8px rgba(0,0,0,0.12);
                                                            border: 1.5px solid ${activeEmotion ? activeEmotion.color : "#E4E6EA"};
                                                            transition: transform 0.15s ease;
                                                        }
                                                    `}</style>
                                                </div>
                                                <div className="flex justify-between text-[10px] font-black tracking-wider text-[#283244]/60 px-0.5 mt-0.5">
                                                    <span>
                                                        {activeEmotion 
                                                            ? getLocalizedLabel(SLIDER_LABELS[activeEmotion.id].left, isRtl) 
                                                            : (isRtl ? "غير سار جداً" : "VERY UNPLEASANT")}
                                                    </span>
                                                    <span>
                                                        {activeEmotion 
                                                            ? getLocalizedLabel(SLIDER_LABELS[activeEmotion.id].right, isRtl) 
                                                            : (isRtl ? "سار جداً" : "VERY PLEASANT")}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Continue Button */}
                                            <button
                                                onClick={handleContinue}
                                                className="w-full py-3.5 rounded-[16px] text-[14px] font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                                                style={{ 
                                                    backgroundColor: activeEmotion ? activeEmotion.color : "#85D3C9",
                                                    color: activeEmotion && (activeEmotion.id === "surprise" || activeEmotion.id === "joy") ? "#283244" : "#FFFFFF"
                                                }}
                                            >
                                                <span>{isRtl ? "متابعة" : "Continue"}</span>
                                                <span className="text-[15px] font-bold">&rarr;</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col justify-between h-full relative z-10">
                                        {/* Top header */}
                                        <div className="relative flex w-full items-center justify-between pt-1 pb-1">
                                            <button 
                                                onClick={handleBack}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:scale-105 active:scale-95 transition-transform"
                                                aria-label="Back"
                                            >
                                                <svg className="w-4 h-4 text-[#283244]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                            <h2 className="text-[13px] font-black tracking-widest text-[#283244]/80 text-center uppercase">
                                                {step === 4 ? (isRtl ? "التفاصيل" : "Details") : (isRtl ? "السياق" : "Context")}
                                            </h2>
                                            <button 
                                                onClick={handleReset}
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:scale-105 active:scale-95 transition-transform"
                                                aria-label="Close"
                                            >
                                                <svg className="w-4 h-4 text-[#283244]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Concentric Badge / Emotion name display */}
                                        <div className="flex flex-col items-center justify-center mb-1.5 mt-0.5">
                                            {/* Concentric rings */}
                                            <div className="relative flex items-center justify-center w-[84px] h-[84px]">
                                                {/* Outer faint ring */}
                                                <div className="absolute inset-0 rounded-full bg-white/10 shadow-sm" />
                                                {/* Middle slightly opaque ring */}
                                                <div className="absolute inset-[6px] rounded-full bg-white/20 shadow-inner" />
                                                {/* Central ring with emoji */}
                                                <div className="absolute inset-[12px] rounded-full bg-white/40 flex items-center justify-center shadow-sm">
                                                    <span className="text-[28px]">{activeEmotion?.emoji ?? "✨"}</span>
                                                </div>
                                                {/* Overlapping sub-badge at bottom-right */}
                                                <div className="absolute bottom-[2px] right-[2px] w-6.5 h-6.5 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-50/20">
                                                    {step === 1 && (
                                                        /* vital signal/pulse wave icon */
                                                        <svg className="w-3.5 h-3.5 text-[#283244]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                                        </svg>
                                                    )}
                                                    {step === 2 && (
                                                        /* location pin icon */
                                                        <svg className="w-3.5 h-3.5 text-[#283244]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                        </svg>
                                                    )}
                                                    {step === 3 && (
                                                        /* group icon */
                                                        <svg className="w-3.5 h-3.5 text-[#283244]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                        </svg>
                                                    )}
                                                    {step === 4 && (
                                                        /* pencil/write icon */
                                                        <svg className="w-3.5 h-3.5 text-[#283244]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-[19px] font-black text-[#283244] mt-1.5 leading-none animate-fade-in">
                                                {activeEmotion ? getLocalizedLabel(activeEmotion.label, isRtl) : ""}
                                            </h3>
                                        </div>

                                        {/* Step Content */}
                                        {step === 1 && (
                                            <div className="flex-1 flex flex-col justify-start mt-2">
                                                <div className="w-full text-center">
                                                    <p className="text-[13px] font-extrabold text-[#283244]/80 mb-1">
                                                        {isRtl ? "ماذا كنت تفعل؟" : "What were you doing?"}
                                                    </p>
                                                    <div className="w-[100%] h-[1px] bg-[#283244]/10 mx-auto mb-2" />
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 justify-center px-1 py-1">
                                                    {ACTIVITIES.map((act) => {
                                                        const labelStr = getLocalizedLabel(act, isRtl);
                                                        const isSelected = selectedActivities.includes(labelStr);
                                                        const activeBg = activeEmotion?.color || "#101827";
                                                        const activeTextColor = activeEmotion && (activeEmotion.id === "surprise" || activeEmotion.id === "joy") ? "#283244" : "#FFFFFF";

                                                        return (
                                                            <button
                                                                key={act.en}
                                                                onClick={() => {
                                                                    setSelectedActivities(prev => 
                                                                        prev.includes(labelStr) 
                                                                            ? prev.filter(x => x !== labelStr)
                                                                            : [...prev, labelStr]
                                                                    );
                                                                }}
                                                                className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold transition-all duration-150 border ${
                                                                    isSelected 
                                                                        ? "border-transparent shadow-md scale-[1.03]"
                                                                        : "bg-white/80 border-[#E4E6EA] text-[#283244] hover:bg-white shadow-sm"
                                                                }`}
                                                                style={isSelected ? { backgroundColor: activeBg, color: activeTextColor } : {}}
                                                            >
                                                                {labelStr}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {step === 2 && (
                                            <div className="flex-1 flex flex-col justify-start mt-2">
                                                <div className="w-full text-center">
                                                    <p className="text-[13px] font-extrabold text-[#283244]/80 mb-1">
                                                        {isRtl ? "أين كنت؟" : "Where were you?"}
                                                    </p>
                                                    <div className="w-[100%] h-[1px] bg-[#283244]/10 mx-auto mb-2" />
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 justify-center px-1 py-1">
                                                    {LOCATIONS.map((loc) => {
                                                        const labelStr = getLocalizedLabel(loc, isRtl);
                                                        const isSelected = selectedLocation === labelStr;
                                                        const activeBg = activeEmotion?.color || "#101827";
                                                        const activeTextColor = activeEmotion && (activeEmotion.id === "surprise" || activeEmotion.id === "joy") ? "#283244" : "#FFFFFF";

                                                        return (
                                                            <button
                                                                key={loc.en}
                                                                onClick={() => {
                                                                    setSelectedLocation(isSelected ? null : labelStr);
                                                                }}
                                                                className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold transition-all duration-150 border ${
                                                                    isSelected 
                                                                        ? "border-transparent shadow-md scale-[1.03]"
                                                                        : "bg-white/80 border-[#E4E6EA] text-[#283244] hover:bg-white shadow-sm"
                                                                }`}
                                                                style={isSelected ? { backgroundColor: activeBg, color: activeTextColor } : {}}
                                                            >
                                                                {labelStr}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {step === 3 && (
                                            <div className="flex-1 flex flex-col justify-start mt-2">
                                                <div className="w-full text-center">
                                                    <p className="text-[13px] font-extrabold text-[#283244]/80 mb-1">
                                                        {isRtl ? "مع من كنت؟" : "Who were you with?"}
                                                    </p>
                                                    <div className="w-[100%] h-[1px] bg-[#283244]/10 mx-auto mb-2" />
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 justify-center px-1 py-1">
                                                    {PEOPLE.map((pep) => {
                                                        const labelStr = getLocalizedLabel(pep, isRtl);
                                                        const isSelected = selectedPeople.includes(labelStr);
                                                        const activeBg = activeEmotion?.color || "#101827";
                                                        const activeTextColor = activeEmotion && (activeEmotion.id === "surprise" || activeEmotion.id === "joy") ? "#283244" : "#FFFFFF";

                                                        return (
                                                            <button
                                                                key={pep.en}
                                                                onClick={() => {
                                                                    setSelectedPeople(prev => 
                                                                        prev.includes(labelStr) 
                                                                            ? prev.filter(x => x !== labelStr)
                                                                            : [...prev, labelStr]
                                                                    );
                                                                }}
                                                                className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold transition-all duration-150 border ${
                                                                    isSelected 
                                                                        ? "border-transparent shadow-md scale-[1.03]"
                                                                        : "bg-white/80 border-[#E4E6EA] text-[#283244] hover:bg-white shadow-sm"
                                                                }`}
                                                                style={isSelected ? { backgroundColor: activeBg, color: activeTextColor } : {}}
                                                            >
                                                                {labelStr}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {step === 4 && (
                                            <div className="flex-1 flex flex-col justify-start mt-1">
                                                <div className="text-center flex flex-col items-center mb-1">
                                                    <span className="text-[#283244]/60 text-[10px] font-black uppercase tracking-wider leading-none">{isRtl ? "تشعر بـ" : "You feel"}</span>
                                                    <span className="text-[#283244] text-[15px] font-black mt-0.5 leading-none">
                                                        {getSliderText()} · {intensity === "light" ? (isRtl ? "خفيف" : "Light") : intensity === "medium" ? (isRtl ? "متوسط" : "Medium") : (isRtl ? "قوي" : "Strong")}
                                                    </span>
                                                </div>
                                                
                                                <textarea
                                                    value={journalText}
                                                    onChange={(e) => setJournalText(e.target.value)}
                                                    placeholder={isRtl ? "ماذا حدث؟ كيف تشعر حيال ذلك؟ اكتب أفكارك هنا..." : "What happened? How do you feel about it? Write or speak your thoughts..."}
                                                    className="w-full h-[150px] rounded-[18px] bg-white/40 border border-white/10 p-3 text-[12px] text-[#283244] placeholder-[#283244]/50 focus:outline-none focus:bg-white/65 resize-none mt-1.5 scrollbar-thin"
                                                />
                                                
                                                <button 
                                                    onClick={toggleListening}
                                                    className={`w-full py-2.5 rounded-[12px] border text-[12px] font-bold flex items-center justify-center gap-1.5 mt-1.5 active:scale-98 transition-all ${
                                                        isListening
                                                            ? "bg-red-500 text-white border-transparent animate-pulse shadow-md"
                                                            : "bg-white/45 border-white/10 hover:bg-white/60 text-[#283244]"
                                                    }`}
                                                >
                                                    {isListening ? (
                                                        <>
                                                            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                                                            <span>{isRtl ? "جاري الاستماع... اضغط للتوقف" : "Listening... Tap to stop"}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-3.5 h-3.5 text-[#283244]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                                                            </svg>
                                                            <span>{isRtl ? "اضغط للتحدث" : "Tap to Speak"}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {/* Optional Info Box */}
                                        <div className="bg-[#E6F4FE] border border-[#B3E5FC]/40 text-[#0288D1] rounded-[16px] p-2.5 flex gap-2 items-start mt-2 mb-2 text-[10.5px] leading-snug shadow-sm">
                                            <svg className="w-4 h-4 text-[#0288D1] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 16v-4" strokeLinecap="round" />
                                                <path d="M12 8h.01" strokeLinecap="round" />
                                            </svg>
                                            <span>
                                                {step === 4 
                                                    ? (isRtl ? "اضغط على الميكروفون وتحدث بشكل طبيعي، سيتم تحويل صوتك إلى نص." : "Tap the mic and speak naturally, your voice will be converted to text.")
                                                    : (isRtl ? "هذه التفاصيل اختيارية ولكنها تساعدك على فهم أنماطك العاطفية بشكل أفضل" : "These details are optional but help you understand your emotional patterns better")
                                                }
                                            </span>
                                        </div>

                                        {/* Bottom Action Button */}
                                        <button
                                            onClick={handleContinue}
                                            className="w-full py-3.5 rounded-[16px] text-[13.5px] font-bold text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                                            style={{ 
                                                backgroundColor: activeEmotion ? activeEmotion.color : "#85D3C9",
                                                color: activeEmotion && (activeEmotion.id === "surprise" || activeEmotion.id === "joy") ? "#283244" : "#FFFFFF"
                                            }}
                                        >
                                            <span>{step === 4 ? (isRtl ? "حفظ المدخلة" : "Save Entry") : (isRtl ? "متابعة" : "Continue")}</span>
                                            {step < 4 && <span className="text-[15px] font-bold">&rarr;</span>}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="flex-1 flex flex-col justify-center items-center text-center px-4 relative z-10"
                            >
                                {/* Particle system inside the mockup */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[36px] z-50">
                                    {particles.map((p) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ x: p.x, y: 300, opacity: 1, scale: 0.5 }}
                                            animate={{ 
                                                y: p.y, 
                                                x: p.x + (Math.random() * 60 - 30), 
                                                opacity: 0, 
                                                scale: [1, 1.2, 0.8],
                                                rotate: Math.random() * 360 
                                            }}
                                            transition={{ duration: 1.8, ease: "easeOut" }}
                                            style={{ position: "absolute", left: "50%", fontSize: p.size }}
                                            className="select-none"
                                        >
                                            {p.emoji}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Success Icon */}
                                <motion.div 
                                    initial={{ scale: 0.5, rotate: -45 }}
                                    animate={{ scale: 1.05, rotate: 0 }}
                                    transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 15 }}
                                    className="w-[72px] h-[72px] rounded-full bg-[#E2F7F4] flex items-center justify-center mb-6 shadow-sm border border-[#C5ECE4]"
                                >
                                    <svg className="w-10 h-10 text-[#2EB8AA]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>

                                <h3 className="text-[20px] font-bold text-[#101827] mb-2.5">
                                    {isRtl ? "تم تسجيل المزاج!" : "Mood Logged!"}
                                </h3>
                                
                                <p className="text-[13px] text-[#4A5462] leading-[20px] mb-8 max-w-[200px]">
                                    {isRtl 
                                        ? "عمل رائع! تخصيص ٣٠ ثانية للتأمل في مشاعرك هو عادة قوية لصحتك النفسية." 
                                        : "Great job! Taking 30 seconds to reflect on your feelings is a powerful habit for your wellbeing."}
                                </p>

                                {/* Summary details card */}
                                <div className="w-full bg-[#F5F6F8] rounded-[20px] p-4 border border-[#E4E6EA] mb-6 text-[12.5px] font-semibold text-[#101827] max-h-[170px] overflow-y-auto scrollbar-thin">
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[#6A727F]">{isRtl ? "المزاج الرئيسي" : "Core Emotion"}</span>
                                        <span>{activeEmotion && getLocalizedLabel(activeEmotion.label, isRtl)} {activeEmotion?.emoji}</span>
                                    </div>
                                    {activeDetail && (
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-[#6A727F]">{isRtl ? "التفصيل العاطفي" : "Sub-Emotion"}</span>
                                            <span>{getLocalizedLabel(activeDetail.middle, isRtl)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[#6A727F]">{isRtl ? "الشدة" : "Intensity"}</span>
                                        <span className="capitalize">{intensity === "light" ? t("Light", "خفيف") : intensity === "medium" ? t("Medium", "متوسط") : t("Strong", "قوي")}</span>
                                    </div>
                                    {selectedActivities.length > 0 && (
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-[#6A727F]">{isRtl ? "النشاط" : "Activity"}</span>
                                            <span className="text-right truncate max-w-[150px]">{selectedActivities.join(", ")}</span>
                                        </div>
                                    )}
                                    {selectedLocation && (
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-[#6A727F]">{isRtl ? "المكان" : "Location"}</span>
                                            <span>{selectedLocation}</span>
                                        </div>
                                    )}
                                    {selectedPeople.length > 0 && (
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-[#6A727F]">{isRtl ? "مع من" : "With"}</span>
                                            <span className="text-right truncate max-w-[150px]">{selectedPeople.join(", ")}</span>
                                        </div>
                                    )}
                                    {journalText.trim() !== "" && (
                                        <div className="flex flex-col items-start border-t border-[#E4E6EA] pt-1.5 mt-1.5">
                                            <span className="text-[#6A727F] mb-0.5">{isRtl ? "الملاحظة" : "Journal Entry"}</span>
                                            <span className="text-[#4A5462] font-normal italic text-[11px] leading-relaxed text-left max-h-[50px] overflow-y-auto w-full scrollbar-thin">{journalText}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogAnother}
                                    className="w-full py-3.5 bg-[#2EB8AA] hover:bg-[#259b8f] active:scale-[0.98] rounded-[16px] text-[14px] font-bold text-white transition-all shadow-md"
                                >
                                    {isRtl ? "تسجيل آخر" : "Log Another"}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
