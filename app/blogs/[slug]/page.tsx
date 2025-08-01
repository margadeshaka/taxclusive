import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";

import Footer from "@/components/footer";
import Header from "@/components/header";
import NewsletterSubscription from "@/components/newsletter-subscription";
import { fetchBlogBySlug, fetchAllBlogs } from "@/lib/api/blogs";
import { generateMetadata as generateBlogMetadata } from "@/lib/metadata";
import { formatDate, calculateReadingTime } from "@/lib/date-utils";

interface BlogPageProps {
  params: { slug: string };
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
    const blog = await fetchBlogBySlug(params.slug);
    
    if (!blog) {
      return {
        title: "Blog Not Found | TaxExclusive",
        description: "The requested blog post could not be found.",
      };
    }

    return generateBlogMetadata({
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 160) + "...",
      image: blog.featured_image?.url,
      url: `https://taxexclusive.com/blogs/${params.slug}`,
      publishedTime: blog.published_at,
      modifiedTime: blog.updated_at,
      author: blog.author?.name || "TaxExclusive Team",
      tags: blog.tags?.map(tag => tag.name) || [],
    });
  } catch (error) {
    console.error("Error generating blog metadata:", error);
    return {
      title: "Blog | TaxExclusive",
      description: "Expert insights on taxation and financial management.",
    };
  }
}

export default async function BlogPost({ params }: BlogPageProps) {
  try {
    const blog = await fetchBlogBySlug(params.slug);

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
                      <span>{blog.author?.name || "TaxExclusive Team"}</span>
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
                <div className="prose prose-gray max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: blog.content }} 
                    className="prose-minimal leading-relaxed"
                  />
                </div>

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
                  <Link href="/appointment" className="minimal-button-primary">
                    Schedule Consultation
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </main>
        
        <Footer />
        <NewsletterSubscription />
      </div>
    );
  } catch (error) {
    console.error("Error rendering blog post:", error);
    notFound();
  }
}