import { Metadata } from "next";
import Script from "next/script";

import { generateMetadata, generateStructuredData } from "@/lib/metadata";

// Default metadata for the blogs section
export const metadata: Metadata = generateMetadata({
  title: "Blogs & Insights | Taxclusive",
  description:
    "Stay updated with the latest trends, insights, and expert advice on taxation, accounting, and financial management.",
  keywords:
    "tax blogs, accounting insights, financial management, tax planning tips, business finance, tax updates",
  canonical: "/blogs",
  type: "article",
});

// Note: For dynamic metadata based on blog ID, we would need to use generateMetadata
// However, since we're using client-side routing with query parameters instead of dynamic routes,
// we can't use generateMetadata effectively here.
// For a production app, you might want to implement client-side title updates using
// a library like next-seo or by updating document.title in the client component.

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      {/* Blog section specific structured data */}
      <Script id="blog-schema-org" type="application/ld+json">
        {generateStructuredData("Article", {
          headline: "Blogs & Insights | Taxclusive",
          description:
            "Stay updated with the latest trends, insights, and expert advice on taxation, accounting, and financial management.",
          image: "https://www.taxclusive.com/images/blog-header.jpg",
          datePublished: "2024-01-01T00:00:00.000Z",
          dateModified: "2024-01-01T00:00:00.000Z",
          author: {
            "@type": "Organization",
            name: "Taxclusive",
            url: "https://www.taxclusive.com",
          },
          publisher: {
            "@type": "Organization",
            name: "Taxclusive",
            logo: {
              "@type": "ImageObject",
              url: "https://www.taxclusive.com/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://www.taxclusive.com/blogs",
          },
        })}
      </Script>
    </>
  );
}
