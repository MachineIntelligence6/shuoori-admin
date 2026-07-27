import { requireSignedInAdmin } from "@/lib/admin-auth"
import { connectToDatabase } from "@/lib/db"
import { errorResponse, isObjectId, jsonResponse } from "@/lib/http"
import Section from "@/models/Section"

export const dynamic = "force-dynamic"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSignedInAdmin()

    if (!isObjectId(params.id)) {
      return errorResponse("Invalid section id", 400)
    }

    await connectToDatabase()
    const payload = await request.json()
    const section = await Section.findByIdAndUpdate(
      params.id,
      {
        key: payload.key,
        title: payload.title,
        subtitle: payload.subtitle,
        body: payload.body,
        images: payload.images,
        items: payload.items,
        order: payload.order,
        isPublished: payload.isPublished,
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!section) {
      return errorResponse("Section not found", 404)
    }

    return jsonResponse({ section })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update section"
    return errorResponse(message, message === "Unauthorized" ? 401 : 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSignedInAdmin()

    if (!isObjectId(params.id)) {
      return errorResponse("Invalid section id", 400)
    }

    await connectToDatabase()
    const section = await Section.findByIdAndDelete(params.id)

    if (!section) {
      return errorResponse("Section not found", 404)
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete section"
    return errorResponse(message, message === "Unauthorized" ? 401 : 500)
  }
}
