// app/layout.tsx

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AlertProvider } from "@/contexts/AlertContext"
import localFont from "next/font/local"
import { Jost } from "next/font/google"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tarafé",
  description:
    "Tarafé est une plateforme digitale de personnalisation des produits mode, accessoires et déco, avec une touche africaine...",
  openGraph: {
    title: "Tarafé",
    description:
      "Tarafé est une plateforme digitale de personnalisation des produits mode...",
    url: "tarafe.com",
  },
}

const poppins = localFont({
  src: "./fonts/Poppins.woff2",
  variable: "--font-poppins",
  weight: "400",
  preload: false,
})

const raleway = localFont({
  src: "./fonts/Raleway.woff2",
  variable: "--font-raleway",
  weight: "100 900",
})

const opensans = localFont({
  src: "./fonts/Open Sans.woff2",
  variable: "--font-open-sans",
  weight: "100 800",
})

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
})


// const jost = Jost({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-jost"
// });

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>


      {/* ${poppins.variable} ${raleway.variable} ${opensans.variable} */}

      {/* <body className={`${jost.variable} antialiased`} > */}

      <body className={`${jost.className} antialiased`} >
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              <AlertProvider>{children}</AlertProvider>
            </main>
          </div>
        </ThemeProvider>

        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "var(--font-jost)", // 👈 Jost ici aussi
            },
            className: "sonner-toast",
          }}
        />
      </body>
    </html>
  )
}
