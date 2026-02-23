import { Metadata } from "next";

import { SEO_CONFIG } from "./seo-config";

// Base URL for the website
const baseUrl = SEO_CONFIG.baseUrl;

// Enhanced default metadata using SEO config
const defaultMetadata: Metadata = {
  title: {
    default: SEO_CONFIG.site.title,
    template: "%s | Taxclusive - Professional Tax & Financial Services",
  },
  description: SEO_CONFIG.site.description,
  keywords: [
    "tax services gurugram",
    "financial services delhi ncr",
    "tax planning gurugram",
    "GST compliance delhi",
    "audit services noida",
    "financial advisory ghaziabad",
    "business registration faridabad",
    "tax consultant delhi",
    "financial services gurugram",
    "tax consultant near me",
    "income tax return filing",
    "GST registration delhi ncr",
    "company incorporation gurugram",
    "tax planning strategies",
    "business advisory delhi",
    "audit and assurance",
    "tax consultant gurgaon",
    "best tax firm in gurugram",
    "top tax consultant delhi ncr",
    "tax services haryana",
    "tax consultant delhi",
    "tax planning services noida",
    "GST filing ghaziabad",
    "audit services faridabad",
    "financial consultant gurugram",
    "financial services delhi ncr",
    "tax advisory gurugram",
    "tax firm haryana",
    "tax consultant near me",
    "business consultant gurugram",
    "tax compliance delhi",
    "GST consultant ncr",
    "income tax gurugram",
    "tax services sohna road",
    "financial services sector 48",
    "tax expert delhi ncr",
  ].join(", "),
  authors: [{ name: SEO_CONFIG.site.author }],
  creator: SEO_CONFIG.site.name,
  publisher: SEO_CONFIG.site.name,
  category: "Professional Services",

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
      "en-IN": "/",
      "hi-IN": "/hi",
    },
  },

  openGraph: {
    title: SEO_CONFIG.site.title,
    description: SEO_CONFIG.site.description,
    url: baseUrl,
    siteName: SEO_CONFIG.site.name,
    images: [
      {
        url: SEO_CONFIG.openGraph.images.default,
        width: SEO_CONFIG.openGraph.images.width,
        height: SEO_CONFIG.openGraph.images.height,
        alt: "Taxclusive - Expert Tax & Financial Services in Gurugram",
      },
    ],
    locale: SEO_CONFIG.openGraph.locale,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Taxclusive - Expert Tax & Financial Services | Tax Planning",
    description:
      "Leading tax and financial services firm in Gurugram. Expert tax planning, GST compliance, audit & financial advisory services. Trusted by 500+ clients.",
    images: ["/images/twitter-image.jpg"],
    site: SEO_CONFIG.twitter.site,
    creator: SEO_CONFIG.twitter.creator,
  },

  robots: {
    index: SEO_CONFIG.robots.index,
    follow: SEO_CONFIG.robots.follow,
    googleBot: {
      index: SEO_CONFIG.robots.googleBot.index,
      follow: SEO_CONFIG.robots.googleBot.follow,
      "max-video-preview": SEO_CONFIG.robots.googleBot["max-video-preview"],
      "max-image-preview": "large",
      "max-snippet": SEO_CONFIG.robots.googleBot["max-snippet"],
    },
  },

  verification: SEO_CONFIG.verification,

  // Additional SEO enhancements
  applicationName: SEO_CONFIG.site.name,
  referrer: "origin-when-cross-origin",
};

/**
 * Generate enhanced metadata for a page with comprehensive SEO optimization
 * @param options - Options for generating metadata
 * @returns Enhanced Metadata object
 */
