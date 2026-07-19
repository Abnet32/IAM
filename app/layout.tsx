import type { Metadata } from "next"
import { Lexend_Deca } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const font = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Internship Management",
  description: "Internship Applicant Management Dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
