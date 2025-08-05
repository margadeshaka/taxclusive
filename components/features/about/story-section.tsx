import Image from "next/image";
import Link from "next/link";

export function StorySection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="ethnic-divider text-left">
            <span className="text-primary font-serif pl-0 pr-4">Our Story</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl md:text-5xl">
            A Legacy of Excellence
          </h2>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Founded with integrity and driven by a passion for precision, our firm has been a
            pillar of trust in financial and accounting services for years. We take pride in
            helping businesses, startups, and individuals achieve financial clarity and
            regulatory compliance with unmatched professionalism.
          </p>
          <p className="text-muted-foreground md:text-xl/relaxed">
            With a legacy built on transparency, client commitment, and deep domain expertise,
            we continue to evolve with the changing landscape—offering innovative solutions that
            empower clients to grow with confidence and peace of mind.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get in Touch
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
              src="/about.png"
              width={550}
              height={550}
              alt="founder of Taxclusive"
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}