import Link from "next/link";

interface IndustrySolution {
  title: string;
  description: string;
}

const industrySolutions: IndustrySolution[] = [
  {
    title: "Real Estate & Construction",
    description: "Specialized accounting, tax planning, and financial advisory services for real estate developers, construction companies, and property managers.",
  },
  {
    title: "Technology & Startups",
    description: "Financial services tailored for tech companies and startups, including funding assistance, R&D tax credits, and growth strategies.",
  },
  {
    title: "Healthcare & Life Sciences",
    description: "Specialized financial services for healthcare providers, medical practices, and life science companies.",
  },
];

export function IndustrySolutionsSection() {
  return (
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
          {industrySolutions.map((solution, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-bold">{solution.title}</h3>
                <p className="text-muted-foreground">{solution.description}</p>
              </div>
            </div>
          ))}
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
  );
}