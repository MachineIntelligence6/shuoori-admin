import { clearAdminSession } from "@/lib/admin-auth"
import { jsonResponse } from "@/lib/http"

export const dynamic = "force-dynamic"

export async function POST() {
  clearAdminSession()
  return jsonResponse({ ok: true })
}
