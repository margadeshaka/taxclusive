import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { ConsistentButton } from "@/components/ui/consistent-button";
import { getServiceBySlug, getAllServiceSlugs } from "@/lib/data/services";
import {
  generateMetadata as generatePageMetadata,
  generateServiceStructuredData,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/metadata";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.taxclusive.com";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };

  return generatePageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    canonical: `/services/${slug}`,
    type: "service",
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", url: baseUrl },
    { name: "Services", url: `${baseUrl}/services` },
    { name: service.title, url: `${baseUrl}/services/${slug}` },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Structured Data - content generated from trusted developer-controlled config, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateServiceStructuredData({
            name: service.title,
            description: service.description,
            areaServed: ["Gurugram", "Delhi", "Noida", "Ghaziabad", "Faridabad", "Greater Noida"],
            offers: service.whatWeOffer.map((item) => ({
              name: item.title,
              description: item.description,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateFAQStructuredData(service.faqs),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData(breadcrumbs),
        }}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-muted">
          <div className="container px-4 md:px-6">
            <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><span className="mx-2">/</span></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
                <li><span className="mx-2">/</span></li>
                <li className="text-foreground font-medium">{service.title}</li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                {service.headline}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {service.description}
              </p>
              <ConsistentButton asChild>
                <Link href="/appointment">Book a Consultation</Link>
              </ConsistentButton>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">What We Offer</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {service.whatWeOffer.map((item) => (
                <div key={item.title} className="p-6 border rounded-lg bg-background">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="w-full py-12 md:py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Who It&apos;s For</h2>
            <ul className="grid gap-3 md:grid-cols-2 max-w-4xl">
              {service.whoItsFor.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Our Process */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Our Process</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step) => (
                <div key={step.step} className="text-center p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full py-12 md:py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl space-y-4">
              {service.faqs.map((faq) => (
                <details key={faq.question} className="group border rounded-lg bg-background">
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
                    {faq.question}
                    <svg className="h-5 w-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="px-4 pb-4 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let our experts help you with {service.title.toLowerCase()}. Schedule a free consultation today.
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
