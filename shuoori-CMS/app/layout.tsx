import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Shuoori CMS",
  description: "Content management dashboard for the Shuoori landing page.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
