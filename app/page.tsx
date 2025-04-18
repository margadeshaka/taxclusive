import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSubscription from "@/components/newsletter-subscription"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="w-16 h-1 bg-primary mb-4"></div>
                  <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl xl:text-6xl/none">
                    Traditional Values, Modern Expertise
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  At <span>Tax</span>clusive, we pride ourselves on being your <strong>Insightful</strong> partner in finance, your <strong>Trusted</strong> advisor in tax, and your <strong>Innovative</strong> guide in business strategy. Backed by deep industry expertise and a client-first approach, we specialize in delivering smart, customized solutions that drive clarity and growth. Whether you're an individual or a business, we're here to simplify complexity and support your success—because we believe in <em>Mastering taxes, delivering excellence</em>.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/appointment"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Book an Appointment
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Our Services
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="ethnic-border p-4">
                  <Image
                    //  src="https://placehold.co/550x550"
                      src="/home.png"
                    width={550}
                    height={550}
                    alt="Professional accountants working together in a modern office environment"
                    className="rounded-lg object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">Our Services</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">
                  Comprehensive Financial Solutions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our comprehensive financial solutions are designed to empower businesses and individuals with <strong>insightful</strong> planning, <strong>trusted</strong> guidance, and <strong>innovative</strong> strategies. From tax optimization to business advisory, we’re committed to <em>Mastering taxes, delivering excellence</em> every step of the way.
                </p>


              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground relative after:absolute after:content-[''] after:w-full after:h-full after:border after:border-primary/30 after:rounded-lg after:-right-1 after:-bottom-1">
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
                    aria-hidden="true"
                  >
                    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M2 15h10" />
                    <path d="m9 18 3-3-3-3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Taxation Services</h3>
                  <p className="text-muted-foreground">
                  Expert tax planning and compliance services to help you minimize liabilities and stay ahead of regulations.
                  </p>
                </div>
                <Link href="/services/taxation" className="inline-flex items-center text-sm font-medium text-primary">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground relative after:absolute after:content-[''] after:w-full after:h-full after:border after:border-primary/30 after:rounded-lg after:-right-1 after:-bottom-1">
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
                    aria-hidden="true"
                  >
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Audit & Assurance</h3>
                  <p className="text-muted-foreground">
                  Delivering trusted audit insights to ensure transparency, accuracy, and confidence in your financial reporting.
                  </p>
                </div>
                <Link href="/services/audit" className="inline-flex items-center text-sm font-medium text-primary">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground relative after:absolute after:content-[''] after:w-full after:h-full after:border after:border-primary/30 after:rounded-lg after:-right-1 after:-bottom-1">
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
                    aria-hidden="true"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Financial Advisory</h3>
                  <p className="text-muted-foreground">
                  Our Financial Advisory services are tailored to help individuals and businesses make informed decisions to achieve financial stability and growth. 
                  {/* We offer expert guidance on budgeting, investment strategies, tax planning, and risk management. Whether you're planning for expansion, managing assets, or preparing for the future, our team ensures you have the right financial roadmap in place. */}
                  </p>
                </div>
                <Link href="/services/advisory" className="inline-flex items-center text-sm font-medium text-primary">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Link
                href="/services"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">Our Expertise</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">
                  Industry Specializations
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We bring deep industry expertise to provide specialized financial, tax, and compliance solutions across a wide range of sectors. From manufacturing and healthcare to real estate, IT, and startups, our tailored approach helps businesses navigate complex regulations and make informed financial decisions with confidence.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Real Estate & Construction</h3>
                  <p className="text-muted-foreground">
                  We offer specialized financial and compliance solutions for the real estate and construction sector, addressing the unique challenges of project financing, cost control, regulatory approvals, and tax structuring. 
                  </p>
                  <Link
                    href="/expertise/real-estate"
                    className="inline-flex items-center text-sm font-medium text-primary"
                    aria-label="Learn more about Real Estate & Construction expertise"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Technology & Startups</h3>
                  <p className="text-muted-foreground">
                  Our team provides comprehensive solutions to address your unique financial needs. We assist with optimizing business operations, ensuring compliance, and maximizing financial growth. 
                  </p>
                  <Link
                    href="/expertise/technology"
                    className="inline-flex items-center text-sm font-medium text-primary"
                    aria-label="Learn more about Technology & Startups expertise"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Manufacturing & Distribution</h3>
                  <p className="text-muted-foreground">
                  We provide tailored financial solutions for the manufacturing and distribution industries, focusing on cost optimization, inventory management, and supply chain efficiency. 
                  </p>
                  <Link
                    href="/expertise/manufacturing"
                    className="inline-flex items-center text-sm font-medium text-primary"
                    aria-label="Learn more about Manufacturing & Distribution expertise"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Healthcare & Life Sciences</h3>
                  <p className="text-muted-foreground">
                  Our financial advisory services in the healthcare and life sciences sectors focus on optimizing revenue cycles, navigating regulatory compliance, and managing healthcare reimbursements. 
                  </p>
                  <Link
                    href="/expertise/healthcare"
                    className="inline-flex items-center text-sm font-medium text-primary"
                    aria-label="Learn more about Healthcare & Life Sciences expertise"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Retail & E-commerce</h3>
                  <p className="text-muted-foreground">
                  We offer strategic financial solutions to retail and e-commerce businesses, helping them optimize operations, enhance supply chain management, and maximize profitability.
                  </p>
                  <Link
                    href="/expertise/retail"
                    className="inline-flex items-center text-sm font-medium text-primary"
                    aria-label="Learn more about Retail & E-commerce expertise"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Nonprofit Organizations</h3>
                  <p className="text-muted-foreground">
                  We provide dedicated financial advisory services for nonprofit organizations, helping them maximize their impact through strategic financial planning, fundraising, and compliance management.
                  </p>
                  <Link
                    href="/expertise/nonprofit"
                    className="inline-flex items-center text-sm font-medium text-primary"
                    aria-label="Learn more about Nonprofit Organizations expertise"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-8">
              <Link
                href="/expertise"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View All Industries
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">Insights</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">
                  Latest Financial Insights
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Stay ahead with our latest financial insights, designed to help you navigate the ever-evolving economic landscape. From market trends and investment strategies to regulatory changes and tax planning tips, our expert analysis empowers you to make informed decisions and achieve long-term financial success.
                </p>
              </div>
            </div>
            <div className="grid gap-8 pt-12 md:grid-cols-2 lg:grid-cols-3">
              <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video overflow-hidden">
                  <Image
                    // src="https://placehold.co/600x400"
                    src="/extra.png"
                    width={600}
                    height={400}
                    alt="Tax planning strategies for small businesses"
                    className="object-cover transition-all group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <time dateTime="2023-04-01">April 1, 2025</time>
                    <span>•</span>
                    <span>Taxation</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">Tax Planning Strategies for Small Businesses</h3>
                  <p className="mt-2 line-clamp-3 text-muted-foreground">
                  With tax reforms underway, small businesses must adapt to new deductions and exemptions. Our expert tips help you optimize your tax strategy, ensuring you maximize savings while remaining compliant with the latest regulations.
                  </p>
                  <Link
                    href="/insights/tax-planning-strategies"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                    aria-label="Read more about Tax Planning Strategies for Small Businesses in 2023"
                  >
                    {/* Read more  */}
                    <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
              <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video overflow-hidden">
                  <Image
                    // src="https://placehold.co/600x400"
                    src="insights2.png"
                    width={600}
                    height={400}
                    alt="Financial forecasting guide for business growth"
                    className="object-cover transition-all group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <time dateTime="2023-03-15">March 15, 2025</time>
                    <span>•</span>
                    <span>Financial Advisory</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">The Importance of Financial Forecasting</h3>
                  <p className="mt-2 line-clamp-3 text-muted-foreground">
                  With a volatile global economy, accurate financial forecasting has never been more critical. This article explores techniques to help businesses predict financial outcomes, adapt to market changes, and make informed investment decisions.
                  
                  </p>
                  <Link
                    href="/insights/financial-forecasting"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                    aria-label="Read more about Financial Forecasting: A Guide for Business Growth"
                  >
                    {/* Read more  */}
                    <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
              <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video overflow-hidden">
                  <Image
                    // src="https://placehold.co/600x400"
                    src="/insights3.png"
                    width={600}
                    height={400}
                    alt="The importance of regular financial audits"
                    className="object-cover transition-all group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <time dateTime="2023-02-28">February 28, 2025</time>
                    <span>•</span>
                    <span>Audit</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">The Importance of Regular Financial Audits</h3>
                  <p className="mt-2 line-clamp-3 text-muted-foreground">
                  As businesses face increasing scrutiny, regular financial audits ensure transparency and build trust with stakeholders. Learn why audits are more important than ever and how they can help safeguard your company’s future.
                  </p>
                  
                  <Link
                    href="/insights/importance-of-audits"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                    aria-label="Read more about The Importance of Regular Financial Audits"
                  >
                    {/* Read more */}
                     <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </div>
            <div className="flex justify-center pt-8">
              <Link
                href="/insights"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View All Insights
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="w-16 h-1 bg-primary mb-4"></div>
                  <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">Get in Touch</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ready to take the next step? Whether you're looking for expert advice or have a quick question, we're here to help you every step of the way. Get in touch today!
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
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
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div className="space-y-1">
                      <h3 className="font-bold">Phone</h3>
                      <p className="text-muted-foreground">(+91)..........</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
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
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <div className="space-y-1">
                      <h3 className="font-bold">Email</h3>
                      <p className="text-muted-foreground">contact@taxclusive.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
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
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div className="space-y-1">
                      <h3 className="font-bold">Address</h3>
                      <p className="text-muted-foreground">
                        JMD Megapolis, Sector 48
                        <br />
                       Sohna road Gurugram
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Send us a Message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your name"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your email"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter subject"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your message"
                      required
                      aria-required="true"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <NewsletterSubscription />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

