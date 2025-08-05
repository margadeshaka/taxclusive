import { BookOpen } from "lucide-react";

interface ApproachStep {
  number: string;
  title: string;
  description: string;
}

const approachSteps: ApproachStep[] = [
  {
    number: "1",
    title: "Understand",
    description: "We take the time to understand your unique financial situation, goals, and challenges.",
  },
  {
    number: "2",
    title: "Plan",
    description: "We develop a customized strategy tailored to your specific needs and objectives.",
  },
  {
    number: "3",
    title: "Execute",
    description: "We implement the agreed-upon solutions with precision and attention to detail.",
  },
  {
    number: "4",
    title: "Review & Adapt",
    description: "We continuously monitor progress, provide regular updates, and adjust strategies as needed.",
  },
];

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "35+", label: "Years of Experience" },
  { value: "500+", label: "Satisfied Clients" },
  { value: "25+", label: "Expert Professionals" },
  { value: "12", label: "Industry Specializations" },
];

export function ApproachSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="ethnic-divider text-left">
                <span className="text-primary font-serif pl-0 pr-4">Our Approach</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                How We Work With You
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                At the core of our approach is a commitment to building long-term partnerships
                with our clients. We begin by understanding your financial goals, challenges,
                and business landscape. Our team then tailors strategic solutions that align
                with your objectives—ensuring compliance, optimizing performance, and unlocking
                sustainable growth.
              </p>
            </div>
            <div className="space-y-4">
              {approachSteps.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold">{step.number}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="space-y-4">
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <BookOpen className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-bold">Our Philosophy</h3>
                    <p className="text-muted-foreground mt-2">
                      Integrity, expertise, and trust form the foundation of everything we do.
                    </p>
                    <p className="text-primary font-medium mt-2">- Founder</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="rounded-lg border bg-background p-6 shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                      <p className="text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}