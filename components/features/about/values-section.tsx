import { CheckCircle, Award, Users } from "lucide-react";

interface Value {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: CheckCircle,
    title: "Integrity",
    description: "We uphold the highest standards of honesty and ethics in every financial decision, ensuring complete transparency and trust in all our engagements.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every service we provide—from audit and tax to financial consulting—ensuring precision and consistent value for our clients.",
  },
  {
    icon: Users,
    title: "Client Focus",
    description: "We build lasting partnerships by understanding each client's unique needs, offering tailored solutions that support growth, compliance, and success.",
  },
];

export function ValuesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="ethnic-divider">
              <span className="text-primary font-serif px-4">Our Values</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
              Principles That Guide Us
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our core values define who we are and shape every client interaction. Integrity,
              transparency, and unwavering professionalism are the cornerstones of our practice.
              We are committed to delivering ethical financial solutions, upholding trust, and
              fostering long-term relationships built on accountability and mutual respect.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {values.map((value, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}