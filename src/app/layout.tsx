import { Inter, PT_Sans_Caption } from "next/font/google"
import "./globals.css"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
})

export const ptSansCaption = PT_Sans_Caption({
  subsets: ["latin"],
  variable: "--font-pt-sans-caption",
  weight: ["700"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${ptSansCaption.variable}`}>
      <body>{children}</body>
    </html>
  )
}
