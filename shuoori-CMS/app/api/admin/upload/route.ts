import { requireSignedInAdmin } from "@/lib/admin-auth"
import { buildSectionObjectKey, deleteFromR2, uploadToR2 } from "@/lib/r2"
import { errorResponse, jsonResponse } from "@/lib/http"

export const dynamic = "force-dynamic"

const MAX_UPLOAD_SIZE = 100 * 1024 * 1024

export async function POST(request: Request) {
  try {
    await requireSignedInAdmin()

    const formData = await request.formData()
    const file = formData.get("file")
    const sectionKey = formData.get("sectionKey")

    if (!(file instanceof File)) {
      return errorResponse("A multipart file field named file is required", 400)
    }

    if (typeof sectionKey !== "string" || sectionKey.trim() === "") {
      return errorResponse("A sectionKey field is required", 400)
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return errorResponse("File must be 100MB or smaller", 400)
    }

    const key = buildSectionObjectKey(sectionKey, file.name)
    const body = Buffer.from(await file.arrayBuffer())
    const result = await uploadToR2({
      key,
      body,
      contentType: file.type,
    })

    return jsonResponse(result, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload file"
    return errorResponse(message, message === "Unauthorized" ? 401 : 500)
  }
}

export async function DELETE(request: Request) {
  try {
    await requireSignedInAdmin()

    const payload = await request.json()

    if (!payload?.key || typeof payload.key !== "string") {
      return errorResponse("Object key is required", 400)
    }

    await deleteFromR2(payload.key)

    return jsonResponse({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete file"
    return errorResponse(message, message === "Unauthorized" ? 401 : 500)
  }
}
