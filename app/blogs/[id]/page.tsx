import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSubscription from "@/components/newsletter-subscription"
import { BlogDetail } from "../components/blog-detail"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // You can fetch the blog data here to generate dynamic metadata
    // For simplicity, we're using a static fallback
    return {
      title: "Blog Detail - Taxclusive",
      description: "Read our detailed blog on taxation, accounting, and financial advisory services.",
    }
  } catch (error) {
    return {
      title: "Blog - Taxclusive",
      description: "Read our blogs on taxation, accounting, and financial advisory services.",
    }
  }
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
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

              {/* This will be replaced with actual blog data from Strapi */}
              <BlogDetail id={params.id} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <NewsletterSubscription />
    </div>
  )
}
