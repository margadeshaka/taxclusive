/**
 * Comprehensive Website Configuration System
 * This file contains all configurable aspects of the website including:
 * - Theme and styling
 * - Content and copy
 * - Images and assets
 * - Business information
 * - Features and functionality
 */

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  success: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  warning: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  error: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
}

export interface ThemeConfiguration {
  name: string;
  colors: {
    light: ThemeColors & {
      background: string;
      foreground: string;
      card: string;
      cardForeground: string;
      popover: string;
      popoverForeground: string;
      muted: string;
      mutedForeground: string;
      border: string;
      input: string;
      ring: string;
    };
    dark: ThemeColors & {
      background: string;
      foreground: string;
      card: string;
      cardForeground: string;
      popover: string;
      popoverForeground: string;
      muted: string;
      mutedForeground: string;
      border: string;
      input: string;
      ring: string;
    };
  };
  fonts: {
    primary: {
      family: string;
      fallback: string[];
      weights: number[];
    };
    secondary: {
      family: string;
      fallback: string[];
      weights: number[];
    };
    mono: {
      family: string;
      fallback: string[];
      weights: number[];
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

// =============================================================================
// CONTENT CONFIGURATION
// =============================================================================

export interface ContentConfiguration {
  site: {
    name: string;
    tagline: string;
    description: string;
    keywords: string[];
    author: string;
    locale: string;
    language: string;
  };
  business: {
    legalName: string;
    displayName: string;
    description: string;
    foundingDate: string;
    numberOfEmployees: string;
    slogan: string;
    mission: string;
    vision: string;
    values: string[];

    // Contact Information
    contact: {
      phone: string;
      email: string;
      website: string;
      supportEmail: string;
      salesEmail: string;
    };

    // Address
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
      countryCode: string;
    };

    // Geographic coordinates
    geo: {
      latitude: number;
      longitude: number;
    };

    // Business hours
    openingHours: string[];
    timeZone: string;

    // Service areas
    serviceAreas: Array<{
      name: string;
      type: "city" | "state" | "country";
      radius?: number;
    }>;

    // Price range
    priceRange: string;

    // Payment methods
    paymentMethods: string[];

    // Social media
    socialMedia: {
      linkedin?: string;
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      whatsapp?: string;
    };

    // Ratings and reviews
    rating: {
      value: string;
      reviewCount: string;
      bestRating: string;
      worstRating: string;
    };

    // Professional credentials
    credentials: Array<{
      name: string;
      issuingOrganization: string;
      abbreviation?: string;
      url?: string;
    }>;

    // Industries served
    industries: string[];
  };

  // Page-specific content
  pages: {
    home: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
        primaryCta: {
          text: string;
          url: string;
        };
        secondaryCta: {
          text: string;
          url: string;
        };
        backgroundImage?: string;
        backgroundVideo?: string;
      };
      services: {
        title: string;
        subtitle: string;
        description: string;
        items: Array<{
          id: string;
          name: string;
          description: string;
          icon: string;
          features: string[];
          url: string;
        }>;
      };
      expertise: {
        title: string;
        subtitle: string;
        description: string;
        items: Array<{
          id: string;
          name: string;
          description: string;
          icon: string;
          url: string;
        }>;
      };
      testimonials: {
        title: string;
        subtitle: string;
        items: Array<{
          id: string;
          name: string;
          role: string;
          company: string;
          content: string;
          rating: number;
          avatar?: string;
        }>;
      };
      cta: {
        title: string;
        description: string;
        primaryButton: {
          text: string;
          url: string;
        };
        secondaryButton?: {
          text: string;
          url: string;
        };
      };
    };

    about: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
        image?: string;
      };
      story: {
        title: string;
        content: string;
        timeline?: Array<{
          year: string;
          title: string;
          description: string;
        }>;
      };
      team: {
        title: string;
        description: string;
        members: Array<{
          id: string;
          name: string;
          role: string;
          description: string;
          image?: string;
          qualifications: string[];
          experience: string;
          specialties: string[];
          social?: {
            linkedin?: string;
            email?: string;
          };
        }>;
      };
      values: {
        title: string;
        items: Array<{
          id: string;
          name: string;
          description: string;
          icon: string;
        }>;
      };
      achievements: {
        title: string;
        items: Array<{
          id: string;
          metric: string;
          label: string;
          description?: string;
        }>;
      };
    };

    services: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
      };
      categories: Array<{
        id: string;
        name: string;
        description: string;
        icon: string;
        services: Array<{
          id: string;
          name: string;
          description: string;
          features: string[];
          benefits: string[];
          process?: string[];
          pricing?: {
            type: "fixed" | "hourly" | "package" | "custom";
            amount?: string;
            description?: string;
          };
          deliverables?: string[];
          timeline?: string;
          requirements?: string[];
        }>;
      }>;
    };

    contact: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
      };
      form: {
        title: string;
        description: string;
        fields: Array<{
          id: string;
          type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "radio";
          label: string;
          placeholder?: string;
          required: boolean;
          options?: Array<{
            value: string;
            label: string;
          }>;
          validation?: {
            minLength?: number;
            maxLength?: number;
            pattern?: string;
            errorMessage?: string;
          };
        }>;
        submitButton: string;
        successMessage: string;
        errorMessage: string;
      };
      locations: Array<{
        id: string;
        name: string;
        address: string;
        phone?: string;
        email?: string;
        hours?: string[];
        coordinates?: {
          lat: number;
          lng: number;
        };
      }>;
    };

    faq: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
      };
      categories: Array<{
        id: string;
        name: string;
        description: string;
        questions: Array<{
          id: string;
          question: string;
          answer: string;
          helpful?: boolean;
        }>;
      }>;
    };
  };

  // Navigation
  navigation: {
    header: {
      logo: {
        text?: string;
        image?: string;
        width?: number;
        height?: number;
      };
      menu: Array<{
        id: string;
        label: string;
        url: string;
        external?: boolean;
        children?: Array<{
          id: string;
          label: string;
          url: string;
          description?: string;
          external?: boolean;
        }>;
      }>;
      cta?: {
        text: string;
        url: string;
        style: "primary" | "secondary" | "outline";
      };
    };

    footer: {
      description?: string;
      sections: Array<{
        id: string;
        title: string;
        links: Array<{
          id: string;
          label: string;
          url: string;
          external?: boolean;
        }>;
      }>;
      bottom: {
        copyright: string;
        links?: Array<{
          id: string;
          label: string;
          url: string;
        }>;
      };
    };
  };

  // SEO Configuration
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    keywords: string[];
    openGraph: {
      type: string;
      locale: string;
      siteName: string;
      images: Array<{
        url: string;
        width: number;
        height: number;
        alt: string;
      }>;
    };
    twitter: {
      card: string;
      site: string;
      creator: string;
    };
    verification: {
      google?: string;
      bing?: string;
      yandex?: string;
    };
  };
}

