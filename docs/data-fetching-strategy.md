# Data Fetching Strategy

This document outlines the data fetching strategy used in the TaxExclusive project. It provides guidelines and best practices for fetching data from APIs, handling errors, caching, and optimizing performance.

## Core Principles

1. **Reliability**: All API requests should be resilient to network failures and server errors.
2. **Performance**: Minimize unnecessary requests and optimize caching strategies.
3. **User Experience**: Provide immediate feedback through optimistic updates and loading states.
4. **Security**: Ensure proper authentication and data validation.
5. **Maintainability**: Use consistent patterns and abstractions across the application.

## API Client Architecture

### Base API Client (`lib/api-client.ts`)

The base API client provides core functionality for making HTTP requests:

- **Timeout Handling**: Automatically cancels requests that take too long.
- **Retry Logic**: Automatically retries failed requests with exponential backoff.
- **Error Handling**: Provides detailed error information for debugging.
- **Interceptors**: Supports request, response, and error interceptors for cross-cutting concerns.

### Strapi API Client (`lib/strapi.ts`)

The Strapi API client extends the base client with Strapi-specific functionality:

- **Authentication**: Automatically adds API key to requests.
- **Data Validation**: Validates response structure to ensure data integrity.
- **Pagination**: Supports paginated requests with filtering and sorting.
- **CRUD Operations**: Provides methods for creating, reading, updating, and deleting resources.

## Data Fetching Hooks

### SWR Integration

We use SWR (Stale-While-Revalidate) for data fetching and caching:

- **Caching**: Responses are cached in memory and localStorage for persistence.
- **Revalidation**: Cache is automatically revalidated on specific events (reconnect, focus).
- **Deduplication**: Duplicate requests are automatically deduplicated.
- **Error Retry**: Failed requests are automatically retried with configurable limits.

### Custom Hooks

Custom hooks provide a higher-level abstraction for data fetching:

- **`useBlogs`**: Fetches a paginated list of blogs with filtering and sorting.
- **`useBlog`**: Fetches a single blog by ID.

These hooks provide:

- **Loading States**: Track loading state for UI feedback.
- **Error States**: Track error state for error handling.
- **Pagination Controls**: Methods for controlling pagination, filtering, and sorting.
- **Optimistic Updates**: Methods for creating, updating, and deleting resources with optimistic updates.

## Optimistic Updates

Optimistic updates provide immediate feedback to users by updating the UI before the server confirms the change:

1. **Update Local Cache**: Immediately update the local cache with the expected result.
2. **Make API Request**: Send the request to the server.
3. **Handle Success**: If successful, revalidate the cache to ensure consistency.
4. **Handle Error**: If failed, revert the optimistic update and show an error message.

## Caching Strategy

### Cache Levels

1. **SWR Memory Cache**: Primary cache for active session.
2. **LocalStorage Cache**: Persistent cache between sessions with TTL (Time-To-Live).
3. **HTTP Cache**: Browser's HTTP cache for static resources.

### Cache Invalidation

Cache is invalidated in the following scenarios:

1. **Mutation**: After creating, updating, or deleting a resource.
2. **Manual Revalidation**: When explicitly calling `mutate()`.
3. **TTL Expiration**: When the cache entry exceeds its TTL.
4. **Reconnect**: When the browser regains network connection.

## Error Handling

### Error Types

1. **Network Errors**: Failed requests due to network issues.
2. **Timeout Errors**: Requests that exceed the timeout limit.
3. **Server Errors**: 5xx status codes from the server.
4. **Client Errors**: 4xx status codes from the server.
5. **Validation Errors**: Invalid response structure or data.

### Error Handling Strategy

1. **Retry**: Automatically retry retryable errors (network, timeout, some server errors).
2. **Fallback**: Use cached data as fallback when available.
3. **User Feedback**: Show appropriate error messages to users.
4. **Logging**: Log detailed error information for debugging.

## Performance Optimization

1. **Pagination**: Fetch only the data needed for the current view.
2. **Caching**: Minimize redundant requests through effective caching.
3. **Prefetching**: Prefetch data that is likely to be needed soon.
4. **Debouncing**: Debounce rapid user interactions that trigger data fetching.
5. **Parallel Requests**: Make independent requests in parallel.

## Security Considerations

1. **Authentication**: Use API keys or tokens for authentication.
2. **HTTPS**: Always use HTTPS for API requests.
3. **Input Validation**: Validate user input before sending to the server.
4. **Response Validation**: Validate server responses to prevent injection attacks.
5. **Error Handling**: Don't expose sensitive information in error messages.

## Best Practices

1. **Use Hooks**: Always use the provided hooks for data fetching.
2. **Handle Loading States**: Always show loading indicators for better UX.
3. **Handle Errors**: Always handle errors and provide user feedback.
4. **Optimistic Updates**: Use optimistic updates for better UX when appropriate.
5. **Pagination**: Use pagination for large datasets.
6. **Data Validation**: Always validate data from the server.
7. **Type Safety**: Use TypeScript interfaces for API responses.
