import { NextResponse } from "next/server"

export function jsonResponse<T>(payload: T, init?: ResponseInit) {
  return NextResponse.json(payload, init)
}

export function errorResponse(message: string, status = 500, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status })
}

export function isObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id)
}
