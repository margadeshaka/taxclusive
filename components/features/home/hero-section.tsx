import Image from "next/image";
import Link from "next/link";
import { SPACING } from "@/lib/constants/spacing";
import { ConsistentButton } from "@/components/ui/consistent-button";

export default function HeroSection() {
  return (
    <section className={`w-full ${SPACING.section.full} minimal-pattern`}>
      <div className={`container ${SPACING.container.full}`}>
        <div className={`grid ${SPACING.gap.lg} lg:grid-cols-2 lg:${SPACING.gap.xl} items-center`}>
          <div className={`flex flex-col justify-center space-y-8`}>
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
                  Taxclusive is your trusted partner for comprehensive accounting, taxation, and financial advisory services. 
                  We combine traditional expertise with modern technology to deliver exceptional results for individuals and businesses across India.
                </p>
              </div>
              
              {/* Key statistics */}
              <div className={`grid grid-cols-3 ${SPACING.gap.md} py-8 border-t border-b border-primary/20`}>
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
            
            <div className={`flex flex-col ${SPACING.gap.sm} sm:flex-row`}>
              <ConsistentButton asChild>
                <Link href="/appointment">
                  Schedule Consultation
                </Link>
              </ConsistentButton>
              <ConsistentButton variant="outline" asChild>
                <Link href="/services">
                  View Services
                </Link>
              </ConsistentButton>
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
