import { Metadata } from "next";

import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Professional Tax & Financial Services | Tax Planning, Audit & Financial Advisory",
  description: "Comprehensive tax and financial services including tax planning, audit & assurance, financial advisory, bookkeeping, and business consulting across Delhi NCR.",
  keywords: "tax services, tax planning, audit services, financial advisory, bookkeeping, payroll services, business consulting, tax and financial services Delhi NCR",
  canonical: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}