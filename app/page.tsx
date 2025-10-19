"use client";

import Script from "next/script";

import { 
  HeroSection, 
  ServicesSection, 
  WhyChooseUsSection, 
  TestimonialsSection 
} from "@/components/features/home";
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
        <WhyChooseUsSection />
        <TestimonialsSection />
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
          url: "https://www.taxexclusive.com",
          logo: "https://www.taxexclusive.com/logo.png",
          description:
            "Professional tax and financial services firm providing comprehensive accounting, taxation, and financial advisory services across Delhi NCR.",
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+91-9999-123456",
              contactType: "customer service",
              areaServed: "IN",
              availableLanguage: ["English", "Hindi"],
            },
          ],
        })}
      </Script>
    </div>
  );
}
