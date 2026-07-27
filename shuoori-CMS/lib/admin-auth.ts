import { createHash, createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

const SESSION_COOKIE = "shuoori_cms_session"
const SESSION_TTL_SECONDS = 60 * 60 * 12

type AdminSession = {
  sub: "admin"
  exp: number
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? ""
}

function getSessionSecret() {
  return process.env.CMS_AUTH_SECRET?.trim() || getAdminPassword()
}

function sign(value: string) {
  const secret = getSessionSecret()
  if (!secret) throw new Error("CMS authentication is not configured")
  return createHmac("sha256", secret).update(value).digest("base64url")
}

function secureCompare(value: string, expected: string) {
  const valueHash = createHash("sha256").update(value).digest()
  const expectedHash = createHash("sha256").update(expected).digest()
  return timingSafeEqual(valueHash, expectedHash)
}

function createSessionToken() {
  const payload: AdminSession = {
    sub: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `${encodedPayload}.${sign(encodedPayload)}`
}

function verifySessionToken(token?: string) {
  if (!token) return false

  const [encodedPayload, signature] = token.split(".")
  if (!encodedPayload || !signature) return false

  const expectedSignature = sign(encodedPayload)
  const actualSignatureBuffer = Buffer.from(signature)
  const expectedSignatureBuffer = Buffer.from(expectedSignature)

  if (actualSignatureBuffer.length !== expectedSignatureBuffer.length) return false
  if (!timingSafeEqual(actualSignatureBuffer, expectedSignatureBuffer)) return false

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<AdminSession>
    return payload.sub === "admin" && typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPassword())
}

export function validateAdminPassword(password: string) {
  const expected = getAdminPassword()
  return Boolean(expected) && secureCompare(password, expected)
}

export function isAdminAuthenticated() {
  try {
    return verifySessionToken(cookies().get(SESSION_COOKIE)?.value)
  } catch {
    return false
  }
}

export function createAdminSession() {
  cookies().set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export function clearAdminSession() {
  cookies().delete(SESSION_COOKIE)
}

export async function requireSignedInAdmin() {
  if (!isAdminAuthenticated()) {
    throw new Error("Unauthorized")
  }

  return { userId: "cms-admin" }
}
