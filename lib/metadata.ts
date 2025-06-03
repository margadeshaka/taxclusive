import { Metadata } from "next";

// Base URL for the website
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.taxclusive.com";

// Default metadata values
const defaultMetadata: Metadata = {
  title: {
    default: "Taxclusive - Professional Chartered Accountancy Services",
    template: "%s | Taxclusive",
  },
  description:
    "Professional chartered accountancy firm providing comprehensive accounting, taxation, and financial advisory services with cultural expertise.",
  keywords:
    "chartered accountant, accounting services, tax planning, financial advisory, audit services, business consulting",
  authors: [{ name: "Taxclusive" }],
  creator: "Taxclusive",
  publisher: "Taxclusive",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "hi-IN": "/hi-IN",
    },
  },
  openGraph: {
    title: "Taxclusive - Professional Chartered Accountancy Services",
    description:
      "Professional chartered accountancy firm providing comprehensive accounting, taxation, and financial advisory services with cultural expertise.",
    url: baseUrl,
    siteName: "Taxclusive",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Taxclusive - Professional Chartered Accountancy Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxclusive - Professional Chartered Accountancy Services",
    description:
      "Professional chartered accountancy firm providing comprehensive accounting, taxation, and financial advisory services with cultural expertise.",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

/**
 * Generate metadata for a page
 * @param options - Options for generating metadata
 * @returns Metadata object
 */
export function generateMetadata(options?: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  canonical?: string;
  noIndex?: boolean;
}): Metadata {
  const metadata: Metadata = { ...defaultMetadata };

  if (options?.title) {
    metadata.title = options.title;
    if (metadata.openGraph) {
      metadata.openGraph.title = options.title;
    }
    if (metadata.twitter) {
      metadata.twitter.title = options.title;
    }
  }

  if (options?.description) {
    metadata.description = options.description;
    if (metadata.openGraph) {
      metadata.openGraph.description = options.description;
    }
    if (metadata.twitter) {
      metadata.twitter.description = options.description;
    }
  }

  if (options?.keywords) {
    metadata.keywords = options.keywords;
  }

  if (options?.image && metadata.openGraph) {
    metadata.openGraph.images = [
      {
        url: options.image,
        width: 1200,
        height: 630,
        alt: options.title || "Taxclusive",
      },
    ];

    if (metadata.twitter) {
      metadata.twitter.images = [options.image];
    }
  }

  if (options?.type && metadata.openGraph) {
    metadata.openGraph.type = options.type;
  }

  if (options?.canonical && metadata.alternates) {
    metadata.alternates.canonical = options.canonical;
  }

  if (options?.noIndex && metadata.robots) {
    metadata.robots.index = false;
  }

  return metadata;
}

/**
 * Generate JSON-LD structured data for a page
 * @param type - Type of structured data
 * @param data - Data for the structured data
 * @returns JSON-LD structured data as a string
 */
export function generateStructuredData(
  type: "Organization" | "AccountingService" | "Article" | "FAQPage" | "Service" | "Person",
  data: Record<string, any>
): string {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
  };

  return JSON.stringify({ ...baseData, ...data });
}
