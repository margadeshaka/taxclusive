export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  language: string;
  locale: string;
  currency: string;
  timezone: string;
  themeColor: string;
}

export interface CompanyConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  foundedYear: number;
  registrationNumber?: string;
  taxId?: string;
}

export interface ContactConfig {
  email: string;
  phone: string;
  alternatePhone?: string;
  whatsapp?: string;
  address: AddressConfig;
  hours: BusinessHours;
}

export interface AddressConfig {
  street: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface BusinessHours {
  weekdays: string;
  saturday: string;
  sunday: string;
  holidays?: string;
}

export interface SocialMediaConfig {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface AssetConfig {
  logo: {
    light: string;
    dark: string;
    favicon: string;
    appleTouchIcon: string;
  };
  images: {
    hero: string;
    about: string;
    services: string;
    contact: string;
    [key: string]: string;
  };
}

export interface FeatureFlags {
  newsletter: boolean;
  blog: boolean;
  appointments: boolean;
  liveChat: boolean;
  testimonials: boolean;
  faq: boolean;
  contactForm: boolean;
  queryForm: boolean;
  careers: boolean;
  [key: string]: boolean;
}

export interface SEOConfig {
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
    handle: string;
    site: string;
    cardType: string;
  };
}

export interface ClientConfig {
  site: SiteConfig;
  company: CompanyConfig;
  contact: ContactConfig;
  social: SocialMediaConfig;
  assets: AssetConfig;
  features: FeatureFlags;
  seo: SEOConfig;
}