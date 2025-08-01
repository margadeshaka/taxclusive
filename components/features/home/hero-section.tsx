import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 minimal-pattern">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:grid-cols-2 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="minimal-border">
                <h1 className="prose-minimal">
                  <span className="block text-base font-medium text-muted-foreground uppercase tracking-widest mb-2">
                    Chartered Accountants
                  </span>
                  Excellence in Financial Advisory
                </h1>
              </div>
              <div className="prose-minimal">
                <p className="text-xl leading-relaxed">
                  TaxExclusive is your trusted partner for comprehensive accounting, taxation, and financial advisory services. 
                  We combine traditional expertise with modern technology to deliver exceptional results for individuals and businesses across India.
                </p>
              </div>
              
              {/* Key statistics */}
              <div className="grid grid-cols-3 gap-6 py-8 border-t border-b border-primary/20">
                <div className="text-center">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Clients Served</div>
                </div>
                <div className="text-center">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="stat-number">99%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/appointment"
                className="minimal-button-primary"
              >
                Schedule Consultation
              </Link>
              <Link
                href="/services"
                className="minimal-button-outline"
              >
                View Services
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative">
              <Image
                src="/home.png"
                width={500}
                height={500}
                alt="Professional chartered accountants providing expert financial services"
                className="object-cover rounded-sm shadow-sm"
                priority
              />
              <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-sm p-4 shadow-sm">
                <div className="text-sm font-medium">Trusted by 500+ Clients</div>
                <div className="text-xs text-muted-foreground">Across Delhi NCR</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
