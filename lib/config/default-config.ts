/**
 * Default Website Configuration for Taxclusive
 * This contains all the default values that can be customized
 */

import { WebsiteConfiguration } from "./website-config";

export const defaultConfig: WebsiteConfiguration = {
  version: "1.0.0",
  environment: "production",
  lastUpdated: new Date().toISOString(),

  // =============================================================================
  // THEME CONFIGURATION
  // =============================================================================
  theme: {
    name: "Taxclusive Professional",
    colors: {
      light: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        accent: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
        },
        neutral: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        background: "#ffffff",
        foreground: "#0f172a",
        card: "#ffffff",
        cardForeground: "#0f172a",
        popover: "#ffffff",
        popoverForeground: "#0f172a",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        border: "#e2e8f0",
        input: "#ffffff",
        ring: "#0ea5e9",
      },
      dark: {
        primary: {
          50: "#082f49",
          100: "#0c4a6e",
          200: "#075985",
          300: "#0369a1",
          400: "#0284c7",
          500: "#0ea5e9",
          600: "#38bdf8",
          700: "#7dd3fc",
          800: "#bae6fd",
          900: "#e0f2fe",
          950: "#f0f9ff",
        },
        secondary: {
          50: "#020617",
          100: "#0f172a",
          200: "#1e293b",
          300: "#334155",
          400: "#475569",
          500: "#64748b",
          600: "#94a3b8",
          700: "#cbd5e1",
          800: "#e2e8f0",
          900: "#f1f5f9",
          950: "#f8fafc",
        },
        accent: {
          50: "#422006",
          100: "#713f12",
          200: "#854d0e",
          300: "#a16207",
          400: "#ca8a04",
          500: "#eab308",
          600: "#facc15",
          700: "#fde047",
          800: "#fef08a",
          900: "#fef9c3",
          950: "#fefce8",
        },
        neutral: {
          50: "#09090b",
          100: "#18181b",
          200: "#27272a",
          300: "#3f3f46",
          400: "#52525b",
          500: "#71717a",
          600: "#a1a1aa",
          700: "#d4d4d8",
          800: "#e4e4e7",
          900: "#f4f4f5",
          950: "#fafafa",
        },
        success: {
          50: "#052e16",
          100: "#14532d",
          200: "#166534",
          300: "#15803d",
          400: "#16a34a",
          500: "#22c55e",
          600: "#4ade80",
          700: "#86efac",
          800: "#bbf7d0",
          900: "#dcfce7",
          950: "#f0fdf4",
        },
        warning: {
          50: "#451a03",
          100: "#78350f",
          200: "#92400e",
          300: "#b45309",
          400: "#d97706",
          500: "#f59e0b",
          600: "#fbbf24",
          700: "#fcd34d",
          800: "#fde68a",
          900: "#fef3c7",
          950: "#fffbeb",
        },
        error: {
          50: "#450a0a",
          100: "#7f1d1d",
          200: "#991b1b",
          300: "#b91c1c",
          400: "#dc2626",
          500: "#ef4444",
          600: "#f87171",
          700: "#fca5a5",
          800: "#fecaca",
          900: "#fee2e2",
          950: "#fef2f2",
        },
        background: "#0f172a",
        foreground: "#f8fafc",
        card: "#1e293b",
        cardForeground: "#f8fafc",
        popover: "#1e293b",
        popoverForeground: "#f8fafc",
        muted: "#334155",
        mutedForeground: "#94a3b8",
        border: "#334155",
        input: "#1e293b",
        ring: "#0ea5e9",
      },
    },
    fonts: {
      primary: {
        family: "Poppins",
        fallback: ["system-ui", "sans-serif"],
        weights: [400, 500, 600, 700],
      },
      secondary: {
        family: "Playfair Display",
        fallback: ["Georgia", "serif"],
        weights: [400, 500, 600, 700],
      },
      mono: {
        family: "JetBrains Mono",
        fallback: ["monospace"],
        weights: [400, 500, 600],
      },
    },
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
      "2xl": "4rem",
      "3xl": "6rem",
      "4xl": "8rem",
    },
    borderRadius: {
      sm: "0.125rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
    animations: {
      duration: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
      },
      easing: {
        linear: "linear",
        easeIn: "cubic-bezier(0.4, 0, 1, 1)",
        easeOut: "cubic-bezier(0, 0, 0.2, 1)",
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },

  // =============================================================================
  // CONTENT CONFIGURATION
  // =============================================================================
  content: {
    site: {
      name: "Taxclusive",
      tagline: "Your Trusted Financial Partner",
      description:
        "Leading Chartered Accountancy firm in Gurugram providing expert tax planning, GST compliance, audit services & financial advisory. Trusted by 500+ clients across India.",
      keywords: [
        "chartered accountant gurugram",
        "CA services",
        "tax planning",
        "GST compliance",
        "audit services",
        "financial advisory",
        "business registration",
        "tax consultant",
        "accounting firm gurugram",
      ],
      author: "Taxclusive Team",
      locale: "en_IN",
      language: "en-IN",
    },

    business: {
      legalName: "Taxclusive Chartered Accountants LLP",
      displayName: "Taxclusive",
      description:
        "Leading Chartered Accountancy firm in Gurugram providing expert CA services across India",
      foundingDate: "2010",
      numberOfEmployees: "25",
      slogan: "Your Trusted Financial Partner",
      mission:
        "To provide exceptional financial and tax advisory services that empower businesses and individuals to achieve their financial goals through expert guidance, innovative solutions, and unwavering integrity.",
      vision:
        "To be the most trusted and preferred chartered accountancy firm in India, recognized for our expertise, client-centric approach, and contribution to the financial success of our clients.",
      values: [
        "Integrity and Ethics",
        "Client-First Approach",
        "Professional Excellence",
        "Continuous Innovation",
        "Transparency in Communication",
        "Timely Delivery",
      ],

      contact: {
        phone: "+919782799042",
        email: "contact@taxclusive.com",
        website: "https://www.taxclusive.com",
        supportEmail: "support@taxclusive.com",
        salesEmail: "sales@taxclusive.com",
      },

      address: {
        streetAddress: "JMD Megapolis, Sector 48, Sohna Road",
        addressLocality: "Gurugram",
        addressRegion: "Haryana",
        postalCode: "122001",
        addressCountry: "IN",
        countryCode: "IN",
      },

      geo: {
        latitude: 28.4089,
        longitude: 77.0378,
      },

      openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-14:00"],
      timeZone: "Asia/Kolkata",

      serviceAreas: [
        { name: "Gurugram", type: "city" },
        { name: "New Delhi", type: "city" },
        { name: "Noida", type: "city" },
        { name: "Ghaziabad", type: "city" },
        { name: "Faridabad", type: "city" },
        { name: "Haryana", type: "state" },
        { name: "Delhi", type: "state" },
        { name: "India", type: "country" },
      ],

      priceRange: "₹₹",

      paymentMethods: [
        "Cash",
        "Credit Card",
        "Debit Card",
        "Bank Transfer",
        "UPI",
        "Net Banking",
        "Cheque",
      ],

      socialMedia: {
        linkedin: "https://www.linkedin.com/company/taxclusive",
        facebook: "https://www.facebook.com/taxclusive",
        twitter: "https://twitter.com/taxclusive",
        instagram: "https://www.instagram.com/taxclusive",
        youtube: "https://www.youtube.com/@taxclusive",
        whatsapp: "https://wa.me/919782799042",
      },

      rating: {
        value: "4.8",
        reviewCount: "150",
        bestRating: "5",
        worstRating: "1",
      },

      credentials: [
        {
          name: "Chartered Accountant",
          issuingOrganization: "Institute of Chartered Accountants of India",
          abbreviation: "ICAI",
          url: "https://www.icai.org",
        },
      ],

      industries: [
        "Real Estate & Construction",
        "Technology & Startups",
        "Manufacturing & Distribution",
        "Healthcare & Life Sciences",
        "Retail & E-commerce",
        "Nonprofit Organizations",
        "Professional Services",
        "Hospitality & Food Service",
        "Financial Services",
      ],
    },

    pages: {
      home: {
        hero: {
          title: "Expert Chartered Accountants in Gurugram",
          subtitle: "Your Trusted Financial Partner",
          description:
            "Leading CA firm providing comprehensive tax planning, audit, GST compliance, and financial advisory services. 35+ years of expertise, 500+ satisfied clients across India.",
          primaryCta: {
            text: "Book Free Consultation",
            url: "/contact",
          },
          secondaryCta: {
            text: "Our Services",
            url: "/services",
          },
          backgroundImage: "/images/hero-bg.jpg",
        },

        services: {
          title: "Comprehensive CA Services",
          subtitle: "Professional Excellence in Every Service",
          description:
            "From tax planning to business advisory, we provide end-to-end chartered accountancy services tailored to your needs.",
          items: [
            {
              id: "tax-planning",
              name: "Tax Planning & Preparation",
              description:
                "Strategic tax planning and preparation services to minimize your tax liability while ensuring full compliance.",
              icon: "calculator",
              features: [
                "Income Tax Return Filing",
                "Tax Optimization Strategies",
                "Advance Tax Calculations",
                "Tax Notice Handling",
              ],
              url: "/services/tax-planning",
            },
            {
              id: "gst-compliance",
              name: "GST Compliance & Returns",
              description:
                "Complete GST registration, compliance, and return filing services for hassle-free tax management.",
              icon: "file-text",
              features: [
                "GST Registration",
                "Monthly Return Filing",
                "Input Tax Credit Optimization",
                "GST Audit Support",
              ],
              url: "/services/gst-compliance",
            },
            {
              id: "audit-assurance",
              name: "Audit & Assurance",
              description:
                "Independent audit and assurance services to enhance your financial credibility and compliance.",
              icon: "shield-check",
              features: ["Statutory Audit", "Internal Audit", "Tax Audit", "Due Diligence"],
              url: "/services/audit-assurance",
            },
            {
              id: "business-registration",
              name: "Business Registration",
              description:
                "End-to-end business registration and compliance services for startups and established companies.",
              icon: "building",
              features: [
                "Company Incorporation",
                "LLP Registration",
                "Partnership Registration",
                "Regulatory Compliance",
              ],
              url: "/services/business-registration",
            },
            {
              id: "financial-advisory",
              name: "Financial Advisory",
              description:
                "Strategic financial planning and business advisory services to drive your growth.",
              icon: "trending-up",
              features: [
                "Business Planning",
                "Investment Advisory",
                "Risk Management",
                "Financial Restructuring",
              ],
              url: "/services/financial-advisory",
            },
            {
              id: "bookkeeping",
              name: "Bookkeeping & Accounting",
              description:
                "Professional bookkeeping and accounting services to maintain accurate financial records.",
              icon: "book-open",
              features: [
                "Daily Bookkeeping",
                "Financial Statements",
                "Payroll Management",
                "MIS Reporting",
              ],
              url: "/services/bookkeeping",
            },
          ],
        },

        expertise: {
          title: "Industry Expertise",
          subtitle: "Specialized Knowledge Across Sectors",
          description:
            "Our team brings deep industry knowledge and specialized expertise across multiple sectors.",
          items: [
            {
              id: "real-estate",
              name: "Real Estate & Construction",
              description:
                "Specialized CA services for real estate developers, construction companies, and property investors.",
              icon: "home",
              url: "/expertise/real-estate",
            },
            {
              id: "technology",
              name: "Technology & Startups",
              description:
                "Financial advisory and compliance support for tech startups and established technology companies.",
              icon: "laptop",
              url: "/expertise/technology",
            },
            {
              id: "manufacturing",
              name: "Manufacturing & Distribution",
              description:
                "Comprehensive accounting and tax services for manufacturing and distribution businesses.",
              icon: "factory",
              url: "/expertise/manufacturing",
            },
            {
              id: "healthcare",
              name: "Healthcare & Life Sciences",
              description:
                "Specialized financial services for healthcare providers and life sciences companies.",
              icon: "heart",
              url: "/expertise/healthcare",
            },
          ],
        },

        testimonials: {
          title: "Client Success Stories",
          subtitle: "What Our Clients Say",
          items: [
            {
              id: "testimonial-1",
              name: "Rajesh Kumar",
              role: "Managing Director",
              company: "Kumar Industries",
              content:
                "Taxclusive has been instrumental in our company's financial success. Their expertise in tax planning has saved us significant amounts while ensuring complete compliance.",
              rating: 5,
            },
            {
              id: "testimonial-2",
              name: "Priya Sharma",
              role: "Founder",
              company: "TechStart Solutions",
              content:
                "As a startup, we needed reliable financial guidance. Taxclusive provided exceptional support from company registration to ongoing compliance.",
              rating: 5,
            },
            {
              id: "testimonial-3",
              name: "Amit Gupta",
              role: "CEO",
              company: "Gupta Enterprises",
              content:
                "Professional, reliable, and always available when we need them. Their audit services have strengthened our financial processes significantly.",
              rating: 5,
            },
          ],
        },

        cta: {
          title: "Ready to Transform Your Financial Management?",
          description:
            "Join 500+ satisfied clients who trust Taxclusive for their chartered accountancy needs.",
          primaryButton: {
            text: "Schedule Free Consultation",
            url: "/contact",
          },
          secondaryButton: {
            text: "View All Services",
            url: "/services",
          },
        },
      },

      about: {
        hero: {
          title: "About Taxclusive",
          subtitle: "35+ Years of Professional Excellence",
          description:
            "We are a leading chartered accountancy firm committed to providing exceptional financial and tax advisory services with integrity, expertise, and client-first approach.",
          image: "/images/about-hero.jpg",
        },

        story: {
          title: "Our Story",
          content:
            "Founded in 2010 with a vision to provide comprehensive and reliable chartered accountancy services, Taxclusive has grown to become one of the most trusted CA firms in Gurugram. Our journey began with a simple commitment: to help businesses and individuals achieve their financial goals through expert guidance and unwavering integrity.\n\nOver the years, we have built a reputation for excellence, serving over 500 clients across various industries. Our team of experienced chartered accountants combines traditional accounting principles with modern technology to deliver efficient, accurate, and timely services.",
          timeline: [
            {
              year: "2010",
              title: "Foundation",
              description:
                "Taxclusive was established with a mission to provide reliable CA services.",
            },
            {
              year: "2015",
              title: "Growth & Expansion",
              description: "Expanded our team and service offerings to meet growing client needs.",
            },
            {
              year: "2018",
              title: "Digital Transformation",
              description: "Embraced technology to enhance service delivery and client experience.",
            },
            {
              year: "2020",
              title: "Milestone Achievement",
              description: "Reached 500+ satisfied clients across multiple industries.",
            },
            {
              year: "2023",
              title: "Continued Excellence",
              description: "Recognized as a leading CA firm in the Delhi NCR region.",
            },
          ],
        },

        team: {
          title: "Meet Our Expert Team",
          description:
            "Our team of qualified chartered accountants brings decades of combined experience and specialized expertise.",
          members: [
            {
              id: "ca-1",
              name: "CA Rajesh Sharma",
              role: "Managing Partner",
              description:
                "Leading chartered accountant with 20+ years of experience in tax planning and audit services.",
              qualifications: ["CA", "MBA Finance"],
              experience: "20+ years",
              specialties: ["Tax Planning", "Corporate Audit", "Financial Advisory"],
              social: {
                linkedin: "https://linkedin.com/in/rajesh-sharma-ca",
                email: "rajesh@taxclusive.com",
              },
            },
            {
              id: "ca-2",
              name: "CA Priya Gupta",
              role: "Senior Partner",
              description:
                "Expert in GST compliance and business registration with comprehensive industry knowledge.",
              qualifications: ["CA", "CS"],
              experience: "15+ years",
              specialties: ["GST Compliance", "Business Registration", "Corporate Law"],
              social: {
                linkedin: "https://linkedin.com/in/priya-gupta-ca",
                email: "priya@taxclusive.com",
              },
            },
          ],
        },

        values: {
          title: "Our Core Values",
          items: [
            {
              id: "integrity",
              name: "Integrity & Ethics",
              description:
                "We uphold the highest standards of professional integrity and ethical conduct in all our services.",
              icon: "shield-check",
            },
            {
              id: "excellence",
              name: "Professional Excellence",
              description:
                "We strive for excellence in every aspect of our work, ensuring quality and accuracy in all deliverables.",
              icon: "award",
            },
            {
              id: "client-first",
              name: "Client-First Approach",
              description:
                "Our clients' success is our priority. We tailor our services to meet their unique needs and objectives.",
              icon: "users",
            },
            {
              id: "innovation",
              name: "Continuous Innovation",
              description:
                "We embrace technology and innovative practices to enhance our service delivery and client experience.",
              icon: "lightbulb",
            },
          ],
        },

        achievements: {
          title: "Our Achievements",
          items: [
            {
              id: "clients",
              metric: "500+",
              label: "Satisfied Clients",
              description: "Businesses and individuals trust us with their financial needs",
            },
            {
              id: "experience",
              metric: "35+",
              label: "Years of Experience",
              description: "Combined team experience in chartered accountancy",
            },
            {
              id: "industries",
              metric: "15+",
              label: "Industries Served",
              description: "Diverse industry expertise across multiple sectors",
            },
            {
              id: "rating",
              metric: "4.8/5",
              label: "Client Rating",
              description: "Consistently high client satisfaction scores",
            },
          ],
        },
      },

      services: {
        hero: {
          title: "Comprehensive CA Services",
          subtitle: "Professional Solutions for All Your Financial Needs",
          description:
            "From tax planning to business advisory, we offer a complete range of chartered accountancy services designed to support your financial success.",
        },

        categories: [
          {
            id: "taxation",
            name: "Taxation Services",
            description: "Complete tax planning, preparation, and compliance services",
            icon: "calculator",
            services: [
              {
                id: "income-tax",
                name: "Income Tax Planning & Filing",
                description:
                  "Comprehensive income tax services including planning, preparation, and filing of returns for individuals and businesses.",
                features: [
                  "Individual Tax Return Filing",
                  "Corporate Tax Planning",
                  "Tax Optimization Strategies",
                  "Advance Tax Calculations",
                  "TDS Return Filing",
                  "Tax Notice Handling",
                ],
                benefits: [
                  "Minimize tax liability legally",
                  "Avoid penalties and interest",
                  "Expert handling of complex cases",
                  "Year-round tax support",
                ],
                process: [
                  "Initial consultation and document collection",
                  "Tax planning and optimization review",
                  "Return preparation and verification",
                  "Filing and acknowledgment",
                  "Follow-up and support",
                ],
                pricing: {
                  type: "package",
                  description: "Starting from ₹2,000 for individual returns",
                },
                timeline: "3-5 business days",
                requirements: [
                  "PAN Card",
                  "Form 16 / Salary Slips",
                  "Investment Proofs",
                  "Bank Statements",
                ],
              },
              {
                id: "gst-services",
                name: "GST Registration & Compliance",
                description:
                  "Complete GST services from registration to regular compliance and return filing.",
                features: [
                  "GST Registration",
                  "Monthly/Quarterly Return Filing",
                  "Input Tax Credit Optimization",
                  "GST Audit Support",
                  "GST Refund Processing",
                  "GST Advisory Services",
                ],
                benefits: [
                  "Hassle-free GST compliance",
                  "Maximize input tax credits",
                  "Avoid GST penalties",
                  "Expert handling of complex transactions",
                ],
                pricing: {
                  type: "package",
                  description: "Monthly compliance starting from ₹3,000",
                },
                timeline: "2-3 business days for registration",
              },
            ],
          },
          {
            id: "audit",
            name: "Audit & Assurance",
            description: "Independent audit services for enhanced financial credibility",
            icon: "shield-check",
            services: [
              {
                id: "statutory-audit",
                name: "Statutory Audit",
                description:
                  "Mandatory audit services for companies as per regulatory requirements.",
                features: [
                  "Financial Statement Audit",
                  "Compliance Verification",
                  "Risk Assessment",
                  "Management Letter",
                  "Audit Report Preparation",
                ],
                benefits: [
                  "Regulatory compliance",
                  "Enhanced credibility",
                  "Risk identification",
                  "Improved internal controls",
                ],
                pricing: {
                  type: "custom",
                  description: "Based on company size and complexity",
                },
              },
            ],
          },
        ],
      },

      contact: {
        hero: {
          title: "Contact Us",
          subtitle: "Get Expert Financial Guidance Today",
          description:
            "Ready to transform your financial management? Our team of expert chartered accountants is here to help.",
        },

        form: {
          title: "Send Us a Message",
          description: "Fill out the form below and we'll get back to you within 24 hours.",
          fields: [
            {
              id: "name",
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              required: true,
              validation: {
                minLength: 2,
                maxLength: 50,
              },
            },
            {
              id: "email",
              type: "email",
              label: "Email Address",
              placeholder: "Enter your email",
              required: true,
            },
            {
              id: "phone",
              type: "phone",
              label: "Phone Number",
              placeholder: "Enter your phone number",
              required: true,
              validation: {
                pattern: "^[+]?[0-9]{10,15}$",
                errorMessage: "Please enter a valid phone number",
              },
            },
            {
              id: "service",
              type: "select",
              label: "Service Interest",
              required: true,
              options: [
                { value: "tax-planning", label: "Tax Planning & Preparation" },
                { value: "gst-compliance", label: "GST Compliance" },
                { value: "audit-services", label: "Audit Services" },
                { value: "business-registration", label: "Business Registration" },
                { value: "financial-advisory", label: "Financial Advisory" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "message",
              type: "textarea",
              label: "Message",
              placeholder: "Tell us about your requirements",
              required: true,
              validation: {
                minLength: 10,
                maxLength: 500,
              },
            },
          ],
          submitButton: "Send Message",
          successMessage: "Thank you for your message. We'll get back to you within 24 hours.",
          errorMessage: "Sorry, there was an error sending your message. Please try again.",
        },

        locations: [
          {
            id: "gurugram-office",
            name: "Gurugram Office",
            address: "JMD Megapolis, Sector 48, Sohna Road, Gurugram, Haryana 122001",
            phone: "+919782799042",
            email: "contact@taxclusive.com",
            hours: [
              "Monday - Friday: 9:00 AM - 6:00 PM",
              "Saturday: 9:00 AM - 2:00 PM",
              "Sunday: Closed",
            ],
            coordinates: {
              lat: 28.4089,
              lng: 77.0378,
            },
          },
        ],
      },

      faq: {
        hero: {
          title: "Frequently Asked Questions",
          subtitle: "Find Answers to Common Questions",
          description:
            "Get quick answers to the most frequently asked questions about our chartered accountancy services.",
        },

        categories: [
          {
            id: "tax-planning",
            name: "Tax Planning & Filing",
            description: "Questions about income tax, GST, and tax planning services",
            questions: [
              {
                id: "tax-filing-deadline",
                question: "What is the deadline for filing income tax returns?",
                answer:
                  "For individuals, the deadline is typically July 31st of the assessment year. For businesses requiring audit, it's September 30th. However, these dates may be extended by the government in certain circumstances.",
              },
              {
                id: "gst-registration-required",
                question: "When is GST registration mandatory?",
                answer:
                  "GST registration is mandatory when your annual turnover exceeds ₹20 lakhs (₹10 lakhs for northeastern states). It's also required for inter-state supply regardless of turnover, and for certain specified services.",
              },
              {
                id: "tax-saving-investments",
                question: "What are the best tax-saving investment options?",
                answer:
                  "Popular tax-saving options under Section 80C include PPF, ELSS mutual funds, life insurance premiums, and home loan principal. Other sections like 80D (health insurance) and 80G (donations) also offer tax benefits.",
              },
            ],
          },
          {
            id: "business-services",
            name: "Business Services",
            description: "Questions about company registration, compliance, and business advisory",
            questions: [
              {
                id: "company-incorporation-time",
                question: "How long does company incorporation take?",
                answer:
                  "With proper documentation, company incorporation typically takes 7-15 business days. The process includes name approval, filing of incorporation documents, and obtaining the Certificate of Incorporation.",
              },
              {
                id: "audit-requirement",
                question: "Which companies require statutory audit?",
                answer:
                  "All companies registered under the Companies Act 2013 require statutory audit, except certain small companies with turnover less than ₹1 crore and borrowings less than ₹50 lakhs.",
              },
            ],
          },
        ],
      },
    },

    navigation: {
      header: {
        logo: {
          text: "Taxclusive",
          image: "/logo.png",
          width: 120,
          height: 40,
        },
        menu: [
          {
            id: "home",
            label: "Home",
            url: "/",
          },
          {
            id: "about",
            label: "About",
            url: "/about",
          },
          {
            id: "services",
            label: "Services",
            url: "/services",
            children: [
              {
                id: "tax-planning",
                label: "Tax Planning",
                url: "/services/tax-planning",
                description: "Strategic tax planning and preparation services",
              },
              {
                id: "gst-compliance",
                label: "GST Compliance",
                url: "/services/gst-compliance",
                description: "Complete GST registration and filing services",
              },
              {
                id: "audit-services",
                label: "Audit Services",
                url: "/services/audit-services",
                description: "Independent audit and assurance services",
              },
              {
                id: "business-registration",
                label: "Business Registration",
                url: "/services/business-registration",
                description: "Company incorporation and compliance",
              },
            ],
          },
          {
            id: "expertise",
            label: "Expertise",
            url: "/expertise",
          },
          {
            id: "blogs",
            label: "Insights",
            url: "/blogs",
          },
          {
            id: "faq",
            label: "FAQ",
            url: "/faq",
          },
          {
            id: "contact",
            label: "Contact",
            url: "/contact",
          },
        ],
        cta: {
          text: "Book Consultation",
          url: "/contact",
          style: "primary",
        },
      },

      footer: {
        description:
          "Leading Chartered Accountancy firm providing expert financial and tax advisory services across India.",
        sections: [
          {
            id: "services",
            title: "Services",
            links: [
              {
                id: "tax-planning",
                label: "Tax Planning",
                url: "/services/tax-planning",
              },
              {
                id: "gst-compliance",
                label: "GST Compliance",
                url: "/services/gst-compliance",
              },
              {
                id: "audit-services",
                label: "Audit Services",
                url: "/services/audit-services",
              },
              {
                id: "business-advisory",
                label: "Business Advisory",
                url: "/services/business-advisory",
              },
            ],
          },
          {
            id: "company",
            title: "Company",
            links: [
              {
                id: "about",
                label: "About Us",
                url: "/about",
              },
              {
                id: "team",
                label: "Our Team",
                url: "/about#team",
              },
              {
                id: "careers",
                label: "Careers",
                url: "/careers",
              },
              {
                id: "contact",
                label: "Contact",
                url: "/contact",
              },
            ],
          },
          {
            id: "resources",
            title: "Resources",
            links: [
              {
                id: "blog",
                label: "Blog",
                url: "/blogs",
              },
              {
                id: "faq",
                label: "FAQ",
                url: "/faq",
              },
              {
                id: "guides",
                label: "Guides",
                url: "/resources",
              },
            ],
          },
          {
            id: "legal",
            title: "Legal",
            links: [
              {
                id: "privacy",
                label: "Privacy Policy",
                url: "/privacy-policy",
              },
              {
                id: "terms",
                label: "Terms of Service",
                url: "/terms-of-service",
              },
            ],
          },
        ],
        bottom: {
          copyright: "© 2024 Taxclusive. All rights reserved.",
          links: [
            {
              id: "privacy",
              label: "Privacy Policy",
              url: "/privacy-policy",
            },
            {
              id: "terms",
              label: "Terms",
              url: "/terms-of-service",
            },
          ],
        },
      },
    },

    seo: {
      defaultTitle:
        "Taxclusive - Expert Chartered Accountants in Gurugram | CA Services | Tax Planning",
      titleTemplate: "%s | Taxclusive - Professional CA Services",
      defaultDescription:
        "Leading Chartered Accountancy firm in Gurugram. Expert tax planning, GST compliance, audit, business registration & financial advisory services. 35+ years experience. Call +919782799042",
      keywords: [
        "chartered accountant gurugram",
        "CA services",
        "tax planning",
        "GST compliance",
        "audit services",
        "financial advisory",
        "business registration",
        "tax consultant",
        "accounting firm gurugram",
      ],
      openGraph: {
        type: "website",
        locale: "en_IN",
        siteName: "Taxclusive",
        images: [
          {
            url: "/images/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Taxclusive - Expert Chartered Accountants in Gurugram",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@taxclusive",
        creator: "@taxclusive",
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
        bing: process.env.BING_SITE_VERIFICATION,
        yandex: process.env.YANDEX_SITE_VERIFICATION,
      },
    },
  },

  // =============================================================================
  // ASSETS CONFIGURATION
  // =============================================================================
  assets: {
    images: {
      logo: {
        main: "/logo.png",
        favicon: "/favicon.ico",
        appleTouchIcon: "/apple-touch-icon.png",
        dark: "/logo-dark.png",
        light: "/logo-light.png",
      },
      hero: {
        home: "/images/hero-home.jpg",
        about: "/images/hero-about.jpg",
        services: "/images/hero-services.jpg",
        contact: "/images/hero-contact.jpg",
      },
      backgrounds: {
        hero: "/images/hero-bg.jpg",
        section: "/images/section-bg.jpg",
        footer: "/images/footer-bg.jpg",
        pattern: "/images/pattern-bg.svg",
      },
      placeholders: {
        avatar: "/images/placeholder-avatar.jpg",
        team: "/images/placeholder-team.jpg",
        service: "/images/placeholder-service.jpg",
        blog: "/images/placeholder-blog.jpg",
        testimonial: "/images/placeholder-testimonial.jpg",
      },
      social: {
        ogImage: "/images/og-image.jpg",
        twitterImage: "/images/twitter-image.jpg",
      },
    },
    icons: {
      services: {
        calculator: "calculator",
        "file-text": "file-text",
        "shield-check": "shield-check",
        building: "building",
        "trending-up": "trending-up",
        "book-open": "book-open",
      },
      features: {
        "check-circle": "check-circle",
        star: "star",
        award: "award",
        users: "users",
        lightbulb: "lightbulb",
        heart: "heart",
      },
      social: {
        linkedin: "linkedin",
        facebook: "facebook",
        twitter: "twitter",
        instagram: "instagram",
        youtube: "youtube",
        whatsapp: "message-circle",
      },
      ui: {
        menu: "menu",
        "x-mark": "x",
        "chevron-down": "chevron-down",
        "chevron-right": "chevron-right",
        "arrow-right": "arrow-right",
        phone: "phone",
        mail: "mail",
        "map-pin": "map-pin",
      },
    },
    documents: {
      brochure: "/documents/taxclusive-brochure.pdf",
      serviceGuide: "/documents/service-guide.pdf",
      privacyPolicy: "/documents/privacy-policy.pdf",
      termsOfService: "/documents/terms-of-service.pdf",
    },
  },

  // =============================================================================
  // FEATURES CONFIGURATION
  // =============================================================================
  features: {
    analytics: {
      googleAnalytics: process.env.GOOGLE_ANALYTICS_ID,
      googleTagManager: process.env.GOOGLE_TAG_MANAGER_ID,
    },
    integrations: {
      email: {
        provider: "aws-ses",
        apiKey: process.env.AWS_ACCESS_KEY_ID,
      },
      maps: {
        provider: "google",
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    features: {
      darkMode: true,
      multiLanguage: false,
      blog: true,
      testimonials: true,
      newsletter: true,
      search: true,
      breadcrumbs: true,
      progressIndicators: true,
      animations: true,
      lazyLoading: true,
      infiniteScroll: false,
      socialSharing: true,
      printFriendly: true,
      offline: false,
      pwa: false,
    },
    forms: {
      validation: "both",
      captcha: {
        enabled: false,
      },
      honeypot: true,
      rateLimit: {
        enabled: true,
        requests: 5,
        window: 60,
      },
    },
    performance: {
      lazyImages: true,
      preloadCritical: true,
      compression: true,
      caching: {
        staticAssets: 31536000, // 1 year
        apiResponses: 300, // 5 minutes
      },
      cdn: {
        enabled: false,
      },
    },
  },
};

export default defaultConfig;
