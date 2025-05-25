# Blogs Integration with Strapi CMS

This directory contains the implementation of the blogs feature, which integrates with Strapi CMS to display blog content.

## Features

- Blog listing page with pagination
- Blog detail page with rich content
- SWR for data fetching and caching
- Responsive design for all devices
- SEO-friendly with dynamic metadata

## Setup Instructions

### 1. Strapi CMS Configuration

1. Set up a Strapi CMS instance (if you don't have one already)
2. Create a "Blog" content type in Strapi with the following fields:
   - Title (Text)
   - Content (Rich Text)
   - Excerpt (Text)
   - Featured Image (Media)
   - Published At (Date)
   - Slug (Text)
3. Create an API token in Strapi with read permissions for the Blog content type

### 2. Environment Variables

Create or update your `.env.local` file with the following variables:

```
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-instance.com
NEXT_PUBLIC_STRAPI_API_KEY=your-api-token
```

### 3. Strapi Content Structure

The blog integration expects the following structure from Strapi:

```typescript
interface Blog {
  id: string;
  attributes: {
    title: string;
    content: string;
    excerpt?: string;
    publishedAt: string;
    featuredImage?: {
      data?: {
        attributes?: {
          url: string;
        }
      }
    }
  }
}
```

## Implementation Details

### Data Fetching

The blog data is fetched using SWR for efficient caching and revalidation. The implementation can be found in:

- `hooks/use-blogs.tsx` - Custom hooks for fetching blogs
- `lib/strapi.ts` - API utility functions for Strapi

### Components

- `app/blogs/page.tsx` - Main blogs listing page
- `app/blogs/[id]/page.tsx` - Blog detail page
- `app/blogs/components/blog-list.tsx` - Client component for displaying blog list
- `app/blogs/components/blog-detail.tsx` - Client component for displaying blog detail

## Customization

### Styling

The blog components use Tailwind CSS for styling. You can customize the appearance by modifying the classes in the component files.

### API Integration

If you need to modify the API integration, update the functions in `lib/strapi.ts` and the custom hooks in `hooks/use-blogs.tsx`.