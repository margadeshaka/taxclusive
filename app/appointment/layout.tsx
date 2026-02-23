import { Metadata } from "next";

import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Book Appointment | Schedule Consultation with Tax Professionals",
  description: "Book an appointment with our expert tax and financial professionals. Schedule your consultation for tax planning, audit, and financial advisory services.",
  keywords: [
    "book tax appointment",
    "schedule consultation",
    "tax professional booking",
    "tax consultation appointment",
    "financial advisor meeting",
  ],
  canonical: "/appointment",
});

export default function AppointmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
