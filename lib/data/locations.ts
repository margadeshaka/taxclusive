export interface LocationPageData {
  slug: string
  city: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  isPrimaryOffice: boolean
  description: string
  localities: string[]
  whyChooseUs: { title: string; description: string }[]
  faqs: { question: string; answer: string }[]
}

export const LOCATIONS: LocationPageData[] = [
  {
    slug: "gurugram",
    city: "Gurugram",
    metaTitle: "Tax Consultant in Gurugram | GST, ITR & Business Registration | Taxclusive",
    metaDescription:
      "Trusted tax consultants in Gurugram. Expert GST filing, ITR returns, company registration & accounting services. Visit our office at JMD Megapolis, Sector 48.",
    keywords: [
      "tax consultant gurugram",
      "GST filing gurugram",
      "ITR filing gurugram",
      "company registration gurugram",
      "tax professional gurugram",
      "accounting services gurugram",
      "business registration gurugram",
      "tax advisor gurugram",
      "income tax gurugram",
      "GST return gurugram",
    ],
    isPrimaryOffice: true,
    description:
      "Taxclusive is a leading tax consultancy firm based in Gurugram, Haryana. Our primary office is located at JMD Megapolis, Sector 48, Sohna Road. We provide comprehensive tax, GST, accounting, and business registration services to individuals and businesses across Gurugram and the entire Delhi NCR region. With years of expertise and a client-first approach, we ensure hassle-free compliance and maximum tax savings for our clients.",
    localities: [
      "Sector 48",
      "Sohna Road",
      "Golf Course Road",
      "MG Road",
      "DLF Cyber City",
      "Udyog Vihar",
      "DLF Phase 1-5",
      "Sector 14",
      "Sector 29",
      "Manesar",
      "Palam Vihar",
      "South City",
    ],
    whyChooseUs: [
      {
        title: "Primary Office in Gurugram",
        description:
          "Visit us at JMD Megapolis, Sector 48, Sohna Road for in-person consultations and document submissions.",
      },
      {
        title: "10+ Years of Experience",
        description:
          "Our team of experienced tax professionals has helped thousands of clients with tax compliance and business registrations.",
      },
      {
        title: "End-to-End Tax Solutions",
        description:
          "From ITR filing to GST registration, company incorporation to tax planning, we handle all your financial compliance needs.",
      },
      {
        title: "Trusted by 5000+ Clients",
        description:
          "Businesses and individuals across Gurugram trust Taxclusive for timely, accurate, and affordable tax services.",
      },
    ],
    faqs: [
      {
        question: "Where is Taxclusive's office in Gurugram?",
        answer:
          "Our primary office is located at JMD Megapolis, Sector 48, Sohna Road, Gurugram, Haryana. You can visit us during business hours for in-person consultations.",
      },
      {
        question: "Can I visit your Gurugram office for in-person consultation?",
        answer:
          "Yes, we welcome walk-in and appointment-based consultations at our Gurugram office. You can also bring your documents for direct submission and verification.",
      },
      {
        question: "Which areas in Gurugram do you serve?",
        answer:
          "We serve all areas of Gurugram including Sector 48, Sohna Road, Golf Course Road, MG Road, DLF Cyber City, Udyog Vihar, DLF Phase 1-5, Sector 14, Sector 29, Manesar, Palam Vihar, and South City.",
      },
    ],
  },
  {
    slug: "delhi",
    city: "Delhi",
    metaTitle: "Tax Consultant in Delhi | GST, ITR & Company Registration | Taxclusive",
    metaDescription:
      "Expert tax consultants serving Delhi. GST filing, income tax returns, company registration & bookkeeping services. Serving all Delhi localities from our NCR office.",
    keywords: [
      "tax consultant delhi",
      "GST filing delhi",
      "ITR filing delhi",
      "company registration delhi",
      "tax professional delhi",
      "accounting services delhi",
      "business registration delhi",
      "tax advisor delhi",
      "income tax delhi",
      "GST return delhi",
    ],
    isPrimaryOffice: false,
    description:
      "Taxclusive provides comprehensive tax and business registration services to clients across Delhi NCT. Operating from our Gurugram office, we serve individuals, startups, and established businesses throughout Delhi with expert GST filing, income tax returns, company registration, and accounting services. Our team ensures seamless compliance whether you are in South Delhi, Central Delhi, or any other part of the national capital.",
    localities: [
      "South Delhi",
      "Central Delhi",
      "Dwarka",
      "Vasant Kunj",
      "Saket",
      "Hauz Khas",
      "Connaught Place",
      "Nehru Place",
      "Lajpat Nagar",
      "Greater Kailash",
      "Defence Colony",
      "Rajouri Garden",
    ],
    whyChooseUs: [
      {
        title: "Serving All of Delhi NCT",
        description:
          "We provide tax and compliance services to clients across all Delhi localities including South Delhi, Central Delhi, Dwarka, and more.",
      },
      {
        title: "Remote & In-Person Support",
        description:
          "Consult with our experts online or visit our nearby Gurugram office for in-person meetings and document submissions.",
      },
      {
        title: "Expert Business Registrations",
        description:
          "Company incorporation, LLP registration, GST registration, and all business compliance services for Delhi-based businesses.",
      },
      {
        title: "Quick Turnaround Time",
        description:
          "We ensure fast processing of ITR filings, GST returns, and registration applications with dedicated support for Delhi clients.",
      },
    ],
    faqs: [
      {
        question: "Does Taxclusive have an office in Delhi?",
        answer:
          "Our primary office is in Gurugram, but we actively serve clients across Delhi NCT through online consultations, pickup/drop services for documents, and virtual meetings.",
      },
      {
        question: "Can you handle business registrations for Delhi-based companies?",
        answer:
          "Yes, we handle all types of business registrations for Delhi including company incorporation, LLP registration, GST registration, MSME registration, and trademark filing.",
      },
      {
        question: "Which areas of Delhi do you cover?",
        answer:
          "We serve all areas of Delhi including South Delhi, Central Delhi, Dwarka, Vasant Kunj, Saket, Hauz Khas, Connaught Place, Nehru Place, Lajpat Nagar, Greater Kailash, Defence Colony, and Rajouri Garden.",
      },
    ],
  },
  {
    slug: "noida",
    city: "Noida",
    metaTitle: "Tax Consultant in Noida | GST, ITR & Startup Registration | Taxclusive",
    metaDescription:
      "Professional tax consultants serving Noida. Specialized in IT & startup tax compliance, GST filing, ITR returns, and company registration across all Noida sectors.",
    keywords: [
      "tax consultant noida",
      "GST filing noida",
      "ITR filing noida",
      "company registration noida",
      "startup registration noida",
      "tax professional noida",
      "accounting services noida",
      "tax advisor noida",
      "income tax noida",
      "GST return noida",
    ],
    isPrimaryOffice: false,
    description:
      "Taxclusive serves Noida's thriving IT and startup ecosystem with specialized tax consultancy services. Based in nearby Gurugram, we provide expert GST filing, income tax returns, company registration, and accounting services tailored for tech companies, startups, and professionals in Noida, Uttar Pradesh. Our deep understanding of startup compliance and IT sector taxation makes us the preferred tax partner for Noida businesses.",
    localities: [
      "Sector 18",
      "Sector 62",
      "Sector 63",
      "Sector 15",
      "Sector 16",
      "Sector 44",
      "Film City",
      "Sector 125",
      "Sector 137",
      "Noida Expressway",
      "Sector 50",
      "Sector 76",
    ],
    whyChooseUs: [
      {
        title: "IT & Startup Specialists",
        description:
          "Deep expertise in tax compliance for IT companies, SaaS businesses, and funded startups in Noida's tech corridors.",
      },
      {
        title: "UP State Compliance Experts",
        description:
          "Thorough knowledge of Uttar Pradesh state tax regulations, professional tax, and local compliance requirements.",
      },
      {
        title: "Startup-Friendly Packages",
        description:
          "Affordable compliance packages designed for early-stage startups including incorporation, GST, TDS, and annual filings.",
      },
      {
        title: "Virtual-First Service Model",
        description:
          "Seamless online consultations and digital document management for busy professionals and startup founders in Noida.",
      },
    ],
    faqs: [
      {
        question: "How do you serve clients in Noida from your Gurugram office?",
        answer:
          "We serve Noida clients through virtual consultations, digital document submissions, and online filing. Our team is well-versed in Uttar Pradesh state compliance requirements specific to Noida businesses.",
      },
      {
        question: "Do you handle UP state compliance for Noida businesses?",
        answer:
          "Yes, we handle all Uttar Pradesh state-specific compliance including professional tax registration, shop and establishment registration, and state-level regulatory filings for Noida-based businesses.",
      },
      {
        question: "Can you help Noida startups with tax compliance?",
        answer:
          "Absolutely. We specialize in startup compliance including company incorporation, Startup India registration, GST registration, TDS filings, annual returns, and tax planning optimized for funded startups in Noida.",
      },
    ],
  },
  {
    slug: "ghaziabad",
    city: "Ghaziabad",
    metaTitle: "Tax Consultant in Ghaziabad | GST, ITR & Factory Compliance | Taxclusive",
    metaDescription:
      "Reliable tax consultants for Ghaziabad businesses. Specialized in manufacturing & trading compliance, GST filing, ITR returns, and factory registrations.",
    keywords: [
      "tax consultant ghaziabad",
      "GST filing ghaziabad",
      "ITR filing ghaziabad",
      "company registration ghaziabad",
      "factory compliance ghaziabad",
      "tax professional ghaziabad",
      "accounting services ghaziabad",
      "tax advisor ghaziabad",
      "income tax ghaziabad",
      "GST return ghaziabad",
    ],
    isPrimaryOffice: false,
    description:
      "Taxclusive provides expert tax consultancy services to Ghaziabad's manufacturing and trading community. From our Gurugram office, we serve businesses across Ghaziabad, Uttar Pradesh with specialized compliance solutions including GST filing, income tax returns, factory registrations, and accounting services. Our team understands the unique compliance needs of manufacturing units, trading firms, and SMEs in the Ghaziabad industrial belt.",
    localities: [
      "Indirapuram",
      "Vaishali",
      "Raj Nagar Extension",
      "Crossings Republik",
      "Kaushambi",
      "Vasundhara",
      "Govindpuram",
      "Loni",
      "Mohan Nagar",
      "Sahibabad",
      "NH-24",
      "GT Road",
    ],
    whyChooseUs: [
      {
        title: "Manufacturing & Trading Experts",
        description:
          "Specialized compliance services for manufacturing units, trading firms, and industrial businesses in Ghaziabad.",
      },
      {
        title: "Factory Compliance Support",
        description:
          "Complete support for factory registrations, labor law compliance, pollution clearances, and industrial licensing requirements.",
      },
      {
        title: "UP State Tax Knowledge",
        description:
          "Expert handling of Uttar Pradesh state regulations including professional tax, VAT transition, and local body compliance.",
      },
      {
        title: "Affordable SME Packages",
        description:
          "Cost-effective tax and compliance packages designed specifically for small and medium enterprises in Ghaziabad.",
      },
    ],
    faqs: [
      {
        question: "How does Taxclusive serve Ghaziabad clients?",
        answer:
          "We serve Ghaziabad clients through online consultations, digital document processing, and virtual meetings. Our team has extensive experience with Uttar Pradesh state compliance requirements applicable to Ghaziabad businesses.",
      },
      {
        question: "Can you handle factory and manufacturing compliance for Ghaziabad units?",
        answer:
          "Yes, we provide comprehensive factory compliance services including factory registration, labour law compliance, ESI/PF registrations, pollution board clearances, and industry-specific regulatory filings for Ghaziabad manufacturing units.",
      },
      {
        question: "Do you manage UP state-specific compliance for Ghaziabad businesses?",
        answer:
          "Yes, we handle all Uttar Pradesh state-specific requirements for Ghaziabad businesses including professional tax, shop and establishment registration, trade license, and all state-level regulatory compliance.",
      },
    ],
  },
  {
    slug: "faridabad",
    city: "Faridabad",
    metaTitle: "Tax Consultant in Faridabad | GST, ITR & Industrial Compliance | Taxclusive",
    metaDescription:
      "Expert tax consultants serving Faridabad industries. GST filing, ITR returns, company registration & industrial compliance services for businesses across Faridabad.",
    keywords: [
      "tax consultant faridabad",
      "GST filing faridabad",
      "ITR filing faridabad",
      "company registration faridabad",
      "industrial compliance faridabad",
      "tax professional faridabad",
      "accounting services faridabad",
      "tax advisor faridabad",
      "income tax faridabad",
      "GST return faridabad",
    ],
    isPrimaryOffice: false,
    description:
      "Taxclusive delivers professional tax and compliance services to Faridabad's industrial and business community. Operating from our Gurugram office in nearby Haryana, we provide end-to-end GST filing, income tax returns, company registration, and industrial compliance services for businesses across Faridabad. Our proximity and expertise in Haryana state regulations make us an ideal tax partner for Faridabad enterprises.",
    localities: [
      "Neharpar",
      "Sector 15",
      "Sector 16",
      "Sector 21",
      "NIT Faridabad",
      "Ballabgarh",
      "Old Faridabad",
      "Surajkund",
      "Sector 37",
      "Sector 28",
      "NHPC Chowk",
      "Mathura Road",
    ],
    whyChooseUs: [
      {
        title: "Industrial Compliance Specialists",
        description:
          "Expert compliance services for Faridabad's manufacturing units, industrial estates, and factory clusters along Mathura Road.",
      },
      {
        title: "Same-State Advantage",
        description:
          "Both our Gurugram office and Faridabad are in Haryana, ensuring consistent state-level compliance knowledge and quick access.",
      },
      {
        title: "Property & Real Estate Tax",
        description:
          "Specialized property tax advisory for Faridabad's growing real estate sector including capital gains planning and property registrations.",
      },
      {
        title: "Comprehensive Business Support",
        description:
          "From GST registration to annual filings, factory compliance to tax audits, we cover all business compliance needs for Faridabad enterprises.",
      },
    ],
    faqs: [
      {
        question: "How do you serve Faridabad clients from Gurugram?",
        answer:
          "Faridabad and our Gurugram office are both in Haryana, making it convenient for clients. We offer online consultations, document pickup services, and clients can also visit our nearby Gurugram office for in-person meetings.",
      },
      {
        question: "Can you handle industrial compliance for Faridabad manufacturing units?",
        answer:
          "Yes, we provide complete industrial compliance services including factory registration, ESI/PF compliance, labor law filings, pollution board clearances, and GST compliance for manufacturing and industrial businesses in Faridabad.",
      },
      {
        question: "Do you assist with property tax matters in Faridabad?",
        answer:
          "Yes, we offer property tax advisory services including capital gains tax planning on property sales, property registration guidance, stamp duty calculations, and rental income tax filings for Faridabad property owners.",
      },
    ],
  },
  {
    slug: "greater-noida",
    city: "Greater Noida",
    metaTitle: "Tax Consultant in Greater Noida | GST, ITR & Startup Services | Taxclusive",
    metaDescription:
      "Professional tax consultants for Greater Noida. Specialized in startup registrations, educational institution compliance, GST filing & ITR returns for all sectors.",
    keywords: [
      "tax consultant greater noida",
      "GST filing greater noida",
      "ITR filing greater noida",
      "company registration greater noida",
      "startup registration greater noida",
      "tax professional greater noida",
      "accounting services greater noida",
      "tax advisor greater noida",
      "income tax greater noida",
      "GST return greater noida",
    ],
    isPrimaryOffice: false,
    description:
      "Taxclusive provides specialized tax consultancy services to Greater Noida's growing startup ecosystem and educational institutions. From our Gurugram office, we serve businesses, startups, and professionals across Greater Noida, Uttar Pradesh with expert GST filing, income tax returns, company registration, and compliance services. Our understanding of the unique tax needs of educational institutions, real estate developers, and tech startups makes us the ideal tax partner for Greater Noida.",
    localities: [
      "Knowledge Park",
      "Pari Chowk",
      "Alpha",
      "Beta",
      "Gamma",
      "Delta",
      "Greater Noida West",
      "Techzone",
      "Surajpur",
      "Kasna",
      "Ecotech",
      "Omega",
    ],
    whyChooseUs: [
      {
        title: "Startup & New Business Focus",
        description:
          "Tailored compliance packages for startups and new businesses in Greater Noida's Knowledge Park and Techzone areas.",
      },
      {
        title: "Educational Institution Compliance",
        description:
          "Specialized tax and compliance services for universities, colleges, and educational trusts in Greater Noida's education hub.",
      },
      {
        title: "Real Estate Tax Advisory",
        description:
          "Expert guidance on property tax, capital gains, and GST on under-construction properties for Greater Noida's real estate sector.",
      },
      {
        title: "UP State Compliance",
        description:
          "Complete knowledge of Uttar Pradesh state regulations, GNIDA compliance, and local authority requirements for Greater Noida businesses.",
      },
    ],
    faqs: [
      {
        question: "Does Taxclusive cover Greater Noida for tax services?",
        answer:
          "Yes, we actively serve Greater Noida clients through virtual consultations and digital document processing. Our team is experienced with Uttar Pradesh state compliance and GNIDA-specific requirements for Greater Noida businesses.",
      },
      {
        question: "Can you handle compliance for educational institutions in Greater Noida?",
        answer:
          "Yes, we provide specialized compliance services for educational institutions including trust registration, 12A/80G certifications, GST compliance, TDS filings, and annual regulatory filings for universities and colleges in Greater Noida.",
      },
      {
        question: "Do you assist with real estate tax matters in Greater Noida?",
        answer:
          "Yes, we offer comprehensive real estate tax services including capital gains tax planning, GST on under-construction properties, property registration guidance, and rental income tax filings for Greater Noida property owners and developers.",
      },
    ],
  },
]

export function getLocationBySlug(slug: string): LocationPageData | undefined {
  return LOCATIONS.find((l) => l.slug === slug)
}

export function getAllLocationSlugs(): string[] {
  return LOCATIONS.map((l) => l.slug)
}
