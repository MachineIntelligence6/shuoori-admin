export type LocalizedText = {
  en: string
  ar: string
}

export type FieldType = "text" | "textarea" | "localized" | "localizedTextarea" | "number" | "checkbox" | "localizedList"

export type ItemField = {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  hidden?: boolean
}

export type SectionConfig = {
  key: string
  label: string
  description: string
  itemLabel: string
  fields: ItemField[]
  defaultItem: Record<string, unknown>
  copyLabels?: {
    title?: string
    subtitle?: string
    body?: string
  }
  mediaLabels?: string[]
}

export const SECTION_KEYS = [
  "header",
  "hero",
  "process",
  "feature_showcase",
  "analytics",
  "testimonials",
  "pricing",
  "faq",
  "final_cta",
  "footer",
] as const

export const emptyLocalized = (): LocalizedText => ({ en: "", ar: "" })

const localized = () => emptyLocalized()

export const SECTION_CONFIGS: SectionConfig[] = [
  {
    key: "header",
    label: "Header",
    description: "Top navigation links and the primary header call to action.",
    itemLabel: "Menu Link",
    fields: [
      { name: "kind", label: "Kind", type: "text", placeholder: "nav or cta", hidden: true },
      { name: "label", label: "Label", type: "localized" },
      { name: "href", label: "URL / Anchor", type: "text", placeholder: "#features" },
    ],
    defaultItem: { kind: "nav", label: localized(), href: "#" },
    copyLabels: { title: "Brand name", subtitle: "Internal note", body: "Internal note" },
    mediaLabels: ["Header logo"],
  },
  {
    key: "hero",
    label: "Hero",
    description: "Main headline, intro copy, hero CTAs, badges, stats, and app-store assets. The right-side visual is the built-in interactive app demo (not a video).",
    itemLabel: "Hero Button / Stat",
    fields: [
      { name: "kind", label: "Kind", type: "text", placeholder: "cta, stat, badge, store_badge", hidden: true },
      { name: "label", label: "Label", type: "localized" },
      { name: "href", label: "URL / Anchor", type: "text", placeholder: "#" },
      { name: "value", label: "Value", type: "text", placeholder: "50K+" },
      { name: "suffix", label: "Suffix", type: "text", placeholder: "%" },
      { name: "decimals", label: "Decimals", type: "number" },
      { name: "imageUrl", label: "Image URL", type: "text", placeholder: "/Mobile app store badge.svg", hidden: true },
    ],
    defaultItem: { kind: "cta", label: localized(), href: "#", value: "", suffix: "", decimals: 0, imageUrl: "" },
    copyLabels: { title: "Main headline", subtitle: "Small badge text", body: "Intro paragraph" },
    mediaLabels: ["Google Play badge", "App Store badge"],
  },
  {
    key: "process",
    label: "Process",
    description: "The four-step process section and per-step preview metadata.",
    itemLabel: "Process Step",
    fields: [
      { name: "step", label: "Step Number", type: "number" },
      { name: "title", label: "Title", type: "localized" },
      { name: "description", label: "Description", type: "localizedTextarea" },
      { name: "preview", label: "Preview Type", type: "text", placeholder: "emotion_wheel", hidden: true },
    ],
    defaultItem: { step: 1, title: localized(), description: localized(), preview: "" },
    copyLabels: { title: "Section heading", subtitle: "Small badge text", body: "Intro paragraph" },
  },
  {
    key: "feature_showcase",
    label: "Feature Showcase",
    description: "Feature tabs/cards currently shown around the interactive preview.",
    itemLabel: "Feature",
    fields: [
      { name: "id", label: "Feature ID", type: "text", placeholder: "wheel", hidden: true },
      { name: "title", label: "Title", type: "localized" },
      { name: "description", label: "Description", type: "localizedTextarea" },
    ],
    defaultItem: { id: "", title: localized(), description: localized() },
    copyLabels: { title: "Section heading", subtitle: "Small badge text", body: "Intro paragraph" },
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Analytics section copy, CTA, and benefit bullets.",
    itemLabel: "Benefit",
    fields: [{ name: "text", label: "Benefit Text", type: "localizedTextarea" }],
    defaultItem: { text: localized() },
    copyLabels: { title: "Section heading", subtitle: "Small badge text", body: "Intro paragraph" },
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Carousel cards, names, roles, quotes, and avatar image references.",
    itemLabel: "Testimonial",
    fields: [
      { name: "quote", label: "Quote", type: "localizedTextarea" },
      { name: "name", label: "Name", type: "localized" },
      { name: "title", label: "Role / Location", type: "localized" },
      { name: "imageUrl", label: "Photo URL", type: "text", placeholder: "/hero-avatar-1.png" },
      { name: "imageAlt", label: "Image Alt", type: "localized" },
    ],
    defaultItem: { quote: localized(), name: localized(), title: localized(), imageUrl: "", imageAlt: localized() },
    copyLabels: { title: "Section heading", subtitle: "Small badge text", body: "Intro paragraph" },
  },
  {
    key: "pricing",
    label: "Pricing",
    description: "Single free plan card, unlimited access badge, and coming soon banner.",
    itemLabel: "Pricing Card Details",
    fields: [
      { name: "tagline", label: "Card Subheader (e.g. FOR NOW)", type: "localized" },
      { name: "headline", label: "Main Headline (Enjoy Unlimited Access!)", type: "localized" },
      { name: "subtext", label: "Main Subtext", type: "localizedTextarea" },
      { name: "freeBadge", label: "Free Badge Text (100% Free to Use)", type: "localized" },
      { name: "bannerTitle", label: "Coming Soon Banner Title", type: "localized" },
      { name: "bannerSubtext", label: "Coming Soon Banner Subtext", type: "localizedTextarea" },
      { name: "bannerButton", label: "Coming Soon Badge Text (Stay Tuned!)", type: "localized" },
    ],
    defaultItem: {
      tagline: localized(),
      headline: localized(),
      subtext: localized(),
      freeBadge: localized(),
      bannerTitle: localized(),
      bannerSubtext: localized(),
      bannerButton: localized(),
    },
    copyLabels: { title: "Section heading", subtitle: "Small badge text", body: "Intro paragraph" },
  },

  {
    key: "faq",
    label: "FAQ",
    description: "FAQ heading, support card, contact CTA, and question rows.",
    itemLabel: "FAQ Row",
    fields: [
      { name: "question", label: "Question", type: "localized" },
      { name: "answer", label: "Answer", type: "localizedTextarea" },
    ],
    defaultItem: { question: localized(), answer: localized() },
    copyLabels: { title: "Section heading", subtitle: "Small badge text", body: "Intro paragraph" },
  },
  {
    key: "final_cta",
    label: "Final CTA",
    description: "Final download section headline, intro copy, and value propositions.",
    itemLabel: "Value Proposition",
    fields: [
      { name: "title", label: "Title", type: "localized" },
      { name: "description", label: "Description", type: "localizedTextarea" },
    ],
    defaultItem: { title: localized(), description: localized() },
    copyLabels: { title: "Section heading", subtitle: "Small badge text", body: "Intro paragraph" },
  },
  {
    key: "footer",
    label: "Footer",
    description: "Footer copyright, links, and logo image.",
    itemLabel: "Footer Link",
    fields: [
      { name: "label", label: "Label", type: "localized" },
      { name: "href", label: "URL / Anchor", type: "text", placeholder: "#features" },
    ],
    defaultItem: { label: localized(), href: "#" },
    copyLabels: { title: "Copyright text", subtitle: "Internal note", body: "Internal note" },
    mediaLabels: ["Footer logo"],
  },
]

export const SECTION_CONFIG_BY_KEY = Object.fromEntries(SECTION_CONFIGS.map((config) => [config.key, config])) as Record<string, SectionConfig>

export function createDefaultItem(sectionKey: string) {
  const config = SECTION_CONFIG_BY_KEY[sectionKey]

  return structuredClone(config?.defaultItem ?? {})
}
