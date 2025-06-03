"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useBlogs } from "@/hooks/use-blogs";

interface BlogDetailProps {
  id: string;
}

export function BlogDetail({ id }: BlogDetailProps) {
  const { blogs, isLoading, isError } = useBlogs();
  const blog = blogs?.find((blog) => blog.id === parseInt(id));
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span>Loading blog...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-12">
        <div className="rounded-lg bg-red-50 p-6 text-red-800">
          <h3 className="text-lg font-medium">Error loading blog</h3>
          <p className="mt-2">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center py-12">
        <div className="rounded-lg bg-muted p-6">
          <h3 className="text-lg font-medium">Blog not found</h3>
          <p className="mt-2">The blog you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/blogs"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
      {blog.cover?.url ? (
        <div className="mb-8 aspect-video relative overflow-hidden rounded-lg">
          <Image
            src={blog.cover.url}
            alt={blog.title || "Blog post"}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="mb-8 aspect-video relative overflow-hidden rounded-lg">
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image available</span>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl md:text-5xl">
        {blog.title || "Untitled Blog Post"}
      </h1>

      {blog.publishedAt && (
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <time dateTime={blog.publishedAt}>
            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      )}

      {blog.description && <p className="mt-4 text-xl text-muted-foreground">{blog.description}</p>}

      {blog.blocks && blog.blocks.length > 0 && (
        <div className="mt-8">
          {blog.blocks.map((block, index) => {
            if (block.__component === "shared.rich-text") {
              return <div key={index} dangerouslySetInnerHTML={{ __html: block.body }} />;
            }
            return null;
          })}
        </div>
      )}
    </article>
  );
}
