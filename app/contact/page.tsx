'use client'
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { emailService } from "@/lib/email-client";
import { generateStructuredData } from "@/lib/metadata";


export default function ContactPage() {
    const [formStatus, setFormStatus] = useState({
        submitted: false,
        success: false,
        message: '',
    });

    async function handleSubmit(formData: FormData) {
        try {
            const data = {
                firstName: formData.get('first-name') as string,
                lastName: formData.get('last-name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                subject: formData.get('subject') as string,
                message: formData.get('message') as string,
            };

            const result = await emailService.submitContactForm(data);
            setFormStatus({
                submitted: true,
                success: result.success,
                message: result.message,
            });
        } catch (error) {
            setFormStatus({
                submitted: true,
                success: false,
                message: 'An unexpected error occurred. Please try again later.',
            });
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
                <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl">
                  Contact Us
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Let’s connect! Whether it’s a quick question or a detailed consultation, we’re
                  always here to help you navigate your finances with clarity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="ethnic-divider text-left">
                  <span className="text-primary font-serif pl-0 pr-4">Get in Touch</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">
                  Connect With Us
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Reach out to Taxclusive for reliable advice, tailored tax strategies, and
                  client-focused solutions that drive results.
                </p>
                <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Need to schedule a consultation?</strong> You can{" "}
                    <Link href="/appointment" className="text-primary hover:underline font-medium">
                      book an appointment online
                    </Link>{" "}
                    with one of our experts at your convenience.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary relative after:absolute after:content-[''] after:w-full after:h-full after:border after:border-primary/30 after:rounded-full after:-right-1 after:-bottom-1" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Phone</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team is just a call away to assist you with tax planning, compliance, and
                      financial solutions.
                    </p>
                    <p className="text-muted-foreground">
                      Reach us during business hours for prompt and professional support.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary relative after:absolute after:content-[''] after:w-full after:h-full after:border after:border-primary/30 after:rounded-full after:-right-1 after:-bottom-1" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      Have questions about tax planning, compliance, or our services?
                    </p>
                    <p className="text-muted-foreground">
                      Reach out to us anytime at <strong>contact@taxclusive.com</strong> — we&apos;re
                      here to provide expert guidance and timely responses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary relative after:absolute after:content-[''] after:w-full after:h-full after:border after:border-primary/30 after:rounded-full after:-right-1 after:-bottom-1" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Office Location</h3>
                    <p className="text-sm text-muted-foreground">
                      Visit us at our centrally located office in Gurugram for expert financial
                      advice and dedicated tax consultation services.
                    </p>
                    <p className="text-muted-foreground"> JMD , Megapolis Sector 48</p>
                    <p className="text-muted-foreground">Sohna Road, Gurugram-122001 , HARYANA</p>
                  </div>
                </div>
              </div>
              {/* <div className="space-y-2">
                                <h3 className="text-xl font-bold">Follow Us</h3>
                                <div className="flex gap-4">
                                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                        </svg>
                                        <span className="sr-only">Facebook</span>
                                    </Link>
                                    <Link href="https://facebook.com/" className="text-muted-foreground hover:text-foreground">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                                        </svg>
                                        <span className="sr-only">Twitter</span>
                                    </Link>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                            <rect width="4" height="12" x="2" y="9"/>
                                            <circle cx="4" cy="4" r="2"/>
                                        </svg>
                                        <span className="sr-only">LinkedIn</span>
                                    </Link>
                                </div>
                            </div> */}
            </div>
            <div className="rounded-lg border bg-background p-8 shadow-sm">
                            <h3 className="text-xl font-bold mb-6">Send us a Message</h3>

                            {formStatus.submitted && (
                                <div className={`p-4 mb-6 rounded-md ${formStatus.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                                    <p className="text-sm font-medium">{formStatus.message}</p>
                                </div>
                            )}

                            <form action={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="first-name"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="first-name"
                                            name="first-name"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Enter your first name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="last-name"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="last-name"
                                            name="last-name"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Enter your last name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="phone"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="subject"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Enter subject"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="message"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Enter your message"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Send Message
                                </button>
                                <p className="text-xs text-muted-foreground text-center">
                                    Fields marked with <span className="text-red-500">*</span> are required
                                </p>
                            </form>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">FAQ</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our services and how we can help your
                  business.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 pt-12 lg:grid-cols-2">
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">What services do you offer?</h3>
                <p className="text-muted-foreground">
                  We provide a wide range of services including tax planning and filing, GST
                  compliance, business registration, audit and assurance, financial advisory, and
                  bookkeeping for individuals and businesses.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">How often should I meet with my accountant?</h3>
                <p className="text-muted-foreground">
                  We recommend quarterly reviews for most businesses to ensure compliance and
                  optimize tax planning. However, the frequency can be customized based on your
                  business needs.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">Do you work with businesses of all sizes?</h3>
                <p className="text-muted-foreground">
                  Yes, we cater to startups, SMEs, and large enterprises across various sectors,
                  offering tailored financial and compliance solutions to match your scale and
                  complexity.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">What industries do you specialize in?</h3>
                <p className="text-muted-foreground">
                  We have experience serving clients in IT, manufacturing, healthcare, retail,
                  education, and real estate, among others. Our team understands the nuances of each
                  industry’s regulatory and financial landscape.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">How do your fees work?</h3>
                <p className="text-muted-foreground">
                  Our fee structure is transparent and flexible. We offer both fixed and customized
                  packages based on the scope of work, complexity, and duration of engagement.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">
                  Can you help with tax planning throughout the year?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely. We offer proactive tax planning services year-round to help you reduce
                  liabilities, ensure timely compliance, and make informed financial decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Contact page specific structured data */}
      <Script id="contact-schema-org" type="application/ld+json">
        {generateStructuredData("Organization", {
          "@type": ["AccountingService", "LocalBusiness", "Organization"],
          name: "Taxclusive - Chartered Accountants",
          alternateName: "Taxclusive CA Services",
          url: "https://www.taxclusive.com",
          logo: "https://www.taxclusive.com/logo.png",
          image: "https://www.taxclusive.com/about.png",
          description: "Leading Chartered Accountancy firm in Gurugram providing expert CA services, tax planning, GST compliance and financial advisory.",
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+919782799042",
              contactType: "customer service",
              email: "contact@taxclusive.com",
              availableLanguage: ["English", "Hindi"],
              hoursAvailable: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00"
              }
            },
          ],
          address: {
            "@type": "PostalAddress",
            streetAddress: "JMD Megapolis, Sector 48, Sohna Road",
            addressLocality: "Gurugram",
            addressRegion: "Haryana",
            postalCode: "122001",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 28.4089,
            longitude: 77.0378,
          },
          openingHours: [
            "Mo-Fr 09:00-18:00",
            "Sa 09:00-14:00"
          ],
          priceRange: "₹₹",
          paymentAccepted: ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "UPI"],
          currenciesAccepted: "INR",
          areaServed: [
            {
              "@type": "City",
              name: "Gurugram"
            },
            {
              "@type": "City", 
              name: "New Delhi"
            },
            {
              "@type": "State",
              name: "Haryana"
            },
            {
              "@type": "State",
              name: "Delhi"
            }
          ],
          sameAs: [
            "https://www.linkedin.com/company/taxclusive",
            "https://www.facebook.com/taxclusive",
            "https://twitter.com/taxclusive",
          ],
        })}
      </Script>
    </div>
  );
}