export function generateMetadata(options?: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "profile" | "service";
  canonical?: string;
  noIndex?: boolean;
  alternates?: Record<string, string>;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  breadcrumbs?: { name: string; url: string }[];
}): Metadata {
  const metadata: Metadata = { ...defaultMetadata };
  type OpenGraphType = "website" | "article" | "profile";

  // Enhanced title handling
  if (options?.title) {
    metadata.title = options.title;
    if (metadata.openGraph) {
      metadata.openGraph.title = options.title;
    }
    if (metadata.twitter) {
      metadata.twitter.title =
        options.title.length > 70 ? options.title.substring(0, 67) + "..." : options.title;
    }
  }

  // Enhanced description handling
  if (options?.description) {
    metadata.description = options.description;
    if (metadata.openGraph) {
      metadata.openGraph.description = options.description;
    }
    if (metadata.twitter) {
      metadata.twitter.description =
        options.description.length > 200
          ? options.description.substring(0, 197) + "..."
          : options.description;
    }
  }

  // Enhanced keywords handling
  if (options?.keywords) {
    const existingKeywords = (metadata.keywords as string).split(", ");
    const combinedKeywords = [...new Set([...existingKeywords, ...options.keywords])];
    metadata.keywords = combinedKeywords.join(", ");
  }

  // Enhanced image handling
  if (options?.image && metadata.openGraph) {
    metadata.openGraph.images = [
      {
        url: options.image,
        width: 1200,
        height: 630,
        alt: options.title || "Taxclusive - Expert Tax & Financial Services",
      },
    ];

    if (metadata.twitter) {
      metadata.twitter.images = [options.image];
    }
  }

  // Enhanced OpenGraph for articles
  if (options?.type === "article" && metadata.openGraph) {
    const openGraphWithType = metadata.openGraph as NonNullable<Metadata["openGraph"]> & {
      type?: OpenGraphType;
    };
    openGraphWithType.type = "article";
    const openGraphExtended = metadata.openGraph as Record<string, unknown>;
    if (options.publishedTime) {
      openGraphExtended.publishedTime = options.publishedTime;
    }
    if (options.modifiedTime) {
      openGraphExtended.modifiedTime = options.modifiedTime;
    }
    if (options.author) {
      openGraphExtended.authors = [options.author];
    }
    if (options.section) {
      openGraphExtended.section = options.section;
    }
  } else if (options?.type && metadata.openGraph) {
    const openGraphWithType = metadata.openGraph as NonNullable<Metadata["openGraph"]> & {
      type?: OpenGraphType;
    };
    openGraphWithType.type = options.type === "service" ? "website" : options.type;
  }

  // Enhanced canonical and alternates handling
  if (options?.canonical && metadata.alternates) {
    metadata.alternates.canonical = options.canonical;
  }

  if (options?.alternates && metadata.alternates) {
    metadata.alternates.languages = { ...metadata.alternates.languages, ...options.alternates };
  }

  // Enhanced robots handling
  if (options?.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    };
  }

  // Add author information
  if (options?.author) {
    metadata.authors = [{ name: options.author }];
  }

  // Add category for articles
  if (options?.section) {
    metadata.category = options.section;
  }

  return metadata;
}

/**
 * Generate comprehensive JSON-LD structured data for different page types
 * @param type - Type of structured data
 * @param data - Data for the structured data
 * @returns JSON-LD structured data as a string
 */
export function generateStructuredData(
  type:
    | "Organization"
    | "AccountingService"
    | "Article"
    | "FAQPage"
    | "Service"
    | "Person"
    | "LocalBusiness"
    | "BreadcrumbList"
    | "WebPage",
  data: Record<string, unknown>
): string {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
  };

  return JSON.stringify({ ...baseData, ...data }, null, 2);
}

/**
 * Generate enhanced business structured data using SEO config
 * @returns JSON-LD structured data for the business
 */
