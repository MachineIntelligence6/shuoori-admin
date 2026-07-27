export type LocalizedText = {
  en: string
  ar: string
}

export type SectionImage = {
  url: string
  alt: LocalizedText
  key: string
}

export type SectionDocumentShape = {
  key: string
  title: LocalizedText
  subtitle: LocalizedText
  body: LocalizedText
  images: SectionImage[]
  items: unknown[]
  order: number
  isPublished: boolean
  createdAt?: Date
  updatedAt?: Date
}
