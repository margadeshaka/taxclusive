"use client";

import Script from "next/script";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { generateStructuredData } from "@/lib/metadata";
import {
  AboutHeroSection,
  StorySection,
  ValuesSection,
  ApproachSection,
  CTASection,
} from "@/components/features/about";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AboutHeroSection />
        <StorySection />
        <ValuesSection />
        <ApproachSection />
        <CTASection />
      </main>
      <Footer />

      {/* About page specific structured data */}
      <Script id="about-schema-org" type="application/ld+json">
        {generateStructuredData("Organization", {
          name: "Taxclusive",
          url: "https://www.taxclusive.com",
          logo: "https://www.taxclusive.com/logo.png",
          description:
            "A trusted Chartered Accountancy firm committed to delivering excellence in financial, taxation, and compliance services.",
          foundingDate: "2010-01-01",
          founders: [
            {
              "@type": "Person",
              name: "John Doe",
              jobTitle: "Founder & Managing Partner",
            },
          ],
          address: {
            "@type": "PostalAddress",
            streetAddress: "123 Financial District, Suite 500",
            addressLocality: "New York",
            addressRegion: "NY",
            postalCode: "10001",
            addressCountry: "US",
          },
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+1-555-123-4567",
              contactType: "customer service",
              email: "info@taxclusive.com",
              availableLanguage: ["English", "Hindi"],
            },
          ],
        })}
      </Script>
    </div>
  );
}
