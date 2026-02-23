"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();

  const getLogoSrc = () => {
    return theme === "dark" ? "/logo.png" : "/logo-black.png";
  };

  return (
    <footer className="w-full border-t bg-background" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4">
            <Image src={getLogoSrc()} alt="Taxclusive Logo" width={250} height={100} />
            <p className="text-sm text-muted-foreground max-w-xs">
              Trusted by clients, driven by insight. Taxclusive delivers innovative tax solutions
              with precision, integrity, and a commitment to excellence.
            </p>
            {/* <SocialLinks /> */}
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/expertise"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Expertise
                </Link>
              </li>
              <li>
                <Link
                  href="/insights"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Insights
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/ask-query"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Ask a Query
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/tax-planning"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Tax Planning
                </Link>
              </li>
              <li>
                <Link
                  href="/services/gst-compliance"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  GST Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="/services/audit-assurance"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Audit & Assurance
                </Link>
              </li>
              <li>
                <Link
                  href="/services/business-registration"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Business Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/services/financial-advisory"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Financial Advisory
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Locations</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/locations/gurugram"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Gurugram
                </Link>
              </li>
              <li>
                <Link
                  href="/locations/delhi"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Delhi
                </Link>
              </li>
              <li>
                <Link
                  href="/locations/noida"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Noida
                </Link>
              </li>
              <li>
                <Link
                  href="/locations/ghaziabad"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Ghaziabad
                </Link>
              </li>
              <li>
                <Link
                  href="/locations/faridabad"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Faridabad
                </Link>
              </li>
              <li>
                <Link
                  href="/locations/greater-noida"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Greater Noida
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  JMD , Megapolis Sector 48 ,Sohna road
                  <br />
                  Gurugram -122001, HARYANA
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">+919782799042</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">contact@taxclusive.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/appointment"
                className="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-background px-4 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Taxclusive. All rights reserved.
            </p>
            {/* <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/sitemap.xml" className="text-xs text-muted-foreground hover:text-foreground">
                Sitemap
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
