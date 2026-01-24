"use client";

import Script from "next/script";

import {
  ServicesHeroSection,
  IntroSection,
  CoreServicesSection,
  IndustrySolutionsSection,
  TestimonialsSection,
  ServicesCTASection,
} from "@/components/features/services";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { generateStructuredData } from "@/lib/metadata";

// Metadata for this page is handled by layout since it's a client component

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ServicesHeroSection />
        <IntroSection />
        <CoreServicesSection />
        <IndustrySolutionsSection />
        <TestimonialsSection />
        <ServicesCTASection />
      </main>
      <Footer />

      {/* Services page specific structured data */}
      <Script id="services-schema-org" type="application/ld+json">
        {generateStructuredData("Service", {
          name: "Taxclusive Financial Services",
          serviceType: "Accounting and Tax Services",
          provider: {
            "@type": "Organization",
            name: "Taxclusive",
            url: "https://www.taxclusive.com",
          },
          description:
            "Comprehensive accounting, taxation, and financial advisory services tailored to meet your unique needs.",
          areaServed: [
            { "@type": "City", name: "Gurugram" },
            { "@type": "City", name: "Delhi" },
            { "@type": "City", name: "Noida" },
            { "@type": "City", name: "Ghaziabad" },
            { "@type": "City", name: "Faridabad" },
            { "@type": "City", name: "Greater Noida" },
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Financial Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Tax Planning & Preparation",
                  description:
                    "Maximize your savings and stay compliant with our proactive tax planning and preparation services.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Audit & Assurance",
                  description:
                    "Independent audit and assurance services to enhance the credibility of your financial information.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Financial Advisory",
                  description:
                    "Strategic financial planning and advisory services to help you make informed business decisions.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Bookkeeping & Accounting",
                  description:
                    "Comprehensive bookkeeping and accounting services to keep your financial records accurate.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Payroll Services",
                  description:
                    "Efficient and accurate payroll processing services to ensure compliance.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Business Consulting",
                  description:
                    "Strategic business consulting services to help you optimize operations.",
                },
              },
            ],
          },
        })}
      </Script>
    </div>
  );
}