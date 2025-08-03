import { Metadata } from "next";

import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Professional CA Services | Tax Planning, Audit & Financial Advisory",
  description: "Comprehensive chartered accountancy services including tax planning, audit & assurance, financial advisory, bookkeeping, and business consulting across Delhi NCR.",
  keywords: "CA services, tax planning, audit services, financial advisory, bookkeeping, payroll services, business consulting, chartered accountant services Delhi NCR",
  canonical: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}