/**
 * Configuration Constants
 * Central location for all constants used throughout the configuration system
 */

// =============================================================================
// THEME CONSTANTS
// =============================================================================

export const THEME_CONSTANTS = {
  // Color scheme names
  SCHEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },

  // Color scale weights
  COLOR_WEIGHTS: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const,

  // Default color palette (Tailwind-inspired)
  DEFAULT_COLORS: {
    PRIMARY: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    SECONDARY: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },

  // Font weights
  FONT_WEIGHTS: {
    THIN: 100,
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
    EXTRABOLD: 800,
    BLACK: 900,
  },

  // Spacing scale
  SPACING_SCALE: {
    XS: '0.5rem',
    SM: '1rem',
    MD: '1.5rem',
    LG: '2rem',
    XL: '3rem',
    '2XL': '4rem',
    '3XL': '6rem',
    '4XL': '8rem',
  },

  // Border radius values
  BORDER_RADIUS: {
    NONE: '0',
    SM: '0.125rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    '2XL': '1rem',
    FULL: '9999px',
  },

  // Animation durations
  ANIMATION_DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },

  // Animation easing
  ANIMATION_EASING: {
    LINEAR: 'linear',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// =============================================================================
// CONTENT CONSTANTS
// =============================================================================

export const CONTENT_CONSTANTS = {
  // Supported languages
  LANGUAGES: {
    EN_IN: 'en-IN',
    HI_IN: 'hi-IN',
    EN_US: 'en-US',
  },

  // Page types
  PAGE_TYPES: {
    HOME: 'home',
    ABOUT: 'about',
    SERVICES: 'services',
    CONTACT: 'contact',
    BLOG: 'blog',
    FAQ: 'faq',
    EXPERTISE: 'expertise',
  },

  // Service categories
  SERVICE_CATEGORIES: {
    TAXATION: 'taxation',
    AUDIT: 'audit',
    ADVISORY: 'advisory',
    COMPLIANCE: 'compliance',
    REGISTRATION: 'registration',
  },

  // Industry types
  INDUSTRY_TYPES: {
    REAL_ESTATE: 'real-estate',
    TECHNOLOGY: 'technology',
    MANUFACTURING: 'manufacturing',
    HEALTHCARE: 'healthcare',
    RETAIL: 'retail',
    HOSPITALITY: 'hospitality',
    FINANCE: 'finance',
    EDUCATION: 'education',
    NONPROFIT: 'nonprofit',
  },

  // Service area types
  SERVICE_AREA_TYPES: {
    CITY: 'city',
    STATE: 'state',
    COUNTRY: 'country',
  },

  // Business hours format
  BUSINESS_HOURS: {
    DAYS: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    TIME_FORMAT: 'HH:mm',
  },

  // Payment methods
  PAYMENT_METHODS: {
    CASH: 'Cash',
    CREDIT_CARD: 'Credit Card',
    DEBIT_CARD: 'Debit Card',
    BANK_TRANSFER: 'Bank Transfer',
    UPI: 'UPI',
    NET_BANKING: 'Net Banking',
    CHEQUE: 'Cheque',
    WALLET: 'Digital Wallet',
  },

  // Social media platforms
  SOCIAL_PLATFORMS: {
    LINKEDIN: 'linkedin',
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    INSTAGRAM: 'instagram',
    YOUTUBE: 'youtube',
    WHATSAPP: 'whatsapp',
    TELEGRAM: 'telegram',
  },
} as const;

// =============================================================================
// ASSET CONSTANTS
// =============================================================================

export const ASSET_CONSTANTS = {
  // Image formats
  IMAGE_FORMATS: {
    PNG: 'png',
    JPG: 'jpg',
    JPEG: 'jpeg',
    WEBP: 'webp',
    AVIF: 'avif',
    SVG: 'svg',
  },

  // Supported image sizes
  IMAGE_SIZES: {
    THUMBNAIL: { width: 150, height: 150 },
    SMALL: { width: 300, height: 200 },
    MEDIUM: { width: 600, height: 400 },
    LARGE: { width: 1200, height: 800 },
    HERO: { width: 1920, height: 1080 },
  },

  // Icon types
  ICON_TYPES: {
    SERVICE: 'service',
    FEATURE: 'feature',
    SOCIAL: 'social',
    UI: 'ui',
    NAVIGATION: 'navigation',
  },

  // Document types
  DOCUMENT_TYPES: {
    PDF: 'pdf',
    DOC: 'doc',
    DOCX: 'docx',
    XLS: 'xls',
    XLSX: 'xlsx',
    PPT: 'ppt',
    PPTX: 'pptx',
  },

  // Asset directories
  DIRECTORIES: {
    IMAGES: '/images',
    ICONS: '/icons',
    DOCUMENTS: '/documents',
    VIDEOS: '/videos',
    ASSETS: '/assets',
  },
} as const;

// =============================================================================
// FEATURE CONSTANTS
// =============================================================================

export const FEATURE_CONSTANTS = {
  // Analytics providers
  ANALYTICS_PROVIDERS: {
    GOOGLE_ANALYTICS: 'google-analytics',
    GOOGLE_TAG_MANAGER: 'gtm',
    FACEBOOK_PIXEL: 'facebook-pixel',
    LINKEDIN_INSIGHT: 'linkedin-insight',
    MIXPANEL: 'mixpanel',
    HOTJAR: 'hotjar',
  },

  // Email providers
  EMAIL_PROVIDERS: {
    SENDGRID: 'sendgrid',
    MAILCHIMP: 'mailchimp',
    CONSTANT_CONTACT: 'constant-contact',
    AZURE: 'azure',
    AWS_SES: 'aws-ses',
    CUSTOM: 'custom',
  },

  // CRM providers
  CRM_PROVIDERS: {
    HUBSPOT: 'hubspot',
    SALESFORCE: 'salesforce',
    PIPEDRIVE: 'pipedrive',
    ZOHO: 'zoho',
    CUSTOM: 'custom',
  },

  // Calendar providers
  CALENDAR_PROVIDERS: {
    CALENDLY: 'calendly',
    ACUITY: 'acuity',
    CALENDULA: 'calendula',
    CUSTOM: 'custom',
  },

  // Chat providers
  CHAT_PROVIDERS: {
    INTERCOM: 'intercom',
    ZENDESK: 'zendesk',
    DRIFT: 'drift',
    CRISP: 'crisp',
    CUSTOM: 'custom',
  },

  // Map providers
  MAP_PROVIDERS: {
    GOOGLE: 'google',
    MAPBOX: 'mapbox',
    OPENSTREETMAP: 'openstreetmap',
    BING: 'bing',
  },

  // Form validation types
  FORM_VALIDATION: {
    CLIENT: 'client',
    SERVER: 'server',
    BOTH: 'both',
  },

  // CAPTCHA providers
  CAPTCHA_PROVIDERS: {
    RECAPTCHA: 'recaptcha',
    HCAPTCHA: 'hcaptcha',
    TURNSTILE: 'turnstile',
  },
} as const;

// =============================================================================
// SEO CONSTANTS
// =============================================================================

export const SEO_CONSTANTS = {
  // Meta tag types
  META_TYPES: {
    TITLE: 'title',
    DESCRIPTION: 'description',
    KEYWORDS: 'keywords',
    AUTHOR: 'author',
    VIEWPORT: 'viewport',
    ROBOTS: 'robots',
    CANONICAL: 'canonical',
  },

  // Open Graph types
  OG_TYPES: {
    WEBSITE: 'website',
    ARTICLE: 'article',
    PROFILE: 'profile',
    BUSINESS: 'business.business',
  },

  // Twitter card types
  TWITTER_CARD_TYPES: {
    SUMMARY: 'summary',
    SUMMARY_LARGE_IMAGE: 'summary_large_image',
    APP: 'app',
    PLAYER: 'player',
  },

  // Structured data types
  SCHEMA_TYPES: {
    ORGANIZATION: 'Organization',
    LOCAL_BUSINESS: 'LocalBusiness',
    PROFESSIONAL_SERVICE: 'ProfessionalService',
    ACCOUNTING_SERVICE: 'AccountingService',
    ARTICLE: 'Article',
    WEBPAGE: 'WebPage',
    WEBSITE: 'WebSite',
    FAQ_PAGE: 'FAQPage',
    SERVICE: 'Service',
    PERSON: 'Person',
    BREADCRUMB_LIST: 'BreadcrumbList',
  },

  // Sitemap change frequencies
  CHANGE_FREQUENCIES: {
    ALWAYS: 'always',
    HOURLY: 'hourly',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    NEVER: 'never',
  },

  // Default meta values
  DEFAULT_META: {
    ROBOTS: 'index,follow',
    VIEWPORT: 'width=device-width, initial-scale=1',
    CHARSET: 'utf-8',
  },
} as const;

// =============================================================================
// VALIDATION CONSTANTS
// =============================================================================

export const VALIDATION_CONSTANTS = {
  // Email regex pattern
  EMAIL_PATTERN: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  
  // Phone regex pattern (international)
  PHONE_PATTERN: '^[+]?[0-9]{10,15}$',
  
  // URL regex pattern
  URL_PATTERN: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&=]*)$',
  
  // Hex color pattern
  HEX_COLOR_PATTERN: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
  
  // Slug pattern
  SLUG_PATTERN: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  
  // File extension patterns
  FILE_PATTERNS: {
    IMAGE: '\\.(png|jpg|jpeg|gif|svg|webp|avif)$',
    DOCUMENT: '\\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$',
    VIDEO: '\\.(mp4|webm|ogg|mov|avi)$',
  },

  // String length limits
  LENGTH_LIMITS: {
    TITLE: { min: 1, max: 100 },
    DESCRIPTION: { min: 10, max: 500 },
    META_DESCRIPTION: { min: 120, max: 160 },
    SLUG: { min: 1, max: 50 },
    KEYWORD: { min: 2, max: 30 },
    PHONE: { min: 10, max: 15 },
    EMAIL: { min: 5, max: 100 },
  },

  // Numeric limits
  NUMERIC_LIMITS: {
    LATITUDE: { min: -90, max: 90 },
    LONGITUDE: { min: -180, max: 180 },
    RATING: { min: 1, max: 5 },
    PRIORITY: { min: 0, max: 1 },
    CACHE_DURATION: { min: 0, max: 31536000 }, // 1 year
  },
} as const;

