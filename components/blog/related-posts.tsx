import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/date-utils";

interface RelatedPostsProps {
  currentSlug: string;
  tagNames: string[];
}

export async function RelatedPosts({ currentSlug, tagNames }: RelatedPostsProps) {
  let relatedBlogs = [];

  try {
    // First try to find blogs with matching tags
    if (tagNames.length > 0) {
      relatedBlogs = await prisma.blog.findMany({
        where: {
          status: "PUBLISHED",
          slug: { not: currentSlug },
          tags: { some: { name: { in: tagNames } } },
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
      });
    }

    // If fewer than 3, fill with recent posts
    if (relatedBlogs.length < 3) {
      const excludeSlugs = [currentSlug, ...relatedBlogs.map((b) => b.slug)];
      const additional = await prisma.blog.findMany({
        where: {
          status: "PUBLISHED",
          slug: { notIn: excludeSlugs },
        },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 3 - relatedBlogs.length,
      });
      relatedBlogs = [...relatedBlogs, ...additional];
    }
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return null;
  }

  if (relatedBlogs.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-muted">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          More Insights
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {relatedBlogs.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group block p-6 border rounded-lg bg-background hover:border-primary transition-colors"
            >
              <h3 className="font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formatDate(post.publishedAt?.toISOString() || post.createdAt.toISOString())}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
