import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
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
                At <span>Tax</span>clusive, we pride ourselves on being your{" "}
                <strong>Insightful</strong> partner in finance, your <strong>Trusted</strong>{" "}
                advisor in tax, and your <strong>Innovative</strong> guide in business strategy.
                Backed by deep industry expertise and a client-first approach, we specialize in
                delivering smart, customized solutions that drive clarity and growth. Whether
                you&apos;re an individual or a business, we&apos;re here to simplify complexity and
                support your success—because we believe in{" "}
                <em>Mastering taxes, delivering excellence</em>.
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
  );
}
