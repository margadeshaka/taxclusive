"use client";

import { useTestimonials } from "@/hooks/use-testimonials";

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className="h-5 w-5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function TestimonialsSection() {
  const { testimonials, loading } = useTestimonials();
  
  // Only show testimonials from database, no fallbacks
  const displayTestimonials = testimonials;
  
  // Don't render section if no testimonials or still loading
  if (loading || displayTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="ethnic-divider">
              <span className="text-primary font-serif px-4">Client Testimonials</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from our satisfied clients about their experience working with Taxclusive.
            </p>
          </div>
        </div>
        <div className="grid gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3">
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
              <div className="flex flex-col space-y-2">
                <div className="flex text-primary">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="pt-4">
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
                  {testimonial.company && (
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}