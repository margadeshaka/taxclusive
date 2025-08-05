import { fetchAllBlogs, fetchFeaturedBlogs } from '@/lib/api/blogs';
import { ApiResponseHandler } from '@/lib/api/response-handler';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit');
    
    let blogs;
    
    if (featured) {
      blogs = await fetchFeaturedBlogs(limit ? parseInt(limit) : 3);
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