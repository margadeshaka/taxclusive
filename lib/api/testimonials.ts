// Local database testimonial API functions
import { prisma } from '@/lib/prisma';

/**
 * Fetch all published testimonials from local database
 * @returns Promise with testimonial data
 */
export async function fetchAllTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return testimonials.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image,
      featured: testimonial.featured,
      approved: testimonial.approved,
      createdAt: testimonial.createdAt.toISOString(),
      updatedAt: testimonial.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    return [];
  }
}

/**
 * Fetch featured testimonials from local database
 * @param limit - Number of featured testimonials to fetch
 * @returns Promise with testimonial data
 */
export async function fetchFeaturedTestimonials(limit: number = 6) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
        featured: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return testimonials.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image,
      featured: testimonial.featured,
      approved: testimonial.approved,
      createdAt: testimonial.createdAt.toISOString(),
      updatedAt: testimonial.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    return [];
  }
}

/**
 * Fetch a single testimonial by ID from local database
 * @param id - The ID of the testimonial to fetch
 * @returns Promise with testimonial data or null
 */
export async function fetchTestimonialById(id: string) {
  try {
    const testimonial = await prisma.testimonial.findFirst({
      where: {
        id: id,
        approved: true
      }
    });

    if (!testimonial) {
      return null;
    }

    return {
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image,
      featured: testimonial.featured,
      approved: testimonial.approved,
      createdAt: testimonial.createdAt.toISOString(),
      updatedAt: testimonial.updatedAt.toISOString()
    };
  } catch (error) {
    console.error(`Error fetching testimonial with ID ${id}:`, error);
    return null;
  }
}