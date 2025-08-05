import { NextResponse } from 'next/server';
import { fetchAllTestimonials, fetchFeaturedTestimonials } from '@/lib/api/testimonials';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit');
    
    let testimonials;
    
    if (featured) {
      testimonials = await fetchFeaturedTestimonials(limit ? parseInt(limit) : 6);
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