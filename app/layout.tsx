import type React from "react"
import "./globals.css"
import { Playfair_Display, Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import ContactButtons from "@/components/contact-buttons"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata = {
  title: "Taxclusive - Professional Chartered Accountancy Services",
  description:
    "Professional chartered accountancy firm providing comprehensive accounting, taxation, and financial advisory services with cultural expertise.",
  keywords:
    "chartered accountant, accounting services, tax planning, financial advisory, audit services, business consulting",
  authors: [{ name: "Taxclusive" }],
  creator: "Taxclusive",
  publisher: "Taxclusive",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.sudarshanassociates.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "hi-IN": "/hi-IN",
    },
  },
  openGraph: {
    title: "Taxclusive - Professional Chartered Accountancy Services",
    description:
      "Professional chartered accountancy firm providing comprehensive accounting, taxation, and financial advisory services with cultural expertise.",
    url: "https://www.sudarshanassociates.com",
    siteName: "Taxclusive",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Taxclusive - Professional Chartered Accountancy Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxclusive - Professional Chartered Accountancy Services",
    description:
      "Professional chartered accountancy firm providing comprehensive accounting, taxation, and financial advisory services with cultural expertise.",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${playfair.variable} ${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <ContactButtons />
        </ThemeProvider>
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "AccountingService",
              "name": "Taxclusive",
              "url": "https://www.taxclusive123.com",
              "logo": "https://www.taxclusive123.com/logo.png",
              "description": "Professional chartered accountancy firm providing comprehensive accounting, taxation, and financial advisory services with cultural expertise.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Financial District, Suite 500",
                "addressLocality": "New York",
                "addressRegion": "NY",
                "postalCode": "10001",
                "addressCountry": "US"
              },
              "telephone": "+1-555-123-4567",
              "email": "info@taxclusive.com",
              "openingHours": "Mo,Tu,We,Th,Fr 09:00-17:00",
              "sameAs": [
                "https://www.facebook.com/taxclusive123",
                "https://www.linkedin.com/company/taxclusive123",
                "https://twitter.com/taxclusive123"
              ],
              "priceRange": "$$",
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 40.7128,
                  "longitude": -74.0060
                },
                "geoRadius": "50000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Accounting Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Tax Planning and Preparation"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Audit and Assurance"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Financial Advisory"
                    }
                  }
                ]
              }
            }
          `}
        </Script>
      </body>
    </html>
  )
}



import './globals.css'