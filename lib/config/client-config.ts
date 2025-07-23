/**
 * Client-side Configuration
 * Simplified configuration system that works with client components
 */

// Simple configuration object that can be imported safely
export const clientConfig = {
  site: {
    name: 'Taxclusive',
    tagline: 'Your Trusted Financial Partner',
    description: 'Leading Chartered Accountancy firm in Gurugram providing expert tax planning, GST compliance, audit services & financial advisory. Trusted by 500+ clients across India.',
    language: 'en-IN',
  },
  
  business: {
    legalName: 'Taxclusive Chartered Accountants LLP',
    displayName: 'Taxclusive',
    phone: '+91-97739-79042',
    email: 'contact@taxclusive.com',
    website: 'https://www.taxclusive.com',
    address: {
      streetAddress: 'JMD Megapolis, Sector 48, Sohna Road',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122001',
      country: 'India',
    },
  },
  
  assets: {
    logo: {
      main: '/logo.png',
      favicon: '/favicon.ico',
      appleTouchIcon: '/apple-touch-icon.png',
      width: 250,
      height: 100,
    },
  },
  
  navigation: {
    header: {
      logo: {
        text: 'Taxclusive',
        image: '/logo.png',
        width: 250,
        height: 100,
      },
      menu: [
        { id: 'home', label: 'Home', url: '/' },
        { id: 'about', label: 'About', url: '/about' },
        { id: 'services', label: 'Services', url: '/services' },
        { id: 'expertise', label: 'Expertise', url: '/expertise' },
        { id: 'blogs', label: 'Insights', url: '/blogs' },
        { id: 'faq', label: 'FAQ', url: '/faq' },
        { id: 'contact', label: 'Contact', url: '/contact' },
      ],
      cta: {
        text: 'Book Consultation',
        url: '/contact',
        style: 'primary' as const,
      },
    },
  },
  
  theme: {
    fonts: {
      primary: { family: 'Poppins', weights: [400, 500, 600, 700] },
      secondary: { family: 'Playfair Display', weights: [400, 500, 600, 700] },
    },
  },
} as const;

export type ClientConfig = typeof clientConfig;