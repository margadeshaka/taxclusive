"use client";

import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company?: string | null;
  content: string;
  rating: number;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/public/testimonials?featured=true&limit=6");
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setTestimonials(data.data as Testimonial[]);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  return { testimonials, loading };
}
