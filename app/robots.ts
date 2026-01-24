import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.taxclusive.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services/", "/blogs/", "/locations/", "/about", "/contact", "/faq", "/expertise", "/appointment", "/insights"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: ["AhrefsBot", "MJ12bot", "SemrushBot", "DotBot"],
        disallow: "/",
      },
      {
        userAgent: ["GPTBot", "Claude-Web", "CCBot"],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
