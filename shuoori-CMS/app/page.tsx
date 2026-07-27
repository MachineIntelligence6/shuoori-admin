import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-lg border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Shuoori CMS</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Landing page content API</h1>
        <p className="mt-4 text-base leading-7 text-muted">
          The public content endpoints are available under <code>/api/content</code>. Admin tools live under{" "}
          <Link href="/admin" className="font-semibold text-brand">
            /admin
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
