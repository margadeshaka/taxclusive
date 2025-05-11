import Link from "next/link"
import { Search } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "Frequently Asked Questions - Taxclusive",
  description: "Find answers to common questions about our accounting, taxation, and financial advisory services.",
}

export default function FAQPage() {
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
                  Frequently Asked Questions
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our services, processes, and expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search for answers..."
                  className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  All Questions
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  Tax Services
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  Audit & Assurance
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Financial Advisory
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  Bookkeeping
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tighter font-serif mb-6">General Questions</h2>
                  <div className="space-y-4">
                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>What services does Taxclusive?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>
                          Taxclisive offers a comprehensive range of accounting and financial services,
                          including:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Tax planning and preparation for individuals and businesses</li>
                          <li>Audit and assurance services</li>
                          <li>Financial advisory and consulting</li>
                          <li>Bookkeeping and accounting</li>
                          <li>Payroll services</li>
                          <li>Business formation and structuring</li>
                          <li>Estate and trust planning</li>
                          <li>Industry-specific financial solutions</li>
                        </ul>
                      </div>
                    </details>

                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>How do I schedule an appointment with your firm?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>You can schedule an appointment with our firm in several ways:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>
                            Use our online appointment booking system on our{" "}
                            <Link href="/appointment" className="text-primary hover:underline">
                              appointment page
                            </Link>
                          </li>
                          <li>Call our office at (+91)97739-79042  during business hours</li>
                          <li>Email us at info@taxclusive.com</li>
                          <li>Visit our office in person</li>
                        </ul>
                        <p className="mt-2">
                          We offer flexible scheduling options, including in-person meetings, video conferences, and
                          phone calls.
                        </p>
                      </div>
                    </details>

                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>What industries do you specialize in?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>
                          We have expertise across various industries, providing specialized accounting and financial
                          services with cultural understanding. Our key industry specializations include:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Real Estate & Construction</li>
                          <li>Technology & Startups</li>
                          <li>Manufacturing & Distribution</li>
                          <li>Healthcare & Life Sciences</li>
                          <li>Retail & E-commerce</li>
                          <li>Nonprofit Organizations</li>
                          <li>Professional Services</li>
                          <li>Hospitality & Food Service</li>
                          <li>Financial Services</li>
                        </ul>
                        <p className="mt-2">
                          Visit our{" "}
                          <Link href="/expertise" className="text-primary hover:underline">
                            expertise page
                          </Link>{" "}
                          to learn more about our industry-specific services.
                        </p>
                      </div>
                    </details>

                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>How do your fees work?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>
                          Our fee structure varies based on the services provided and the complexity of your needs. We
                          offer:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Fixed-fee arrangements for many standard services</li>
                          <li>Hourly rates for consulting and advisory services</li>
                          <li>Monthly retainer packages for ongoing services</li>
                          <li>Customized fee structures for complex projects</li>
                        </ul>
                        <p className="mt-2">
                          We believe in transparent pricing and will discuss all fees upfront before beginning any work.
                          During your initial consultation, we'll assess your specific needs and provide a clear fee
                          estimate.
                        </p>
                      </div>
                    </details>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tighter font-serif mb-6">Tax Services</h2>
                  <div className="space-y-4">
                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>What tax services do you provide?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>We offer comprehensive tax services for individuals and businesses, including:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Tax planning and strategy development</li>
                          <li>Individual tax return preparation</li>
                          <li>Business tax return preparation</li>
                          <li>International tax planning and compliance</li>
                          <li>Estate and gift tax planning</li>
                          <li>Tax audit representation</li>
                          <li>Sales and use tax compliance</li>
                          <li>Tax credit and incentive identification</li>
                          <li>Expatriate tax services</li>
                        </ul>
                      </div>
                    </details>

                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>How often should I meet with my accountant for tax planning?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>
                          We recommend quarterly tax planning meetings for most businesses to ensure you're taking
                          advantage of all available tax strategies and to adjust your plan as needed throughout the
                          year. For individuals with complex financial situations, we typically suggest semi-annual
                          meetings.
                        </p>
                        <p className="mt-2">
                          However, the frequency can vary based on your specific situation, business complexity, and
                          financial goals. At a minimum, we recommend meeting at least once before year-end to implement
                          tax-saving strategies before the tax year closes.
                        </p>
                        <p className="mt-2">
                          Remember that proactive tax planning throughout the year is much more effective than reactive
                          tax preparation after the year ends.
                        </p>
                      </div>
                    </details>

                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>What documents should I bring for tax preparation?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>For individual tax preparation, you should bring:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Personal information (SSN, date of birth, etc.)</li>
                          <li>Income documents (W-2s, 1099s, K-1s, etc.)</li>
                          <li>Investment income statements</li>
                          <li>Real estate documents</li>
                          <li>Retirement account information</li>
                          <li>Deduction and credit information</li>
                          <li>Health insurance documentation</li>
                          <li>Prior year's tax return</li>
                        </ul>
                        <p className="mt-2">For business tax preparation, additional documents include:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Business income and expense records</li>
                          <li>Asset purchase and depreciation records</li>
                          <li>Payroll information</li>
                          <li>Partnership or corporate documents</li>
                          <li>Business loan documents</li>
                        </ul>
                        <p className="mt-2">
                          We'll provide you with a detailed checklist specific to your situation before your
                          appointment.
                        </p>
                      </div>
                    </details>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tighter font-serif mb-6">Audit & Assurance</h2>
                  <div className="space-y-4">
                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>What types of audit and assurance services do you offer?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>We provide a range of audit and assurance services, including:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Financial statement audits</li>
                          <li>Reviews and compilations</li>
                          <li>Internal control assessments</li>
                          <li>Compliance audits</li>
                          <li>Due diligence for mergers and acquisitions</li>
                          <li>Fraud investigations</li>
                          <li>Agreed-upon procedures</li>
                          <li>Employee benefit plan audits</li>
                        </ul>
                        <p className="mt-2">
                          Our audit and assurance services are designed to enhance the credibility of your financial
                          information and provide stakeholders with confidence in your financial reporting.
                        </p>
                      </div>
                    </details>

                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>How long does an audit typically take?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>The duration of an audit depends on several factors, including:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>The size and complexity of your organization</li>
                          <li>The condition of your financial records</li>
                          <li>The scope of the audit</li>
                          <li>Your team's responsiveness to information requests</li>
                        </ul>
                        <p className="mt-2">
                          Typically, a small to medium-sized business audit might take 2-4 weeks from start to finish,
                          while larger or more complex organizations might require 4-8 weeks or more. The audit process
                          generally includes planning, fieldwork, and reporting phases.
                        </p>
                        <p className="mt-2">
                          We work efficiently to minimize disruption to your operations while maintaining the
                          thoroughness required for a quality audit.
                        </p>
                      </div>
                    </details>

                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>What's the difference between an audit, review, and compilation?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>These services represent different levels of assurance:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>
                            <strong>Audit:</strong> Provides the highest level of assurance. We examine your financial
                            statements by conducting verification procedures such as confirmation with third parties,
                            physical inspection, and testing of supporting documentation. An audit includes an
                            assessment of internal controls and provides reasonable assurance that the financial
                            statements are free from material misstatement.
                          </li>
                          <li>
                            <strong>Review:</strong> Provides limited assurance. We perform analytical procedures and
                            inquiries to determine whether the financial statements appear to be free from material
                            misstatement. A review is less extensive than an audit but more thorough than a compilation.
                          </li>
                          <li>
                            <strong>Compilation:</strong> Provides no assurance. We assist in preparing financial
                            statements based on information provided by management. We do not verify the accuracy or
                            completeness of the information but present it in the proper format according to accounting
                            standards.
                          </li>
                        </ul>
                        <p className="mt-2">
                          The appropriate service depends on your needs, such as stakeholder requirements, financing
                          needs, and regulatory obligations.
                        </p>
                      </div>
                    </details>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tighter font-serif mb-6">Financial Advisory</h2>
                  <div className="space-y-4">
                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>What financial advisory services do you offer?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>Our financial advisory services include:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Business valuation</li>
                          <li>Mergers and acquisitions advisory</li>
                          <li>Financial forecasting and projections</li>
                          <li>Cash flow management</li>
                          <li>Business succession planning</li>
                          <li>Strategic business planning</li>
                          <li>Financial restructuring</li>
                          <li>Risk management</li>
                          <li>Investment analysis</li>
                          <li>Retirement planning</li>
                        </ul>
                        <p className="mt-2">
                          Our advisory services are tailored to help you make informed financial decisions that align
                          with your business goals and personal objectives.
                        </p>
                      </div>
                    </details>

                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>How can financial advisory services benefit my business?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>Financial advisory services can benefit your business in numerous ways:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Improved decision-making through data-driven insights</li>
                          <li>Enhanced cash flow management and forecasting</li>
                          <li>Strategic planning for growth and expansion</li>
                          <li>Identification of cost-saving opportunities</li>
                          <li>Risk mitigation strategies</li>
                          <li>Preparation for financing or investment</li>
                          <li>Succession planning and business continuity</li>
                          <li>Performance measurement and benchmarking</li>
                        </ul>
                        <p className="mt-2">
                          Our advisory approach focuses on understanding your business objectives and providing tailored
                          solutions that drive financial success and sustainable growth.
                        </p>
                      </div>
                    </details>

                    <details className="group rounded-lg border border-border p-4 [&[open]]:bg-muted/50 transition-all hover:border-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between font-medium">
                        <span>Do you provide personal financial planning services?</span>
                        <span className="transition duration-300 group-open:rotate-180">
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
                            className="h-5 w-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-4 text-muted-foreground">
                        <p>Yes, we offer personal financial planning services that include:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Retirement planning</li>
                          <li>Estate planning</li>
                          <li>Investment analysis and recommendations</li>
                          <li>Education funding strategies</li>
                          <li>Tax-efficient wealth building</li>
                          <li>Insurance needs analysis</li>
                          <li>Cash flow and budgeting</li>
                          <li>Debt management strategies</li>
                        </ul>
                        <p className="mt-2">
                          Our personal financial planning services are designed to help you achieve your financial goals
                          while maintaining harmony between your personal and business finances. We take a holistic
                          approach that considers your complete financial picture. We take a holistic approach that
                          considers your complete financial picture.
                        </p>
                      </div>
                    </details>
                  </div>
                </div>
              </div>

              <div className="mt-12 border-t border-border pt-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold tracking-tighter font-serif">Still have questions?</h2>
                  <p className="text-muted-foreground">
                    If you couldn't find the answer you were looking for, please feel free to reach out to us directly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                    <Link
                      href="/ask-query"
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      Ask a Question
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

