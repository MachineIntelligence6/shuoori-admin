import type { Locale } from "../i18n"

export type LocalizedText = {
    en?: string
    ar?: string
}

export type CmsImage = {
    url?: string
    alt?: LocalizedText
    key?: string
}

export type CmsItem = Record<string, unknown>

export type CmsSection = {
    key: string
    title?: LocalizedText
    subtitle?: LocalizedText
    body?: LocalizedText
    images?: CmsImage[]
    items?: CmsItem[]
    order?: number
    isPublished?: boolean
}

export type CmsTextOverrides = {
    en?: Record<string, string>
    ar?: Record<string, string>
}

type CmsPayload = {
    sections?: CmsSection[]
}

const defaultCmsApiUrl = "http://127.0.0.1:3000/api/content"

export async function fetchCmsSections(signal?: AbortSignal) {
    const apiUrl = (import.meta.env.VITE_CMS_API_URL || defaultCmsApiUrl).replace(/\/$/, "")
    const response = await fetch(apiUrl, { cache: "no-store", signal })

    if (!response.ok) {
        throw new Error(`CMS content request failed with ${response.status}`)
    }

    const payload = (await response.json()) as CmsPayload
    return Array.isArray(payload.sections) ? payload.sections : []
}

export function groupSectionsByKey(sections: CmsSection[]) {
    return sections.reduce<Record<string, CmsSection>>((accumulator, section) => {
        accumulator[section.key] = section
        return accumulator
    }, {})
}

export function sectionItems(section?: CmsSection) {
    return Array.isArray(section?.items) ? section.items : []
}

export function sectionMedia(section?: CmsSection) {
    return Array.isArray(section?.images) ? section.images : []
}

export function mediaAlt(image: CmsImage | undefined, locale: Locale, fallback = "") {
    return localize(image?.alt, locale) || fallback
}

export function findSectionMedia(section: CmsSection | undefined, patterns: string[]) {
    const loweredPatterns = patterns.map((pattern) => pattern.toLowerCase())

    return sectionMedia(section).find((image) => {
        const haystack = [image.url, image.key, image.alt?.en, image.alt?.ar].filter(Boolean).join(" ").toLowerCase()
        return loweredPatterns.some((pattern) => haystack.includes(pattern))
    })
}

export function localize(value: unknown, locale: Locale) {
    if (!value || typeof value !== "object") return ""

    const localized = value as LocalizedText
    return (locale === "ar" ? localized.ar || localized.en : localized.en || localized.ar) || ""
}

export function localizedField(item: CmsItem, field: string, locale: Locale, fallback = "") {
    return localize(item[field], locale) || fallback
}

export function stringField(item: CmsItem, field: string, fallback = "") {
    const value = item[field]

    if (typeof value === "string") return value
    if (typeof value === "number") return String(value)

    return fallback
}

export function numberField(item: CmsItem, field: string, fallback = 0) {
    const value = item[field]

    if (typeof value === "number") return value
    if (typeof value === "string") {
        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : fallback
    }

    return fallback
}

