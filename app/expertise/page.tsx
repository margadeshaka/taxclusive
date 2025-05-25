import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ExpertisePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
                <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl">Our Expertise</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We provide specialized accounting and financial services across various industries, tailored to meet
                  the unique needs of each sector with cultural understanding.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Real Estate & Construction</h3>
                  <p className="text-muted-foreground">
                    Specialized accounting, tax planning, and financial advisory services for real estate developers,
                    construction companies, and property managers.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Cost segregation studies</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Construction accounting</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Property tax planning</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Project-based accounting</span>
                    </li>
                  </ul>
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
                    Financial services tailored for tech companies and startups, including funding assistance, R&D tax
                    credits, and growth strategies.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>R&D tax credit analysis</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Startup funding advisory</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Equity compensation planning</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>SaaS revenue recognition</span>
                    </li>
                  </ul>
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
                  <h3 className="text-xl font-bold">Manufacturing & Distribution</h3>
                  <p className="text-muted-foreground">
                    Comprehensive accounting and advisory services for manufacturing businesses, focusing on inventory
                    management and cost optimization.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Inventory accounting</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Cost accounting systems</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Supply chain optimization</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>International tax planning</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/expertise/manufacturing"
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
                    Specialized financial services for healthcare providers, medical practices, and life science
                    companies.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Medical practice accounting</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Healthcare compliance</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Revenue cycle management</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Biotech financial planning</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/expertise/healthcare"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Retail & E-commerce</h3>
                  <p className="text-muted-foreground">
                    Financial solutions for retail businesses and e-commerce platforms, including inventory accounting
                    and sales tax compliance.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Multi-state sales tax compliance</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Inventory management systems</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>E-commerce accounting</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Cash flow forecasting</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/expertise/retail"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Nonprofit Organizations</h3>
                  <p className="text-muted-foreground">
                    Specialized accounting and tax services for nonprofit organizations, focusing on compliance and
                    financial sustainability.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Form 990 preparation</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Grant compliance</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Donor management</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Board financial reporting</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/expertise/nonprofit"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Professional Services</h3>
                  <p className="text-muted-foreground">
                    Tailored financial solutions for law firms, consulting companies, and other professional service
                    providers.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Partnership accounting</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Time and billing systems</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Profit distribution planning</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Succession planning</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/expertise/professional-services"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Hospitality & Food Service</h3>
                  <p className="text-muted-foreground">
                    Specialized accounting services for restaurants, hotels, and hospitality businesses.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Restaurant accounting</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Tip reporting compliance</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Inventory control systems</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Franchise accounting</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/expertise/hospitality"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Financial Services</h3>
                  <p className="text-muted-foreground">
                    Accounting and compliance services for investment firms, financial advisors, and insurance
                    companies.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Regulatory compliance</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Investment portfolio accounting</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Financial reporting</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                      <span>Risk management</span>
                    </li>
                  </ul>
                  {/* <Link
                    href="/expertise/financial-services"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">Get Started</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">Ready to Work With Us?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Contact our team of experts to discuss how we can help your business with specialized accounting and
                  financial services.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Contact Us
                </Link>
                <Link
                  href="/services"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  View Our Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
