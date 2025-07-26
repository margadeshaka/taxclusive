"use client";

import Script from "next/script";

import { HeroSection, ServicesSection } from "@/components/features/home";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { dynamicImport } from "@/lib/dynamic-import";
import { generateStructuredData } from "@/lib/metadata";

// Lazy load components that are below the fold with enhanced error handling
const ExpertiseSection = dynamicImport(
  () => import("@/components/features/home/expertise-section")
);
const InsightsSection = dynamicImport(() => import("@/components/features/home/insights-section"));
const ContactSection = dynamicImport(() => import("@/components/features/home/contact-section"));
const NewsletterSubscription = dynamicImport(() => import("@/components/newsletter-subscription"), {
  loading: () => <div className="w-full py-12 animate-pulse"></div>,
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <ExpertiseSection />
        <InsightsSection />
        <ContactSection />
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <NewsletterSubscription />
          </div>
        </section>
      </main>
      <Footer />

      {/* Home page specific structured data */}
      <Script id="home-schema-org" type="application/ld+json">
        {generateStructuredData("Organization", {
          name: "Taxclusive",
          url: "https://www.taxclusive.com",
          logo: "https://www.taxclusive.com/logo.png",
          description:
            "Professional chartered accountancy firm providing comprehensive accounting, taxation, and financial advisory services with cultural expertise.",
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+1-555-123-4567",
              contactType: "customer service",
              areaServed: "US",
              availableLanguage: ["English", "Hindi"],
            },
          ],
        })}
      </Script>
    </div>
  );
}
