import type React from "react"
import type { Metadata, Viewport } from "next"
import { Black_Ops_One, Quantico, Roboto_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import LocationAreas from "@/components/location-areas"
import { ThemeProvider } from "@/components/theme-provider"
import PageTransition from "@/components/page-transition"
import { OrganizationSchema, LocalBusinessSchema } from "@/components/structured-data"
import { siteConfig, generateViewport } from "@/lib/seo-config"
import { criticalAssets } from "@/lib/performance"

// Military-style heading font with display swap for better performance
const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

// Military-style body font with display swap
const quantico = Quantico({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

// Monospace font for technical specs with display swap
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const viewport: Viewport = generateViewport()

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@penmenstudios",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
  icons: {
    // Explicitly define icons for better search index recognition
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any", rel: "icon" }, // Assuming a favicon.ico might also exist or be generated
    ],
    apple: "/apple-touch-icon.png", // Assuming an apple-touch-icon.png might exist
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Preload critical assets */}
        {criticalAssets.map((asset, index) => (
          <link key={index} rel={asset.rel} href={asset.href} as={asset.as} type={asset.type} />
        ))}

        <OrganizationSchema />
        <LocalBusinessSchema />
      </head>
      <body className={`${blackOpsOne.variable} ${quantico.variable} ${robotoMono.variable} font-body`}>
        <ThemeProvider defaultTheme="dark" attribute="class">
          <div className="flex min-h-screen flex-col bg-black">
            <Header />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <LocationAreas />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
