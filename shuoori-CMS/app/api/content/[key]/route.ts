import { connectToDatabase } from "@/lib/db"
import { corsOptionsResponse, getCorsHeaders } from "@/lib/cors"
import { errorResponse, jsonResponse } from "@/lib/http"
import Section from "@/models/Section"

export const dynamic = "force-dynamic"

export async function OPTIONS(request: Request) {
  return corsOptionsResponse(request)
}

export async function GET(request: Request, { params }: { params: { key: string } }) {
  try {
    await connectToDatabase()
    const section = await Section.findOne({ key: params.key, isPublished: true }).lean()

    if (!section) {
      return jsonResponse(
        { error: "Section not found" },
        {
          status: 404,
          headers: {
            ...getCorsHeaders(request),
            "Cache-Control": "no-store",
          },
        }
      )
    }

    return jsonResponse(
      { section },
      {
        headers: {
          ...getCorsHeaders(request),
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to load section")
  }
}
