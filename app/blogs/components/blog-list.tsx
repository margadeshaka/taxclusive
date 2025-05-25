"use client"

import Image from "next/image"
import Link from "next/link"
import { useBlogs } from "@/hooks/use-blogs"

export function BlogList() {
  const { blogs, isLoading, isError } = useBlogs()

  if (isLoading) {
    return (
      <div className="col-span-full flex justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span>Loading blogs...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="col-span-full flex justify-center py-12">
        <div className="rounded-lg bg-red-50 p-6 text-red-800">
          <h3 className="text-lg font-medium">Error loading blogs</h3>
          <p className="mt-2">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="col-span-full flex justify-center py-12">
        <div className="rounded-lg bg-muted p-6">
          <h3 className="text-lg font-medium">No blogs found</h3>
          <p className="mt-2">Check back later for new content.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {blogs.map((blog) => (
        <Link 
          key={blog.id} 
          href={`/blogs/${blog.id}`}
          className="group flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
        >
          <div className="aspect-video relative overflow-hidden">
            {blog.cover?.url ? (
              <Image
                src={blog.cover.url}
                alt={blog.title || "Blog post"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col p-4 sm:p-6">
            <h3 className="text-xl font-bold">{blog.title || "Untitled Blog Post"}</h3>
            {(blog.description) && (
              <p className="mt-2 line-clamp-3 text-muted-foreground">
                {blog.description}
              </p>
            )}
            {!blog.description && blog.blocks && blog.blocks.length > 0 && blog.blocks[0].__component === "shared.rich-text" && (
              <p className="mt-2 line-clamp-3 text-muted-foreground">
                {blog.blocks[0].body && blog.blocks[0].body.substring(0, 150) + '...'}
              </p>
            )}
            {blog.publishedAt && (
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <time dateTime={blog.publishedAt}>
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            )}
          </div>
        </Link>
      ))}
    </>
  )
}
