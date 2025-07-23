/**
 * SEO Configuration for Taxclusive
 * Centralized SEO settings and constants
 */

export const SEO_CONFIG = {
  // Base URL
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.taxclusive.com',
  
  // Default site information
  site: {
    name: 'Taxclusive',
    title: 'Taxclusive - Expert Chartered Accountants in Gurugram',
    description: 'Leading Chartered Accountancy firm in Gurugram providing expert tax planning, GST compliance, audit services & financial advisory. 35+ years experience, 500+ clients.',
    keywords: 'chartered accountant gurugram, CA services, tax planning, GST compliance, audit services, financial advisory, business registration',
    author: 'Taxclusive Team',
    locale: 'en_IN',
    language: 'en-IN',
  },
  
  // Business information
  business: {
    name: 'Taxclusive - Chartered Accountants',
    legalName: 'Taxclusive Chartered Accountants LLP',
    description: 'Leading Chartered Accountancy firm in Gurugram providing expert CA services across India',
    foundingDate: '2010',
    numberOfEmployees: '25',
    slogan: 'Your Trusted Financial Partner',
    logo: '/logo.png',
    image: '/about.png',
    
    // Contact information
    contact: {
      phone: '+91-97739-79042',
      email: 'contact@taxclusive.com',
      website: 'https://www.taxclusive.com',
    },
    
    // Address
    address: {
      streetAddress: 'JMD Megapolis, Sector 48, Sohna Road',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122001',
      addressCountry: 'IN',
    },
    
    // Geographic coordinates
    geo: {
      latitude: 28.4089,
      longitude: 77.0378,
    },
    
    // Business hours
    openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-14:00'],
    
    // Service areas
    serviceAreas: [
      'Gurugram',
      'New Delhi', 
      'Noida',
      'Ghaziabad',
      'Faridabad',
      'Haryana',
      'Delhi NCR',
      'India'
    ],
    
    // Price range
    priceRange: '₹₹',
    
    // Payment methods
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Net Banking'],
    
    // Social media
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/taxclusive',
      facebook: 'https://www.facebook.com/taxclusive',
      twitter: 'https://twitter.com/taxclusive',
      instagram: 'https://www.instagram.com/taxclusive',
    },
    
    // Services offered
    services: [
      {
        name: 'Tax Planning and Preparation',
        description: 'Comprehensive tax planning and return filing services for individuals and businesses',
        url: '/services#tax-planning'
      },
      {
        name: 'GST Compliance and Returns',
        description: 'Complete GST registration, compliance, and return filing services',
        url: '/services#gst-compliance'
      },
      {
        name: 'Audit and Assurance Services',
        description: 'Independent audit and assurance services for enhanced financial credibility',
        url: '/services#audit-assurance'
      },
      {
        name: 'Business Registration and Compliance',
        description: 'Company incorporation, LLP registration, and regulatory compliance services',
        url: '/services#business-registration'
      },
      {
        name: 'Financial Advisory and Consulting',
        description: 'Strategic financial planning and business advisory services',
        url: '/services#financial-advisory'
      },
      {
        name: 'Bookkeeping and Accounting',
        description: 'Comprehensive bookkeeping and accounting services',
        url: '/services#bookkeeping'
      }
    ],
    
    // Industries served
    industries: [
      'Real Estate & Construction',
      'Technology & Startups',
      'Manufacturing & Distribution', 
      'Healthcare & Life Sciences',
      'Retail & E-commerce',
      'Nonprofit Organizations',
      'Professional Services',
      'Hospitality & Food Service',
      'Financial Services'
    ],
    
    // Ratings and reviews
    aggregateRating: {
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1'
    }
  },
  
  // Open Graph defaults
  openGraph: {
    type: 'website',
    siteName: 'Taxclusive',
    locale: 'en_IN',
    images: {
      default: '/images/og-image.jpg',
      width: 1200,
      height: 630
    }
  },
  
  // Twitter defaults
  twitter: {
    card: 'summary_large_image',
    site: '@taxclusive',
    creator: '@taxclusive'
  },
  
  // Robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification codes
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    bing: process.env.BING_SITE_VERIFICATION || '',
    yandex: process.env.YANDEX_SITE_VERIFICATION || '',
  },
  
  // Analytics
  analytics: {
    googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || '',
    googleTagManager: process.env.GOOGLE_TAG_MANAGER_ID || '',
  }
};

/**
 * Generate page-specific SEO configuration
 */
export function generatePageSEO(page: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
}) {
  const { site, baseUrl } = SEO_CONFIG;
  
  return {
    title: page.title ? `${page.title} | ${site.name}` : site.title,
    description: page.description || site.description,
    keywords: page.keywords || site.keywords,
    canonical: page.path ? `${baseUrl}${page.path}` : baseUrl,
    openGraph: {
      title: page.title || site.title,
      description: page.description || site.description,
      url: page.path ? `${baseUrl}${page.path}` : baseUrl,
      siteName: site.name,
      images: [{
        url: page.image || SEO_CONFIG.openGraph.images.default,
        width: SEO_CONFIG.openGraph.images.width,
        height: SEO_CONFIG.openGraph.images.height,
        alt: page.title || site.title,
      }],
      locale: site.locale,
      type: page.type || 'website',
    },
    twitter: {
      card: SEO_CONFIG.twitter.card,
      title: page.title || site.title,
      description: page.description || site.description,
      images: [page.image || SEO_CONFIG.openGraph.images.default],
      site: SEO_CONFIG.twitter.site,
      creator: SEO_CONFIG.twitter.creator,
    },
    robots: page.noIndex ? { index: false, follow: false } : SEO_CONFIG.robots,
  };
}

/**
 * Generate structured data for different page types
 */
export function generateStructuredDataConfig(type: 'organization' | 'localBusiness' | 'service' | 'faq' | 'article') {
  const { business } = SEO_CONFIG;
  
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type === 'organization' ? 'Organization' : 
             type === 'localBusiness' ? ['AccountingService', 'LocalBusiness'] :
             type === 'service' ? 'Service' :
             type === 'faq' ? 'FAQPage' : 'Article',
    name: business.name,
    url: business.contact.website,
    logo: business.logo,
    image: business.image,
    description: business.description,
  };
  
  if (type === 'localBusiness' || type === 'organization') {
    return {
      ...baseData,
      address: {
        '@type': 'PostalAddress',
        ...business.address,
      },
      geo: {
        '@type': 'GeoCoordinates',
        ...business.geo,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: business.contact.phone,
        email: business.contact.email,
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
      },
      openingHours: business.openingHours,
      priceRange: business.priceRange,
      paymentAccepted: business.paymentAccepted,
      areaServed: business.serviceAreas.map(area => ({
        '@type': area.includes('India') ? 'Country' : area.includes('Haryana') || area.includes('Delhi') ? 'State' : 'City',
        name: area
      })),
      sameAs: Object.values(business.socialMedia),
      aggregateRating: {
        '@type': 'AggregateRating',
        ...business.aggregateRating,
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Chartered Accountancy Services',
        itemListElement: business.services.map(service => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
            url: `${business.contact.website}${service.url}`
          }
        }))
      }
    };
  }
  
  return baseData;
}

export default SEO_CONFIG;