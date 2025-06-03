import "./globals.css";
import { Playfair_Display, Poppins } from "next/font/google";
import Script from "next/script";
import type React from "react";

import ContactButtons from "@/components/contact-buttons";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { generateMetadata as generateSiteMetadata, generateStructuredData } from "@/lib/metadata";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

// Generate site-wide metadata
export const metadata = generateSiteMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${playfair.variable} ${poppins.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ContactButtons />
          <Toaster />
        </ThemeProvider>
        <Script id="schema-org" type="application/ld+json">
          {generateStructuredData("AccountingService", {
            name: "Taxclusive",
            url: "https://www.taxclusive.com",
            logo: "https://www.taxclusive.com/logo.png",
            description:
              "Professional chartered accountancy firm providing comprehensive accounting, taxation, and financial advisory services with cultural expertise.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Financial District, Suite 500",
              addressLocality: "New York",
              addressRegion: "NY",
              postalCode: "10001",
              addressCountry: "US",
            },
            telephone: "+1-555-123-4567",
            email: "info@taxclusive.com",
            openingHours: "Mo,Tu,We,Th,Fr 09:00-17:00",
            sameAs: [
              "https://www.facebook.com/taxclusive",
              "https://www.linkedin.com/company/taxclusive",
              "https://twitter.com/taxclusive",
            ],
            priceRange: "$$",
            serviceArea: {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: 40.7128,
                longitude: -74.006,
              },
              geoRadius: "50000",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Accounting Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Tax Planning and Preparation",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Audit and Assurance",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Financial Advisory",
                  },
                },
              ],
            },
          })}
        </Script>
      </body>
    </html>
  );
}
