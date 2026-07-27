import { requireSignedInAdmin } from "@/lib/admin-auth"
import { connectToDatabase } from "@/lib/db"
import { errorResponse, jsonResponse } from "@/lib/http"
import Section from "@/models/Section"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await requireSignedInAdmin()
    await connectToDatabase()
    const sections = await Section.find({}).sort({ order: 1, createdAt: 1 }).lean()

    return jsonResponse({ sections })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list sections"
    return errorResponse(message, message === "Unauthorized" ? 401 : 500)
  }
}

export async function POST(request: Request) {
  try {
    await requireSignedInAdmin()
    await connectToDatabase()

    const payload = await request.json()

    if (!payload?.key || typeof payload.key !== "string") {
      return errorResponse("Section key is required", 400)
    }

    const section = await Section.create({
      key: payload.key,
      title: payload.title,
      subtitle: payload.subtitle,
      body: payload.body,
      images: payload.images,
      items: payload.items,
      order: payload.order,
      isPublished: payload.isPublished,
    })

    return jsonResponse({ section }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create section"
    return errorResponse(message, message === "Unauthorized" ? 401 : 500)
  }
}
