import { Metadata } from "next";

import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Contact Us | Get in Touch with Expert Tax Professionals",
  description: "Contact our professional tax and financial services team for expert financial services. Located in Gurugram, serving Delhi NCR. Book consultation today.",
  keywords: ["contact tax professional, tax consultant contact, tax consultation booking, financial advisor contact, tax consultant contact Delhi NCR Gurugram"],
  canonical: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}