import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose"

const LocalizedTextSchema = new Schema(
  {
    en: { type: String, default: "" },
    ar: { type: String, default: "" },
  },
  { _id: false }
)

const SectionImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: LocalizedTextSchema, default: () => ({}) },
    key: { type: String, required: true },
  },
  { _id: false }
)

const SectionSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: { type: LocalizedTextSchema, default: () => ({}) },
    subtitle: { type: LocalizedTextSchema, default: () => ({}) },
    body: { type: LocalizedTextSchema, default: () => ({}) },
    images: { type: [SectionImageSchema], default: [] },
    items: { type: [Schema.Types.Mixed], default: [] },
    order: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
)

export type Section = InferSchemaType<typeof SectionSchema>

const SectionModel =
  (mongoose.models.Section as Model<Section> | undefined) ?? mongoose.model<Section>("Section", SectionSchema)

export default SectionModel
