import Link from "next/link";

export default function ServicesSection() {
  return (
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
              Our comprehensive financial solutions are designed to empower businesses and
              individuals with <strong>insightful</strong> planning, <strong>trusted</strong>{" "}
              guidance, and <strong>innovative</strong> strategies. From tax optimization to
              business advisory, we&apos;re committed to{" "}
              <em>Mastering taxes, delivering excellence</em> every step of the way.
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
                Expert tax planning and compliance services to help you minimize liabilities and
                stay ahead of regulations.
              </p>
            </div>
            {/* <Link href="/services/taxation" className="inline-flex items-center text-sm font-medium text-primary">
              Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link> */}
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
                Delivering trusted audit insights to ensure transparency, accuracy, and confidence
                in your financial reporting.
              </p>
            </div>
            {/* <Link href="/services/audit" className="inline-flex items-center text-sm font-medium text-primary">
              Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link> */}
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
                Our Financial Advisory services are tailored to help individuals and businesses make
                informed decisions to achieve financial stability and growth.
              </p>
            </div>
            {/* <Link href="/services/advisory" className="inline-flex items-center text-sm font-medium text-primary">
              Learn more <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link> */}
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
  );
}
