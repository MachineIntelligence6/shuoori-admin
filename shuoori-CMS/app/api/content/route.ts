import { connectToDatabase } from "@/lib/db"
import { corsOptionsResponse, getCorsHeaders } from "@/lib/cors"
import { errorResponse, jsonResponse } from "@/lib/http"
import Section from "@/models/Section"

export const dynamic = "force-dynamic"

export async function OPTIONS(request: Request) {
  return corsOptionsResponse(request)
}

export async function GET(request: Request) {
  try {
    await connectToDatabase()
    const sections = await Section.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean()

    return jsonResponse(
      { sections },
      {
        headers: {
          ...getCorsHeaders(request),
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to load content")
  }
}
