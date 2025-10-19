/**
 * Local SEO optimizations for Delhi NCR region
 * Enhanced structured data and location-specific content
 */

import { SEO_CONFIG } from "./seo-config";

/**
 * Generate comprehensive local business structured data
 */
export function generateLocalBusinessStructuredData(): string {
  const business = SEO_CONFIG.business;

  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": ["AccountingService", "LocalBusiness", "ProfessionalService", "FinancialService"],
      "@id": `${business.contact.website}#organization`,
      name: business.name,
      legalName: business.legalName,
      alternateName: [
        "Taxclusive Tax Services",
        "Taxclusive Financial Services Delhi NCR",
        "Best Tax Firm in Gurugram",
        "Top Tax Consultant Delhi",
      ],
      url: business.contact.website,
      logo: {
        "@type": "ImageObject",
        "@id": `${business.contact.website}#logo`,
        url: `${SEO_CONFIG.baseUrl}${business.logo}`,
        contentUrl: `${SEO_CONFIG.baseUrl}${business.logo}`,
        width: 400,
        height: 400,
        caption: business.name,
      },
      image: [
        {
          "@type": "ImageObject",
          url: `${SEO_CONFIG.baseUrl}${business.image}`,
          width: 1200,
          height: 630,
          caption: "Taxclusive Office in Gurugram",
        },
      ],
      description: business.description,
      slogan: business.slogan,
      foundingDate: business.foundingDate,
      numberOfEmployees: business.numberOfEmployees,

      // Enhanced address with local landmarks
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address.streetAddress,
        addressLocality: business.address.addressLocality,
        addressRegion: business.address.addressRegion,
        postalCode: business.address.postalCode,
        addressCountry: business.address.addressCountry,
        areaServed: business.serviceAreas,
      },

      // Precise geo-coordinates for Gurugram location
      geo: {
        "@type": "GeoCoordinates",
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },

      // Multiple contact points for different services
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: business.contact.phone,
          contactType: "customer service",
          areaServed: ["IN", "Delhi", "Haryana", "Uttar Pradesh"],
          availableLanguage: ["English", "Hindi"],
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
            validFrom: "2024-01-01",
            validThrough: "2025-12-31",
          },
        },
        {
          "@type": "ContactPoint",
          email: business.contact.email,
          contactType: "business inquiries",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
        {
          "@type": "ContactPoint",
          url: `${business.contact.website}/appointment`,
          contactType: "appointment booking",
          areaServed: business.serviceAreas,
        },
      ],

      // Detailed opening hours
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "14:00",
        },
      ],

      // Extensive service area coverage
      areaServed: business.serviceAreas.map((area) => {
        if (area.includes("India")) {
          return { "@type": "Country", name: area };
        } else if (["Haryana", "Delhi", "Uttar Pradesh"].some((state) => area.includes(state))) {
          return { "@type": "State", name: area };
        } else {
          return { "@type": "City", name: area };
        }
      }),

      // Service radius for local SEO
      serviceArea: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: business.geo.latitude,
          longitude: business.geo.longitude,
        },
        geoRadius: "50000", // 50km radius covering Delhi NCR
      },

      // Payment and pricing information
      priceRange: business.priceRange,
      paymentAccepted: business.paymentAccepted,
      currenciesAccepted: "INR",

      // Social media presence
      sameAs: Object.values(business.socialMedia),

      // Professional credentials
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional Certification",
          recognizedBy: {
            "@type": "Organization",
            name: "Professional Tax Services Association",
            abbreviation: "PTSA",
            url: "https://taxclusive.com",
          },
        },
      ],

      // Service catalog with local keywords
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Tax and Financial Services in Delhi NCR",
        itemListElement: business.services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${service.name} in Delhi NCR`,
            description: service.description,
            url: `${business.contact.website}${service.url}`,
            areaServed: business.serviceAreas,
            provider: {
              "@type": "Organization",
              name: business.name,
            },
          },
          availability: "InStock",
          priceRange: business.priceRange,
        })),
      },

      // Industry specializations
      knowsAbout: business.industries,

      // Awards and recognition (example - customize as needed)
      award: [
        "Best Tax Firm in Gurugram 2023",
        "Excellence in Tax Planning Services",
        "Top Rated Financial Advisory Firm Delhi NCR",
      ],

      // Client testimonials aggregate
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: business.aggregateRating.ratingValue,
        reviewCount: business.aggregateRating.reviewCount,
        bestRating: business.aggregateRating.bestRating,
        worstRating: business.aggregateRating.worstRating,
      },

      // Organization member of professional bodies
      memberOf: [
        {
          "@type": "Organization",
          name: "Federation of Indian Chambers of Commerce & Industry",
          url: "https://ficci.in",
        },
        {
          "@type": "Organization",
          name: "Professional Tax Services Network",
          url: "https://taxclusive.com",
        },
      ],

      // Parent organization (if applicable)
      parentOrganization: {
        "@type": "Organization",
        name: business.legalName,
        legalName: business.legalName,
      },
    },
    null,
    2
  );
}

/**
 * Generate local service page structured data
 */
export function generateLocalServiceStructuredData(serviceDetails: {
  serviceName: string;
  serviceDescription: string;
  serviceUrl: string;
  locations?: string[];
}): string {
  const business = SEO_CONFIG.business;
  const locations = serviceDetails.locations || business.serviceAreas.slice(0, 10);

  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${serviceDetails.serviceName} in Delhi NCR`,
      description: serviceDetails.serviceDescription,
      url: `${business.contact.website}${serviceDetails.serviceUrl}`,
      provider: {
        "@type": ["AccountingService", "LocalBusiness"],
        name: business.name,
        url: business.contact.website,
        telephone: business.contact.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: business.address.streetAddress,
          addressLocality: business.address.addressLocality,
          addressRegion: business.address.addressRegion,
          postalCode: business.address.postalCode,
          addressCountry: business.address.addressCountry,
        },
      },
      areaServed: locations.map((location) => ({
        "@type": "City",
        name: location,
      })),
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${business.contact.website}${serviceDetails.serviceUrl}`,
        servicePhone: business.contact.phone,
        serviceSmsNumber: business.contact.phone,
      },
      category: "Professional Services",
      serviceType: "Tax and Financial Services",
      priceRange: business.priceRange,
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
    null,
    2
  );
}

/**
 * Generate FAQ structured data for local queries
 */
export function generateLocalFAQStructuredData(): string {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which areas in Delhi NCR do you serve?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We provide tax and financial services across Delhi NCR including Gurugram, New Delhi, Noida, Ghaziabad, Faridabad, Greater Noida, Manesar, and surrounding areas. Our main office is located in Gurugram with easy access from all NCR locations.",
          },
        },
        {
          "@type": "Question",
          name: "Do you provide tax services in Gurugram?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we are based in Gurugram and provide comprehensive tax and financial services including tax planning, GST compliance, audit services, and financial advisory to businesses and individuals in Gurugram and surrounding areas.",
          },
        },
        {
          "@type": "Question",
          name: "What are your office timings in Gurugram?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our Gurugram office is open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM. We also offer appointment-based consultations outside regular hours for urgent matters.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer online consultations for clients in Delhi NCR?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we provide both in-person and online consultations for clients across Delhi NCR. Our digital platform allows secure document sharing and virtual meetings for your convenience.",
          },
        },
        {
          "@type": "Question",
          name: "What makes you the best tax firm in Delhi NCR?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "With 35+ years of experience, 500+ satisfied clients, and deep expertise in Delhi NCR business landscape, we provide personalized service, timely compliance, and strategic tax planning. Our local presence and understanding of regional business challenges sets us apart.",
          },
        },
      ],
    },
    null,
    2
  );
}

/**
 * Generate location-specific breadcrumb structured data
 */
export function generateLocationBreadcrumbs(currentPage: string, location?: string): string {
  const business = SEO_CONFIG.business;
  const breadcrumbs = [
    { name: "Home", url: business.contact.website },
    { name: "Services", url: `${business.contact.website}/services` },
  ];

  if (location) {
    breadcrumbs.push({
      name: `Services in ${location}`,
      url: `${business.contact.website}/services?location=${location.toLowerCase()}`,
    });
  }

  breadcrumbs.push({
    name: currentPage,
    url: `${business.contact.website}/${currentPage.toLowerCase()}`,
  });

  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    },
    null,
    2
  );
}