export function buildTextOverrides(sections: CmsSection[]): CmsTextOverrides {
    const overrides: Required<CmsTextOverrides> = { en: {}, ar: {} }
    const byKey = groupSectionsByKey(sections)

    const set = (key: string, value?: LocalizedText) => {
        if (!value) return
        if (typeof value.en === "string") overrides.en[key] = value.en
        if (typeof value.ar === "string") overrides.ar[key] = value.ar
    }

    const setSplit = (keys: [string, string], value?: LocalizedText) => {
        if (!value) return

        for (const locale of ["en", "ar"] as const) {
            const text = value[locale]
            if (typeof text !== "string") continue

            const parts = text.includes("\n") ? text.split(/\n+/) : [text, ""]
            overrides[locale][keys[0]] = parts[0] ?? ""
            overrides[locale][keys[1]] = parts.slice(1).join(" ") || ""
        }
    }

    const setItems = (sectionKey: string, keys: string[], fields: string[]) => {
        sectionItems(byKey[sectionKey]).forEach((item, index) => {
            const key = keys[index]
            if (!key) return

            fields.forEach((field) => set(key, item[field] as LocalizedText | undefined))
        })
    }

    const header = byKey.header
    set("Shuoori", header?.title)
    set("شعوري", header?.title)

    const hero = byKey.hero
    set("#1 Emotion Wellness App", hero?.subtitle)
    setSplit(["Understand your emotions", "transform "], hero?.title)
    set("your mental wellness", { en: "", ar: "" })
    set("Shuoori helps you track, understand, and improve your emotional health through intuitive journaling, AI-powered insights, and beautiful analytics — in just 60 seconds a day.", hero?.body)
    sectionItems(hero).forEach((item) => {
        const label = item.label as LocalizedText | undefined
        const kind = typeof item.kind === "string" ? item.kind : ""
        const fallbackKey = typeof label?.en === "string" ? label.en : ""

        if (fallbackKey && ["cta", "stat", "social_proof", "badge"].includes(kind)) {
            set(fallbackKey, label)
        }
    })

    setSplit(["Start tracking in ", "4 simple steps"], byKey.process?.title)
    set("Simple Process", byKey.process?.subtitle)
    set("From logging your first emotion to receiving personalized monthly reports Shuoori guides you every step of the way.", byKey.process?.body)
    setItems(
        "process",
        ["Pick your emotion", "Add when, where and with whom", "Define any additional details", "Watch notice, trends and pattern"],
        ["title"]
    )
    setItems(
        "process",
        [
            "Choose from our intuitive emotion wheel. From joy to anxiety, we have all the shades of feeling covered with clear labels.",
            "Tag your activity, location and who you're with. The context behind your emotion unlocks deep insights.",
            "Add a journal entry by typing or using voice-to-text. Guided prompts help when you're unsure what to write.",
            "After a week or month, review how happy, calm or anxious you were and get AI insights to improve your wellbeing.",
        ],
        ["description"]
    )

    setSplit(["Powerful features for ", "your emotional journey"], byKey.feature_showcase?.title)
    set("Everything You Need", byKey.feature_showcase?.subtitle)
    set("Shuoori combines the best parts of journaling, mood tracking, and analytics into one beautiful, private space.", byKey.feature_showcase?.body)

    setSplit(["Discover your ", "emotional patterns"], byKey.analytics?.title)
    set("Analytics & Insights", byKey.analytics?.subtitle)
    set("After a month of logging, you'll see exactly how happy, calm, or anxious you've been. Our analytics dashboard helps you identify trends, triggers, and progress — so you can actively work on improving your mental wellness.", byKey.analytics?.body)

    setSplit(["Loved by people who prioritise ", "their wellbeing"], byKey.testimonials?.title)
    set("Real Stories", byKey.testimonials?.subtitle)
    set("Thousands of people have used Shuoori to understand themselves better and build healthier emotional habits.", byKey.testimonials?.body)

    setSplit(["Invest in your ", "emotional wellness"], byKey.pricing?.title)
    set("Simple Pricing", byKey.pricing?.subtitle)
    set("Start free, upgrade when you're ready. No hidden fees, no long-term contracts.", byKey.pricing?.body)
    sectionItems(byKey.pricing).forEach((item) => {
        const name = item.name as LocalizedText | undefined
        if (name) {
            set("Free plan", name)
            set("الخطة المجانية", name)
        }
        const monthlyPrice = typeof item.monthlyPrice === "string" ? item.monthlyPrice : ""
        if (monthlyPrice) {
            overrides.en["$0.00/mth"] = monthlyPrice
            overrides.ar["0$/شهرياً"] = monthlyPrice
        }
        const yearlyPrice = typeof item.yearlyPrice === "string" ? item.yearlyPrice : ""
        if (yearlyPrice) {
            overrides.en["$0.00/year"] = yearlyPrice
            overrides.ar["0$/سنوياً"] = yearlyPrice
        }
        const description = item.description as LocalizedText | undefined
        if (description) {
            set("Perfect for getting started with emotion tracking.", description)
            set("مثالية للبدء في تتبع المشاعر.", description)
        }
        const ctaLabel = item.ctaLabel as LocalizedText | undefined
        if (ctaLabel) {
            set("Get started free", ctaLabel)
            set("ابدأ مجاناً", ctaLabel)
            set("ابدأ مجانا", ctaLabel)
        }
    })

    setSplit(["Frequently asked ", "questions"], byKey.faq?.title)
    set("Questions", byKey.faq?.subtitle)
    set("Everything you need to know about Shuoori.", byKey.faq?.body)
    sectionItems(byKey.faq).forEach((item) => {
        const question = item.question as LocalizedText | undefined
        const answer = item.answer as LocalizedText | undefined
        if (question?.en) set(question.en, question)
        if (answer?.en) set(answer.en, answer)
    })

    set("© 2026 Shuoori. Made with care for your wellbeing.", byKey.footer?.title)
    sectionItems(byKey.footer).forEach((item) => {
        const label = item.label as LocalizedText | undefined
        if (label?.en) set(label.en, label)
    })

    return overrides
}