// =============================================================================
// ASSET CONFIGURATION
// =============================================================================

export interface AssetConfiguration {
  images: {
    logo: {
      main: string;
      favicon: string;
      appleTouchIcon: string;
      dark?: string;
      light?: string;
    };
    hero: {
      home: string;
      about?: string;
      services?: string;
      contact?: string;
    };
    backgrounds: {
      hero?: string;
      section?: string;
      footer?: string;
      pattern?: string;
    };
    placeholders: {
      avatar: string;
      team: string;
      service: string;
      blog: string;
      testimonial: string;
    };
    social: {
      ogImage: string;
      twitterImage: string;
    };
  };
  icons: {
    services: Record<string, string>;
    features: Record<string, string>;
    social: Record<string, string>;
    ui: Record<string, string>;
  };
  videos?: {
    hero?: string;
    testimonials?: string;
    backgrounds?: Record<string, string>;
  };
  documents: {
    brochure?: string;
    serviceGuide?: string;
    privacyPolicy?: string;
    termsOfService?: string;
  };
}

// =============================================================================
// FEATURE CONFIGURATION
// =============================================================================

export interface FeatureConfiguration {
  analytics: {
    googleAnalytics?: string;
    googleTagManager?: string;
    facebookPixel?: string;
    linkedInInsight?: string;
  };
  integrations: {
    crm?: {
      type: "hubspot" | "salesforce" | "pipedrive" | "custom";
      apiKey?: string;
      endpoint?: string;
    };
    email: {
      provider: "sendgrid" | "mailchimp" | "constant-contact" | "azure" | "custom";
      apiKey?: string;
      templates?: Record<string, string>;
    };
    calendar: {
      provider?: "calendly" | "acuity" | "custom";
      url?: string;
    };
    chat: {
      provider?: "intercom" | "zendesk" | "custom";
      id?: string;
    };
    maps: {
      provider: "google" | "mapbox" | "openstreetmap";
      apiKey?: string;
    };
  };
  features: {
    darkMode: boolean;
    multiLanguage: boolean;
    blog: boolean;
    testimonials: boolean;
    newsletter: boolean;
    search: boolean;
    breadcrumbs: boolean;
    progressIndicators: boolean;
    animations: boolean;
    lazyLoading: boolean;
    infiniteScroll: boolean;
    socialSharing: boolean;
    printFriendly: boolean;
    offline: boolean;
    pwa: boolean;
  };
  forms: {
    validation: "client" | "server" | "both";
    captcha: {
      enabled: boolean;
      provider?: "recaptcha" | "hcaptcha" | "turnstile";
      siteKey?: string;
    };
    honeypot: boolean;
    rateLimit: {
      enabled: boolean;
      requests?: number;
      window?: number; // in minutes
    };
  };
  performance: {
    lazyImages: boolean;
    preloadCritical: boolean;
    compression: boolean;
    caching: {
      staticAssets: number; // in seconds
      apiResponses: number;
    };
    cdn: {
      enabled: boolean;
      url?: string;
    };
  };
}

// =============================================================================
// MAIN CONFIGURATION INTERFACE
// =============================================================================

export interface WebsiteConfiguration {
  version: string;
  environment: "development" | "staging" | "production";
  lastUpdated: string;
  theme: ThemeConfiguration;
  content: ContentConfiguration;
  assets: AssetConfiguration;
  features: FeatureConfiguration;
}

// =============================================================================
// CONFIGURATION VALIDATION SCHEMA
// =============================================================================

export interface ConfigValidation {
  required: string[];
  optional: string[];
  deprecated: string[];
  validation: {
    [key: string]: {
      type: string;
      pattern?: string;
      min?: number;
      max?: number;
      enum?: string[];
    };
  };
}

// =============================================================================
// EXPORT TYPES
// =============================================================================

export type {
  ThemeColors,
  ThemeConfiguration,
  ContentConfiguration,
  AssetConfiguration,
  FeatureConfiguration,
  WebsiteConfiguration,
  ConfigValidation,
};

// Default export for easy importing
export default WebsiteConfiguration;
