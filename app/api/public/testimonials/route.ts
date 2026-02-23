import { NextResponse } from 'next/server';

import { fetchAllTestimonials, fetchFeaturedTestimonials } from '@/lib/api/testimonials';

function parseLimit(rawLimit: string | null, defaultLimit: number, maxLimit: number): number {
  if (!rawLimit) {
    return defaultLimit;
  }

  const parsed = Number.parseInt(rawLimit, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return defaultLimit;
  }

  return Math.min(parsed, maxLimit);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseLimit(searchParams.get('limit'), 6, 20);
    
    let testimonials;
    
    if (featured) {
      testimonials = await fetchFeaturedTestimonials(limit);
    } else {
      testimonials = await fetchAllTestimonials();
    }
    
    return NextResponse.json({
      success: true,
      data: testimonials,
      count: testimonials.length
    });
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch testimonials'
      },
      { status: 500 }
    );
  }
}
