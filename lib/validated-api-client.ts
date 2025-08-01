import { z } from "zod";
import { fetchWithRetry, RequestOptions } from "./api-client";
import { validateApiResponse, safeValidateApiResponse } from "./api-validation";
import { handleError } from "./error-handler";

interface ValidatedApiOptions extends RequestOptions {
  validate?: boolean;
  suppressErrors?: boolean;
}

export class ValidatedApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private getFullUrl(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  }

  async get<T>(
    endpoint: string,
    schema?: z.ZodSchema<T>,
    options: ValidatedApiOptions = {}
  ): Promise<T | null> {
    return this.request<T>("GET", endpoint, schema, options);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    schema?: z.ZodSchema<T>,
    options: ValidatedApiOptions = {}
  ): Promise<T | null> {
    return this.request<T>("POST", endpoint, schema, {
      ...options,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    schema?: z.ZodSchema<T>,
    options: ValidatedApiOptions = {}
  ): Promise<T | null> {
    return this.request<T>("PUT", endpoint, schema, {
      ...options,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    schema?: z.ZodSchema<T>,
    options: ValidatedApiOptions = {}
  ): Promise<T | null> {
    return this.request<T>("PATCH", endpoint, schema, {
      ...options,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  }

  async delete<T>(
    endpoint: string,
    schema?: z.ZodSchema<T>,
    options: ValidatedApiOptions = {}
  ): Promise<T | null> {
    return this.request<T>("DELETE", endpoint, schema, options);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    schema?: z.ZodSchema<T>,
    options: ValidatedApiOptions = {}
  ): Promise<T | null> {
    const {
      validate = true,
      suppressErrors = false,
      ...requestOptions
    } = options;

    try {
      const url = this.getFullUrl(endpoint);
      const response = await fetchWithRetry(url, {
        method,
        ...requestOptions,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response if schema is provided and validation is enabled
      if (schema && validate) {
        if (suppressErrors) {
          return safeValidateApiResponse(schema, data, endpoint);
        } else {
          return validateApiResponse(schema, data, endpoint);
        }
      }

      return data as T;
    } catch (error) {
      if (!suppressErrors) {
        handleError(
          error instanceof Error ? error : new Error(String(error)),
          { method, endpoint, options }
        );
      }
      return null;
    }
  }

  // Batch requests
  async batch<T>(
    requests: Array<{
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      endpoint: string;
      data?: any;
      schema?: z.ZodSchema<T>;
      options?: ValidatedApiOptions;
    }>
  ): Promise<Array<T | null>> {
    const promises = requests.map(({ method, endpoint, data, schema, options }) => {
      switch (method) {
        case "GET":
          return this.get(endpoint, schema, options);
        case "POST":
          return this.post(endpoint, data, schema, options);
        case "PUT":
          return this.put(endpoint, data, schema, options);
        case "PATCH":
          return this.patch(endpoint, data, schema, options);
        case "DELETE":
          return this.delete(endpoint, schema, options);
        default:
          return Promise.resolve(null);
      }
    });

    return Promise.all(promises);
  }
}

// Default client instance
export const apiClient = new ValidatedApiClient(
  process.env.NEXT_PUBLIC_STRAPI_API_URL || ""
);

// Convenience functions for common API operations
export const fetchBlogPosts = (options?: ValidatedApiOptions) =>
  apiClient.get("/api/articles?populate=*", undefined, options);

export const fetchBlogPost = (slug: string, options?: ValidatedApiOptions) =>
  apiClient.get(`/api/articles?filters[slug][$eq]=${slug}&populate=*`, undefined, options);

export const fetchServices = (options?: ValidatedApiOptions) =>
  apiClient.get("/api/services?populate=*", undefined, options);

export const fetchFAQs = (options?: ValidatedApiOptions) =>
  apiClient.get("/api/faqs?populate=*", undefined, options);

export const fetchTeamMembers = (options?: ValidatedApiOptions) =>
  apiClient.get("/api/teams?populate=*", undefined, options);

export const submitContactForm = (data: any, options?: ValidatedApiOptions) =>
  apiClient.post("/api/contact", data, undefined, options);

export const submitAppointmentForm = (data: any, options?: ValidatedApiOptions) =>
  apiClient.post("/api/appointment", data, undefined, options);

export const subscribeNewsletter = (data: any, options?: ValidatedApiOptions) =>
  apiClient.post("/api/newsletter", data, undefined, options);