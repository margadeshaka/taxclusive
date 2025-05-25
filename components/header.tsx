"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Globe } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  // const [language, setLanguage] = useState("English")
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = "auto"
  }

  const isActive = (path: string) => {
    return pathname === path
  }

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
          <Link href="/" className="font-serif font-bold text-xl" aria-label="Taxclusive - Home">
            <span className="text-primary">Taxclusive</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6" aria-label="Main">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary font-bold" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about") ? "text-primary font-bold" : ""}`}
          >
            About Us
          </Link>
          <Link
            href="/services"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/services") ? "text-primary font-bold" : ""}`}
          >
            Services
          </Link>
          <Link
            href="/expertise"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/expertise") ? "text-primary font-bold" : ""}`}
          >
            Expertise
          </Link>
          <Link
            href="/insights"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/insights") ? "text-primary font-bold" : ""}`}
          >
            Insights
          </Link>
          <Link
            href="/blogs"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/blogs") ? "text-primary font-bold" : ""}`}
          >
            Blogs
          </Link>
          <Link
            href="/faq"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/faq") ? "text-primary font-bold" : ""}`}
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/contact") ? "text-primary font-bold" : ""}`}
          >
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <div className="relative group">
            {/*<button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">*/}
            {/*  <Globe className="h-4 w-4" />*/}
            {/*  <span>{language}</span>*/}
            {/*</button>*/}
            {/* <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-background border border-border hidden group-hover:block">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                  role="menuitem"
                  onClick={() => setLanguage("English")}
                >
                  English
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                  role="menuitem"
                  onClick={() => setLanguage("हिन्दी")}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div> */}
          </div>
          <Link
            href="/appointment"
            className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-6 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Book an Appointment
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Get in Touch
          </Link>
        </div>
        <button className="flex items-center md:hidden"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-50 bg-background pt-16 pb-6 px-4 md:hidden overflow-auto">
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
              <div className="mb-4">
                {/* <p className="text-sm text-muted-foreground mb-2">Select Language</p>
                <div className="space-y-2">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${language === "English" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setLanguage("English")}
                  >
                    English
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${language === "हिन्दी" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setLanguage("हिन्दी")}
                  >
                    हिन्दी (Hindi)
                  </button>
                </div> */}
              </div>
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
  )
}
