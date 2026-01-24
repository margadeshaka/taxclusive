export interface ServicePageData {
  slug: string
  title: string
  headline: string
  description: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  whatWeOffer: { title: string; description: string }[]
  whoItsFor: string[]
  process: { step: string; title: string; description: string }[]
  faqs: { question: string; answer: string }[]
}

export const SERVICES: ServicePageData[] = [
  {
    slug: "tax-planning",
    title: "Tax Planning & Preparation",
    headline: "Strategic Tax Planning Services in Delhi NCR",
    description:
      "Expert income tax planning and filing services designed to minimize your tax liability through strategic planning and timely compliance. With over 35 years of experience, we help individuals and businesses navigate complex tax regulations across Delhi NCR.",
    metaTitle: "Tax Planning & Filing Services in Delhi NCR | Income Tax Consultant Gurugram",
    metaDescription:
      "Expert income tax planning and filing services in Gurugram, Delhi, Noida. Minimize tax liability with strategic planning. 35+ years experience, 500+ clients.",
    keywords: [
      "tax planning gurugram",
      "income tax filing delhi ncr",
      "tax consultant near me",
      "ITR filing services noida",
      "tax advisor gurgaon",
    ],
    whatWeOffer: [
      {
        title: "Income Tax Return Filing",
        description:
          "Accurate and timely filing of ITR for individuals, HUFs, and businesses across all applicable forms.",
      },
      {
        title: "Tax Planning & Advisory",
        description:
          "Strategic tax planning to optimize your tax position using legitimate deductions, exemptions, and investment strategies.",
      },
      {
        title: "Advance Tax Computation",
        description:
          "Precise calculation and timely payment of advance tax installments to avoid interest and penalties.",
      },
      {
        title: "Capital Gains Tax",
        description:
          "Expert handling of capital gains from property, stocks, mutual funds, and other assets with tax-efficient structuring.",
      },
      {
        title: "NRI Taxation",
        description:
          "Comprehensive tax services for Non-Resident Indians including DTAA benefits, repatriation planning, and return filing.",
      },
      {
        title: "Tax Notice Response",
        description:
          "Professional representation and response drafting for income tax notices, scrutiny assessments, and departmental proceedings.",
      },
    ],
    whoItsFor: [
      "Salaried professionals seeking to maximize deductions",
      "Self-employed individuals and freelancers",
      "Small and medium enterprise owners",
      "NRIs with income or assets in India",
      "Investors with capital gains from multiple sources",
      "High-net-worth individuals requiring comprehensive planning",
    ],
    process: [
      {
        step: "1",
        title: "Assessment",
        description:
          "We review your complete financial profile, income sources, investments, and existing tax positions to identify opportunities.",
      },
      {
        step: "2",
        title: "Strategy",
        description:
          "Our experts develop a customized tax strategy leveraging applicable deductions, exemptions, and investment options for maximum savings.",
      },
      {
        step: "3",
        title: "Implementation",
        description:
          "We execute the strategy through timely filings, advance tax payments, and investment recommendations aligned with your goals.",
      },
      {
        step: "4",
        title: "Ongoing Support",
        description:
          "Year-round support for tax queries, notice responses, and proactive planning adjustments based on regulatory changes.",
      },
    ],
    faqs: [
      {
        question: "What is the deadline for filing an Income Tax Return?",
        answer:
          "For salaried individuals and non-audit cases, the ITR deadline is typically July 31st of the assessment year. For businesses requiring audit, the deadline extends to October 31st. Late filing attracts penalties and interest, so timely filing is always recommended.",
      },
      {
        question: "How can I reduce my tax liability legally?",
        answer:
          "Tax liability can be reduced through strategic use of deductions under Sections 80C, 80D, 80E, and others, along with HRA exemptions, NPS contributions, and tax-efficient investment choices. Our experts analyze your specific situation to identify all applicable savings opportunities.",
      },
      {
        question: "What should I do if I receive a tax notice?",
        answer:
          "Do not panic—most tax notices are routine. Contact our team immediately with the notice details. We will analyze the notice type, prepare the appropriate response, and represent you before the tax authorities if needed. Timely response is critical to avoid adverse consequences.",
      },
      {
        question: "What documents are required for income tax filing?",
        answer:
          "You typically need Form 16/16A, bank statements, investment proofs (PPF, ELSS, insurance), home loan statements, rent receipts, and capital gains statements. For business income, you also need profit and loss accounts and balance sheets. We provide a comprehensive checklist based on your situation.",
      },
    ],
  },
  {
    slug: "gst-compliance",
    title: "GST Registration & Compliance",
    headline: "Complete GST Solutions for Your Business",
    description:
      "End-to-end GST services from registration to monthly compliance, helping businesses stay compliant while maximizing input tax credits. Our expert team handles all aspects of GST for 500+ business clients across Delhi NCR.",
    metaTitle: "GST Registration & Filing Services Delhi NCR | GST Consultant Gurugram",
    metaDescription:
      "Complete GST registration, monthly/quarterly return filing, and compliance services in Gurugram, Delhi, Noida. Expert GST consultants with 500+ business clients",
    keywords: [
      "GST registration delhi",
      "GST filing gurugram",
      "GST consultant noida",
      "GST compliance ncr",
      "GST return filing gurgaon",
    ],
    whatWeOffer: [
      {
        title: "GST Registration",
        description:
          "Quick and hassle-free GST registration for all business types including regular, composition, and voluntary registration.",
      },
      {
        title: "Monthly/Quarterly Returns",
        description:
          "Timely filing of GSTR-1, GSTR-3B, and other applicable returns with accurate data reconciliation and compliance checks.",
      },
      {
        title: "Input Tax Credit",
        description:
          "Maximization of eligible ITC claims through proper documentation, vendor reconciliation, and credit matching.",
      },
      {
        title: "GST Audit",
        description:
          "Comprehensive GST audit services including GSTR-9 and GSTR-9C preparation for businesses exceeding the prescribed turnover threshold.",
      },
      {
        title: "E-Way Bill",
        description:
          "Generation and management of e-way bills for seamless goods transportation compliance across state borders.",
      },
      {
        title: "GST Refund",
        description:
          "Processing of GST refund claims for exporters, inverted duty structure cases, and excess tax payments with proper documentation.",
      },
    ],
    whoItsFor: [
      "Businesses with annual turnover above Rs. 40 lakhs",
      "E-commerce sellers and marketplace operators",
      "Exporters seeking refunds and LUT filing",
      "Service providers with turnover above Rs. 20 lakhs",
      "Businesses involved in inter-state supply of goods or services",
      "Entities seeking voluntary GST registration for business growth",
    ],
    process: [
      {
        step: "1",
        title: "Registration",
        description:
          "We handle the complete GST registration process including document preparation, application filing, and GSTIN activation.",
      },
      {
        step: "2",
        title: "Setup",
        description:
          "Configuration of your invoicing system, HSN/SAC code mapping, and establishment of compliant billing processes.",
      },
      {
        step: "3",
        title: "Filing",
        description:
          "Regular filing of all applicable GST returns with data validation, ITC reconciliation, and liability computation.",
      },
      {
        step: "4",
        title: "Compliance",
        description:
          "Ongoing compliance monitoring, annual return preparation, audit support, and advisory on regulatory changes affecting your business.",
      },
    ],
    faqs: [
      {
        question: "When is GST registration mandatory?",
        answer:
          "GST registration is mandatory when your aggregate turnover exceeds Rs. 40 lakhs for goods (Rs. 20 lakhs for services) in a financial year. It is also mandatory for inter-state suppliers, e-commerce operators, and certain notified categories regardless of turnover.",
      },
      {
        question: "What are the due dates for GST return filing?",
        answer:
          "GSTR-1 is due by the 11th of the following month for monthly filers. GSTR-3B is due by the 20th of the following month. Quarterly filers under QRMP scheme have different timelines. Annual returns (GSTR-9) are typically due by December 31st of the following year.",
      },
      {
        question: "How do I handle ITC reconciliation issues?",
        answer:
          "ITC reconciliation involves matching your purchase records with supplier-filed GSTR-1 data on the GST portal. Discrepancies should be communicated to vendors for correction. Our team performs monthly reconciliation to ensure you claim maximum eligible credit without compliance risk.",
      },
      {
        question: "What should I do if I receive a GST notice?",
        answer:
          "GST notices can be for various reasons including return discrepancies, ITC mismatches, or non-filing. Contact us immediately with the notice details. We analyze the issue, prepare a comprehensive response, and represent you before the GST authorities to resolve the matter efficiently.",
      },
    ],
  },
  {
    slug: "audit-assurance",
    title: "Audit & Assurance",
    headline: "Independent Audit Services for Financial Credibility",
    description:
      "Professional audit and assurance services that enhance the credibility of your financial statements. Our independent audit approach helps organizations build stakeholder confidence and ensure regulatory compliance.",
    metaTitle: "Audit & Assurance Services Delhi NCR | Statutory Audit Gurugram",
    metaDescription:
      "Professional statutory audit, tax audit, and internal audit services in Gurugram, Delhi NCR. Build financial credibility with independent assurance services.",
    keywords: [
      "audit services gurugram",
      "statutory audit delhi ncr",
      "tax audit noida",
      "internal audit services",
      "financial audit gurgaon",
    ],
    whatWeOffer: [
      {
        title: "Statutory Audit",
        description:
          "Independent examination of financial statements in compliance with applicable laws and accounting standards for companies and LLPs.",
      },
      {
        title: "Tax Audit",
        description:
          "Mandatory tax audit under Section 44AB for businesses and professionals exceeding prescribed turnover thresholds.",
      },
      {
        title: "Internal Audit",
        description:
          "Systematic evaluation of internal controls, processes, and risk management to strengthen operational efficiency and governance.",
      },
      {
        title: "Due Diligence",
        description:
          "Comprehensive financial and operational due diligence for mergers, acquisitions, investments, and business transactions.",
      },
      {
        title: "Compliance Audit",
        description:
          "Assessment of adherence to regulatory requirements, industry standards, and organizational policies across business operations.",
      },
      {
        title: "Forensic Audit",
        description:
          "Specialized investigation of financial irregularities, fraud detection, and dispute-related financial analysis with detailed reporting.",
      },
    ],
    whoItsFor: [
      "Companies requiring statutory audit under the Companies Act",
      "Businesses exceeding prescribed tax audit turnover limits",
      "Organizations seeking to strengthen internal controls",
      "Parties involved in mergers and acquisition transactions",
      "NGOs, trusts, and societies requiring annual audits",
      "Businesses seeking to build investor and stakeholder confidence",
    ],
    process: [
      {
        step: "1",
        title: "Planning",
        description:
          "We understand your business, assess risks, determine materiality, and develop a comprehensive audit plan tailored to your organization.",
      },
      {
        step: "2",
        title: "Fieldwork",
        description:
          "Systematic examination of financial records, internal controls testing, substantive procedures, and evidence gathering at your premises.",
      },
      {
        step: "3",
        title: "Reporting",
        description:
          "Preparation of the audit report with opinion, key findings, material observations, and recommendations for improvement.",
      },
      {
        step: "4",
        title: "Follow-up",
        description:
          "Post-audit support including management letter discussion, implementation guidance for recommendations, and ongoing advisory.",
      },
    ],
    faqs: [
      {
        question: "Who needs a statutory audit?",
        answer:
          "All companies registered under the Companies Act 2013, regardless of turnover, require a statutory audit. LLPs with turnover exceeding Rs. 40 lakhs or contribution exceeding Rs. 25 lakhs also need statutory audits. The audit must be conducted by qualified professionals as prescribed by law.",
      },
      {
        question: "How long does an audit typically take?",
        answer:
          "The duration depends on the size and complexity of your organization. A small company audit may take 1-2 weeks, while larger organizations may require 4-6 weeks. Proper preparation of records and timely availability of information can significantly reduce the timeline.",
      },
      {
        question: "What is the difference between internal and statutory audit?",
        answer:
          "Statutory audit is a legally mandated examination of financial statements for external stakeholders, while internal audit is a voluntary assessment of internal controls and processes for management. Internal audit is ongoing and operational, whereas statutory audit is periodic and compliance-focused.",
      },
      {
        question: "What is a management letter in an audit?",
        answer:
          "A management letter is a communication from the auditor to management highlighting internal control weaknesses, process inefficiencies, and recommendations for improvement. It covers matters that are not material enough for the audit report but are important for organizational governance and risk management.",
      },
    ],
  },
  {
    slug: "business-registration",
    title: "Business Registration & Incorporation",
    headline: "Start Your Business with Proper Legal Structure",
    description:
      "Complete business registration and incorporation services to help entrepreneurs establish their ventures with the right legal structure. From private limited companies to LLPs, we handle end-to-end registration with fast processing.",
    metaTitle: "Company Registration & Incorporation Delhi NCR | Business Setup Gurugram",
    metaDescription:
      "Company incorporation, LLP registration, trademark filing, and startup compliance in Gurugram, Delhi NCR. End-to-end business registration. Fast processing.",
    keywords: [
      "company registration delhi",
      "LLP registration gurugram",
      "business incorporation noida",
      "startup registration ncr",
      "pvt ltd company gurgaon",
    ],
    whatWeOffer: [
      {
        title: "Private Limited Company",
        description:
          "End-to-end incorporation of Pvt Ltd companies including name reservation, DSC, DIN, MOA/AOA drafting, and certificate of incorporation.",
      },
      {
        title: "LLP Registration",
        description:
          "Complete Limited Liability Partnership registration with partnership agreement drafting, filing, and compliance setup.",
      },
      {
        title: "One Person Company",
        description:
          "OPC incorporation for solo entrepreneurs seeking limited liability protection with simplified compliance requirements.",
      },
      {
        title: "Startup India Registration",
        description:
          "Registration under the Startup India scheme with DPIIT recognition for tax benefits, funding access, and compliance relaxations.",
      },
      {
        title: "Trademark Registration",
        description:
          "Protection of your brand identity through trademark search, application filing, and registration across relevant classes.",
      },
      {
        title: "MSME/Udyam Registration",
        description:
          "Online Udyam registration for micro, small, and medium enterprises to access government schemes, subsidies, and priority lending.",
      },
    ],
    whoItsFor: [
      "New entrepreneurs starting their first business venture",
      "Freelancers seeking limited liability protection",
      "Existing partnerships looking to convert to LLP structure",
      "Startups seeking funding and investor readiness",
      "Foreign companies establishing presence in India",
      "Existing businesses restructuring for growth or compliance",
    ],
    process: [
      {
        step: "1",
        title: "Consultation",
        description:
          "We understand your business objectives, recommend the optimal legal structure, and explain the implications of each option for taxation and compliance.",
      },
      {
        step: "2",
        title: "Documentation",
        description:
          "Preparation of all required documents including identity proofs, address proofs, consent forms, and constitutional documents like MOA and AOA.",
      },
      {
        step: "3",
        title: "Filing",
        description:
          "Submission of incorporation applications to MCA/registrar, name reservation, DSC and DIN procurement, and tracking until approval.",
      },
      {
        step: "4",
        title: "Post-Registration",
        description:
          "Assistance with PAN, TAN, bank account opening, GST registration, and setting up initial compliance calendar for your new entity.",
      },
    ],
    faqs: [
      {
        question: "Which business structure is right for me?",
        answer:
          "The right structure depends on factors like number of owners, liability concerns, funding plans, and compliance capacity. Pvt Ltd is ideal for growth-oriented businesses seeking investment, LLP suits professional services with flexibility, and OPC works for solo entrepreneurs. We help you evaluate these factors during consultation.",
      },
      {
        question: "How long does company incorporation take?",
        answer:
          "With all documents ready, a Private Limited Company can be incorporated in 7-15 working days. LLP registration typically takes 10-15 days. Timelines may vary based on government processing and name availability. We expedite the process by ensuring error-free documentation from the start.",
      },
      {
        question: "What is the minimum capital required for a Pvt Ltd company?",
        answer:
          "There is no minimum paid-up capital requirement for incorporating a Private Limited Company in India. You can start with any amount of authorized capital. However, the authorized capital amount affects the government fees payable during incorporation. Most startups begin with Rs. 1 lakh to Rs. 10 lakhs.",
      },
      {
        question: "What are the post-incorporation compliance requirements?",
        answer:
          "After incorporation, a Pvt Ltd company must hold board meetings, maintain statutory registers, file annual returns (AOC-4 and MGT-7) with MCA, conduct statutory audits, and file income tax returns. Additional compliances include GST filing if registered, TDS returns, and other sector-specific requirements.",
      },
    ],
  },
  {
    slug: "financial-advisory",
    title: "Financial Advisory & Planning",
    headline: "Strategic Financial Planning for Growth",
    description:
      "Personalized financial advisory services to help individuals and businesses achieve their financial goals. Our strategic approach combines investment planning, business consulting, and wealth management for sustainable growth.",
    metaTitle: "Financial Advisory Services Delhi NCR | Financial Planner Gurugram",
    metaDescription:
      "Strategic financial planning, investment advisory, and business consulting in Gurugram, Delhi NCR. Personalized strategies for wealth creation and growth.",
    keywords: [
      "financial advisory gurugram",
      "financial planner delhi ncr",
      "investment advisory noida",
      "business consulting services",
      "wealth management gurgaon",
    ],
    whatWeOffer: [
      {
        title: "Financial Planning",
        description:
          "Comprehensive financial planning covering budgeting, goal setting, cash flow management, and long-term wealth creation strategies.",
      },
      {
        title: "Business Advisory",
        description:
          "Strategic business consulting for growth planning, operational efficiency, profitability improvement, and market expansion.",
      },
      {
        title: "Investment Advisory",
        description:
          "Personalized investment guidance across asset classes including equity, debt, mutual funds, and alternative investments.",
      },
      {
        title: "Retirement Planning",
        description:
          "Structured retirement planning with corpus estimation, investment allocation, and income strategies for a financially secure retirement.",
      },
      {
        title: "Loan & Funding Advisory",
        description:
          "Guidance on optimal funding sources, loan structuring, term sheet negotiation, and investor pitch preparation for businesses.",
      },
      {
        title: "Succession Planning",
        description:
          "Business continuity planning including ownership transfer strategies, estate planning, and intergenerational wealth transition.",
      },
    ],
    whoItsFor: [
      "Professionals planning for a secure retirement",
      "Business owners seeking strategies for growth",
      "Families planning wealth transfer across generations",
      "Startups seeking funding and financial structuring",
      "Individuals with complex financial situations requiring expert guidance",
      "NRIs managing investments and assets in India",
    ],
    process: [
      {
        step: "1",
        title: "Discovery",
        description:
          "We conduct a detailed discussion to understand your financial situation, goals, risk appetite, time horizons, and existing commitments.",
      },
      {
        step: "2",
        title: "Analysis",
        description:
          "Thorough analysis of your current financial position, gap identification, risk assessment, and opportunity mapping against your objectives.",
      },
      {
        step: "3",
        title: "Strategy",
        description:
          "Development of a customized financial strategy with specific recommendations, timelines, and actionable steps for achieving your goals.",
      },
      {
        step: "4",
        title: "Review",
        description:
          "Periodic review of your financial plan with performance tracking, rebalancing recommendations, and strategy adjustments as circumstances evolve.",
      },
    ],
    faqs: [
      {
        question: "How is financial advisory different from tax planning?",
        answer:
          "Tax planning focuses specifically on minimizing tax liability through deductions and exemptions. Financial advisory is broader—it encompasses your entire financial life including investments, insurance, retirement, estate planning, and business growth. Tax planning is one component within a comprehensive financial plan.",
      },
      {
        question: "Do you sell financial products?",
        answer:
          "We operate as fee-based advisors providing unbiased recommendations. Our advisory is product-agnostic, meaning we recommend what is best for your situation without any commission-driven bias. This ensures our advice is always aligned with your interests rather than product sales.",
      },
      {
        question: "Is there a minimum investment size to engage your services?",
        answer:
          "We work with clients across different financial stages. While our comprehensive advisory services are best suited for individuals with investable assets above Rs. 25 lakhs or businesses with annual revenue above Rs. 1 crore, we offer focused planning modules for those starting their financial journey.",
      },
      {
        question: "How often should I review my financial plan?",
        answer:
          "We recommend a formal review at least twice a year, with additional reviews triggered by major life events such as marriage, childbirth, job change, or significant market movements. Regular monitoring ensures your plan stays aligned with evolving goals and market conditions.",
      },
    ],
  },
]

export function getServiceBySlug(slug: string): ServicePageData | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

export function getAllServiceSlugs(): string[] {
  return SERVICES.map((s) => s.slug)
}
