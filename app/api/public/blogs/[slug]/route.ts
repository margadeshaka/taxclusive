import { NextResponse } from 'next/server';
import { fetchBlogBySlug } from '@/lib/api/blogs';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await fetchBlogBySlug(params.slug);
    
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog'
      },
      { status: 500 }
    );
  }
}