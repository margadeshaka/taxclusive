# TaxExclusive API Documentation

This document provides comprehensive documentation for the TaxExclusive API services, including endpoints, parameters, and usage examples.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Caching](#caching)
6. [Endpoints](#endpoints)
   - [Blogs](#blogs)
   - [Newsletter Subscription](#newsletter-subscription)
7. [Data Models](#data-models)
8. [Usage Examples](#usage-examples)

## Overview

The TaxExclusive API is built on top of Strapi CMS and provides access to various resources including blogs, articles, and newsletter subscriptions. The API uses RESTful principles and returns data in JSON format.

## Authentication

The API uses Bearer token authentication. To authenticate requests, include an `Authorization` header with a valid API key:

```
Authorization: Bearer YOUR_API_KEY
```

API keys can be obtained from the Strapi admin panel. The API key is stored in the environment variable `NEXT_PUBLIC_STRAPI_API_KEY`.

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: The request was successful
- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication failed or user doesn't have permissions
- `404 Not Found`: The requested resource does not exist
- `422 Unprocessable Entity`: The request was well-formed but was unable to be followed due to semantic errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: An error occurred on the server

Error responses include a JSON object with the following structure:

```json
{
  "error": true,
  "message": "Error message describing what went wrong",
  "details": {
    /* Additional error details if available */
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. The current rate limit is 100 requests per minute per client. When the rate limit is exceeded, the API returns a `429 Too Many Requests` status code.

## Caching

The API implements caching strategies to improve performance:

- GET requests use `force-cache` by default for better performance
- POST, PUT, and DELETE requests use `no-store` to ensure data is always fresh
- The client-side implements a custom caching mechanism using localStorage with a 24-hour expiration

## Endpoints

### Blogs

#### Get All Blogs

```
GET /api/articles
```

Query Parameters:

- `page`: Page number for pagination (default: 1)
- `pageSize`: Number of items per page (default: 10)
- `sort`: Field to sort by (e.g., `publishedAt:desc`)
- `filters`: Filters to apply (e.g., `filters[title][$contains]=tax`)

Response:

```json
{
  "data": [
    {
      "id": "1",
      "attributes": {
        "title": "Blog Title",
        "content": "Blog content...",
        "publishedAt": "2023-01-01T00:00:00.000Z",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50
    }
  }
}
```

#### Get Blog by ID

```
GET /api/articles/:id
```

Response:

```json
{
  "data": {
    "id": "1",
    "attributes": {
      "title": "Blog Title",
      "content": "Blog content...",
      "publishedAt": "2023-01-01T00:00:00.000Z",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Create Blog

```
POST /api/articles
```

Request Body:

```json
{
  "data": {
    "title": "New Blog Title",
    "content": "New blog content..."
  }
}
```

Response:

```json
{
  "data": {
    "id": "2",
    "attributes": {
      "title": "New Blog Title",
      "content": "New blog content...",
      "publishedAt": null,
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    }
  }
}
```

#### Update Blog

```
PUT /api/articles/:id
```

Request Body:

```json
{
  "data": {
    "title": "Updated Blog Title"
  }
}
```

Response:

```json
{
  "data": {
    "id": "1",
    "attributes": {
      "title": "Updated Blog Title",
      "content": "Blog content...",
      "publishedAt": "2023-01-01T00:00:00.000Z",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-03T00:00:00.000Z"
    }
  }
}
```

#### Delete Blog

```
DELETE /api/articles/:id
```

Response:

```json
{
  "data": {
    "id": "1",
    "attributes": {
      "title": "Blog Title",
      "content": "Blog content...",
      "publishedAt": "2023-01-01T00:00:00.000Z",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Newsletter Subscription

The newsletter subscription endpoint is currently simulated in the frontend. In a production environment, you would implement an API endpoint to handle newsletter subscriptions.

## Data Models

### Blog

| Field       | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| id          | string   | Unique identifier               |
| title       | string   | Blog title                      |
| content     | string   | Blog content (HTML or Markdown) |
| publishedAt | datetime | Publication date                |
| createdAt   | datetime | Creation date                   |
| updatedAt   | datetime | Last update date                |

## Usage Examples

### Fetching Blogs with Pagination

```typescript
import { fetchBlogs } from "@/lib/strapi";

// Fetch the first page of blogs with 10 items per page
const response = await fetchBlogs({
  page: 1,
  pageSize: 10,
  sort: "publishedAt:desc",
});

// Access the blogs data
const blogs = response.data;

// Access pagination metadata
const pagination = response.meta.pagination;
```

### Fetching a Single Blog

```typescript
import { fetchBlogById } from "@/lib/strapi";

// Fetch a blog by ID
const blog = await fetchBlogById("1");

// Access the blog data
const blogData = blog.attributes;
```

### Creating a New Blog

```typescript
import { createBlog } from "@/lib/strapi";

// Create a new blog
const newBlog = await createBlog({
  title: "New Blog Title",
  content: "New blog content...",
});

// Access the created blog data
const createdBlogData = newBlog.attributes;
```

### Updating a Blog

```typescript
import { updateBlog } from "@/lib/strapi";

// Update a blog
const updatedBlog = await updateBlog("1", {
  title: "Updated Blog Title",
});

// Access the updated blog data
const updatedBlogData = updatedBlog.attributes;
```

### Deleting a Blog

```typescript
import { deleteBlog } from "@/lib/strapi";

// Delete a blog
const deletedBlog = await deleteBlog("1");

// Access the deleted blog data
const deletedBlogData = deletedBlog.attributes;
```
