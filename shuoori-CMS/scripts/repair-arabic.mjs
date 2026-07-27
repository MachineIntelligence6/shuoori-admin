import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import mongoose from "mongoose"

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env")

  if (!existsSync(envPath)) return

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) continue

    const separatorIndex = trimmed.indexOf("=")

    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()
    const value = rawValue.replace(/^['"]|['"]$/g, "")

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

const LocalizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, default: "" },
    ar: { type: String, default: "" },
  },
  { _id: false }
)

const SectionImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: LocalizedTextSchema, default: () => ({}) },
    key: { type: String, required: true },
  },
  { _id: false }
)

const SectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    title: { type: LocalizedTextSchema, default: () => ({}) },
    subtitle: { type: LocalizedTextSchema, default: () => ({}) },
    body: { type: LocalizedTextSchema, default: () => ({}) },
    images: { type: [SectionImageSchema], default: [] },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    order: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
)

const corruptPattern = /[ØÙÂ�ï]/

function isLocalized(value) {
  return value && typeof value === "object" && ("en" in value || "ar" in value)
}

function repairLocalized(current, seed) {
  if (!isLocalized(current) || !isLocalized(seed)) return { value: current, changed: false }
  if (typeof current.ar !== "string" || !corruptPattern.test(current.ar)) return { value: current, changed: false }

  return {
    value: {
      ...current,
      ar: seed.ar ?? "",
    },
    changed: true,
  }
}

function repairArray(currentArray, seedArray) {
  let changed = false
  const value = currentArray.map((currentItem, index) => {
    const seedItem = seedArray[index]

    if (!currentItem || typeof currentItem !== "object" || !seedItem || typeof seedItem !== "object") {
      return currentItem
    }

    const nextItem = Array.isArray(currentItem) ? [...currentItem] : { ...currentItem }

    for (const [field, fieldValue] of Object.entries(currentItem)) {
      const repaired = repairLocalized(fieldValue, seedItem[field])

      if (repaired.changed) {
        nextItem[field] = repaired.value
        changed = true
      }
    }

    return nextItem
  })

  return { value, changed }
}

async function main() {
  loadEnv()

  const uri = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Missing MONGODB_URI or MONGODB_URI_DIRECT")
  }

  const seedSections = JSON.parse(readFileSync(resolve(process.cwd(), "data", "initial-sections.json"), "utf8"))
  const seedByKey = new Map(seedSections.map((section) => [section.key, section]))
  const Section = mongoose.models.Section ?? mongoose.model("Section", SectionSchema)

  await mongoose.connect(uri, { bufferCommands: false })

  const sections = await Section.find({}).lean()
  let repairedSections = 0
  let repairedFields = 0

  for (const section of sections) {
    const seed = seedByKey.get(section.key)

    if (!seed) continue

    const patch = {}

    for (const field of ["title", "subtitle", "body"]) {
      const repaired = repairLocalized(section[field], seed[field])

      if (repaired.changed) {
        patch[field] = repaired.value
        repairedFields += 1
      }
    }

    const repairedItems = repairArray(section.items ?? [], seed.items ?? [])

    if (repairedItems.changed) {
      patch.items = repairedItems.value
      repairedFields += 1
    }

    const repairedImages = repairArray(section.images ?? [], seed.images ?? [])

    if (repairedImages.changed) {
      patch.images = repairedImages.value
      repairedFields += 1
    }

    if (Object.keys(patch).length > 0) {
      await Section.updateOne({ _id: section._id }, { $set: patch })
      repairedSections += 1
    }
  }

  console.log(`Repaired ${repairedFields} Arabic field group(s) across ${repairedSections} section(s).`)
  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error)
  await mongoose.disconnect().catch(() => undefined)
  process.exit(1)
})
