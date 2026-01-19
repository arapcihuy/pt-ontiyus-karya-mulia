import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PT. Ontiyus Karya Mulia - Produsen Alat Kesehatan Terpercaya",
  description:
    "PT. Ontiyus Karya Mulia adalah produsen dan distributor alat kesehatan terpercaya di Indonesia untuk rumah sakit, klinik, dan laboratorium.",
  generator: "v0.app",
  icons: {
    icon: "/ontiyus-logo-full.png",
    apple: "/ontiyus-logo-full.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
