import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import type { Locale } from "../../i18n"

type ContextSelectionPreviewProps = {
    locale: Locale
}

type Option = {
    en: string
    ar: string
}

type CardConfig = {
    title: Option
    options: Option[]
}

const CARDS: CardConfig[] = [
    {
        title: { en: "What were you doing?", ar: "ماذا كنت تفعل؟" },
        options: [
            { en: "Working", ar: "العمل" },
            { en: "Relaxing", ar: "الاسترخاء" },
            { en: "Studying", ar: "الدراسة" },
            { en: "Exercising", ar: "الرياضة" },
            { en: "Eating", ar: "الأكل" },
            { en: "Socialising", ar: "الاجتماع" },
            { en: "Reading", ar: "القراءة" },
            { en: "Cooking", ar: "الطبخ" },
            { en: "Watching TV", ar: "مشاهدة التلفاز" },
            { en: "Playing Games", ar: "الألعاب" },
            { en: "Listening to Music", ar: "الاستماع للموسيقى" },
            { en: "Shopping", ar: "التسوق" },
        ],
    },
    {
        title: { en: "Who were you with?", ar: "مع من كنت؟" },
        options: [
            { en: "Alone", ar: "وحدك" },
            { en: "With Family", ar: "مع العائلة" },
            { en: "With Partner", ar: "مع الشريك" },
            { en: "With Friends", ar: "مع الأصدقاء" },
            { en: "With Coworkers", ar: "مع الزملاء" },
            { en: "With Children", ar: "مع الأطفال" },
            { en: "With Strangers", ar: "مع غرباء" },
            { en: "In a Crowd", ar: "في تجمع" },
        ],
    },
    {
        title: { en: "Where were you?", ar: "أين كنت؟" },
        options: [
            { en: "Home", ar: "المنزل" },
            { en: "Work", ar: "العمل" },
            { en: "School", ar: "المدرسة" },
            { en: "Park", ar: "الحديقة" },
            { en: "Restaurant", ar: "المطعم" },
            { en: "Cafe", ar: "المقهى" },
            { en: "Gym", ar: "النادي" },
            { en: "Outdoors", ar: "الخارج" },
            { en: "Friends Place", ar: "بيت الأصدقاء" },
            { en: "Other", ar: "أخرى" },
        ],
    },
]

const SEQUENCE = [
    [1, 1, 0],
    [3, 4, 4],
    [0, 0, 7],
    [6, 3, 2],
]

function getText(option: Option, isRtl: boolean) {
    return isRtl ? option.ar : option.en
}

function RadioOption({
    active,
    label,
}: {
    active: boolean
    label: string
}) {
    return (
        <motion.div
            layout
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            className={`inline-flex items-center gap-[8px] rounded-full px-[8px] py-[4px] transition-colors duration-300 ${
                active ? "border border-[#2EB8AA] bg-[#F3FCFA]" : "border border-transparent bg-transparent"
            }`}
        >
            <span
                className={`flex h-[16px] w-[16px] items-center justify-center rounded-full border transition-colors duration-300 ${
                    active ? "border-[#2EB8AA]" : "border-[#E4E6EA]"
                }`}
            >
                <motion.span
                    animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="h-[8px] w-[8px] rounded-full bg-[#2EB8AA]"
                />
            </span>
            <span className={`text-[12px] font-medium transition-colors duration-300 ${active ? "text-[#101827]" : "text-[#374151]"}`}>
                {label}
            </span>
        </motion.div>
    )
}

function PreviewCard({
    card,
    activeIndex,
    isRtl,
    className,
}: {
    card: CardConfig
    activeIndex: number
    isRtl: boolean
    className: string
}) {
    return (
        <motion.div
            transition={{
                
                ease: [0.42, 0, 0.18, 1],
                repeat: Infinity,
                repeatType: "mirror",
            }}
            className={`rounded-[18px] bg-white p-[16px] shadow-[0_18px_34px_rgba(16,24,39,0.12)] sm:p-[18px] ${className}`}
        >
            <h4 className="text-[17px] font-semibold leading-tight text-[#1F2937] sm:text-[18px]">{getText(card.title, isRtl)}</h4>
            <div className="mt-[14px] grid grid-cols-2 gap-x-[8px] gap-y-[10px] sm:gap-x-[12px]">
                {card.options.map((option, index) => (
                    <RadioOption
                        key={option.en}
                        active={index === activeIndex}
                        label={getText(option, isRtl)}
                    />
                ))}
            </div>
        </motion.div>
    )
}

export default function ContextSelectionPreview({ locale }: ContextSelectionPreviewProps) {
    const isRtl = locale === "ar"
    const [stepIndex, setStepIndex] = useState(0)

    useEffect(() => {
        const interval = window.setInterval(() => {
            setStepIndex((current) => (current + 1) % SEQUENCE.length)
        }, 1800)

        return () => window.clearInterval(interval)
    }, [])

    const activeSet = SEQUENCE[stepIndex]

    return (
        <div className="relative flex h-auto min-h-[560px] w-full max-w-[620px] flex-col items-center gap-4 overflow-visible px-3 py-2 md:block md:h-[360px] md:min-h-0 md:px-0 md:py-0">
            <div className="pointer-events-none absolute inset-x-[10%] top-[18%] h-[58%] rounded-full bg-[#2EB8AA]/10 blur-3xl" />

            <PreviewCard
                card={CARDS[0]}
                activeIndex={activeSet[0]}
                isRtl={isRtl}
                className={`relative z-10 w-full max-w-[360px] md:absolute md:top-[64px] md:w-[360px] ${isRtl ? "md:right-[0px]" : "md:left-[0px]"}`}
                
                
            />
            <PreviewCard
                card={CARDS[1]}
                activeIndex={activeSet[1]}
                isRtl={isRtl}
                className={`relative z-20 w-full max-w-[360px] md:absolute md:top-[8px] md:w-[304px] ${isRtl ? "md:left-[36px]" : "md:left-[284px]"}`}
                
            />
            <PreviewCard
                card={CARDS[2]}
                activeIndex={activeSet[2]}
                isRtl={isRtl}
                className={`relative z-30 w-full max-w-[360px] md:absolute md:top-[228px] md:w-[332px] ${isRtl ? "md:left-[72px]" : "md:left-[218px]"}`}
                
            />
        </div>
    )
}
