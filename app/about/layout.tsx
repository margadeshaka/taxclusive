import { Metadata } from "next";

import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "About Us | Professional Tax & Financial Services",
  description: "Learn about our experienced team of tax and financial professionals providing expert financial services across Delhi NCR. Trusted firm with 35+ years of experience.",
  keywords: [
    "about us",
    "tax professional team",
    "financial services firm history",
    "professional tax advisors",
    "experienced tax professionals Delhi NCR",
    "financial services legacy",
    "expert financial advisors",
  ],
  canonical: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
