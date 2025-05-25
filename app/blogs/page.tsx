import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSubscription from "@/components/newsletter-subscription"
import { BlogList } from "./components/blog-list"

export const metadata: Metadata = {
  title: "Blogs - Taxclusive",
  description: "Read our latest blogs on taxation, accounting, and financial advisory services.",
}

export default function BlogsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
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
                  Stay updated with the latest trends, insights, and expert advice on taxation, accounting, and financial management.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* This will be replaced with actual blog data from Strapi */}
              <BlogList />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <NewsletterSubscription />
    </div>
  )
}

