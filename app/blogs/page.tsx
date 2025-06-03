"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Footer from "@/components/footer";
import Header from "@/components/header";
import NewsletterSubscription from "@/components/newsletter-subscription";

import { BlogDetail } from "./components/blog-detail";
import { BlogList } from "./components/blog-list";

export default function BlogsPage() {
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {!blogId ? (
          <>
            <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <div className="ethnic-divider">
                      <span className="text-primary font-serif px-4">Our Blogs</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl">
                      Insights & Knowledge
                    </h1>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Stay updated with the latest trends, insights, and expert advice on taxation,
                      accounting, and financial management.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <BlogList />
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="mx-auto max-w-3xl">
                <Link
                  href="/blogs"
                  className="mb-8 inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Blogs
                </Link>
                <BlogDetail id={blogId} />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <NewsletterSubscription />
    </div>
  );
}
