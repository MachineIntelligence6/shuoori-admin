import { NextResponse } from "next/server"

const DEFAULT_METHODS = "GET,OPTIONS"
const DEFAULT_HEADERS = "Content-Type, Authorization"

function getAllowedOrigins() {
  return (process.env.ALLOWED_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export function getCorsHeaders(request: Request, methods = DEFAULT_METHODS) {
  const requestOrigin = request.headers.get("origin")
  const allowedOrigins = getAllowedOrigins()
  const allowOrigin =
    allowedOrigins.length === 0
      ? "*"
      : requestOrigin && allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0]

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": DEFAULT_HEADERS,
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  }
}

export function corsOptionsResponse(request: Request, methods = DEFAULT_METHODS) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request, methods),
  })
}
