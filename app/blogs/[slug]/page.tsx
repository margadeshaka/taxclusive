import { ChevronLeft, Calendar, Clock, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import NewsletterSubscription from "@/components/newsletter-subscription";
import { ConsistentButton } from "@/components/ui/consistent-button";
import { fetchBlogBySlug, fetchAllBlogs } from "@/lib/api/blogs";
import { formatDate, calculateReadingTime } from "@/lib/date-utils";
import { generateMetadata as generateBlogMetadata } from "@/lib/metadata";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const blogs = await fetchAllBlogs();
    return blogs.map((blog) => ({
      slug: blog.slug || blog.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const blog = await fetchBlogBySlug(slug);
    
    if (!blog) {
      return {
        title: "Blog Not Found | Taxclusive",
        description: "The requested blog post could not be found.",
      };
    }

    return generateBlogMetadata({
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 160) + "...",
      image: blog.featured_image?.url,
      url: `https://taxexclusive.com/blogs/${slug}`,
      publishedTime: blog.published_at,
      authorName: blog.author?.name || "Taxclusive Team",
      tags: blog.tags?.map((tag: { name: string }) => tag.name),
    });
  } catch (error) {
    return {
      title: "Blog | Taxclusive",
      description: "Expert insights on taxation and financial management.",
    };
  }
}

export default async function BlogPost({ params }: BlogPageProps) {
  try {
    const { slug } = await params;
    const blog = await fetchBlogBySlug(slug);

    if (!blog) {
      notFound();
    }

    const publishedDate = formatDate(blog.published_at);
    const readingTime = calculateReadingTime(blog.content || '');

    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        
        <main className="flex-1">
          <article className="w-full py-12 md:py-16 lg:py-20">
            <div className="container px-4 md:px-6">
              <div className="mx-auto max-w-4xl">
                {/* Back to blogs link */}
                <Link
                  href="/blogs"
                  className="mb-8 inline-flex items-center text-sm font-medium text-primary hover:underline transition-colors"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Blogs
                </Link>

                {/* Blog header */}
                <header className="mb-12">
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {blog.tags[0].name}
                      </span>
                    </div>
                  )}
                  
                  <h1 className="prose-minimal mb-6">
                    {blog.title}
                  </h1>
                  
                  {blog.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Blog meta information */}
                  <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-border text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{blog.author?.name || "Taxclusive Team"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{publishedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                </header>

                {/* Featured image */}
                {blog.featured_image && (
                  <div className="mb-12">
                    <Image
                      src={blog.featured_image.url}
                      alt={blog.featured_image.alt || blog.title}
                      width={800}
                      height={400}
                      className="w-full h-64 md:h-96 object-cover rounded-sm shadow-sm"
                      priority
                    />
                  </div>
                )}

                {/* Blog content */}
                <MarkdownRenderer content={blog.content || ''} />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <h3 className="text-sm font-medium text-foreground mb-4">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Call to action */}
                <div className="mt-16 p-8 bg-primary/5 rounded-sm border border-primary/20 text-center">
                  <h3 className="text-xl font-semibold mb-4">Need Expert Financial Advice?</h3>
                  <p className="text-muted-foreground mb-6">
                    Get personalized consultation from our experienced chartered accountants.
                  </p>
                  <ConsistentButton asChild>
                    <Link href="/appointment">
                      Schedule Consultation
                    </Link>
                  </ConsistentButton>
                </div>
              </div>
            </div>
          </article>

          {/* Related blogs section */}
          <section className="w-full py-12 md:py-16 lg:py-20 bg-muted">
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-semibold text-center mb-12">
                More Insights
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Related blogs will be populated here */}
                <div className="text-center text-muted-foreground">
                  Check out our other blog posts for more insights.
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter subscription */}
          <section className="w-full py-12 md:py-16 lg:py-20">
            <div className="container px-4 md:px-6">
              <NewsletterSubscription />
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);
    notFound();
  }
}