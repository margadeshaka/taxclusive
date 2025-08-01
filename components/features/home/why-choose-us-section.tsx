import { CheckCircle, Users, Award, Clock, Shield, Target } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Expert Team",
    description: "Qualified Chartered Accountants with 15+ years of experience in taxation and financial advisory."
  },
  {
    icon: Award,
    title: "Proven Track Record",
    description: "Successfully served 500+ clients with 99% satisfaction rate and zero compliance failures."
  },
  {
    icon: Clock,
    title: "Timely Service",
    description: "We ensure all your tax filings and compliance requirements are met well before deadlines."
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Your financial information is protected with bank-grade security and confidentiality measures."
  },
  {
    icon: Target,
    title: "Customized Solutions",
    description: "Tailored financial strategies that align with your specific business goals and requirements."
  },
  {
    icon: CheckCircle,
    title: "Comprehensive Support",
    description: "End-to-end financial services from tax planning to business advisory and compliance management."
  }
];

const process = [
  {
    step: "01",
    title: "Initial Consultation",
    description: "Free consultation to understand your financial needs and business requirements."
  },
  {
    step: "02", 
    title: "Strategy Development",
    description: "Custom financial strategy creation based on your goals and regulatory requirements."
  },
  {
    step: "03",
    title: "Implementation",
    description: "Professional execution of tax planning, compliance, and advisory services."
  },
  {
    step: "04",
    title: "Ongoing Support",
    description: "Continuous monitoring, updates, and support to ensure compliance and growth."
  }
];

export default function WhyChooseUsSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        {/* Why Choose Us */}
        <div className="text-center mb-16">
          <div className="minimal-divider">
            <span>Why Choose TaxExclusive</span>
          </div>
          <h2 className="prose-minimal text-center">
            Your Trusted Financial Partner
          </h2>
          <p className="prose-minimal text-center max-w-3xl mx-auto">
            We combine expertise, reliability, and personalized service to deliver exceptional results 
            for individuals and businesses across India.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="minimal-card text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Our Process */}
        <div className="bg-primary/5 rounded-sm border border-primary/20 p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Our Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We follow a systematic approach to ensure you receive the best possible service 
              and achieve your financial objectives.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                
                {/* Arrow connector (hidden on last item and mobile) */}
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-px bg-border"></div>
                      <div className="w-0 h-0 border-l-4 border-l-border border-t-2 border-b-2 border-t-transparent border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}