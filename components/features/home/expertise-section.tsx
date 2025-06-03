import Link from "next/link";

export default function ExpertiseSection() {
  return (
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
              We bring deep industry expertise to provide specialized financial, tax, and compliance
              solutions across a wide range of sectors. From manufacturing and healthcare to real
              estate, IT, and startups, our tailored approach helps businesses navigate complex
              regulations and make informed financial decisions with confidence.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl font-bold">Real Estate & Construction</h3>
              <p className="text-muted-foreground">
                We offer specialized financial and compliance solutions for the real estate and
                construction sector, addressing the unique challenges of project financing, cost
                control, regulatory approvals, and tax structuring.
              </p>
              {/* <Link
                href="/expertise/real-estate"
                className="inline-flex items-center text-sm font-medium text-primary"
                aria-label="Learn more about Real Estate & Construction expertise"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link> */}
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl font-bold">Technology & Startups</h3>
              <p className="text-muted-foreground">
                Our team provides comprehensive solutions to address your unique financial needs. We
                assist with optimizing business operations, ensuring compliance, and maximizing
                financial growth.
              </p>
              {/* <Link
                href="/expertise/technology"
                className="inline-flex items-center text-sm font-medium text-primary"
                aria-label="Learn more about Technology & Startups expertise"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link> */}
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl font-bold">Manufacturing & Distribution</h3>
              <p className="text-muted-foreground">
                We provide tailored financial solutions for the manufacturing and distribution
                industries, focusing on cost optimization, inventory management, and supply chain
                efficiency.
              </p>
              {/* <Link
                href="/expertise/manufacturing"
                className="inline-flex items-center text-sm font-medium text-primary"
                aria-label="Learn more about Manufacturing & Distribution expertise"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link> */}
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl font-bold">Healthcare & Life Sciences</h3>
              <p className="text-muted-foreground">
                Our financial advisory services in the healthcare and life sciences sectors focus on
                optimizing revenue cycles, navigating regulatory compliance, and managing healthcare
                reimbursements.
              </p>
              {/* <Link
                href="/expertise/healthcare"
                className="inline-flex items-center text-sm font-medium text-primary"
                aria-label="Learn more about Healthcare & Life Sciences expertise"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link> */}
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl font-bold">Retail & E-commerce</h3>
              <p className="text-muted-foreground">
                We offer strategic financial solutions to retail and e-commerce businesses, helping
                them optimize operations, enhance supply chain management, and maximize
                profitability.
              </p>
              {/* <Link
                href="/expertise/retail"
                className="inline-flex items-center text-sm font-medium text-primary"
                aria-label="Learn more about Retail & E-commerce expertise"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link> */}
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl font-bold">Nonprofit Organizations</h3>
              <p className="text-muted-foreground">
                We provide dedicated financial advisory services for nonprofit organizations,
                helping them maximize their impact through strategic financial planning,
                fundraising, and compliance management.
              </p>
              {/* <Link
                href="/expertise/nonprofit"
                className="inline-flex items-center text-sm font-medium text-primary"
                aria-label="Learn more about Nonprofit Organizations expertise"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link> */}
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
  );
}
