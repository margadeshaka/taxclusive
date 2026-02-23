import { NextResponse } from 'next/server';

import { fetchBlogBySlug } from '@/lib/api/blogs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await fetchBlogBySlug(slug);
    
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
