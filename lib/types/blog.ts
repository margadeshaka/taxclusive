/**
 * TypeScript interfaces for blog data models
 */

/**
 * Interface for blog metadata
 */
export interface BlogMeta {
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/**
 * Interface for blog attributes
 */
export interface BlogAttributes {
  title: string;
  content: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  coverImage?: {
    data?: {
      id: number;
      attributes: {
        url: string;
        width: number;
        height: number;
        alternativeText?: string;
      };
    };
  };
  category?: {
    data?: {
      id: number;
      attributes: {
        name: string;
        slug: string;
      };
    };
  };
  author?: {
    data?: {
      id: number;
      attributes: {
        name: string;
        bio?: string;
        avatar?: {
          data?: {
            attributes: {
              url: string;
            };
          };
        };
      };
    };
  };
}

/**
 * Interface for a single blog
 */
export interface Blog {
  id: number;
  attributes: BlogAttributes;
}

/**
 * Interface for blog list response
 */
export interface BlogListResponse {
  data: Blog[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Interface for single blog response
 */
export interface BlogResponse {
  data: Blog;
  meta: Record<string, never>;
}
