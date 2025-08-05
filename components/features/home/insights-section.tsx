"use client";

import Image from "next/image";
import Link from "next/link";
import { useBlogs } from "@/hooks/use-blogs";
import { ChevronRight } from "lucide-react";

// Fallback articles for when database is empty
const fallbackArticles = [
  {
    id: "fallback-1",
    title: "Tax Planning Strategies for Small Businesses",
    slug: "tax-planning-strategies",
    excerpt: "With tax reforms underway, small businesses must adapt to new deductions and exemptions. Our expert tips help you optimize your tax strategy, ensuring you maximize savings while remaining compliant with the latest regulations.",
    coverImage: "/extra.png",
    publishedAt: new Date("2025-04-01").toISOString(),
    author: { name: "Tax Expert" },
    tags: [{ name: "Taxation" }]
  },
  {
    id: "fallback-2",
    title: "The Importance of Financial Forecasting",
    slug: "financial-forecasting",
    excerpt: "With a volatile global economy, accurate financial forecasting has never been more critical. This article explores techniques to help businesses predict financial outcomes, adapt to market changes, and make informed investment decisions.",
    coverImage: "/insights2.png",
    publishedAt: new Date("2025-03-15").toISOString(),
    author: { name: "Financial Advisor" },
    tags: [{ name: "Financial Advisory" }]
  },
  {
    id: "fallback-3",
    title: "The Importance of Regular Financial Audits",
    slug: "importance-of-audits",
    excerpt: "As businesses face increasing scrutiny, regular financial audits ensure transparency and build trust with stakeholders. Learn why audits are more important than ever and how they can help safeguard your company's future.",
    coverImage: "/insights3.png",
    publishedAt: new Date("2025-02-28").toISOString(),
    author: { name: "Audit Expert" },
    tags: [{ name: "Audit" }]
  }
];

export default function InsightsSection() {
  const { blogs, isLoading } = useBlogs();
  
  // Use first 3 featured/recent blogs or fallback if no blogs or loading
  const displayBlogs = (!isLoading && blogs.length > 0) 
    ? blogs.filter(blog => blog.status === 'PUBLISHED').slice(0, 3)
    : fallbackArticles;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="ethnic-divider">
              <span className="text-primary font-serif px-4">Insights</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">
              Latest Financial Insights
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stay ahead with our latest financial insights, designed to help you navigate the
              ever-evolving economic landscape. From market trends and investment strategies to
              regulatory changes and tax planning tips, our expert analysis empowers you to make
              informed decisions and achieve long-term financial success.
            </p>
          </div>
        </div>
        <div className="grid gap-8 pt-12 md:grid-cols-2 lg:grid-cols-3">
          {displayBlogs.map((blog) => (
            <article key={blog.id} className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
              <div className="aspect-video overflow-hidden">
                <Image
                  src={blog.coverImage || "/placeholder-blog.jpg"}
                  width={600}
                  height={400}
                  alt={blog.title}
                  className="object-cover transition-all group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <time dateTime={blog.publishedAt}>
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                  {blog.tags && blog.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{blog.tags[0].name}</span>
                    </>
                  )}
                </div>
                <h3 className="mt-3 text-xl font-bold">
                  {blog.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-muted-foreground">
                  {blog.excerpt}
                </p>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                  aria-label={`Read more about ${blog.title}`}
                >
                  Read more 
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="flex justify-center pt-8">
          <Link
            href="/blogs"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View All Insights
          </Link>
        </div>
      </div>
    </section>
  );
}