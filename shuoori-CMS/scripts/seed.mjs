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

async function main() {
  loadEnv()

  const uri = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Missing MONGODB_URI or MONGODB_URI_DIRECT")
  }

  const sections = JSON.parse(readFileSync(resolve(process.cwd(), "data", "initial-sections.json"), "utf8"))
  const Section = mongoose.models.Section ?? mongoose.model("Section", SectionSchema)

  await mongoose.connect(uri, { bufferCommands: false })
  await Section.collection.createIndex({ key: 1 }, { unique: true })

  let upserted = 0

  for (const section of sections) {
    const result = await Section.updateOne({ key: section.key }, { $set: section }, { upsert: true })
    upserted += result.upsertedCount || 0
  }

  console.log(`Seeded ${sections.length} sections (${upserted} new).`)
  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error)
  await mongoose.disconnect().catch(() => undefined)
  process.exit(1)
})