// =============================================================================
// ENVIRONMENT CONSTANTS
// =============================================================================

export const ENVIRONMENT_CONSTANTS = {
  // Environment types
  ENVIRONMENTS: {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
    TEST: 'test',
  },

  // API endpoints (relative to base URL)
  API_ENDPOINTS: {
    CONFIG: '/api/config',
    CONTACT: '/api/contact',
    SUBSCRIBE: '/api/subscribe',
    SITEMAP: '/api/sitemap',
    HEALTH: '/api/health',
  },

  // Default ports
  DEFAULT_PORTS: {
    HTTP: 80,
    HTTPS: 443,
    DEVELOPMENT: 3000,
    PREVIEW: 3001,
  },
} as const;

// =============================================================================
// ACCESSIBILITY CONSTANTS
// =============================================================================

export const ACCESSIBILITY_CONSTANTS = {
  // WCAG contrast ratios
  CONTRAST_RATIOS: {
    AA_NORMAL: 4.5,
    AA_LARGE: 3,
    AAA_NORMAL: 7,
    AAA_LARGE: 4.5,
  },

  // ARIA roles
  ARIA_ROLES: {
    BUTTON: 'button',
    LINK: 'link',
    NAVIGATION: 'navigation',
    MAIN: 'main',
    BANNER: 'banner',
    CONTENTINFO: 'contentinfo',
    COMPLEMENTARY: 'complementary',
    REGION: 'region',
  },

  // Focus management
  FOCUS_MANAGEMENT: {
    SKIP_LINK_ID: 'skip-to-main',
    MAIN_CONTENT_ID: 'main-content',
    NAVIGATION_ID: 'main-navigation',
  },
} as const;

