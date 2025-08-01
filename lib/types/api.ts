// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

// Strapi-specific response types
export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiMeta {
  pagination?: StrapiPagination;
  publication?: {
    state: "live" | "preview";
  };
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ApiMeta {
  timestamp?: string;
  requestId?: string;
  [key: string]: any;
}

// API Error types
export interface ApiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

// Request configuration
export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
}

// Paginated request params
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string | string[];
  filters?: Record<string, any>;
}

// API client configuration
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>;
    response?: <T>(response: T) => T | Promise<T>;
    error?: (error: Error) => Error | Promise<Error>;
  };
}