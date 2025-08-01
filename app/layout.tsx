import "./globals.css";
import { Playfair_Display, Poppins } from "next/font/google";
import Script from "next/script";
import type React from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ContactButtons from "@/components/contact-buttons";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/shared";
import { clientConfig } from "@/lib/config/client-config";
import {
  generateLocalBusinessStructuredData,
  generateLocalFAQStructuredData,
} from "@/lib/local-seo";
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata";

// Load fonts with explicit weights (Next.js requirement)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

// Generate site-wide metadata
export const metadata = generateSiteMetadata();

// Generate viewport for theme colors
export const viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={clientConfig.site.language} dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href={clientConfig.assets.logo.favicon} sizes="any" />
        <link rel="apple-touch-icon" href={clientConfig.assets.logo.appleTouchIcon} />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${playfair.variable} ${poppins.variable} font-sans`}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <ContactButtons />
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
        {/* Enhanced Local Business Structured Data */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateLocalBusinessStructuredData(),
          }}
        />

        {/* Website structured data with local search */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Taxclusive - Expert Chartered Accountants Delhi NCR",
              alternateName: ["Taxclusive CA Services", "Best CA in Gurugram"],
              url: "https://www.taxclusive.com",
              description:
                "Leading Chartered Accountancy firm providing expert CA services across Delhi NCR - Gurugram, Delhi, Noida, Ghaziabad, Faridabad",
              inLanguage: "en-IN",
              potentialAction: [
                {
                  "@type": "SearchAction",
                  target: "https://www.taxclusive.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
                {
                  "@type": "ContactAction",
                  target: "https://www.taxclusive.com/contact",
                },
              ],
              sameAs: [
                "https://www.linkedin.com/company/taxclusive",
                "https://www.facebook.com/taxclusive",
                "https://twitter.com/taxclusive",
              ],
            }),
          }}
        />

        {/* Local FAQ Structured Data */}
        <Script
          id="local-faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateLocalFAQStructuredData(),
          }}
        />
      </body>
    </html>
  );
}
