// app/layout.tsx

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AlertProvider } from "@/contexts/AlertContext"
import localFont from "next/font/local"
import { Jost } from "next/font/google"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Roboto as RobotoFont } from "next/font/google"
import Providers from "@/components/Providers"

// metadata moved to the more detailed declaration below

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


const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"], // <-- pas de "900"
  variable: "--font-plus-jakarta-sans",
  display: "swap",
})

const roboto = RobotoFont({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
})


export const metadata: Metadata = {
  title: "Tarafé",
  description: "Tarafé est une plateforme digitale de personnalisation des produits mode, accessoires et déco, avec une touche africaine, pour les entreprises et les particuliers. Notre mission est de valoriser les savoir-faire et le patrimoine textile local. Bienvenue !",
  openGraph: {
		title: "Tarafé",
		description: "Tarafé est une plateforme digitale de personnalisation des produits mode, accessoires et déco, avec une touche africaine, pour les entreprises et les particuliers. Notre mission est de valoriser les savoir-faire et le patrimoine textile local. Bienvenue !",
		url: "tarafe.com",
	},
    icons:{
    icon: "/ads/logos2.png",
    },
};


interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>


      {/* ${poppins.variable} ${raleway.variable} ${opensans.variable} */}

      {/* <body className={`${jost.variable} antialiased`} > */}

      <body
  className={`
    ${roboto.className}
    antialiased
  `}
>

        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              {/* <CartProvider> */}
              <Providers>
                <AlertProvider>  {children}  </AlertProvider>
              </Providers>
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
