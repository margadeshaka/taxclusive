"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { SimpleThemeToggle } from "@/components/theme-toggle";
import { clientConfig } from "@/lib/config/client-config";

/**
 * Header component for the application
 * Provides navigation links, responsive mobile menu, and appointment booking options
 * @returns {JSX.Element} The rendered header component
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Get configuration data
  const { navigation, site, assets } = clientConfig;

  /**
   * Effect to handle component mounting
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Effect to handle scroll events and update the header appearance
   */
  useEffect(() => {
    const handleScroll = () => {
      try {
        setIsScrolled(window.scrollY > 10);
      } catch (error) {
        console.error("Error handling scroll event:", error);
      }
    };

    try {
      window.addEventListener("scroll", handleScroll);
    } catch (error) {
      console.error("Error adding scroll event listener:", error);
    }

    return () => {
      try {
        window.removeEventListener("scroll", handleScroll);
      } catch (error) {
        console.error("Error removing scroll event listener:", error);
      }
    };
  }, []);

  /**
   * Toggles a class on the body element
   * @param {boolean} add - Whether to add or remove the class
   * @param {string} className - The class name to toggle
   */
  const toggleBodyClass = (add: boolean, className: string) => {
    try {
      if (add) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
    } catch (error) {
      console.error(`Error ${add ? "adding" : "removing"} class ${className}:`, error);
    }
  };

  /**
   * Toggles the mobile menu open/closed state and adjusts body overflow
   */
  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    toggleBodyClass(newMenuState, "overflow-hidden");
  };

  /**
   * Closes the mobile menu and restores body overflow
   */
  const closeMenu = () => {
    setIsMenuOpen(false);
    toggleBodyClass(false, "overflow-hidden");
  };

  /**
   * Checks if the given path matches the current pathname
   * @param {string} path - The path to check against the current pathname
   * @returns {boolean} True if the path matches the current pathname
   */
  const isActive = (path: string) => {
    return pathname === path;
  };

  /**
   * Get the logo source based on the current theme
   * @returns {string} The logo source path
   */
  const getLogoSrc = () => {
    if (!mounted) return "/logo-black.png"; // Default to light mode logo before mount
    return theme === "dark" ? "/logo.png" : "/logo-black.png";
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-background"
      }`}
      aria-label="Main navigation"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-serif font-bold text-xl pt-4"
            aria-label={`${site.name} - Home`}
          >
            {navigation.header.logo.image ? (
              <Image
                src={getLogoSrc()}
                alt={`${site.name} Logo`}
                width={navigation.header.logo.width || 250}
                height={navigation.header.logo.height || 100}
              />
            ) : (
              <span className="text-xl font-bold">{navigation.header.logo.text || site.name}</span>
            )}
          </Link>
        </div>
        <nav className="hidden md:flex gap-6" aria-label="Main">
          {navigation.header.menu.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.url) ? "text-primary font-bold" : ""
              }`}
              {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <SimpleThemeToggle />
          {navigation.header.cta && (
            <Link
              href={navigation.header.cta.url}
              className={`inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                navigation.header.cta.style === "primary"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : navigation.header.cta.style === "secondary"
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "border border-primary bg-background text-primary hover:bg-primary/10"
              }`}
            >
              {navigation.header.cta.text}
            </Link>
          )}
          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Get in Touch
          </Link>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <SimpleThemeToggle />
          <button
            className="flex items-center"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 bg-background pt-16 pb-6 px-4 md:hidden overflow-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-serif font-bold text-xl"
              aria-label="Taxclusive - Home"
              onClick={closeMenu}
            >
              <Image src={getLogoSrc()} alt="Taxclusive Logo" width={250} height={100} />
            </Link>
          </div>
          <nav className="flex flex-col space-y-6 mt-6" aria-label="Mobile">
            <Link
              href="/"
              className={`text-lg font-medium ${isActive("/") ? "text-primary font-bold" : ""}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-lg font-medium ${isActive("/about") ? "text-primary font-bold" : ""}`}
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link
              href="/services"
              className={`text-lg font-medium ${isActive("/services") ? "text-primary font-bold" : ""}`}
              onClick={closeMenu}
            >
              Services
            </Link>
            <Link
              href="/expertise"
              className={`text-lg font-medium ${isActive("/expertise") ? "text-primary font-bold" : ""}`}
              onClick={closeMenu}
            >
              Expertise
            </Link>
            <Link
              href="/insights"
              className={`text-lg font-medium ${isActive("/insights") ? "text-primary font-bold" : ""}`}
              onClick={closeMenu}
            >
              Insights
            </Link>
            <Link
              href="/blogs"
              className={`text-lg font-medium ${isActive("/blogs") ? "text-primary font-bold" : ""}`}
              onClick={closeMenu}
            >
              Blogs
            </Link>
            <Link
              href="/faq"
              className={`text-lg font-medium ${isActive("/faq") ? "text-primary font-bold" : ""}`}
              onClick={closeMenu}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`text-lg font-medium ${isActive("/contact") ? "text-primary font-bold" : ""}`}
              onClick={closeMenu}
            >
              Contact
            </Link>
            <div className="pt-6 border-t">
              <div className="space-y-3">
                <Link
                  href="/appointment"
                  className="w-full inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-6 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onClick={closeMenu}
                >
                  Book an Appointment
                </Link>
                <Link
                  href="/ask-query"
                  className="w-full inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-6 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onClick={closeMenu}
                >
                  Ask a Query
                </Link>
                <Link
                  href="/contact"
                  className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onClick={closeMenu}
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
