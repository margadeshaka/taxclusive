import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import NewsletterSubscription from "@/components/newsletter-subscription";
import { fetchAllBlogs } from "@/lib/api/strapi";
import { generateMetadata as generatePageMetadata } from "@/lib/metadata";

// Generate metadata for the blogs page
export const metadata: Metadata = generatePageMetadata({
  title: "Expert Financial Insights & Tax Updates | TaxExclusive Blog",
  description: "Stay updated with the latest tax laws, financial planning tips, and business insights from our expert chartered accountants. Professional advice you can trust.",
  url: "https://taxexclusive.com/blogs",
});

export default async function BlogsPage() {
  const blogs = await fetchAllBlogs();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="w-full py-16 md:py-24 lg:py-32 minimal-pattern">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <div className="minimal-divider">
                <span>Insights & Knowledge</span>
              </div>
              <h1 className="prose-minimal text-center">
                Expert Financial Insights
              </h1>
              <p className="prose-minimal text-center max-w-3xl mx-auto">
                Stay ahead with expert insights on taxation, financial planning, and business strategy. 
                Our chartered accountants share practical advice to help you make informed financial decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Featured blog */}
        {blogs.length > 0 && (
          <section className="w-full py-16">
            <div className="container px-4 md:px-6">
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-2">Featured Article</h2>
                <div className="w-16 h-0.5 bg-primary"></div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  {blogs[0].featured_image && (
                    <Image
                      src={blogs[0].featured_image.url}
                      alt={blogs[0].featured_image.alt || blogs[0].title}
                      width={600}
                      height={400}
                      className="w-full h-64 md:h-80 object-cover rounded-sm shadow-sm"
                    />
                  )}
                </div>
                
                <div className="space-y-6">
                  {blogs[0].category && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {blogs[0].category.name}
                    </span>
                  )}
                  
                  <h3 className="text-3xl font-semibold leading-tight">
                    {blogs[0].title}
                  </h3>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {blogs[0].excerpt || blogs[0].content?.substring(0, 150) + "..."}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(blogs[0].published_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.ceil((blogs[0].content?.length || 0) / 200)} min read</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/blogs/${blogs[0].slug || blogs[0].id}`}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                  >
                    Read Full Article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All blogs grid */}
        <section className="w-full py-16 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-2">Latest Articles</h2>
              <div className="w-16 h-0.5 bg-primary"></div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.slice(1).map((blog) => {
                const publishedDate = new Date(blog.published_at).toLocaleDateString();
                const readingTime = Math.ceil((blog.content?.length || 0) / 200);
                
                return (
                  <article key={blog.id} className="minimal-card group animate-fade-in">
                    {blog.featured_image && (
                      <div className="mb-4 overflow-hidden rounded-sm">
                        <Image
                          src={blog.featured_image.url}
                          alt={blog.featured_image.alt || blog.title}
                          width={400}
                          height={240}
                          className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {blog.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {blog.category.name}
                        </span>
                      )}
                      
                      <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {blog.excerpt || blog.content?.substring(0, 120) + "..."}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{publishedDate}</span>
                          <span>{readingTime} min read</span>
                        </div>
                        
                        <Link
                          href={`/blogs/${blog.slug || blog.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            
            {blogs.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No blogs available</h3>
                <p className="text-muted-foreground">Check back soon for expert insights and updates.</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to action */}
        <section className="w-full py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center p-12 bg-muted/20 rounded-sm border border-border">
              <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Don&apos;t miss out on the latest tax updates, financial tips, and business insights. 
                Subscribe to our newsletter for expert advice delivered to your inbox.
              </p>
              <Link href="#newsletter" className="minimal-button-primary">
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <NewsletterSubscription />
    </div>
  );
}