// =============================================================================
// PERFORMANCE CONSTANTS
// =============================================================================

export const PERFORMANCE_CONSTANTS = {
  // Cache durations (in seconds)
  CACHE_DURATION: {
    STATIC_ASSETS: 31536000, // 1 year
    IMAGES: 2592000, // 30 days
    API_RESPONSES: 300, // 5 minutes
    HTML_PAGES: 86400, // 1 day
  },

  // Image optimization
  IMAGE_OPTIMIZATION: {
    QUALITY: {
      HIGH: 90,
      MEDIUM: 75,
      LOW: 60,
    },
    FORMATS: ['avif', 'webp', 'jpg'],
    LAZY_LOAD_THRESHOLD: 100, // pixels
  },

  // Bundle size limits (in KB)
  BUNDLE_LIMITS: {
    CRITICAL_CSS: 15,
    INITIAL_JS: 200,
    TOTAL_JS: 500,
  },

  // Performance metrics thresholds
  PERFORMANCE_THRESHOLDS: {
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100, // First Input Delay (ms)
    CLS: 0.1, // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 600, // Time to First Byte (ms)
  },
} as const;

// =============================================================================
// EXPORT ALL CONSTANTS
// =============================================================================

export const WEBSITE_CONFIG_CONSTANTS = {
  THEME: THEME_CONSTANTS,
  CONTENT: CONTENT_CONSTANTS,
  ASSETS: ASSET_CONSTANTS,
  FEATURES: FEATURE_CONSTANTS,
  SEO: SEO_CONSTANTS,
  VALIDATION: VALIDATION_CONSTANTS,
  ENVIRONMENT: ENVIRONMENT_CONSTANTS,
  ACCESSIBILITY: ACCESSIBILITY_CONSTANTS,
  PERFORMANCE: PERFORMANCE_CONSTANTS,
} as const;

// Export individual constants for easier imports
// (Already exported above, removing duplicate exports)

// Export as default for convenience
export default WEBSITE_CONFIG_CONSTANTS;