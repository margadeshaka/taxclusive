"use client";

import { Star, Quote } from "lucide-react";
import { useTestimonials } from "@/hooks/use-testimonials";

// Fallback testimonials for when database is empty
const fallbackTestimonials = [
  {
    id: "fallback-1",
    name: "Rajesh Kumar",
    role: "CEO, Tech Solutions Pvt Ltd",
    company: "Tech Solutions Pvt Ltd",
    rating: 5,
    content: "Taxclusive has been instrumental in managing our company's tax compliance and financial planning. Their expertise in GST and corporate taxation saved us significant costs and time.",
    image: "/testimonials/rajesh.jpg",
    featured: true,
    approved: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "fallback-2",
    name: "Priya Sharma",
    role: "Entrepreneur",
    company: "StartUp Inc",
    rating: 5,
    content: "As a startup founder, I needed reliable CA services for company incorporation and ongoing compliance. The team provided exceptional guidance throughout the process.",
    image: "/testimonials/priya.jpg",
    featured: true,
    approved: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "fallback-3",
    name: "Amit Patel",
    role: "Investment Consultant",
    company: "Wealth Advisors",
    rating: 5,
    content: "Their financial advisory services helped me optimize my tax planning and investment portfolio. Professional, timely, and always available for queries.",
    image: "/testimonials/amit.jpg",
    featured: true,
    approved: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function TestimonialsSection() {
  const { testimonials, loading } = useTestimonials();
  
  // Use fallback if no testimonials or while loading
  const displayTestimonials = (!loading && testimonials.length > 0) ? testimonials : fallbackTestimonials;
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="minimal-divider">
            <span>Client Testimonials</span>
          </div>
          <h2 className="prose-minimal text-center">
            What Our Clients Say
          </h2>
          <p className="prose-minimal text-center max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied clients have to say about our services.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayTestimonials.map((testimonial, index) => (
            <div key={index} className="minimal-card animate-fade-in">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              
              <div className="relative mb-6">
                <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2" />
                <p className="text-muted-foreground italic leading-relaxed pl-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  {testimonial.company && (
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-12 border-t border-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div>
              <div className="stat-number">15+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div>
              <div className="stat-number">99%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}