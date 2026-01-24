import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { ConsistentButton } from "@/components/ui/consistent-button";
import { getLocationBySlug, getAllLocationSlugs } from "@/lib/data/locations";
import {
  generateMetadata as generatePageMetadata,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/metadata";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.taxclusive.com";

interface LocationPageProps {
  params: Promise<{ city: string }>;
}

// Map cities to their states
function getState(city: string): string {
  const stateMap: Record<string, string> = {
    gurugram: "Haryana",
    faridabad: "Haryana",
    delhi: "Delhi",
    noida: "Uttar Pradesh",
    ghaziabad: "Uttar Pradesh",
    "greater-noida": "Uttar Pradesh",
  };
  return stateMap[city] || "Haryana";
}

const services = [
  { slug: "tax-planning", title: "Tax Planning & Preparation" },
  { slug: "gst-compliance", title: "GST Registration & Compliance" },
  { slug: "audit-assurance", title: "Audit & Assurance" },
  { slug: "business-registration", title: "Business Registration & Incorporation" },
  { slug: "financial-advisory", title: "Financial Advisory & Planning" },
];

export async function generateStaticParams() {
  return getAllLocationSlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { city } = await params;
  const location = getLocationBySlug(city);
  if (!location) return { title: "Location Not Found" };

  return generatePageMetadata({
    title: location.metaTitle,
    description: location.metaDescription,
    keywords: location.keywords,
    canonical: `/locations/${city}`,
  });
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { city } = await params;
  const location = getLocationBySlug(city);

  if (!location) {
    notFound();
  }

  const state = getState(city);
  const breadcrumbs = [
    { name: "Home", url: baseUrl },
    { name: "Locations", url: `${baseUrl}/locations` },
    { name: location.city, url: `${baseUrl}/locations/${city}` },
  ];

  // Build LocalBusiness structured data
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Taxclusive - Tax Services in ${location.city}`,
    description: location.description,
    url: `${baseUrl}/locations/${city}`,
    telephone: "+919782799042",
    email: "contact@taxclusive.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: location.isPrimaryOffice
        ? "JMD Megapolis, Sector 48, Sohna Road"
        : "Serving from Gurugram office",
      addressLocality: location.isPrimaryOffice ? "Gurugram" : location.city,
      addressRegion: state,
      postalCode: location.isPrimaryOffice ? "122001" : undefined,
      addressCountry: "IN",
    },
    areaServed: location.localities.map((locality) => ({
      "@type": "Place",
      name: `${locality}, ${location.city}`,
    })),
    priceRange: "₹₹",
    openingHours: "Mo-Sa 09:00-18:00",
  };

  // Serialize structured data (content from our own config, safe for injection)
  const localBusinessJson = JSON.stringify(localBusinessData);
  const faqJson = generateFAQStructuredData(location.faqs);
  const breadcrumbJson = generateBreadcrumbStructuredData(breadcrumbs);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Structured Data - generated from trusted internal config data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: localBusinessJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJson }}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-muted">
          <div className="container px-4 md:px-6">
            <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="mx-2">/</span>
                </li>
                <li className="text-foreground font-medium">{location.city}</li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Tax & Financial Services in {location.city}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">{location.description}</p>
              <ConsistentButton asChild>
                <Link href="/appointment">Book a Consultation</Link>
              </ConsistentButton>
            </div>
          </div>
        </section>

        {/* Services Available */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Services Available in {location.city}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="p-6 border rounded-lg bg-background hover:border-primary transition-colors group"
                >
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <span className="text-sm text-muted-foreground mt-2 inline-block">
                    Learn more &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="w-full py-12 md:py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">
              Why Choose Taxclusive in {location.city}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {location.whyChooseUs.map((item) => (
                <div key={item.title} className="p-6 border rounded-lg bg-background">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Areas Served */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Areas We Serve in {location.city}</h2>
            <div className="flex flex-wrap gap-3">
              {location.localities.map((locality) => (
                <span
                  key={locality}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-sm font-medium"
                >
                  {locality}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Office Info */}
        <section className="w-full py-12 md:py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">
              {location.isPrimaryOffice
                ? "Visit Our Office"
                : `Serving ${location.city} From Our Gurugram Office`}
            </h2>
            <div className="max-w-2xl space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Office Address</p>
                  <p className="text-muted-foreground">
                    JMD Megapolis, Sector 48, Sohna Road, Gurugram - 122001, Haryana
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+91 97827 99042</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">contact@taxclusive.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl space-y-4">
              {location.faqs.map((faq) => (
                <details key={faq.question} className="group border rounded-lg bg-background">
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
                    {faq.question}
                    <svg
                      className="h-5 w-5 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <p className="px-4 pb-4 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-16 bg-muted">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Tax Help in {location.city}?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get expert tax and financial services from Taxclusive. We serve all major areas of{" "}
              {location.city}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConsistentButton asChild>
                <Link href="/appointment">Schedule Consultation</Link>
              </ConsistentButton>
              <ConsistentButton asChild variant="outline">
                <Link href="/contact">Contact Us</Link>
              </ConsistentButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
