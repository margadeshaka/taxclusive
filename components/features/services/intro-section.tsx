import Image from "next/image";
import Link from "next/link";

export function IntroSection() {
  return (
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
                Whether you&apos;re an individual, a small business, or a large corporation, our
                team of experienced professionals is dedicated to providing exceptional service
                and strategic guidance.
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
  );
}