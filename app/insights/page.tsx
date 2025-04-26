import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "Insights - Taxclusive",
  description:
    "Stay informed with our latest articles, updates, and insights on accounting, taxation, and financial management.",
}

export default function InsightsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
                <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl">Financial Insights</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore trusted financial insights crafted to empower businesses and individuals alike. Our innovative approach, backed by expert knowledge, ensures clarity and confidence in every financial decision—mastering taxes, delivering excellence.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <div className="space-y-2 mb-8">
                  <div className="ethnic-divider text-left">
                    <span className="text-primary font-serif pl-0 pr-4">Featured Article</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                    Latest Financial Insights
                  </h2>
                </div>
                <div className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      // src="https://placehold.co/1200x600"
                      src="/latestfinancial.png"
                      width={1200}
                      height={600}
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
                    <h3 className="mt-3 text-2xl font-bold">Tax Planning Strategies for Small Businesses in 2025</h3>
                    <p className="mt-2 text-muted-foreground">
                    As the tax landscape continues to evolve in 2025, small businesses must adopt proactive strategies to optimize savings and ensure compliance. From leveraging new deductions to restructuring business operations, effective tax planning can significantly enhance financial efficiency. Our insightful guidance helps you navigate complex regulations with confidence and clarity.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        Small Business
                      </span>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        Tax Planning
                      </span>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        2025 Updates
                      </span>
                    </div>
                    {/* <Link
                      href="/insights/tax-planning-strategies"
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                    >
                      Read more 
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link> */}
                  </div>
                </div>

                <div className="space-y-2 mt-12 mb-8">
                  <div className="ethnic-divider text-left">
                    <span className="text-primary font-serif pl-0 pr-4">Recent Articles</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tighter font-serif">
                    Stay Updated with Our Latest Insights
                  </h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        //src="https://placehold.co/600x400"
                        src="/insights1.png"
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
                      <h3 className="mt-3 text-xl font-bold">Financial Forecasting: A Guide for Business Growth</h3>
                      <p className="mt-2 line-clamp-3 text-muted-foreground">
                      Accurate financial forecasting is key to driving sustainable business growth. By analyzing trends, anticipating cash flow, and setting realistic goals, businesses can make informed decisions with confidence. Our trusted expertise empowers you with innovative tools and insights to stay ahead in a dynamic market.
                      </p>
                      {/* <Link
                        href="/insights/financial-forecasting"
                        className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                      >
                        Read more 
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link> */}
                    </div>
                  </article>
                  <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        // src="https://placehold.co/600x400"
                        src="/insights2.png"
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
                      Regular financial audits ensure accuracy, compliance, and transparency in your business operations. They help detect discrepancies early, strengthen stakeholder confidence, and provide actionable insights for strategic planning. As a trusted partner, we bring an insightful and innovative approach to every audit we conduct.
                      </p>
                      {/* <Link
                        href="/insights/importance-of-audits"
                        className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                      >
                        Read more <ChevronRight className="ml-1 h-4 w-4" />
                      </Link> */}
                    </div>
                  </article>
                  <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        // src="https://placehold.co/600x400"
                        src="/insights3.png"
                        width={600}
                        height={400}
                        alt="Navigating business succession planning"
                        className="object-cover transition-all group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <time dateTime="2023-02-15">February 15, 2025</time>
                        <span>•</span>
                        <span>Business Advisory</span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold">Navigating Business Succession Planning</h3>
                      <p className="mt-2 line-clamp-3 text-muted-foreground">
                      Effective succession planning ensures a smooth transition of leadership, minimizes disruptions, and safeguards your business legacy. Our trusted advisors provide insightful strategies that align with your long-term goals, helping you plan with confidence and clarity for the future.
                      </p>
                      {/* <Link
                        href="/insights/succession-planning"
                        className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                      >
                        Read more 
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link> */}
                    </div>
                  </article>
                  <article className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        // src="https://placehold.co/600x400"
                        src="/insights4.png"

                        width={600}
                        height={400}
                        alt="Digital transformation in accounting"
                        className="object-cover transition-all group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <time dateTime="2023-01-30">January 30, 2025</time>
                        <span>•</span>
                        <span>Technology</span>
                      </div>
                      <h3 className="mt-3 text-xl font-bold">Digital Transformation in Accounting</h3>
                      <p className="mt-2 line-clamp-3 text-muted-foreground">
                      Embracing digital tools is reshaping the future of accounting, enabling real-time insights, enhanced accuracy, and greater efficiency. Our innovative approach integrates advanced technology with trusted financial expertise to deliver streamlined and future-ready accounting solutions.
                      </p>
                      {/* <Link
                        href="/insights/digital-transformation"
                        className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                      >
                        Read more
                         <ChevronRight className="ml-1 h-4 w-4" />
                      </Link> */}
                    </div>
                  </article>
                </div>
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/insights/archive"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    View All Articles
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="sticky top-24 space-y-8">
                  <div className="rounded-lg border bg-background p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Categories</h3>
                    <ul className="space-y-2">
                      <li>
                        {/* <Link
                          href="/insights/category/taxation"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        > */}
                          Taxation (12)
                        {/* </Link> */}
                      </li>
                      <li>
                        {/* <Link
                          href="/insights/category/audit"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        > */}
                          Audit & Assurance (8)
                        {/* </Link> */}
                      </li>
                      <li>
                        {/* <Link
                          href="/insights/category/advisory"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        > */}
                          Financial Advisory (10)
                        {/* </Link> */}
                      </li>
                      <li>
                        {/* <Link
                          href="/insights/category/business"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        > */}
                          Business Consulting (7)
                        {/* </Link> */}
                      </li>
                      <li>
                        {/* <Link
                          href="/insights/category/technology"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        > */}
                          Technology (5)
                        {/* </Link> */}
                      </li>
                      <li>
                        {/* <Link
                          href="/insights/category/industry"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        > */}
                          Industry Insights (9)
                        {/* </Link> */}
                      </li>
                    </ul>
                  </div>
                  {/* <div className="rounded-lg border bg-background p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="/insights/tag/tax-planning"
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        Tax Planning
                      </Link> 
                       <Link 
                        href="/insights/tag/small-business"
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      > 
                        Small Business
                      </Link>
                      <Link
                        href="/insights/tag/financial-reporting"
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        Financial Reporting
                      </Link>
                      <Link
                        href="/insights/tag/audit"
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        Audit
                      </Link>
                      <Link
                        href="/insights/tag/compliance"
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        Compliance
                      </Link>
                      <Link
                        href="/insights/tag/digital-transformation"
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        Digital Transformation
                      </Link>
                      <Link
                        href="/insights/tag/succession-planning"
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        Succession Planning
                      </Link>
                    </div>
                  </div> */}
                  <div className="rounded-lg border bg-background p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Subscribe to Our Newsletter</h3>
                    <p className="text-muted-foreground mb-4">
                      Stay updated with our latest insights and news. Subscribe to our newsletter for regular updates.
                    </p>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>
                  <div className="rounded-lg border bg-primary/10 p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Need Financial Guidance?</h3>
                    <p className="text-muted-foreground mb-4">
                      Our team of experts is ready to help you navigate your financial challenges and achieve your
                      goals.
                    </p>
                    <Link
                      href="/appointment"
                      className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      Book a Consultation
                    </Link>
                  </div>
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
                  <span className="text-primary font-serif px-4">Webinars & Events</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                  Upcoming Learning Opportunities
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our experts for informative webinars and events on various financial topics.
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="text-primary font-medium">May 15, 2025 • 2:00 PM EST</div>
                  <h3 className="text-xl font-bold">Tax Planning Strategies for Small Businesses</h3>
                  <p className="text-muted-foreground"> Discover practical and insightful tax planning strategies designed to help small businesses minimize liabilities, stay compliant, and maximize growth. Our trusted experts break down key tax-saving opportunities tailored for the evolving financial landscape of 2025.</p>
                  {/* <Link
                    href="/events/tax-planning-webinar"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Register Now <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="text-primary font-medium">June 8, 2025 • 1:00 PM EST</div>
                  <h3 className="text-xl font-bold">Financial Forecasting Workshop</h3>
                  <p className="text-muted-foreground">  Learn how to forecast with confidence and drive strategic growth through data-driven financial planning.</p>
                  {/* <Link
                    href="/events/forecasting-workshop"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Register Now <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex flex-col space-y-2">
                  <div className="text-primary font-medium">June 22, 2025 • 3:00 PM EST</div>
                  <h3 className="text-xl font-bold">Digital Transformation in Accounting</h3>
                  <p className="text-muted-foreground">Explore how technology is reshaping accounting practices and driving innovation in financial management.</p>
                  {/* <Link
                    href="/events/digital-transformation-webinar"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  >
                    Register Now <ChevronRight className="ml-1 h-4 w-4" />
                  </Link> */}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/events"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View All Events
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

