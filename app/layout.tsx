export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Cinzel, EB_Garamond } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { BottomNav } from "@/components/layout/bottom-nav"

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
})

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Feux de la Rose Noire",
  description:
    "Atelier artisanal de forge et poterie — stages, marchés et expositions.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${cinzel.variable} ${ebGaramond.variable} antialiased`}
      >
        {children}
        <BottomNav />
        <Toaster />
      </body>
    </html>
  )
}
