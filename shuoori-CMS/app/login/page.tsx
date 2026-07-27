import { redirect } from "next/navigation"
import {
  createAdminSession,
  isAdminAuthConfigured,
  isAdminAuthenticated,
  validateAdminPassword,
} from "@/lib/admin-auth"

type LoginPageProps = {
  searchParams?: {
    error?: string
  }
}

async function signIn(formData: FormData) {
  "use server"

  const password = String(formData.get("password") ?? "")

  if (!isAdminAuthConfigured()) {
    redirect("/login?error=config")
  }

  if (!validateAdminPassword(password)) {
    redirect("/login?error=invalid")
  }

  createAdminSession()
  redirect("/admin")
}

function getErrorMessage(error?: string) {
  if (error === "config") {
    return "CMS authentication is not configured. Set ADMIN_PASSWORD on the server."
  }

  if (error === "invalid") {
    return "Incorrect password."
  }

  return ""
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  if (isAdminAuthenticated()) {
    redirect("/admin")
  }

  const errorMessage = getErrorMessage(searchParams?.error)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F5] px-6 text-[#101827]">
      <div className="w-full max-w-[420px] rounded-2xl border border-[#E4E6EA]/80 bg-white p-8 shadow-[0_18px_48px_rgba(16,24,39,0.08)]">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1B7C72]">Shuoori CMS</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight">Admin Login</h1>
          <p className="mt-2 text-sm leading-6 text-[#6A727F]">Enter the CMS password to manage landing page content.</p>
        </div>

        <form action={signIn} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[#283244]">
            Password
            <input
              autoComplete="current-password"
              autoFocus
              className="h-12 rounded-xl border border-[#D8DDE5] bg-white px-4 text-base outline-none transition focus:border-[#2EB8AA] focus:ring-4 focus:ring-[#2EB8AA]/10"
              name="password"
              required
              type="password"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="h-12 rounded-xl bg-[#101827] px-5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-black"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}
