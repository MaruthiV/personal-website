import type React from "react"
import "./globals.css"
import "./site.css"
import type { Metadata } from "next"
import { Newsreader } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Newsreader serif — used only for italic emphasis words (the <Em> helper).
// Body/headings use the system sans stack.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Maruthi Vemula",
  description: "Personal website of Maruthi Vemula",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${newsreader.variable} min-h-screen bg-white font-sans antialiased dark:bg-neutral-950`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
