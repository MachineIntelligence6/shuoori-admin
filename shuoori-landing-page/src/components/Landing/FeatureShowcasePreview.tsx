import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Lock, ShieldCheck, Sparkles } from "lucide-react"
import EmotionWheelLoop from "./EmotionWheelLoop"
import ShareDetailsPreview from "./ShareDetailsPreview"
import { TrendWidget } from "./TrendWidget"
import type { Locale } from "../../i18n"

type FeatureId = "wheel" | "analytics" | "journaling" | "hipaa"

type FeatureShowcasePreviewProps = {
    featureId: FeatureId
    locale: Locale
}

function HipaaPreview({ locale }: { locale: Locale }) {
    const isRtl = locale === "ar"
    const t = (en: string, ar: string) => (isRtl ? ar : en)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-[430px]"
        >
            <div className="pointer-events-none absolute inset-x-[12%] top-[14%] h-[70%] rounded-full bg-[#2EB8AA]/12 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-[#E8ECF2] bg-white p-[24px] shadow-[0_20px_42px_rgba(16,24,39,0.10)]">
                <div className="flex items-start justify-between gap-[16px]">
                    <div className={`flex flex-col gap-[8px] ${isRtl ? "items-start text-right" : "items-start text-left"}`}>
                        <div className="inline-flex items-center gap-[8px] rounded-full bg-[#F2FBF9] px-[12px] py-[6px] text-[12px] font-semibold text-[#1C6964]">
                            <Sparkles className="h-[14px] w-[14px]" strokeWidth={2} />
                            {t("Private by design", "الخصوصية من الأساس")}
                        </div>
                        <h4 className="text-[24px] font-semibold leading-[30px] text-[#101827]">
                            {t("HIPAA secure", "آمن وفق HIPAA")}
                        </h4>
                        <p className="max-w-[250px] text-[14px] leading-[22px] text-[#4A5462]">
                            {t("Encrypted storage, protected access and health-grade data handling.", "تخزين مشفر ووصول محمي ومعالجة بيانات بمستوى الرعاية الصحية.")}
                        </p>
                    </div>

                    <div className="relative flex h-[78px] w-[78px] items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,#2EB8AA,#1FA296)] shadow-[0_18px_32px_rgba(46,184,170,0.22)]">
                        <motion.div
                            animate={{ scale: [1, 1.16, 1], opacity: [0.16, 0.05, 0.16] }}
                            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-[-10px] rounded-[28px] border border-[#2EB8AA]"
                        />
                        <ShieldCheck className="h-[34px] w-[34px] text-white" strokeWidth={2.2} />
                    </div>
                </div>

                <div className="mt-[22px] grid grid-cols-2 gap-[12px]">
                    {[
                        { icon: Lock, title: t("Encrypted", "مشفر"), text: t("At rest & in transit", "أثناء النقل والتخزين") },
                        { icon: ShieldCheck, title: t("Protected", "محمي"), text: t("Strict access control", "تحكم صارم بالوصول") },
                        { icon: CheckCircle2, title: t("Compliant", "متوافق"), text: t("Built for trust", "مصمم للثقة") },
                        { icon: Sparkles, title: t("Private", "خاص"), text: t("No ad data sharing", "بدون مشاركة إعلانية") },
                    ].map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 * index, duration: 0.3, ease: "easeOut" }}
                            className="rounded-[18px] border border-[#EEF2F6] bg-[#FBFCFD] p-[14px]"
                        >
                            <item.icon className="h-[18px] w-[18px] text-[#2EB8AA]" strokeWidth={2} />
                            <p className="mt-[10px] text-[14px] font-semibold text-[#101827]">{item.title}</p>
                            <p className="mt-[4px] text-[12px] leading-[18px] text-[#6A727F]">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default function FeatureShowcasePreview({ featureId, locale }: FeatureShowcasePreviewProps) {
    const preview = (() => {
        if (featureId === "wheel") {
            return <EmotionWheelLoop locale={locale} />
        }

        if (featureId === "analytics") {
            return <TrendWidget locale={locale} />
        }

        if (featureId === "journaling") {
            return <ShareDetailsPreview locale={locale} />
        }

        return <HipaaPreview locale={locale} />
    })()

    return (
        <div className="relative flex min-h-[420px] w-full items-center justify-center lg:min-h-[520px]">
            <div className="pointer-events-none absolute inset-x-[8%] top-[12%] h-[76%] rounded-full bg-[radial-gradient(circle,rgba(46,184,170,0.12),rgba(255,255,255,0))] blur-2xl" />
            <div className="relative flex w-full items-center justify-center rounded-[36px] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,250,252,0.92))] px-[12px] py-[20px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={featureId}
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -18, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="flex w-full items-center justify-center"
                    >
                        {preview}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
