import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-serif font-bold text-xl">
              <span className="text-primary">Taxclusive</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About Us
            </Link>
            <Link href="/services" className="text-sm font-medium transition-colors hover:text-primary">
              Services
            </Link>
            <Link href="/expertise" className="text-sm font-medium transition-colors hover:text-primary">
              Expertise
            </Link>
            <Link href="/insights" className="text-sm font-medium transition-colors hover:text-primary">
              Insights
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary font-bold">
              Contact
            </Link>
          </nav>
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get in Touch
            </Link>
          </div>
          <button className="flex items-center space-x-2 md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
                <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl">Contact Us</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Let’s connect! Whether it’s a quick question or a detailed consultation, we’re always here to help you navigate your finances with clarity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="ethnic-divider text-left">
                  <span className="text-primary font-serif pl-0 pr-4">Get in Touch</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">Connect With Us</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Reach out to Taxclusive for reliable advice, tailored tax strategies, and client-focused solutions that drive results.
                </p>
                <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Need to schedule a consultation?</strong> You can{" "}
                    <Link href="/appointment" className="text-primary hover:underline font-medium">
                      book an appointment online
                    </Link>{" "}
                    with one of our experts at your convenience.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary relative after:absolute after:content-[''] after:w-full after:h-full after:border after:border-primary/30 after:rounded-full after:-right-1 after:-bottom-1" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Phone</h3>
                    <p className="text-sm text-muted-foreground">Our team is just a call away to assist you with tax planning, compliance, and financial solutions.</p>
                    <p className="text-muted-foreground">Reach us during business hours for prompt and professional support.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary relative after:absolute after:content-[''] after:w-full after:h-full after:border after:border-primary/30 after:rounded-full after:-right-1 after:-bottom-1" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Email</h3>
                    <p className="text-sm text-muted-foreground">Have questions about tax planning, compliance, or our services?</p>
                    <p className="text-muted-foreground">Reach out to us anytime at <strong>support@taxclusive.in</strong> — we're here to provide expert guidance and timely responses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary relative after:absolute after:content-[''] after:w-full after:h-full after:border after:border-primary/30 after:rounded-full after:-right-1 after:-bottom-1" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Office Location</h3>
                    <p className="text-sm text-muted-foreground">Visit us at our centrally located office in Gurugram for expert financial advice and dedicated tax consultation services.
                    </p>
                    <p className="text-muted-foreground"> JMD , Megapolis Sector 48</p>
                    <p className="text-muted-foreground">Sohna Road – Gurugram</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Follow Us</h3>
                <div className="flex gap-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-background p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="first-name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      First Name
                    </label>
                    <input
                      id="first-name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="last-name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last Name
                    </label>
                    <input
                      id="last-name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter subject"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your message"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">FAQ</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our services and how we can help your business.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 pt-12 lg:grid-cols-2">
              /* <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">What services do you offer?</h3>
                <p className="text-muted-foreground">
                We provide a wide range of services including tax planning and filing, GST compliance, business registration, audit and assurance, financial advisory, and bookkeeping for individuals and businesses.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">How often should I meet with my accountant?</h3>
                <p className="text-muted-foreground">
                We recommend quarterly reviews for most businesses to ensure compliance and optimize tax planning. However, the frequency can be customized based on your business needs.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">Do you work with businesses of all sizes?</h3>
                <p className="text-muted-foreground">
                Yes, we cater to startups, SMEs, and large enterprises across various sectors, offering tailored financial and compliance solutions to match your scale and complexity.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">What industries do you specialize in?</h3>
                <p className="text-muted-foreground">
                We have experience serving clients in IT, manufacturing, healthcare, retail, education, and real estate, among others. Our team understands the nuances of each industry’s regulatory and financial landscape.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">How do your fees work?</h3>
                <p className="text-muted-foreground">
                Our fee structure is transparent and flexible. We offer both fixed and customized packages based on the scope of work, complexity, and duration of engagement.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">Can you help with tax planning throughout the year?</h3>
                <p className="text-muted-foreground">
                Absolutely. We offer proactive tax planning services year-round to help you reduce liabilities, ensure timely compliance, and make informed financial decisions.
                </p>
              </div>
            </div>
          </div> 
        </section>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Taxclusive. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

