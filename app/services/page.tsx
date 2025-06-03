import {
  ChevronRight,
  FileText,
  BarChart,
  Calculator,
  DollarSign,
  BookOpen,
  PieChart,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { generateMetadata, generateStructuredData } from "@/lib/metadata";


export const metadata: Metadata = generateMetadata({
  title: "Our Services | Taxclusive",
  description:
    "Comprehensive accounting, taxation, and financial advisory services tailored to meet your unique needs. Expert solutions for individuals and businesses.",
  keywords:
    "tax planning, tax preparation, accounting services, financial advisory, audit services, business consulting, bookkeeping, payroll services, tax compliance",
  canonical: "/services",
});

export default function ServicesPage() {
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
                  Our Services
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Comprehensive accounting, taxation, and financial advisory services tailored to
                  meet your unique needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="ethnic-divider text-left">
                    <span className="text-primary font-serif pl-0 pr-4">Our Approach</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                    Tailored Financial Solutions
                  </h2>
                  <p className="text-muted-foreground md:text-xl/relaxed">
                    We deliver trusted, insightful, and innovative financial solutions tailored to
                    individuals, startups, and enterprises alike.
                  </p>
                  <p className="text-muted-foreground md:text-xl/relaxed">
                    Whether you&apos;re an individual, a small business, or a large corporation, our team
                    of experienced professionals is dedicated to providing exceptional service and
                    strategic guidance.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Link
                    href="/appointment"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Book a Consultation
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="ethnic-border p-4">
                  <Image
                    // src="https://placehold.co/550x550"
                    src="/TailoredFinancialSolutions.png"
                    width={550}
                    height={550}
                    alt="Professional accountants providing financial services to clients"
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">Core Services</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                  Comprehensive Financial Solutions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We offer a wide range of services to meet all your accounting and financial needs.
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Tax Planning & Preparation</h3>
                  <p className="text-muted-foreground">
                    Maximize your savings and stay compliant with our proactive tax planning and
                    preparation services. We help individuals and businesses develop effective
                    strategies that minimize liabilities and align with the latest tax laws and
                    regulations.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Individual tax returns</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Business tax planning</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>International taxation</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Tax compliance</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/services/taxation"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Audit & Assurance</h3>
                  <p className="text-muted-foreground">
                    Independent audit and assurance services to enhance the credibility of your
                    financial information and provide stakeholders with confidence.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Financial statement audits</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Reviews and compilations</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Internal control assessments</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Compliance audits</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/services/audit"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <PieChart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Financial Advisory</h3>
                  <p className="text-muted-foreground">
                    Strategic financial planning and advisory services to help you make informed
                    business decisions and achieve your financial goals.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Business valuation</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Financial forecasting</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Mergers & acquisitions</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Succession planning</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/services/advisory"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Bookkeeping & Accounting</h3>
                  <p className="text-muted-foreground">
                    Comprehensive bookkeeping and accounting services to maintain accurate financial
                    records and provide timely financial information.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>General ledger maintenance</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Financial statement preparation</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Accounts receivable/payable</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Bank reconciliations</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/services/bookkeeping"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Payroll Services</h3>
                  <p className="text-muted-foreground">
                    Efficient payroll processing and management services to ensure accurate and
                    timely payment of employees and compliance with regulations.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Payroll processing</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Tax filing and payments</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Employee benefits administration</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Compliance reporting</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/services/payroll"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Business Consulting</h3>
                  <p className="text-muted-foreground">
                    Strategic business consulting services to help you optimize operations, improve
                    profitability, and achieve sustainable growth.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Business planning</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Cash flow management</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Process improvement</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Strategic planning</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/services/consulting"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
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
                  <span className="text-primary font-serif px-4">Specialized Services</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                  Industry-Specific Solutions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We offer specialized services tailored to the unique needs of various industries.
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Real Estate & Construction</h3>
                  <p className="text-muted-foreground">
                    Specialized accounting, tax planning, and financial advisory services for real
                    estate developers, construction companies, and property managers.
                  </p>
                  {/* <Link
                    href="/expertise/real-estate"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Technology & Startups</h3>
                  <p className="text-muted-foreground">
                    Financial services tailored for tech companies and startups, including funding
                    assistance, R&D tax credits, and growth strategies.
                  </p>
                  {/* <Link
                    href="/expertise/technology"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Healthcare & Life Sciences</h3>
                  <p className="text-muted-foreground">
                    Specialized financial services for healthcare providers, medical practices, and
                    life science companies.
                  </p>
                  {/* <Link
                    href="/expertise/healthcare"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/expertise"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View All Industries
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">Client Testimonials</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                  What Our Clients Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from our satisfied clients about their experience working with Taxclusive.
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="flex text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground italic">
                    &ldquo;Taxclusive has been instrumental in helping our business navigate complex tax
                    regulations. Their expertise and personalized approach have saved us both time
                    and money.&rdquo;
                  </p>
                  <div className="pt-4">
                    <p className="font-bold">Rajesh Patel</p>
                    <p className="text-sm text-muted-foreground">CEO, TechInnovate Solutions</p>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="flex text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground italic">
                    &quot;I&apos;ve been working with Taxclusive for over 10 years, and their financial
                    guidance has been invaluable. They truly understand my business and provide
                    tailored solutions.&quot;
                  </p>
                  <div className="pt-4">
                    <p className="font-bold">Anita Sharma</p>
                    <p className="text-sm text-muted-foreground">Owner, Sharma Properties</p>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="flex text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                      className="h-5 w-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground italic">
                    &quot;As a nonprofit organization, we have unique financial needs. Taxclusive
                    understands these challenges and provides expert guidance that helps us fulfill
                    our mission.&quot;
                  </p>
                  <div className="pt-4">
                    <p className="font-bold">Dr. Vikram Mehta</p>
                    <p className="text-sm text-muted-foreground">Director, Healthcare Foundation</p>
                  </div>
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
                  <span className="text-primary font-serif px-4">Get Started</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                  Ready to Work With Us?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Contact our team today to schedule a consultation and learn how we can help you
                  achieve your financial goals.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Link
                  href="/appointment"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Book an Appointment
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
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
          areaServed: {
            "@type": "Country",
            name: "United States",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Financial Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Tax Planning & Preparation",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Accounting & Bookkeeping",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Audit & Assurance",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Business Advisory",
                },
              },
            ],
          },
        })}
      </Script>
    </div>
  );
}
