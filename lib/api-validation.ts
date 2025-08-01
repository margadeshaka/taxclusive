import { z } from "zod";
import { ValidationError } from "./error-handler";

// Base API response schema
export const baseApiResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

// Strapi response schemas
export const strapiMetaSchema = z.object({
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    pageCount: z.number(),
    total: z.number(),
  }).optional(),
  publication: z.object({
    state: z.enum(["live", "preview"]),
  }).optional(),
});

export const strapiSingleResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: strapiMetaSchema,
  });

export const strapiCollectionResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    meta: strapiMetaSchema,
  });

// Blog post schemas
export const blogPostSchema = z.object({
  id: z.number(),
  attributes: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string().optional(),
    content: z.string(),
    featuredImage: z.object({
      data: z.object({
        id: z.number(),
        attributes: z.object({
          url: z.string(),
          alternativeText: z.string().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
        }),
      }).optional(),
    }).optional(),
    author: z.object({
      data: z.object({
        id: z.number(),
        attributes: z.object({
          name: z.string(),
          email: z.string().email().optional(),
        }),
      }).optional(),
    }).optional(),
    categories: z.object({
      data: z.array(z.object({
        id: z.number(),
        attributes: z.object({
          name: z.string(),
          slug: z.string(),
        }),
      })),
    }).optional(),
    publishedAt: z.string().datetime(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

// Service schemas
export const serviceSchema = z.object({
  id: z.number(),
  attributes: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    features: z.array(z.object({
      text: z.string(),
      description: z.string().optional(),
    })).optional(),
    category: z.object({
      data: z.object({
        id: z.number(),
        attributes: z.object({
          name: z.string(),
          slug: z.string(),
        }),
      }).optional(),
    }).optional(),
    publishedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

// Team member schemas
export const teamMemberSchema = z.object({
  id: z.number(),
  attributes: z.object({
    name: z.string(),
    position: z.string(),
    bio: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    linkedin: z.string().url().optional(),
    image: z.object({
      data: z.object({
        id: z.number(),
        attributes: z.object({
          url: z.string(),
          alternativeText: z.string().optional(),
        }),
      }).optional(),
    }).optional(),
    qualifications: z.array(z.string()).optional(),
    specializations: z.array(z.string()).optional(),
    experience: z.number().optional(),
    order: z.number().optional(),
    publishedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

// FAQ schemas
export const faqSchema = z.object({
  id: z.number(),
  attributes: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.object({
      data: z.object({
        id: z.number(),
        attributes: z.object({
          name: z.string(),
          slug: z.string(),
        }),
      }).optional(),
    }).optional(),
    order: z.number().optional(),
    keywords: z.array(z.string()).optional(),
    publishedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

// Form submission response schema
export const formSubmissionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
  data: z.any().optional(),
});

// Generic validation function
export function validateApiResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = `API response validation failed${
        context ? ` for ${context}` : ""
      }: ${error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ")}`;
      
      throw new ValidationError(errorMessage);
    }
    throw error;
  }
}

// Specific validation functions
export const validateBlogPost = (data: unknown) =>
  validateApiResponse(blogPostSchema, data, "blog post");

export const validateBlogPosts = (data: unknown) =>
  validateApiResponse(strapiCollectionResponseSchema(blogPostSchema), data, "blog posts");

export const validateService = (data: unknown) =>
  validateApiResponse(serviceSchema, data, "service");

export const validateServices = (data: unknown) =>
  validateApiResponse(strapiCollectionResponseSchema(serviceSchema), data, "services");

export const validateTeamMember = (data: unknown) =>
  validateApiResponse(teamMemberSchema, data, "team member");

export const validateTeamMembers = (data: unknown) =>
  validateApiResponse(strapiCollectionResponseSchema(teamMemberSchema), data, "team members");

export const validateFAQ = (data: unknown) =>
  validateApiResponse(faqSchema, data, "FAQ");

export const validateFAQs = (data: unknown) =>
  validateApiResponse(strapiCollectionResponseSchema(faqSchema), data, "FAQs");

export const validateFormSubmission = (data: unknown) =>
  validateApiResponse(formSubmissionResponseSchema, data, "form submission");

// Safe validation function that returns null on error instead of throwing
export function safeValidateApiResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T | null {
  try {
    return validateApiResponse(schema, data, context);
  } catch (error) {
    console.error("API validation failed:", error);
    return null;
  }
}