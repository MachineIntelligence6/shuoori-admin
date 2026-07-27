import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import mongoose from "mongoose"

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env")

  if (!existsSync(envPath)) return

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) continue

    const separatorIndex = trimmed.indexOf("=")

    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()

    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, "")
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

function replaceBrand(value) {
  if (typeof value === "string") {
    return value.replaceAll("EmotionFlow", "Shuoori")
  }

  if (Array.isArray(value)) {
    return value.map(replaceBrand)
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, replaceBrand(nestedValue)]))
  }

  return value
}

function normalizeHeader(section) {
  if (section.key !== "header") return section

  return {
    ...section,
    title: { en: "Shuoori", ar: "شعوري" },
  }
}

async function main() {
  loadEnv()

  const seedPath = resolve(process.cwd(), "data", "initial-sections.json")
  const seedSections = JSON.parse(readFileSync(seedPath, "utf8"))
  const repairedSeedSections = replaceBrand(seedSections).map(normalizeHeader)

  writeFileSync(seedPath, `${JSON.stringify(repairedSeedSections, null, 2)}\n`, "utf8")

  const uri = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Missing MONGODB_URI or MONGODB_URI_DIRECT")
  }

  const Section = mongoose.models.Section ?? mongoose.model("Section", SectionSchema)

  await mongoose.connect(uri, { bufferCommands: false })

  const sections = await Section.find({}).lean()
  let repairedSections = 0

  for (const section of sections) {
    const repaired = normalizeHeader(replaceBrand(section))
    delete repaired._id
    delete repaired.__v
    delete repaired.createdAt
    delete repaired.updatedAt

    const before = JSON.stringify(section)
    const after = JSON.stringify({ ...section, ...repaired })

    if (before !== after) {
      await Section.updateOne({ _id: section._id }, { $set: repaired })
      repairedSections += 1
    }
  }

  console.log(`Repaired Shuoori brand text in seed and ${repairedSections} Mongo section(s).`)
  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error)
  await mongoose.disconnect().catch(() => undefined)
  process.exit(1)
})
