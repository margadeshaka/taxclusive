import { Metadata } from "next"

// Default metadata for the blogs section
export const metadata: Metadata = {
  title: "Blogs - Taxclusive",
  description: "Read our latest blogs on taxation, accounting, and financial advisory services.",
}

// Note: For dynamic metadata based on blog ID, we would need to use generateMetadata
// However, since we're using client-side routing with query parameters instead of dynamic routes,
// we can't use generateMetadata effectively here.
// For a production app, you might want to implement client-side title updates using
// a library like next-seo or by updating document.title in the client component.

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
