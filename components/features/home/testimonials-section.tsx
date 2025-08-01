import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    designation: "CEO, Tech Solutions Pvt Ltd",
    location: "Delhi",
    rating: 5,
    content: "TaxExclusive has been instrumental in managing our company's tax compliance and financial planning. Their expertise in GST and corporate taxation saved us significant costs and time.",
    avatar: "/testimonials/rajesh.jpg"
  },
  {
    name: "Priya Sharma",
    designation: "Entrepreneur",
    location: "Gurugram",
    rating: 5,
    content: "As a startup founder, I needed reliable CA services for company incorporation and ongoing compliance. The team provided exceptional guidance throughout the process.",
    avatar: "/testimonials/priya.jpg"
  },
  {
    name: "Amit Patel",
    designation: "Investment Consultant",
    location: "Noida",
    rating: 5,
    content: "Their financial advisory services helped me optimize my tax planning and investment portfolio. Professional, timely, and always available for queries.",
    avatar: "/testimonials/amit.jpg"
  },
  {
    name: "Sneha Gupta",
    designation: "Small Business Owner",
    location: "Faridabad",
    rating: 5,
    content: "Excellent bookkeeping and accounting services. They simplified our financial processes and provided valuable insights for business growth.",
    avatar: "/testimonials/sneha.jpg"
  },
  {
    name: "Vikram Singh",
    designation: "Real Estate Developer",
    location: "Ghaziabad",
    rating: 5,
    content: "Complex real estate taxation made simple. Their deep understanding of property laws and tax implications has been invaluable for our projects.",
    avatar: "/testimonials/vikram.jpg"
  },
  {
    name: "Meera Joshi",
    designation: "Freelance Designer",
    location: "Delhi NCR",
    rating: 5,
    content: "Perfect for individual tax filing and ITR services. They made the entire process hassle-free and educated me on tax-saving opportunities.",
    avatar: "/testimonials/meera.jpg"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/20">
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
          {testimonials.map((testimonial, index) => (
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
                  <div className="text-sm text-muted-foreground">{testimonial.designation}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="stat-number text-primary">500+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div>
              <div className="stat-number text-primary">15+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div>
              <div className="stat-number text-primary">99%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div>
              <div className="stat-number text-primary">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}