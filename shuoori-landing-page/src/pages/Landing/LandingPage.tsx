import type { Locale } from "../../i18n"

type LandingPageProps = {
    locale: Locale
    setLocale: (l: Locale) => void
}

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

function AnimatedCounter({ value }: { value: number }) {
    const spring = useSpring(0, { bounce: 0, duration: 2500 });
    const display = useTransform(spring, (current) => Math.round(current) + "%");

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
}

function AnimatedStatistic({ target, suffix = "", decimals = 0 }: { target: number, suffix?: string, decimals?: number }) {
    const spring = useSpring(0, { bounce: 0, duration: 2500 });
    const display = useTransform(spring, (current) => current.toFixed(decimals) + suffix);

    useEffect(() => {
        spring.set(target);
    }, [spring, target]);

    return <motion.span>{display}</motion.span>;
}
import {
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Flame,
    Gift,
    Heart,
    Mic,
    ShieldAlert,
    Smile,
    Tag,
    ThumbsUp,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Header from "../../components/Landing/Header"
import ContextSelectionPreview from "../../components/Landing/ContextSelectionPreview"
import EmotionWheelLoop from "../../components/Landing/EmotionWheelLoop"
import FeatureShowcasePreview from "../../components/Landing/FeatureShowcasePreview"
import ShareDetailsPreview from "../../components/Landing/ShareDetailsPreview"
import { TrendWidget } from "../../components/Landing/TrendWidget"
import AnalyticsPhoneMockup from "../../components/Landing/AnalyticsPhoneMockup"
import EmotionWheelSandbox from "../../components/Landing/EmotionWheelSandbox"
import { fetchCmsSections, buildTextOverrides, groupSectionsByKey, type CmsSection } from "../../lib/cmsContent"

export default function LandingPage({ locale, setLocale }: LandingPageProps) {
    const isRtl = locale === "ar"
    const [cmsContent, setCmsContent] = useState<{ en?: Record<string, string>; ar?: Record<string, string> } | null>(null)
    const [rawSections, setRawSections] = useState<CmsSection[]>([])

    useEffect(() => {
        const controller = new AbortController()
        async function loadCms() {
            try {
                const sections = await fetchCmsSections(controller.signal)
                if (sections && sections.length > 0) {
                    setRawSections(sections)
                    setCmsContent(buildTextOverrides(sections))
                }
            } catch (err) {
                // Keep fallback on error
            }
        }
        loadCms()
        const interval = setInterval(loadCms, 3000)
        window.addEventListener("focus", loadCms)
        return () => {
            controller.abort()
            clearInterval(interval)
            window.removeEventListener("focus", loadCms)
        }
    }, [])

    const t = (en: string, ar: string) => {
        const map = cmsContent?.[isRtl ? "ar" : "en"]
        const override = map?.[en]
        return override ?? (isRtl ? ar : en)
    }
    const [expandedFaq, setExpandedFaq] = useState<number>(0)
    const [activeFeaturePreview, setActiveFeaturePreview] = useState(0)
    const [testimonialIndex, setTestimonialIndex] = useState(1)
    const [isTestimonialTransitioning, setIsTestimonialTransitioning] = useState(true)
    const [isTestimonialAutoplay, setIsTestimonialAutoplay] = useState(true)
    const [isTestimonialHovered, setIsTestimonialHovered] = useState(false)
    const testimonials = [
        {
            quote: t(
                "I've tried every mood tracker out there. Shuoori is the first one that actually helped me understand why I feel the way I do. The AI insights are genuinely useful.",
                "جرّبت كل تطبيقات تتبع المزاج، لكن Shuoori كان الأول الذي ساعدني فعلياً على فهم سبب مشاعري. الرؤى بالذكاء الاصطناعي مفيدة جداً."
            ),
            name: t("Sarah M.", "سارة جميل"),
            title: t("Therapist · Dubai", "أخصائية نفسية · دبي"),
            image: "/Pexels Photo by Mikhail Nilov.png",
            imageClass: "absolute bottom-0 right-[-10px] w-[172px] sm:right-[0px] sm:w-[220px] md:w-[280px] lg:w-[260px] xl:w-[300px] z-0 pointer-events-none",
            imageClassRtl: "absolute bottom-0 left-[-10px] right-auto w-[172px] sm:left-[0px] sm:w-[220px] md:w-[280px] lg:w-[260px] xl:w-[300px] z-0 pointer-events-none"
        },
        {
            quote: t(
                "The card grid for emotions is so much better than the wheel. I log my mood every morning in under 30 seconds. My mental health has genuinely improved over 3 months.",
                "بطاقات المشاعر أفضل بكثير من العجلة. أسجل مزاجي كل صباح في أقل من 30 ثانية. صحتي النفسية تحسنت فعلاً خلال 3 أشهر."
            ),
            name: t("Ahmed K.", "أحمد جميل"),
            title: t("Software Engineer · Riyadh", "مهندس برمجيات · الرياض"),
            image: "/Pexels Photo by Khaled Saleh.png",
            imageClass: "absolute bottom-0 right-[-10px] w-[172px] sm:right-[0px] sm:w-[220px] md:w-[280px] lg:w-[260px] xl:w-[300px] z-0 pointer-events-none",
            imageClassRtl: "absolute bottom-0 left-[-10px] right-auto w-[172px] sm:left-[0px] sm:w-[220px] md:w-[280px] lg:w-[260px] xl:w-[300px] z-0 pointer-events-none"
        },
        {
            quote: t(
                "The voice-to-text journaling feature is a lifesaver. I can just speak my thoughts on my drive home and it captures the emotional context perfectly.",
                "ميزة التدوين الصوتي مذهلة. يمكنني التعبير عن أفكاري أثناء قيادتي للسيارة ويسجل التطبيق السياق العاطفي بدقة."
            ),
            name: t("Layla H.", "ليلى حسن"),
            title: t("UI/UX Designer · Abu Dhabi", "مصممة واجهات · أبو ظبي"),
            image: "/hero-avatar-1.png",
            imageClass: "absolute bottom-0 right-[-10px] w-[172px] sm:right-[0px] sm:w-[220px] md:w-[280px] lg:w-[260px] xl:w-[300px] z-0 pointer-events-none",
            imageClassRtl: "absolute bottom-0 left-[-10px] right-auto w-[172px] sm:left-[0px] sm:w-[220px] md:w-[280px] lg:w-[260px] xl:w-[300px] z-0 pointer-events-none"
        },
        {
            quote: t(
                "I love the clean, modern interface. Tracking my triggers over the last 3 months helped me restructure my morning routine for less stress.",
                "أحب الواجهة النظيفة والحديثة. ساعدني تتبع محفزات القلق خلال الأشهر الثلاثة الماضية في إعادة هيكلة روتيني الصباحي لتقليل التوتر."
            ),
            name: t("Omar F.", "عمر فاروق"),
            title: t("Marketing Lead · Muscat", "مدير تسويق · مسقط"),
            image: "/hero-avatar-2.png",
            imageClass: "absolute bottom-0 right-[-10px] w-[172px] sm:right-[0px] sm:w-[220px] md:w-[280px] lg:w-[260px] xl:w-[300px] z-0 pointer-events-none",
            imageClassRtl: "absolute bottom-0 left-[-10px] right-auto w-[172px] sm:left-[0px] sm:w-[220px] md:w-[280px] lg:w-[260px] xl:w-[300px] z-0 pointer-events-none"
        }
    ]
    const analyticsVectors = {
        love: Heart,
        joy: Smile,
        fear: ShieldAlert,
        anger: Flame,
    }
    const emotionDistribution: { label: string; value: number; color: string; Icon: LucideIcon }[] = [
        { label: t("Love", "الحب"), value: 44, color: "#ff006e", Icon: analyticsVectors.love },
        { label: t("Joy", "الفرح"), value: 11, color: "#10b57e", Icon: analyticsVectors.joy },
        { label: t("Fear", "الخوف"), value: 22, color: "#6b7280", Icon: analyticsVectors.fear },
        { label: t("Anger", "الغضب"), value: 22, color: "#dc2626", Icon: analyticsVectors.anger },
    ]
    const trySection = {
        blob: "https://www.figma.com/api/mcp/asset/5605f90f-08ab-4d7f-9039-4a64a1f3cdf0",
    }
    const featureShowcaseItems = [
        {
            id: "wheel" as const,
            title: t("Emotion wheel", "عجلة المشاعر"),
            desc: t("Emotion wheels with a fast, tappable 6 core emotions with sub-emotion detail built for speed and clarity.", "عجلة مشاعر سريعة وسهلة النقر بـ 6 مشاعر أساسية وتفاصيل فرعية للوضوح والسرعة."),
        },
        {
            id: "analytics" as const,
            title: t("Deep Analytics Dashboard", "لوحة تحليلات متقدمة"),
            desc: t("Bar charts, donut breakdowns. Understand your emotional trends across weeks and months.", "مخططات أعمدة ودوائر. افهم اتجاهات مشاعرك عبر الأسابيع والأشهر."),
        },
        {
            id: "journaling" as const,
            title: t("Voice-to-Text Journaling", "تدوين الصوت إلى نص"),
            desc: t("Too tired to type? Just speak. Your voice gets converted to a rich journal entry in seconds effortless emotional expression.", "متعب من الكتابة؟ فقط تحدث. يتحول صوتك إلى ملاحظة غنية خلال ثوانٍ للتعبير العاطفي بسهولة."),
        },
        {
            id: "hipaa" as const,
            title: t("HIPAA Compliant", "متوافق مع HIPAA"),
            desc: t("Shuoori adheres to HIPAA (Health Insurance Portability and Accountability Act) standards — the highest level of healthcare data protection in the industry.", "يلتزم Shuoori بمعايير HIPAA — أعلى مستوى لحماية بيانات الرعاية الصحية في المجال."),
        },
    ]

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_STRAPI_URL
        if (!baseUrl) return

        const controller = new AbortController()
        fetch(`${baseUrl.replace(/\/$/, "")}/api/landing-page`, { signal: controller.signal })
            .then((res) => (res.ok ? res.json() : null))
            .then((payload) => {
                const content =
                    payload?.data?.attributes?.content ??
                    payload?.data?.content ??
                    payload?.content
                if (content && typeof content === "object") {
                    setCmsContent(content)
                }
            })
            .catch(() => { })

        return () => controller.abort()
    }, [])

    useEffect(() => {
        const interval = window.setInterval(() => {
            setActiveFeaturePreview((current) => (current + 1) % featureShowcaseItems.length)
        }, 3600)

        return () => window.clearInterval(interval)
    }, [featureShowcaseItems.length])

    useEffect(() => {
        if (!isTestimonialAutoplay || isTestimonialHovered) return

        const interval = window.setInterval(() => {
            setTestimonialIndex((prev) => prev + 1)
        }, 5000)

        return () => window.clearInterval(interval)
    }, [isTestimonialAutoplay, isTestimonialHovered])

    useEffect(() => {
        if (!isTestimonialTransitioning) {
            const timeout = setTimeout(() => {
                setIsTestimonialTransitioning(true)
            }, 20)
            return () => clearTimeout(timeout)
        }
    }, [isTestimonialTransitioning])

    const extendedTestimonials = [
        testimonials[testimonials.length - 1],
        ...testimonials,
        testimonials[0],
        testimonials[1]
    ]

    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return
        if (testimonialIndex >= testimonials.length + 1) {
            setIsTestimonialTransitioning(false)
            setTestimonialIndex(1)
        } else if (testimonialIndex <= 0) {
            setIsTestimonialTransitioning(false)
            setTestimonialIndex(testimonials.length)
        }
    }

    const activeDot = (testimonialIndex - 1 + testimonials.length) % testimonials.length
    const dirMultiplier = isRtl ? -1 : 1

    return (
        <div className="min-h-screen bg-[#FCFBF8] text-[#101827]">
            <Header locale={locale} setLocale={setLocale} t={t} />

            <section className="relative overflow-hidden bg-[#FCFBF8] pb-[56px] pt-[56px] sm:pb-[160px] sm:pt-[80px]">
                {/* Concentric Circles Background */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vw] min-w-[1200px] max-w-[2400px] opacity-[0.04] pointer-events-none z-0">
                    <svg viewBox="0 0 1000 1000" fill="none" className="w-full h-full">
                        {[...Array(14)].map((_, i) => (
                            <circle key={i} cx="500" cy="500" r={(i + 1) * 35} stroke="#101827" strokeWidth="1" />
                        ))}
                    </svg>
                </div>

                <div className="relative z-10 mx-auto flex w-full max-w-[1400px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col items-center gap-[40px] px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-[56px] lg:px-[32px]">
                    <div className={`flex max-w-[1000px] flex-col items-center text-center lg:flex-1 lg:items-start ${isRtl ? "lg:ml-auto lg:text-right" : "lg:mr-auto lg:text-left"}`}>
                        <div className="mb-[24px] flex items-center justify-center rounded-full border border-[#2EB8AA] bg-[#F2FBF9] px-[18px] py-[8px] text-[15px] font-medium text-[#1C6964] lg:justify-start">
                            {t("#1 Emotion Wellness App", "تطبيق الرفاه العاطفي رقم 1")}
                        </div>
                        <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-2px] md:text-[32px] lg:text-[40px] xl:text-[48px] text-[#101827]">
                            {t("Understand your emotions", "افهم مشاعرك")}
                            <br className="hidden md:block" />
                            {t("transform ", "وغيّر ")}
                            <span className="text-[#2EB8AA]">{t("your mental wellness", "صحتك النفسية")}</span>
                        </h1>
                        <p className="mt-[24px] w-full max-w-[760px] text-[14px] leading-[26px] text-[#4A5462] md:text-[16px] md:leading-[30px]">
                            {t(
                                "Shuoori helps you track, understand, and improve your emotional health through intuitive journaling, AI-powered insights, and beautiful analytics — in just 60 seconds a day.",
                                "يساعدك Shuoori على تتبع وفهم وتحسين صحتك العاطفية عبر تدوين المشاعر والبصيرة المدعومة بالذكاء الاصطناعي والتحليلات الجميلة — خلال 60 ثانية يومياً."
                            )}
                        </p>

                        <div className="mt-[48px] flex flex-wrap items-center justify-center gap-[16px] lg:justify-start">
                            <button className="flex items-center justify-center rounded-[12px] bg-[#2EB8AA] px-[36px] py-[16px] text-[16px] font-semibold text-white transition-all hover:bg-[#259b8f] shadow-lg shadow-[#2eb8aa]/30">
                                {t("Start free no card needed", "ابدأ مجاناً بدون بطاقة")}
                            </button>
                            <button
                                type="button"
                                disabled
                                aria-disabled="true"
                                className="flex cursor-default items-center justify-center gap-[10px] rounded-[12px] border border-[#E4E6EA] bg-white px-[32px] py-[16px] text-[16px] font-semibold text-[#101827] shadow-sm disabled:opacity-100"
                            >
                                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.99998 14.6666C11.6819 14.6666 14.6666 11.6819 14.6666 7.99998C14.6666 4.31808 11.6819 1.33331 7.99998 1.33331C4.31808 1.33331 1.33331 4.31808 1.33331 7.99998C1.33331 11.6819 4.31808 14.6666 7.99998 14.6666Z" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.66665 5.33331L10.6666 7.99998L6.66665 10.6666V5.33331Z" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {t("Watch demo", "شاهد العرض")}
                            </button>
                        </div>

                        <div className="hidden">
                            <div className={`flex items-center ${isRtl ? "flex-row-reverse" : ""}`}>
                                <img src="/hero-avatar-1.png" alt="" className="h-[44px] w-[44px] rounded-full border-[2px] border-[#FCFBF8] object-cover shadow-sm" />
                                <img src="/hero-avatar-2.png" alt="" className={`${isRtl ? "-mr-[16px]" : "-ml-[16px]"} h-[44px] w-[44px] rounded-full border-[2px] border-[#FCFBF8] object-cover shadow-sm`} />
                                <img src="/hero-avatar-3.png" alt="" className={`${isRtl ? "-mr-[16px]" : "-ml-[16px]"} h-[44px] w-[44px] rounded-full border-[2px] border-[#FCFBF8] object-cover shadow-sm`} />
                            </div>
                            {t("50K+ people track their emotions daily", "أكثر من 50 ألف شخص يتتبعون مشاعرهم يومياً")}
                        </div>

                        {(() => {
                            const cmsSectionsMap = groupSectionsByKey(rawSections)
                            const heroImages = cmsSectionsMap.hero?.images || []
                            const googlePlayImg = heroImages[0]?.url || "/Mobile app store badge.svg"
                            const googlePlayAlt = (isRtl ? heroImages[0]?.alt?.ar : heroImages[0]?.alt?.en) || t("Download on Google Play", "تحميل من جوجل بلاي")
                            const appStoreImg = heroImages[1]?.url || "/Mobile app store badge (1).svg"
                            const appStoreAlt = (isRtl ? heroImages[1]?.alt?.ar : heroImages[1]?.alt?.en) || t("Download on the App Store", "تنزيل من آب ستور")

                            return (
                                <div className="mt-[40px] flex flex-wrap items-center justify-center gap-[14px] lg:justify-start">
                                    <a
                                        href="https://play.google.com/store"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Get Shuoori on Google Play"
                                        className="transition-transform duration-200 hover:-translate-y-1"
                                    >
                                        <img
                                            src={googlePlayImg}
                                            alt={googlePlayAlt}
                                            className="h-auto w-full max-w-[162px] object-contain"
                                        />
                                    </a>
                                    <a
                                        href="https://apps.apple.com/us/app/shuoori/id6769279333"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Download Shuoori on the App Store"
                                        className="transition-transform duration-200 hover:-translate-y-1"
                                    >
                                        <img
                                            src={appStoreImg}
                                            alt={appStoreAlt}
                                            className="h-auto w-full max-w-[143px] object-contain"
                                        />
                                    </a>
                                </div>
                            )
                        })()}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 32, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                        className="relative flex w-full items-center justify-center lg:w-[480px] xl:w-[520px] 2xl:w-[560px] lg:flex-shrink-0"
                    >
                        <EmotionWheelSandbox locale={locale} t={t} readOnly />
                    </motion.div>

                    {/* Floating Cards (Visible only on lg displays) */}
                    <div className="hidden">
                        {/* Top Left: This week's top mood */}
                        <motion.div
                            initial={{ rotate: -14 }}
                            whileHover={{ scale: 1.05 }}
                            className={`absolute ${isRtl ? "right-[2%] xl:right-[8%]" : "left-[2%] xl:left-[8%]"} top-[10%] flex flex-col gap-[10px] rounded-[20px] bg-white px-[24px] py-[20px] shadow-[0_16px_32px_rgba(0,0,0,0.06)] pointer-events-auto border border-[#f3f4f6]`}
                        >
                            <p className="text-[#8e95a2] text-[13px] font-medium tracking-wide">{t("This week's top mood", "أبرز مشاعر هذا الأسبوع")}</p>
                            <div className="flex items-center gap-[8px]">
                                <motion.img
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Hearts.png"
                                    alt="Love"
                                    className="h-[36px] w-[36px] drop-shadow-sm object-contain"
                                />
                                <p className="text-[20px] font-bold text-[#101827] tracking-tight">{t("Love & Calm", "حب وهدوء")}</p>
                            </div>
                            <p className="text-[14px] font-bold text-[#2EB8AA]">{t("↑ +18% vs last week", "↑ +18% مقارنة بالأسبوع الماضي")}</p>
                        </motion.div>

                        {/* Bottom Left: Emotion Distribution */}
                        <motion.div
                            initial={{ rotate: -10 }}
                            whileHover={{ scale: 1.05 }}
                            className={`absolute ${isRtl ? "right-[0%] xl:right-[6%]" : "left-[0%] xl:left-[6%]"} bottom-[-5%] xl:bottom-[0%] flex flex-col gap-[16px] rounded-[24px] bg-white px-[28px] py-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] pointer-events-auto w-[340px] border border-[#f3f4f6]`}
                        >
                            <h3 className="text-[17px] font-bold text-[#101827]">{t("Emotion Distribution", "توزيع المشاعر")}</h3>
                            <div className="flex items-center justify-between w-full">
                                {emotionDistribution.map(({ label, value, color, Icon }) => (
                                    <div key={label} className="flex flex-col items-start gap-[6px]">
                                        <div className="flex items-center gap-[4px]">
                                            <Icon className="h-[12px] w-[12px]" style={{ color }} strokeWidth={2} />
                                            <p className="text-[13px] font-semibold text-[#6A727F]">{label}</p>
                                        </div>
                                        <p className="text-[16px] font-black" style={{ color }}><AnimatedCounter value={value} /></p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Top Right: You feel calm on evening */}
                        <motion.div
                            initial={{ rotate: 12 }}
                            whileHover={{ scale: 1.05 }}
                            className={`absolute ${isRtl ? "left-[2%] xl:left-[8%]" : "right-[2%] xl:right-[8%]"} top-[15%] flex flex-col gap-[10px] rounded-[20px] bg-white px-[24px] py-[20px] shadow-[0_16px_32px_rgba(0,0,0,0.06)] pointer-events-auto border border-[#f3f4f6]`}
                        >
                            <p className="text-[#8e95a2] text-[13px] font-medium tracking-wide">{t("You feel calm on evening", "تشعر بالهدوء مساءً")}</p>
                            <div className="flex items-center gap-[8px]">
                                <motion.img
                                    animate={{ y: [0, -6, 0], x: [0, 6, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20Running.png"
                                    alt="Running"
                                    className="w-[44px] h-[44px] object-contain drop-shadow-sm"
                                />
                                <p className="text-[20px] font-bold text-[#101827] tracking-tight">{t("After exercise", "بعد التمرين")}</p>
                            </div>
                        </motion.div>

                        {/* Bottom Right: Trend Card */}
                        <motion.div
                            initial={{ rotate: 14 }}
                            whileHover={{ scale: 1.05 }}
                            className={`absolute ${isRtl ? "left-[2%] xl:left-[6%]" : "right-[2%] xl:right-[6%]"} bottom-[0%] xl:bottom-[5%] pointer-events-auto w-[280px] h-[280px]`}
                        >
                            <div className="w-[420px] scale-[0.66] origin-top-left pointer-events-none">
                                <TrendWidget locale={locale} t={t} />
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mx-auto mt-[32px] w-full max-w-[1200px] px-6 relative z-20 sm:mt-[72px] lg:max-w-[1280px] lg:px-[32px] xl:max-w-[1360px] 2xl:max-w-[1480px]">
                    <div className={`grid grid-cols-2 gap-x-[18px] gap-y-[24px] rounded-[16px] bg-white p-[22px] text-center shadow-[0_12px_28px_rgba(16,24,39,0.06)] lg:flex lg:items-center lg:justify-between lg:gap-[24px] lg:rounded-[12px] lg:p-[40px] xl:p-[48px] border border-[#f3f4f6] ${isRtl ? "lg:flex-row-reverse lg:text-right" : "lg:text-left"}`}>
                        {[
                            [50, "K", t("Active Users", "المستخدمون النشطون"), 0],
                            [2, "M", t("Emotions Logged", "المشاعر المسجلة"), 0],
                            [4.9, "", t("App Store Rating", "تقييم متجر التطبيقات"), 1],
                            [94, "", t("Report Improved Wellness", "أبلغوا بتحسن الرفاه"), 0],
                        ].map(([val, prefix, label, decimals], index) => (
                            <div key={label as string} className="flex min-w-0 flex-col items-center gap-[6px] lg:flex-1 lg:w-auto lg:items-start lg:gap-[8px]">
                                <div className="text-[34px] font-semibold leading-none tracking-[-0.8px] text-[#101827] flex items-center sm:text-[40px] lg:text-[48px] lg:leading-[1.1] lg:tracking-normal">
                                    <AnimatedStatistic target={val as number} suffix={prefix as string} decimals={decimals as number} />
                                    {index === 0 || index === 1 ? <span className="text-[#2EB8AA]">+</span> : null}
                                    {index === 2 ? <span className="text-[#2EB8AA]">★</span> : null}
                                    {index === 3 ? <span className="text-[#2EB8AA]">%</span> : null}
                                </div>
                                <div className="text-[14px] leading-[20px] text-[#4A5462] sm:text-[16px] sm:leading-[24px] lg:text-[20px] lg:leading-[30px]">{label as string}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="bg-[#FCFBF8] py-[64px] sm:py-[128px]">
                <div className="mx-auto flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col items-center gap-[40px] px-6 sm:gap-[64px] lg:px-[96px]">
                    <div className="flex flex-col items-center gap-[12px] text-center">
                        <div className="flex items-center justify-center rounded-full border-2 border-[#2EB8AA] bg-[#F2FBF9] px-[18px] py-[8px] text-[16px] text-[#1C6964]">
                            {t("Simple Process", "عملية بسيطة")}
                        </div>
                        <h2 className="text-[34px] font-semibold leading-[1.12] tracking-[-0.8px] sm:text-[48px] sm:tracking-[-1.92px]">
                            {t("Start tracking in ", "ابدأ التتبع في ")}
                            <span className="text-[#2EB8AA]">{t("4 simple steps", "4 خطوات بسيطة")}</span>
                        </h2>
                        <p className="max-w-[px] w-full text-[16px] leading-[26px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">
                            {t(
                                "From logging your first emotion to receiving personalized monthly reports Shuoori guides you every step of the way.",
                                "من تسجيل أول شعور لك إلى استلام تقارير شهرية مخصصة، يرشدك Shuoori في كل خطوة على الطريق."
                            )}
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-[56px] sm:gap-[96px]">
                        <div className={`flex w-full flex-col items-center gap-[32px] sm:gap-[48px] lg:gap-[96px] lg:flex-row`}>
                            <div className="flex-1">
                                <div className={`flex flex-col gap-[20px] ${isRtl ? "text-right items-start" : "text-left items-start"}`}>
                                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[15px] bg-[#2EB8AA] text-[18px] font-semibold text-white">
                                        01
                                    </div>
                                    <div className="flex flex-col gap-[16px]">
                                        <h3 className="text-[24px] font-semibold leading-[31px] sm:text-[30px] sm:leading-[38px]">{t("Pick your emotion", "اختر شعورك")}</h3>
                                        <p className="text-[16px] leading-[25px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">
                                            {t(
                                                "Choose from our intuitive emotion wheel. From joy to anxiety, we have all the shades of feeling covered with clear labels.",
                                                "اختر من عجلة المشاعر البديهية. من الفرح إلى القلق، لدينا جميع درجات الشعور بتسميات واضحة."
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative flex flex-1 items-center justify-center min-h-[280px] lg:min-h-[420px] w-full">
                                <EmotionWheelLoop locale={locale} />
                            </div>
                        </div>

                        <div className={`flex w-full flex-col items-center gap-[32px] sm:gap-[48px] lg:gap-[104px] lg:flex-row`}>
                            <div className={`flex w-full max-w-[620px] flex-1 justify-center ${isRtl ? "lg:justify-start" : "lg:justify-start"}`}>
                                <ContextSelectionPreview locale={locale} />
                            </div>
                            <div className={`flex w-full max-w-[520px] flex-1 justify-center ${isRtl ? "lg:justify-start" : "lg:justify-start"}`}>
                                <div className={`flex flex-col gap-[18px] ${isRtl ? "text-right items-start" : "text-left items-start"}`}>
                                    <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#2EB8AA] text-[16px] font-semibold text-white">
                                        02
                                    </div>
                                    <div className="flex flex-col gap-[12px]">
                                        <h3 className="text-[28px] font-semibold leading-[36px]">{t("Add when, where and with whom", "أضف متى وأين ومع من")}</h3>
                                        <p className="text-[17px] leading-[26px] text-[#4A5462]">
                                            {t(
                                                "Tag your activity, location and who you're with. The context behind your emotion unlocks deep insights.",
                                                "ضع علامة على النشاط والموقع ومن تكون معه. سياق المشاعر يمنحك رؤى أعمق."
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`flex w-full flex-col items-center gap-[32px] sm:gap-[48px] lg:gap-[96px] lg:flex-row`}>
                            <div className={`flex w-full max-w-[520px] flex-1 justify-center ${isRtl ? "lg:justify-start" : "lg:justify-start"}`}>
                                <div className={`flex flex-col gap-[20px] ${isRtl ? "text-right items-start" : "text-left items-start"}`}>
                                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[15px] bg-[#2EB8AA] text-[18px] font-semibold text-white">
                                        03
                                    </div>
                                    <div className="flex flex-col gap-[16px]">
                                        <h3 className="text-[24px] font-semibold leading-[31px] sm:text-[30px] sm:leading-[38px]">{t("Define any additional details", "أضف أي تفاصيل إضافية")}</h3>
                                        <p className="text-[16px] leading-[25px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">
                                            {t(
                                                "Add a journal entry by typing or using voice-to-text. Guided prompts help when you're unsure what to write.",
                                                "أضف مذكّرة بكتابة النص أو باستخدام تحويل الصوت إلى نص. تساعدك الإرشادات عندما لا تعرف ماذا تكتب."
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex justify-center items-center w-full min-h-[300px] lg:min-h-[512px]">
                                <ShareDetailsPreview locale={locale} />
                                <div className="hidden w-full max-w-[412px] flex-col items-center gap-[24px] rounded-[12px] bg-white p-[16px] shadow-[0_8px_16px_rgba(0,0,0,0.12)]">
                                    <div className="flex w-full flex-col gap-[6px]">
                                        <p className="text-[14px] font-medium leading-none text-[#18181B]">{t("Share more details (optional)", "شارك المزيد من التفاصيل (اختياري)")}</p>
                                        <div className="flex min-h-[80px] w-full items-start rounded-[12px] border border-[#E4E6EA] bg-white px-[12px] py-[8px]">
                                            <p className="text-[14px] leading-[20px] text-[#6A727F]">
                                                {t(
                                                    "What happened? How do you feel about it? Write or speak your thoughts...",
                                                    "ماذا حدث؟ كيف تشعر حيال ذلك؟ اكتب أو شارك أفكارك..."
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex h-[56px] w-full items-center justify-center gap-[8px] rounded-[12px] border border-[#E4E6EA] bg-white px-[32px] py-[8px]">
                                        <Mic className="h-[20px] w-[20px] text-[#101827]" strokeWidth={2} />
                                        <p className="text-[16px] font-medium leading-none text-[#101827]">{t("Tap to Speack", "اضغط للتحدث")}</p>
                                    </div>
                                    <div className="flex w-full flex-col items-start gap-[12px]">
                                        <p className="text-[14px] font-medium leading-none text-[#18181B]">{t("Need help getting started?", "هل تحتاج إلى مساعدة للبدء؟")}</p>
                                        {[
                                            t("What triggered this feeling?", "ما الذي أثار هذا الشعور؟"),
                                            t("How intense is it right now?", "ما مدى شدته الآن؟"),
                                            t("What would help me feel better?", "ما الذي قد يساعدني على الشعور بشكل أفضل؟"),
                                            t("What can I learn from this?", "ماذا يمكنني أن أتعلم من هذا؟"),
                                        ].map((text) => (
                                            <div key={text} className="flex items-center justify-center rounded-[99px] bg-[#F8F9FB] px-[12px] py-[8px]">
                                                <p className="text-[14px] leading-none text-[#101827]">{text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`flex w-full flex-col items-center gap-[32px] sm:gap-[48px] lg:gap-[96px] lg:flex-row`}>
                            <div className="flex-1 w-full flex justify-center py-[20px] sm:py-[40px]">
                                <div className="relative w-full max-w-[360px] pt-[56px] sm:max-w-[420px] sm:pt-0">
                                    {/* The main Trend card */}
                                    <div className="relative z-10 w-full">
                                        <TrendWidget locale={locale} />
                                    </div>

                                    {/* The floating tilted pill */}
                                    <div className={`absolute top-0 sm:top-[-35px] lg:top-[-45px] ${isRtl ? "right-[14px] lg:right-[-70px]" : "left-[14px] lg:left-[-70px]"} -rotate-[8deg] sm:-rotate-[16deg] flex max-w-[190px] items-center justify-center gap-[8px] rounded-[12px] bg-white px-[12px] py-[8px] shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-[#f3f4f6] z-20 sm:w-max sm:max-w-none sm:gap-[10px] sm:px-[20px] sm:py-[16px]`}>
                                        <ThumbsUp className="h-[20px] w-[20px] shrink-0 text-[#2EB8AA] sm:h-[26px] sm:w-[26px]" strokeWidth={2} />
                                        <p className="text-[12px] font-bold leading-[16px] text-[#101827] sm:text-[14px] sm:leading-[18px]">
                                            {t("You were 76%", "كنت إيجابياً بنسبة 76%")}
                                            <br />
                                            {t("positive this week", "هذا الأسبوع")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={`flex w-full max-w-[520px] flex-1 justify-center ${isRtl ? "lg:justify-start" : "lg:justify-start"}`}>
                                <div className={`flex flex-col gap-[20px] ${isRtl ? "text-right items-start" : "text-left items-start"}`}>
                                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[15px] bg-[#2EB8AA] text-[18px] font-semibold text-white">
                                        04
                                    </div>
                                    <div className="flex flex-col gap-[12px] sm:gap-[16px]">
                                        <h3 className="text-[24px] font-semibold leading-[31px] sm:text-[30px] sm:leading-[38px]">{t("Watch notice, trends and pattern", "تابع الملاحظات والاتجاهات والأنماط")}</h3>
                                        <p className="text-[16px] leading-[25px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">
                                            {t(
                                                "After a week or month, review how happy, calm or anxious you were and get AI insights to improve your wellbeing.",
                                                "بعد أسبوع أو شهر، راجع مدى سعادتك أو هدوئك أو قلقك واحصل على رؤى الذكاء الاصطناعي لتحسين رفاهك."
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how" className="bg-[#FCFBF8] py-[64px] sm:py-[128px]">
                <div className="mx-auto flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col gap-[32px] px-6 sm:gap-[64px] lg:px-[96px]">
                    <div className={`mx-auto flex w-[768px] max-w-full flex-col items-center gap-[12px] text-center lg:mx-0 ${isRtl ? "lg:items-start lg:text-right" : "lg:items-start lg:text-left"}`}>
                        <div className="flex w-fit items-center justify-center rounded-full border border-[#2EB8AA] bg-[#F2FBF9] px-[16px] py-[6px] text-[14px] font-medium text-[#1C6964]">
                            {t("Everything You Need", "كل ما تحتاجه")}
                        </div>
                        <h2 className="max-w-[px] w-full text-[34px] font-semibold leading-[1.12] tracking-[-0.8px] sm:text-[48px] sm:tracking-[-1.92px]">
                            {t("Powerful features for ", "ميزات قوية لـ")}
                            <span className="text-[#2EB8AA]">{t("your emotional journey", "رحلتك العاطفية")}</span>
                        </h2>
                        <p className="max-w-[px] w-full text-[16px] leading-[26px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">
                            {t(
                                "Shuoori combines the best parts of journaling, mood tracking, and analytics into one beautiful, private space.",
                                "يجمع Shuoori بين أفضل ما في تدوين المشاعر وتتبع المزاج والتحليلات في مساحة جميلة وخاصة."
                            )}
                        </p>
                    </div>
                    <div className="flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col items-center gap-[48px] lg:flex-row lg:gap-[64px]">
                        <div className={`flex max-w-[560px] flex-1 flex-col gap-[18px] ${isRtl ? "items-start text-right" : "items-start text-left"}`}>
                            {featureShowcaseItems.map((item, index) => {
                                const isActive = index === activeFeaturePreview

                                return (
                                    <motion.button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setActiveFeaturePreview(index)}
                                        whileHover={{ y: -3, scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className={`group relative w-full overflow-hidden rounded-[16px] bg-white px-[24px] py-[20px] text-inherit transition-all duration-300 ${isRtl
                                            ? `text-right border-y-0 border-l-0 border-r-[4px] ${isActive
                                                ? "border-r-[#2EB8AA] shadow-[0_20px_38px_rgba(46,184,170,0.14)] lg:-translate-x-[10px]"
                                                : "border-r-[#E4E6EA] shadow-[0_12px_24px_rgba(16,24,39,0.03)] hover:border-r-[#B9E8E2] hover:shadow-[0_16px_28px_rgba(16,24,39,0.06)]"
                                            }`
                                            : `text-left border-y-0 border-r-0 border-l-[4px] ${isActive
                                                ? "border-l-[#2EB8AA] shadow-[0_20px_38px_rgba(46,184,170,0.14)] lg:translate-x-[10px]"
                                                : "border-l-[#E4E6EA] shadow-[0_12px_24px_rgba(16,24,39,0.03)] hover:border-l-[#B9E8E2] hover:shadow-[0_16px_28px_rgba(16,24,39,0.06)]"
                                            }`
                                            }`}
                                    >
                                        <div className={`flex flex-col ${isRtl ? "text-right items-start" : "text-left items-start"}`}>
                                            <h3 className="text-[20px] font-semibold leading-[30px] text-[#101827]">{item.title}</h3>
                                            <p className="mt-[8px] text-[16px] leading-[24px] text-[#4A5462]">{item.desc}</p>
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>
                        <div className="mt-[20px] flex w-full flex-1 items-center justify-center sm:mt-[40px] lg:mt-0">
                            <FeatureShowcasePreview featureId={featureShowcaseItems[activeFeaturePreview].id} locale={locale} />
                        </div>
                    </div>
                    <div className="hidden flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col items-center gap-[48px] lg:flex-row lg:gap-[64px]">
                        <div className={`flex max-w-[560px] flex-1 flex-col gap-[24px] ${isRtl ? "text-left" : "text-left"}`}>
                            {[
                                [
                                    t("Emotion wheel", "عجلة المشاعر"),
                                    t("Emotion wheels with a fast, tappable 6 core emotions with sub-emotion detail built for speed and clarity.", "عجلة مشاعر سريعة وسهلة النقر بـ 6 مشاعر أساسية وتفاصيل فرعية للوضوح والسرعة.")
                                ],
                                [
                                    t("Deep Analytics Dashboard", "لوحة تحليلات متقدمة"),
                                    t("Bar charts, donut breakdowns. Understand your emotional trends across weeks and months.", "مخططات أعمدة ودوائر. افهم اتجاهات مشاعرك عبر الأسابيع والأشهر.")
                                ],
                                [
                                    t("Voice-to-Text Journaling", "تدوين الصوت إلى نص"),
                                    t("Too tired to type? Just speak. Your voice gets converted to a rich journal entry in seconds effortless emotional expression.", "متعب من الكتابة؟ فقط تحدث. يتحول صوتك إلى ملاحظة غنية خلال ثوانٍ للتعبير العاطفي بسهولة.")
                                ],
                                [
                                    t("HIPAA Compliant", "متوافق مع HIPAA"),
                                    t("EmotionFlow adheres to HIPAA (Health Insurance Portability and Accountability Act) standards — the highest level of healthcare data protection in the industry.", "يلتزم EmotionFlow بمعايير HIPAA — أعلى مستوى لحماية بيانات الرعاية الصحية في المجال.")
                                ],
                            ].map(([title, desc]) => (
                                <div key={title} className={`w-full rounded-[12px] ${isRtl ? "border-l-4" : "border-l-4"} border-[#E4E6EA] bg-white px-[24px] py-[16px]`}>
                                    <h3 className="text-[20px] font-semibold leading-[30px] text-[#101827]">{title}</h3>
                                    <p className="mt-[8px] text-[16px] leading-[24px] text-[#4A5462]">{desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-1 items-center justify-center w-full mt-[64px] lg:mt-0">
                            <div
                                className="flex w-full items-center justify-center bg-contain bg-center bg-no-repeat py-[32px]"
                                style={{ backgroundImage: `url(${trySection.blob})` }}
                            >
                                <img src={isRtl ? "/arabicanalytics.png" : "/feature-phone-framed.png"} alt="Analytics preview" className="w-full max-w-[331px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#F8F9FB] py-[64px] sm:py-[128px]">
                <div className="mx-auto flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col items-center gap-[36px] px-6 sm:gap-[48px] lg:flex-row lg:items-center lg:gap-[64px] lg:px-[96px]">
                    <AnalyticsPhoneMockup locale={locale} t={t} />
                    <div className={`flex w-full flex-1 flex-col items-center gap-[12px] text-center ${isRtl ? "lg:items-start lg:text-right" : "lg:items-start lg:text-left"}`}>
                        <div className="flex w-fit items-center justify-center rounded-full border border-[#2EB8AA] bg-[#F2FBF9] px-[16px] py-[6px] text-[14px] font-medium text-[#1C6964]">
                            {t("Analytics & Insights", "التحليلات والرؤى")}
                        </div>
                        <h2 className="text-[34px] font-semibold leading-[1.12] tracking-[-0.8px] sm:text-[48px] sm:tracking-[-1.92px]">
                            {t("Discover your ", "اكتشف ")}
                            <span className="text-[#2EB8AA]">{t("emotional patterns", "أنماط مشاعرك")}</span>
                        </h2>
                        <p className="max-w-[px] w-full text-[16px] leading-[26px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">
                            {t(
                                "After a month of logging, you'll see exactly how happy, calm, or anxious you've been. Our analytics dashboard helps you identify trends, triggers, and progress — so you can actively work on improving your mental wellness.",
                                "بعد شهر من تسجيل مشاعرك، ستعرف بدقة مدى سعادتك أو هدوئك أو قلقك. تساعدك لوحة التحليلات على تحديد الاتجاهات والمحركات والتقدم — لتعمل بفعالية على تحسين صحتك النفسية."
                            )}
                        </p>
                        <div className="py-[16px]">
                            {[
                                t("Monthly mood breakdown — see your happiest and toughest days", "تحليل شهري للحالة المزاجية — تعرّف على أكثر أيامك سعادة وأصعبها"),
                                t("Track progress over weeks and months to spot improvements", "تتبع تقدمك عبر الأسابيع والأشهر لملاحظة التحسن"),
                                t("Daily, weekly, and monthly views of your emotional journey", "عرض يومي وأسبوعي وشهري لرحلتك العاطفية"),
                                t("Understand which emotions dominate and what triggers them", "افهم المشاعر الأكثر تأثيراً وما الذي يحفّزها"),
                            ].map((text) => (
                                <div key={text} className="flex items-start gap-[12px] py-[6px]">
                                    <CheckCircle2 className="h-[24px] w-[24px] shrink-0 text-[#2EB8AA] sm:h-[28px] sm:w-[28px]" strokeWidth={1.6} />
                                    <p className="text-[16px] leading-[25px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">{text}</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-fit rounded-[12px] bg-[#2EB8AA] px-[20px] py-[12px] text-[16px] font-medium text-white">
                            {t("Try it now free", "جرّبه الآن مجاناً")}
                        </button>
                    </div>
                </div>
            </section>

            <section id="stories" className="bg-[#FCFBF8] py-[64px] sm:py-[96px]">
                <div className="mx-auto flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col items-center gap-[40px] px-6 sm:gap-[64px] lg:px-[96px]">
                    <div className="flex flex-col items-center gap-[12px] text-center">
                        <div className="flex items-center justify-center rounded-full border-2 border-[#2EB8AA] bg-[#F2FBF9] px-[18px] py-[8px] text-[16px] text-[#1C6964]">
                            {t("Real Stories", "قصص حقيقية")}
                        </div>
                        <h2 className="max-w-[px] w-full text-[34px] font-semibold leading-[1.12] tracking-[-0.8px] text-[#101827] sm:text-[48px] sm:tracking-[-1.92px]">
                            {t("Loved by people who prioritise ", "محبوب من قبل الأشخاص الذين ")}
                            <span className="text-[#2EB8AA]">{t("their wellbeing", "يضعون صحتهم النفسية أولاً")}</span>
                        </h2>
                        <p className="max-w-[px] w-full text-[16px] leading-[26px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">
                            {t(
                                "Thousands of people have used Shuoori to understand themselves better and build healthier emotional habits.",
                                "انضم إلى الآلاف ممن استخدموا Shuoori لفهم أنفسهم بشكل أعمق وبناء عادات عاطفية صحية."
                            )}
                        </p>
                    </div>
                    <div
                        className="w-full overflow-hidden py-4"
                        onMouseEnter={() => setIsTestimonialHovered(true)}
                        onMouseLeave={() => setIsTestimonialHovered(false)}
                    >
                        <style>{`
                            .testimonial-track {
                                --slide-width: calc(100% + 24px);
                            }
                            @media (min-width: 1024px) {
                                .testimonial-track {
                                    --slide-width: calc(50% + 12px);
                                }
                            }
                        `}</style>
                        <div
                            onTransitionEnd={handleTransitionEnd}
                            className={`testimonial-track flex w-full gap-6 ${isTestimonialTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                            style={{
                                transform: `translate3d(calc(-1 * ${dirMultiplier} * ${testimonialIndex} * var(--slide-width)), 0, 0)`,
                            } as React.CSSProperties}
                        >
                            {extendedTestimonials.map((story, index) => {
                                return (
                                    <div
                                        key={`${story.name}-${index}`}
                                        className={`relative w-full lg:w-[calc(50%-12px)] flex-shrink-0 flex flex-col justify-between gap-[20px] rounded-[24px] bg-white p-[24px] pb-[190px] pt-[24px] sm:gap-[24px] sm:p-[32px] sm:pb-[32px] md:p-[48px] md:pt-[32px] shadow-[0_12px_32px_rgba(0,0,0,0.04)] overflow-hidden min-h-[500px] sm:min-h-[380px] lg:min-h-[420px] ${isRtl ? "text-right" : "text-left"}`}
                                    >
                                        <div className="flex flex-col gap-[18px] relative z-10 w-full sm:w-[65%] sm:gap-[24px] xl:w-[60%]">
                                            <div className="text-[78px] leading-[0.5] pt-[18px] text-[#F4F5F7] font-serif tracking-tighter sm:text-[120px] sm:pt-[40px]">“</div>
                                            <p className="text-[14px] leading-[24px] text-[#4A5462] sm:text-[15px] xl:text-[17px] xl:leading-[28px]">
                                                "{story.quote}"
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-[4px] relative z-10 mt-auto">
                                            <p className="text-[18px] font-bold leading-[30px] text-[#101827]">{story.name}</p>
                                            <p className="text-[14px] leading-none text-[#6A727F]">{story.title}</p>
                                        </div>
                                        <img
                                            src={story.image}
                                            alt={story.name}
                                            className={isRtl ? story.imageClassRtl : story.imageClass}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pagination Indicators / Dots */}
                    <div className="flex items-center justify-center gap-[8px]">
                        {[0, 1, 2, 3].map((idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setTestimonialIndex(idx + 1);
                                    setIsTestimonialAutoplay(false);
                                }}
                                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${activeDot === idx ? "w-8 bg-[#2EB8AA]" : "w-2.5 bg-[#cbd5e1] hover:bg-gray-400"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    <div className={`flex items-center gap-[32px] ${isRtl ? "flex-row-reverse" : ""}`}>
                        <button
                            onClick={() => {
                                setTestimonialIndex((prev) => isRtl ? prev + 1 : prev - 1);
                                setIsTestimonialAutoplay(false);
                            }}
                            className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[#EAECF0] bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all shadow-sm focus:outline-none"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-[24px] w-[24px] text-[#101827]" strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => {
                                setTestimonialIndex((prev) => isRtl ? prev - 1 : prev + 1);
                                setIsTestimonialAutoplay(false);
                            }}
                            className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[#EAECF0] bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all shadow-sm focus:outline-none"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-[24px] w-[24px] text-[#101827]" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </section>

            <section id="pricing" className="bg-[#F8F9FB] py-[64px] sm:py-[120px]">
                <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 lg:px-[96px]">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-[12px] text-center mb-[40px] sm:mb-[52px]">
                        <div className="inline-flex items-center gap-[8px] rounded-full border border-[#2EB8AA]/30 bg-[#F2FBF9] px-[16px] py-[6px] text-[13px] font-bold text-[#1C6964] shadow-sm">
                            <Tag className="h-3.5 w-3.5 text-[#2EB8AA]" />
                            <span>{t("PRICING", "الأسعار")}</span>
                        </div>
                        <h2 className="text-[30px] font-extrabold leading-[1.16] tracking-[-0.6px] text-[#101827] sm:text-[46px] sm:tracking-[-1.5px]">
                            {t("Simple, Transparent Pricing", "أسعار بسيطة وشفافة")}
                        </h2>
                        <p className="max-w-[580px] text-[15px] leading-[25px] text-[#4A5462] sm:text-[18px] sm:leading-[28px]">
                            {t("We believe in keeping things simple. Enjoy full access to Shuoori today — with more options coming soon.", "نؤمن بتبسيط الأمور. استمتع بالوصول الكامل إلى Shuoori اليوم — مع خيارات إضافية قادمة قريباً.")}
                        </p>
                    </div>

                    {/* Single Plan Card & Banner Container */}
                    {(() => {
                        const cmsSectionsMap = groupSectionsByKey(rawSections)
                        const item = (cmsSectionsMap.pricing?.items?.[0] || {}) as Record<string, any>

                        const getVal = (fieldObj: any, fallbackEn: string, fallbackAr: string) => {
                            if (!fieldObj) return isRtl ? fallbackAr : fallbackEn
                            if (typeof fieldObj === "string") return fieldObj
                            const val = isRtl ? (fieldObj.ar || fieldObj.en) : (fieldObj.en || fieldObj.ar)
                            return typeof val === "string" && val ? val : (isRtl ? fallbackAr : fallbackEn)
                        }

                        const tagline = getVal(item.tagline, "FOR NOW", "حالياً")
                        const headline = getVal(item.headline, "Enjoy Unlimited Access!", "استمتع بجميع الميزات مجاناً!")
                        const subtext = getVal(item.subtext, "All features are available to you right now. No payments, no limits.", "جميع الميزات متاحة لك الآن. بدون أية مدفوعات وبدون حدود.")
                        const freeBadge = getVal(item.freeBadge, "100% Free to Use", "مجاني 100% للمستخدمين")
                        const bannerTitle = getVal(item.bannerTitle, "More Plans Coming Soon", "المزيد من الخطط قريباً")
                        const bannerSubtext = getVal(item.bannerSubtext, "We're working on exciting premium plans to bring you even more.", "نعمل على تصميم خطط احترافية مميزة لتوفير المزيد من الخصائص.")
                        const bannerButton = getVal(item.bannerButton, "Stay Tuned!", "ترقبوا الجديد!")

                        return (
                            <div className="w-full max-w-[680px] mx-auto flex flex-col gap-[20px]">
                                {/* Main Free Card */}
                                <div className="relative overflow-hidden rounded-[28px] border border-[#2EB8AA]/20 bg-[linear-gradient(180deg,#F2FBF9_0%,#FFFFFF_100%)] p-[28px] sm:rounded-[32px] sm:p-[48px] shadow-[0_24px_60px_rgba(46,184,170,0.10)] text-center flex flex-col items-center">
                                    {/* Icon Badge */}
                                    <div className="relative mb-[18px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white border border-[#E8ECF2] shadow-[0_12px_28px_rgba(46,184,170,0.16)] sm:mb-[20px] sm:h-[84px] sm:w-[84px]">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2EB8AA]/10 to-transparent" />
                                        <Gift className="h-[32px] w-[32px] text-[#2EB8AA] sm:h-[38px] sm:w-[38px]" strokeWidth={1.8} />
                                    </div>

                                    {/* Tagline */}
                                    <span className="text-[12px] font-extrabold tracking-[0.18em] text-[#2EB8AA] uppercase mb-[10px]">
                                        {tagline}
                                    </span>

                                    {/* Headline */}
                                    <h3 className="text-[24px] font-extrabold tracking-[-0.4px] text-[#101827] leading-[1.24] sm:text-[34px] sm:tracking-[-0.8px]">
                                        {headline}
                                    </h3>

                                    {/* Subtext */}
                                    <p className="mt-[12px] max-w-[440px] text-[15px] sm:text-[16px] leading-[24px] text-[#4A5462]">
                                        {subtext}
                                    </p>

                                    {/* Free Badge */}
                                    <div className="mt-[28px] inline-flex items-center gap-[10px] rounded-full border border-[#2EB8AA]/30 bg-[#F2FBF9] px-[24px] py-[12px] text-[15px] font-bold text-[#1C6964] shadow-sm">
                                        <CheckCircle2 className="h-[20px] w-[20px] text-[#2EB8AA]" />
                                        <span>{freeBadge}</span>
                                    </div>
                                </div>

                                {/* Coming Soon Banner */}
                                <div className="rounded-[24px] border border-[#E8ECF2] bg-white p-[20px] sm:p-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-[16px]">
                                    <div className="flex items-center gap-[16px]">
                                        <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] bg-[#F2FBF9] border border-[#2EB8AA]/20 text-[#2EB8AA]">
                                            <CalendarDays className="h-[24px] w-[24px]" strokeWidth={2} />
                                        </div>
                                        <div className={`flex flex-col ${isRtl ? "text-right" : "text-left"}`}>
                                            <p className="text-[16px] font-bold text-[#101827]">{bannerTitle}</p>
                                            <p className="mt-[2px] text-[13px] leading-[20px] text-[#6A727F]">{bannerSubtext}</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 rounded-full border border-[#2EB8AA]/20 bg-[#F2FBF9] px-[20px] py-[10px] text-[13px] font-bold text-[#1C6964]">
                                        {bannerButton}
                                    </div>
                                </div>
                            </div>
                        )
                    })()}
                </div>
            </section>

            <section id="faq" className="bg-[#F8F9FB] py-[64px] sm:py-[96px]">
                <div
                    className={`mx-auto flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col gap-[36px] px-6 sm:gap-[64px] lg:px-[96px] lg:flex-row`}
                >
                    <div className={`flex flex-1 flex-col items-center gap-[32px] text-center sm:gap-[64px] ${isRtl ? "lg:items-start lg:text-right" : "lg:items-start lg:text-left"}`}>
                        <div className={`flex flex-col items-center gap-[12px] text-center ${isRtl ? "lg:items-start lg:text-right" : "lg:items-start lg:text-left"}`}>
                            <div className="flex w-fit items-center justify-center rounded-full border border-[#2EB8AA] bg-[#F2FBF9] px-[16px] py-[6px] text-[14px] font-medium text-[#1C6964]">
                                {t("Questions", "الأسئلة")}
                            </div>
                            <h2 className="text-[34px] font-semibold leading-[1.12] tracking-[-0.8px] text-[#101827] sm:text-[48px] sm:tracking-[-1.92px]">
                                {t("Frequently asked ", "الأسئلة ")}
                                <span className="text-[#2EB8AA]">{t("questions", "الشائعة")}</span>
                            </h2>
                            <p className="text-[18px] leading-[28px] text-[#4A5462]">{t("Everything you need to know about Shuoori.", "كل ما تحتاج لمعرفته عن Shuoori.")}</p>
                        </div>
                        <div className="rounded-[12px] bg-white p-[24px]">
                            <h3 className="text-[24px] font-semibold leading-[32px] text-[#101827]">{t("Can’t find answers?", "لم تجد الإجابة؟")}</h3>
                            <p className="mt-[8px] text-[18px] leading-[28px] text-[#4A5462]">
                                {t(
                                    "We are here to help you out whenever you need! Get in touch with our dedicated support team for personalized assistance anytime.",
                                    "نحن هنا لمساعدتك متى احتجت! تواصل مع فريق الدعم المتخصص للحصول على مساعدة مخصصة في أي وقت."
                                )}
                            </p>
                            <a href="/contact" className="mt-[24px] inline-flex h-[44px] items-center gap-[8px] rounded-[12px] bg-[#2EB8AA] px-[32px] text-[16px] font-medium text-white">
                                {t("Contact us", "تواصل معنا")}
                                <ArrowUpRight className="h-[16px] w-[16px]" />
                            </a>
                        </div>
                    </div>
                    <div className={`flex flex-1 flex-col gap-[24px] ${isRtl ? "items-stretch text-right" : "items-stretch text-left"}`}>
                        {[
                            {
                                question: t("Is my emotional data private and secure?", "هل بياناتي العاطفية خاصة وآمنة؟"),
                                answer: t(
                                    "Absolutely. Your data is encrypted end-to-end and stored securely. We never sell, share, or use your emotional data for advertising. Shuoori is a private sanctuary your entries are yours alone.",
                                    "نعم تماماً. بياناتك مشفرة بالكامل وتُخزن بأمان. لا نبيع أو نشارك بياناتك ولا نستخدمها للإعلانات. مدخلاتك ملك لك وحدك."
                                ),
                            },
                            {
                                question: t("How long does it take to log an emotion?", "كم يستغرق تسجيل المشاعر؟"),
                                answer: t("Most people log an emotion in under 60 seconds. You can tap, add context, and save quickly.", "أغلب المستخدمين يسجلون شعوراً خلال أقل من 60 ثانية. يمكنك الاختيار وإضافة السياق والحفظ بسرعة."),
                            },
                            {
                                question: t("Is Shuoori a replacement for therapy?", "هل Shuoori بديل عن العلاج النفسي؟"),
                                answer: t("No. Shuoori is a supportive self‑reflection tool and does not replace professional care.", "لا. Shuoori أداة للتأمل الذاتي ولا تُغني عن الرعاية المتخصصة."),
                            },
                            {
                                question: t("Can I export my data?", "هل يمكنني تصدير بياناتي؟"),
                                answer: t("Yes, you can export your data anytime from the settings section.", "نعم، يمكنك تصدير بياناتك في أي وقت من الإعدادات."),
                            },
                            {
                                question: t("What platforms is Shuoori available on?", "على أي منصات يتوفر Shuoori؟"),
                                answer: t("Shuoori is available on iOS, Android, and web.", "يتوفر Shuoori على iOS وAndroid والويب."),
                            },
                            {
                                question: t("Can I cancel my subscription at any time?", "هل يمكنني إلغاء الاشتراك في أي وقت؟"),
                                answer: t("Yes. You can cancel your subscription at any time without penalties.", "نعم. يمكنك الإلغاء في أي وقت بدون غرامات."),
                            },
                        ].map((item, idx) => {
                            const isOpen = expandedFaq === idx
                            return (
                                <div key={item.question} className="rounded-[12px] bg-white p-[24px] w-full">
                                    <button
                                        type="button"
                                        onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                                        className={`flex w-full items-start justify-between gap-[24px] ${isRtl ? "text-right" : "text-left"}`}
                                        aria-expanded={isOpen}
                                    >
                                        <div className="flex flex-1 flex-col gap-[8px]">
                                            <p className="text-[18px] font-medium leading-[28px] text-[#101827]">{item.question}</p>
                                            {isOpen && (
                                                <p className="text-[16px] leading-[24px] text-[#4A5462]">{item.answer}</p>
                                            )}
                                        </div>
                                        <div className={`flex h-[40px] w-[40px] items-center justify-center rounded-[12px] ${isOpen ? "bg-[#2EB8AA]" : "border border-[#E4E6EA] bg-white"}`}>
                                            {isOpen ? (
                                                <ChevronUp className="h-[16px] w-[16px] text-white" strokeWidth={2.5} />
                                            ) : (
                                                <ChevronDown className="h-[16px] w-[16px] text-[#101827]" strokeWidth={2.5} />
                                            )}
                                        </div>
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            <footer className="bg-[#F8F9FB] pb-[96px] pt-[64px]">
                <div className="relative mx-auto flex w-full max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1480px] flex-col items-center gap-[64px] px-6 lg:px-[96px]">
                    <div className={`flex w-full flex-col items-center gap-[18px] text-center text-[14px] text-[#4A5462] lg:gap-[24px] lg:items-center lg:justify-between ${isRtl ? "lg:flex-row-reverse lg:text-right" : "lg:flex-row lg:text-left"}`}>
                        <p className="w-full lg:w-auto">{t("© 2026 Shuoori. Made with care for your wellbeing.", "© 2026 Shuoori. صُنع بعناية من أجل رفاهك.")}</p>
                        <div className="flex flex-wrap items-center justify-center gap-x-[18px] gap-y-[12px] font-medium sm:gap-x-[24px] lg:justify-start lg:gap-x-[32px]">
                            <a href="#features" className="hover:text-[#101827] transition-colors">{t("Features", "الميزات")}</a>
                            <a href="#how" className="hover:text-[#101827] transition-colors">{t("How it works", "كيف يعمل")}</a>
                            <a href="#stories" className="hover:text-[#101827] transition-colors">{t("Stories", "قصص")}</a>
                            <a href="#pricing" className="hover:text-[#101827] transition-colors">{t("Pricing", "الأسعار")}</a>
                            <a href="#faq" className="hover:text-[#101827] transition-colors">{t("FAQ", "الأسئلة الشائعة")}</a>
                        </div>
                    </div>
                    <div className="flex justify-center w-full max-w-[400px] opacity-20 mix-blend-multiply">
                        <img src="/logo.png" alt="Shuoori" className="w-full object-contain" />
                    </div>
                </div>
            </footer>
        </div>
    )
}

