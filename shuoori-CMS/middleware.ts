import { NextResponse } from "next/server"

// TODO: Re-enable Clerk protection before launch.
// Temporarily bypassed so Mongo/R2 integration can be tested without Clerk keys.
export default function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api)(.*)",
  ],
}
