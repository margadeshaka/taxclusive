import { fetchAllBlogs, fetchFeaturedBlogs } from '@/lib/api/blogs';
import { ApiResponseHandler } from '@/lib/api/response-handler';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const limit = parseLimit(searchParams.get('limit'), 3, 20);
    
    let blogs;
    
    if (featured) {
      blogs = await fetchFeaturedBlogs(limit);
    } else {
      blogs = await fetchAllBlogs();
    }
    
    
    return ApiResponseHandler.success(blogs, `Successfully fetched ${blogs.length} blogs`);
  } catch (error) {
    return ApiResponseHandler.error(
      'Failed to fetch blogs',
      500,
      error instanceof Error ? { details: error.message } : undefined
    );
  }
}