export function generateBusinessStructuredData(): string {
  const business = SEO_CONFIG.business;

  return generateStructuredData("AccountingService", {
    "@type": ["AccountingService", "ProfessionalService", "LocalBusiness"],
    name: business.name,
    legalName: business.legalName,
    url: business.contact.website,
    logo: business.logo,
    image: business.image,
    description: business.description,
    slogan: business.slogan,
    foundingDate: business.foundingDate,
    numberOfEmployees: business.numberOfEmployees,

    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },

    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: business.contact.phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        email: business.contact.email,
        contactType: "business inquiries",
        areaServed: "IN",
      },
    ],

    openingHours: business.openingHours,
    priceRange: business.priceRange,
    paymentAccepted: business.paymentAccepted,

    areaServed: business.serviceAreas.map((area) => ({
      "@type": area.includes("India")
        ? "Country"
        : area.includes("Haryana") || area.includes("Delhi")
          ? "State"
          : "City",
      name: area,
    })),

    sameAs: Object.values(business.socialMedia),

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.aggregateRating.ratingValue,
      reviewCount: business.aggregateRating.reviewCount,
      bestRating: business.aggregateRating.bestRating,
      worstRating: business.aggregateRating.worstRating,
    },

    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tax and Financial Services",
      itemListElement: business.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          url: `${business.contact.website}${service.url}`,
        },
      })),
    },

    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Professional Certification",
      recognizedBy: {
        "@type": "Organization",
        name: "Professional Tax Services Association",
        abbreviation: "PTSA",
      },
    },

    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
      geoRadius: "500000", // 500km radius
    },

    knowsAbout: business.industries,
  });
}

/**
 * Generate FAQ structured data
 * @param faqs - Array of FAQ objects
 * @returns JSON-LD structured data for FAQ page
 */
export function generateFAQStructuredData(faqs: { question: string; answer: string }[]): string {
  return generateStructuredData("FAQPage", {
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
}

/**
 * Generate Service structured data
 * @param service - Service information
 * @returns JSON-LD structured data for service
 */
export function generateServiceStructuredData(service: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string[];
  offers?: { name: string; description: string; price?: string }[];
}): string {
  const business = SEO_CONFIG.business;

  return generateStructuredData("Service", {
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: service.provider || business.name,
      url: business.contact.website,
    },
    areaServed:
      service.areaServed ||
      business.serviceAreas.map((area) => ({
        "@type": "City",
        name: area,
      })),
    offers: service.offers?.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      description: offer.description,
      ...(offer.price && { price: offer.price }),
    })),
  });
}

/**
 * Generate Breadcrumb structured data
 * @param breadcrumbs - Array of breadcrumb items
 * @returns JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: { name: string; url: string }[]
): string {
  return generateStructuredData("BreadcrumbList", {
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  });
}

/**
 * Generate Article structured data for blog posts
 * @param article - Article information
 * @returns JSON-LD structured data for article
 */
export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  url: string;
  section?: string;
}): string {
  const site = SEO_CONFIG.site;
  const business = SEO_CONFIG.business;

  return generateStructuredData("Article", {
    headline: article.title,
    description: article.description,
    image: article.image
      ? `${SEO_CONFIG.baseUrl}${article.image}`
      : `${SEO_CONFIG.baseUrl}/images/blog-default.jpg`,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${SEO_CONFIG.baseUrl}${business.logo}`,
      },
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    url: article.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    ...(article.section && { articleSection: article.section }),
  });
}

/**
 * Generate WebPage structured data
 * @param page - Page information
 * @returns JSON-LD structured data for webpage
 */
export function generateWebPageStructuredData(page: {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: { name: string; url: string }[];
}): string {
  const business = SEO_CONFIG.business;

  const webPageData: Record<string, unknown> = {
    name: page.name,
    description: page.description,
    url: page.url,
    isPartOf: {
      "@type": "WebSite",
      name: business.name,
      url: business.contact.website,
    },
    about: {
      "@type": "Organization",
      name: business.name,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SEO_CONFIG.baseUrl}/images/og-image.jpg`,
    },
  };

  if (page.breadcrumbs && page.breadcrumbs.length > 0) {
    webPageData.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: page.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  return generateStructuredData("WebPage", webPageData);
}
