// Local database blog API functions
import { prisma } from '@/lib/prisma';

/**
 * Fetch all published blogs from local database
 * @returns Promise with blog data
 */
export async function fetchAllBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tags: true
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' }
      ]
    });

    return blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      status: blog.status,
      featured: blog.featured,
      published_at: blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
      updated_at: blog.updatedAt.toISOString(),
      created_at: blog.createdAt.toISOString(),
      author: blog.author ? {
        name: blog.author.name || 'Taxclusive Team',
        email: blog.author.email
      } : null,
      tags: blog.tags?.map(tag => ({ name: tag.name, slug: tag.slug })) || [],
      featured_image: blog.coverImage ? {
        url: blog.coverImage,
        alt: `${blog.title} cover image`
      } : null
    }));
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    return [];
  }
}

/**
 * Fetch a single blog by slug from local database
 * @param slug - The slug of the blog to fetch
 * @returns Promise with blog data or null
 */
export async function fetchBlogBySlug(slug: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        slug: slug,
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tags: true
      }
    });

    if (!blog) {
      return null;
    }

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      status: blog.status,
      featured: blog.featured,
      published_at: blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
      updated_at: blog.updatedAt.toISOString(),
      created_at: blog.createdAt.toISOString(),
      author: blog.author ? {
        name: blog.author.name || 'Taxclusive Team',
        email: blog.author.email
      } : null,
      tags: blog.tags?.map(tag => ({ name: tag.name, slug: tag.slug })) || [],
      featured_image: blog.coverImage ? {
        url: blog.coverImage,
        alt: `${blog.title} cover image`
      } : null
    };
  } catch (error) {
    console.error(`Error fetching blog with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch a single blog by ID from local database
 * @param id - The ID of the blog to fetch
 * @returns Promise with blog data or null
 */
export async function fetchBlogById(id: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: id,
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tags: true
      }
    });

    if (!blog) {
      return null;
    }

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      status: blog.status,
      featured: blog.featured,
      published_at: blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
      updated_at: blog.updatedAt.toISOString(),
      created_at: blog.createdAt.toISOString(),
      author: blog.author ? {
        name: blog.author.name || 'Taxclusive Team',
        email: blog.author.email
      } : null,
      tags: blog.tags?.map(tag => ({ name: tag.name, slug: tag.slug })) || [],
      featured_image: blog.coverImage ? {
        url: blog.coverImage,
        alt: `${blog.title} cover image`
      } : null
    };
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetch featured blogs from local database
 * @param limit - Number of featured blogs to fetch
 * @returns Promise with blog data
 */
export async function fetchFeaturedBlogs(limit: number = 3) {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tags: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    });

    return blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      status: blog.status,
      featured: blog.featured,
      published_at: blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
      updated_at: blog.updatedAt.toISOString(),
      created_at: blog.createdAt.toISOString(),
      author: blog.author ? {
        name: blog.author.name || 'Taxclusive Team',
        email: blog.author.email
      } : null,
      tags: blog.tags?.map(tag => ({ name: tag.name, slug: tag.slug })) || [],
      featured_image: blog.coverImage ? {
        url: blog.coverImage,
        alt: `${blog.title} cover image`
      } : null
    }));
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return [];
  }
}