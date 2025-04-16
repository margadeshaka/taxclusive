import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Award, Users, BookOpen } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "About Us - Taxclusive",
  description: "Learn about our firm's history, values, and the expert team behind Taxclusive.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
                <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl">About Our Firm</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We are a trusted Chartered Accountancy firm committed to delivering excellence in financial, taxation, and compliance services. With a client-centric approach and deep industry expertise, we empower businesses and individuals to navigate complex financial landscapes with confidence. Our mission is to provide transparent, timely, and tailored solutions that foster sustainable growth and ensure regulatory peace of mind.
              
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="ethnic-divider text-left">
                <span className="text-primary font-serif pl-0 pr-4">Our Story</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl md:text-5xl">
                A Legacy of Excellence
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
              Founded with integrity and driven by a passion for precision, our firm has been a pillar of trust in financial and accounting services for years. We take pride in helping businesses, startups, and individuals achieve financial clarity and regulatory compliance with unmatched professionalism.
              </p>
              <p className="text-muted-foreground md:text-xl/relaxed">
              With a legacy built on transparency, client commitment, and deep domain expertise, we continue to evolve with the changing landscape—offering innovative solutions that empower clients to grow with confidence and peace of mind.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Get in Touch
                </Link>
                <Link
                  href="/services"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Our Services
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="ethnic-border p-4">
                <Image
                  // src="https://placehold.co/550x550"
                  src="/about.jpg"
                  width={550}
                  height={550}
                  alt="Sudarshan Mehta, founder of Sudarshan & Associates"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">Our Values</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">Principles That Guide Us</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our core values define who we are and shape every client interaction. Integrity, transparency, and unwavering professionalism are the cornerstones of our practice. We are committed to delivering ethical financial solutions, upholding trust, and fostering long-term relationships built on accountability and mutual respect.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Integrity</h3>
                  <p className="text-muted-foreground">We uphold the highest standards of honesty and ethics in every financial decision, ensuring complete transparency and trust in all our engagements.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Excellence</h3>
                  <p className="text-muted-foreground"> We strive for excellence in every service we provide—from audit and tax to financial consulting—ensuring precision and consistent value for our clients.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Client Focus</h3>
                  <p className="text-muted-foreground">We build lasting partnerships by understanding each client’s unique needs, offering tailored solutions that support growth, compliance, and success.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="ethnic-divider text-left">
                    <span className="text-primary font-serif pl-0 pr-4">Our Approach</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">How We Work With You</h2>
                  <p className="text-muted-foreground md:text-xl/relaxed">
                  At the core of our approach is a commitment to building long-term partnerships with our clients. We begin by understanding your financial goals, challenges, and business landscape. Our team then tailors strategic solutions that align with your objectives—ensuring compliance, optimizing performance, and unlocking sustainable growth.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="font-bold">1</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold">Understand</h3>
                      <p className="text-muted-foreground">
                        We take the time to understand your unique financial situation, goals, and challenges.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="font-bold">2</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold">Plan</h3>
                      <p className="text-muted-foreground">
                        We develop a customized strategy tailored to your specific needs and objectives.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="font-bold">3</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold">Execute</h3>
                      <p className="text-muted-foreground">
                        We implement the agreed-upon solutions with precision and attention to detail.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="font-bold">4</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold">Review & Adapt</h3>
                      <p className="text-muted-foreground">
                        We continuously monitor progress, provide regular updates, and adjust strategies as needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-background p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <BookOpen className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold">Our Philosophy</h3>
                        <p className="text-muted-foreground mt-2">
                        Integrity, expertise, and trust form the foundation of everything we do.
                        </p>
                        <p className="text-primary font-medium mt-2">-  Founder</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-background p-6 shadow-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">35+</div>
                        <p className="text-muted-foreground mt-1">Years of Experience</p>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-background p-6 shadow-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">500+</div>
                        <p className="text-muted-foreground mt-1">Satisfied Clients</p>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-background p-6 shadow-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">25+</div>
                        <p className="text-muted-foreground mt-1">Expert Professionals</p>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-background p-6 shadow-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">12</div>
                        <p className="text-muted-foreground mt-1">Industry Specializations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">Get Started</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">Ready to Work With Us?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Contact our team today to schedule a consultation and learn how we can help you achieve your financial
                  goals.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Link
                  href="/appointment"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Book an Appointment
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

