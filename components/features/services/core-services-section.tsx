import {
  FileText,
  BarChart,
  PieChart,
  Calculator,
  DollarSign,
  BookOpen,
} from "lucide-react";
import { ServiceCard } from "./service-card";

const coreServices = [
  {
    icon: FileText,
    title: "Tax Planning & Preparation",
    description: "Maximize your savings and stay compliant with our proactive tax planning and preparation services. We help individuals and businesses develop effective strategies that minimize liabilities and align with the latest tax laws and regulations.",
    features: [
      { text: "Individual tax returns" },
      { text: "Business tax planning" },
      { text: "International taxation" },
      { text: "Tax compliance" },
    ],
  },
  {
    icon: BarChart,
    title: "Audit & Assurance",
    description: "Independent audit and assurance services to enhance the credibility of your financial information and provide stakeholders with confidence.",
    features: [
      { text: "Financial statement audits" },
      { text: "Reviews and compilations" },
      { text: "Internal control assessments" },
      { text: "Compliance audits" },
    ],
  },
  {
    icon: PieChart,
    title: "Financial Advisory",
    description: "Strategic financial planning and advisory services to help you make informed business decisions and achieve your financial goals.",
    features: [
      { text: "Business valuations" },
      { text: "Financial planning" },
      { text: "Investment advisory" },
      { text: "Risk management" },
    ],
  },
  {
    icon: Calculator,
    title: "Bookkeeping & Accounting",
    description: "Comprehensive bookkeeping and accounting services to keep your financial records accurate, up-to-date, and compliant with regulations.",
    features: [
      { text: "Monthly bookkeeping" },
      { text: "Financial statement preparation" },
      { text: "Accounts payable/receivable" },
      { text: "General ledger maintenance" },
    ],
  },
  {
    icon: DollarSign,
    title: "Payroll Services",
    description: "Efficient and accurate payroll processing services to ensure your employees are paid correctly and on time while maintaining compliance.",
    features: [
      { text: "Payroll processing" },
      { text: "Direct deposit services" },
      { text: "Tax withholding & filings" },
      { text: "Compliance management" },
    ],
  },
  {
    icon: BookOpen,
    title: "Business Consulting",
    description: "Strategic business consulting services to help you optimize operations, improve profitability, and achieve sustainable growth.",
    features: [
      { text: "Business strategy development" },
      { text: "Process optimization" },
      { text: "Performance analysis" },
      { text: "Growth planning" },
    ],
  },
];

export function CoreServicesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="ethnic-divider">
              <span className="text-primary font-serif px-4">Core Services</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
              Comprehensive Financial Solutions
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We offer a wide range of services to meet all your accounting and financial needs.
            </p>
          </div>
        </div>
        <div className="grid gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}