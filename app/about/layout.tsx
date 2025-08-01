import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "About Us | Professional Chartered Accountants",
  description: "Learn about our experienced team of chartered accountants providing expert financial services across Delhi NCR. Trusted CA firm with 35+ years of experience.",
  keywords: "about us, chartered accountant team, CA firm history, professional accountants, experienced CA Delhi NCR, CA firm legacy, expert financial advisors",
  canonical: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}