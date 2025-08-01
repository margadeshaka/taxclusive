import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Book Appointment | Schedule Consultation with CA",
  description: "Book an appointment with our expert chartered accountants. Schedule your consultation for tax planning, audit, and financial advisory services.",
  keywords: "book CA appointment, schedule consultation, chartered accountant booking, tax consultation appointment, financial advisor meeting",
  canonical: "/appointment",
});

export default function AppointmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}