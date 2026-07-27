import { commonAr } from "./ar/common"
import { userDashboardAr } from "./ar/userDashboard"
import { landingAr } from "./ar/landing"
import { commonEn } from "./en/common"
import { userDashboardEn } from "./en/userDashboard"
import { landingEn } from "./en/landing"

export type Locale = "ar" | "en"

export const copy = {
  ar: {
    common: commonAr,
    landing: landingAr,
    userDashboard: userDashboardAr,
  },
  en: {
    common: commonEn,
    landing: landingEn,
    userDashboard: userDashboardEn,
  },
} as const

export const localeMeta: Record<Locale, { dir: "rtl" | "ltr"; label: string }> = {
  ar: { dir: "rtl", label: "Arabic" },
  en: { dir: "ltr", label: "English" },
}
