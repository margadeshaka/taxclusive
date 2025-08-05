import { Calculator, FileText, TrendingUp, Building, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ConsistentButton } from "@/components/ui/consistent-button";
import { SPACING } from "@/lib/constants/spacing";

const services = [
  {
    icon: Calculator,
    title: "Income Tax Services",
    description: "Complete income tax planning, filing, and compliance services for individuals and businesses.",
    features: ["Tax Return Filing", "Tax Planning", "Appeals & Assessments", "Advance Tax Calculation"]
  },
  {
    icon: FileText,
    title: "GST Services",
    description: "End-to-end GST registration, filing, and compliance management.",
    features: ["GST Registration", "Monthly/Quarterly Filing", "Input Tax Credit", "GST Audit"]
  },
  {
    icon: Building,
    title: "Company Formation",
    description: "Complete assistance in company incorporation and regulatory compliance.",
    features: ["Private Limited Company", "LLP Formation", "Partnership Firms", "Proprietorship"]
  },
  {
    icon: TrendingUp,
    title: "Financial Advisory",
    description: "Strategic financial planning and investment advisory services.",
    features: ["Investment Planning", "Retirement Planning", "Insurance Advisory", "Wealth Management"]
  },
  {
    icon: ShieldCheck,
    title: "Audit & Assurance",
    description: "Independent audit services to ensure financial accuracy and compliance.",
    features: ["Statutory Audit", "Internal Audit", "Tax Audit", "Concurrent Audit"]
  },
  {
    icon: Users,
    title: "Bookkeeping",
    description: "Professional bookkeeping and accounting services for small to medium businesses.",
    features: ["Daily Bookkeeping", "Financial Statements", "Payroll Management", "Expense Tracking"]
  }
];

export default function ServicesSection() {
  return (
    <section className={`w-full ${SPACING.section.full}`}>
      <div className={`container ${SPACING.container.full}`}>
        <div className="text-center mb-16">
          <div className="minimal-divider">
            <span>Our Services</span>
          </div>
          <h2 className="prose-minimal text-center">
            Comprehensive CA Services
          </h2>
          <p className="prose-minimal text-center max-w-3xl mx-auto">
            From tax planning to business formation, we provide end-to-end financial services 
            tailored to your specific needs. Our expert team ensures compliance while maximizing your financial potential.
          </p>
        </div>
        
        <div className={`grid ${SPACING.gap.lg} md:grid-cols-2 lg:grid-cols-3`}>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="minimal-card animate-fade-in">
                <div className={`flex items-center ${SPACING.gap.sm} mb-4`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground mb-3">Key Services:</div>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-16">
          <ConsistentButton variant="outline" asChild>
            <Link href="/services">
              View All Services
            </Link>
          </ConsistentButton>
          
          <div className="mt-8 p-6 bg-primary/5 rounded-sm border border-primary/20">
            <h3 className="text-lg font-semibold mb-2">Need Expert Advice?</h3>
            <p className="text-muted-foreground mb-4">
              Get personalized consultation from our experienced chartered accountants.
            </p>
            <ConsistentButton asChild>
              <Link href="/appointment">
                Schedule Free Consultation
              </Link>
            </ConsistentButton>
          </div>
        </div>
      </div>
    </section>
  );
}
