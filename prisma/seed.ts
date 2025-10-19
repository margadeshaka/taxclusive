import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@taxclusive.com' },
    update: {},
    create: {
      email: 'admin@taxclusive.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 12)
  
  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@taxclusive.com' },
    update: {},
    create: {
      email: 'editor@taxclusive.com',
      name: 'Editor User',
      password: editorPassword,
      role: 'EDITOR'
    }
  })

  console.log('✅ Editor user created:', editorUser.email)

  // Create multiple blogs
  const blogs = [
    {
      title: 'Welcome to Taxclusive',
      slug: 'welcome-to-taxclusive',
      excerpt: 'Learn about our comprehensive tax and financial services and how we can help your business grow.',
      content: `# Welcome to Taxclusive

We are delighted to welcome you to Taxclusive, your trusted partner in comprehensive tax and financial services.

## Our Mission

At Taxclusive, we believe in **mastering taxes and delivering excellence**. Our mission is to provide:

- Expert tax planning and compliance
- Professional audit and assurance services
- Strategic financial advisory
- Business growth consultation

## Why Choose Us?

### 1. Experienced Team
Our qualified tax and financial professionals bring over 15 years of combined experience in taxation and financial management.

### 2. Comprehensive Services
From individual tax returns to complex corporate restructuring, we handle it all with precision and care.

### 3. Client-First Approach
We prioritize your success and work closely with you to achieve your financial goals.

## Get Started Today

Ready to experience the Taxclusive difference? [Contact us](/contact) for a free consultation.`,
      status: 'PUBLISHED' as const,
      featured: true,
      publishedAt: new Date('2025-01-01'),
      authorId: adminUser.id,
      tags: ['About', 'Introduction']
    },
    {
      title: 'Understanding Tax Deductions for Small Businesses',
      slug: 'understanding-tax-deductions-small-business',
      excerpt: 'A comprehensive guide to tax deductions available for small businesses, including home office, vehicle expenses, and professional services.',
      content: `# Understanding Tax Deductions for Small Businesses

Tax deductions are one of the most effective ways for small businesses to reduce their tax burden. In this comprehensive guide, we'll explore the key deductions available to small business owners.

## What Are Tax Deductions?

Tax deductions are expenses that can be subtracted from your business's gross income to reduce the amount of income subject to taxation. Understanding and properly claiming these deductions can significantly impact your bottom line.

### Common Business Deductions

Here are some of the most common tax deductions for small businesses:

1. **Home Office Deduction**
   - Available if you use part of your home regularly and exclusively for business
   - Can be calculated using the simplified method ($5 per square foot) or actual expenses

2. **Vehicle Expenses**
   - Mileage driven for business purposes
   - Actual vehicle expenses (gas, maintenance, insurance)

3. **Office Supplies and Equipment**
   - Computers, software, printers
   - Paper, pens, and other consumables

## Important Considerations

> **Note:** Always keep detailed records and receipts for all business expenses. The IRS may request documentation during an audit.

### Record Keeping Tips

- Use accounting software to track expenses
- Scan and digitally store all receipts
- Maintain a mileage log for vehicle deductions
- Keep records for at least 3-7 years

## Conclusion

Understanding and properly claiming tax deductions is crucial for small business success. By taking advantage of all available deductions, you can significantly reduce your tax liability and keep more money in your business.

*Need help with your business taxes? [Contact our expert team](/contact) for personalized tax planning and preparation services.*`,
      status: 'PUBLISHED' as const,
      featured: true,
      publishedAt: new Date('2025-01-15'),
      authorId: adminUser.id,
      coverImage: '/extra.png',
      tags: ['Taxation', 'Small Business']
    },
    {
      title: 'GST Registration and Compliance: A Complete Guide',
      slug: 'gst-registration-compliance-guide',
      excerpt: 'Everything you need to know about GST registration, filing requirements, and maintaining compliance for your business.',
      content: `# GST Registration and Compliance: A Complete Guide

The Goods and Services Tax (GST) has transformed the indirect tax landscape in India. This comprehensive guide will help you understand GST registration and compliance requirements.

## Who Needs to Register for GST?

GST registration is mandatory for:

- Businesses with annual turnover exceeding ₹40 lakhs (₹20 lakhs for special category states)
- Inter-state suppliers
- E-commerce operators
- Casual taxable persons
- Non-resident taxable persons

## GST Registration Process

### Step 1: Gather Required Documents
- PAN card of the business
- Aadhaar card of proprietor/partners/directors
- Proof of business address
- Bank account details
- Digital signature

### Step 2: Online Application
1. Visit the GST portal
2. Fill Form GST REG-01
3. Upload required documents
4. Submit application

### Step 3: Verification
- Application verified within 3 working days
- Additional clarifications may be sought
- GSTIN issued upon approval

## GST Compliance Requirements

### Monthly Requirements
- **GSTR-1**: Outward supplies (10th of next month)
- **GSTR-3B**: Summary return (20th of next month)

### Annual Requirements
- **GSTR-9**: Annual return
- **GSTR-9C**: Reconciliation statement (for turnover > ₹5 crores)

## Common Compliance Mistakes to Avoid

1. **Late Filing**: Attracts penalties and interest
2. **Incorrect Classification**: Wrong HSN/SAC codes
3. **Input Tax Credit Errors**: Claiming ineligible ITC
4. **Invoice Violations**: Missing mandatory fields

## Best Practices for GST Compliance

- Maintain proper books of accounts
- Reconcile data regularly
- File returns on time
- Keep updated with GST notifications
- Seek professional help when needed

## Conclusion

GST compliance is crucial for business operations. Proper understanding and timely compliance can help avoid penalties while maximizing benefits.

*Need assistance with GST registration or compliance? Our expert team is here to help. [Contact us today](/contact).*`,
      status: 'PUBLISHED' as const,
      featured: false,
      publishedAt: new Date('2025-02-01'),
      authorId: editorUser.id,
      coverImage: '/insights2.png',
      tags: ['GST', 'Compliance', 'Taxation']
    },
    {
      title: 'Financial Planning for Retirement: Start Early, Retire Comfortably',
      slug: 'financial-planning-retirement',
      excerpt: 'Learn effective strategies for retirement planning, including investment options, tax-saving instruments, and creating a sustainable retirement corpus.',
      content: `# Financial Planning for Retirement: Start Early, Retire Comfortably

Retirement planning is one of the most crucial aspects of financial management. The earlier you start, the more comfortable your retirement will be.

## Why Retirement Planning Matters

With increasing life expectancy and rising inflation, having a substantial retirement corpus is no longer optional—it's essential.

### Key Considerations
- **Inflation Impact**: ₹100 today will be worth much less in 20-30 years
- **Medical Expenses**: Healthcare costs typically increase with age
- **Lifestyle Maintenance**: Ensuring quality of life post-retirement

## Retirement Planning Strategies

### 1. Start Early
The power of compounding works best when you have time on your side.

**Example**: Starting at age 25 vs 35
- 25-year-old investing ₹5,000/month for 35 years
- 35-year-old needs to invest ₹15,000/month for 25 years
- Both achieve similar corpus at age 60

### 2. Diversify Your Portfolio

**Recommended Asset Allocation by Age**:
- 20s-30s: 70% Equity, 20% Debt, 10% Gold
- 40s: 60% Equity, 30% Debt, 10% Gold
- 50s: 40% Equity, 50% Debt, 10% Gold
- 60s+: 20% Equity, 70% Debt, 10% Gold

### 3. Tax-Efficient Investments

Maximize tax benefits while building retirement corpus:

- **PPF**: Tax-free returns, 15-year lock-in
- **EPF**: Employer contribution bonus
- **NPS**: Additional ₹50,000 deduction under 80CCD(1B)
- **ELSS**: Tax saving with equity exposure

## Creating Your Retirement Corpus

### Step 1: Calculate Required Corpus
- Estimate monthly expenses in retirement
- Factor in 6-7% inflation
- Plan for 25-30 years post-retirement

### Step 2: Review and Rebalance
- Annual portfolio review
- Rebalance based on age and risk profile
- Increase contributions with salary hikes

## Common Retirement Planning Mistakes

1. **Starting Late**: Losing compounding benefits
2. **Underestimating Expenses**: Not factoring healthcare costs
3. **No Inflation Adjustment**: Fixed return expectations
4. **Inadequate Insurance**: Health and life cover gaps

## Conclusion

Retirement planning is a marathon, not a sprint. Start early, stay disciplined, and review regularly for a comfortable retirement.

*Need personalized retirement planning advice? Our financial experts can help create a customized plan. [Schedule a consultation](/contact).*`,
      status: 'PUBLISHED' as const,
      featured: true,
      publishedAt: new Date('2025-02-15'),
      authorId: adminUser.id,
      coverImage: '/insights3.png',
      tags: ['Financial Planning', 'Retirement', 'Investment']
    },
    {
      title: 'Audit and Assurance: Building Trust in Your Financial Statements',
      slug: 'audit-assurance-financial-trust',
      excerpt: 'Understand the importance of regular audits, different types of audits, and how they help build stakeholder confidence in your business.',
      content: `# Audit and Assurance: Building Trust in Your Financial Statements

In today's business environment, transparency and accountability are paramount. Regular audits play a crucial role in building trust with stakeholders and ensuring financial integrity.

## What is an Audit?

An audit is an independent examination of financial statements to ensure they present a true and fair view of the company's financial position.

## Types of Audits

### 1. Statutory Audit
- Mandatory for companies as per Companies Act
- Annual examination of books of accounts
- Ensures compliance with legal requirements

### 2. Internal Audit
- Continuous evaluation of internal controls
- Risk assessment and mitigation
- Process improvement recommendations

### 3. Tax Audit
- Required when turnover exceeds specified limits
- Verifies tax compliance
- Identifies tax planning opportunities

### 4. Special Purpose Audit
- Due diligence for M&A
- Bank loan audits
- Grant utilization audits

## Benefits of Regular Audits

### For Business Owners
- **Early Problem Detection**: Identify issues before they escalate
- **Improved Controls**: Strengthen internal processes
- **Better Decision Making**: Reliable financial data

### For Stakeholders
- **Transparency**: Clear view of financial health
- **Credibility**: Third-party validation
- **Compliance**: Assurance of regulatory adherence

## The Audit Process

1. **Planning Phase**
   - Understanding business operations
   - Risk assessment
   - Audit strategy development

2. **Execution Phase**
   - Testing internal controls
   - Substantive procedures
   - Evidence gathering

3. **Reporting Phase**
   - Draft findings
   - Management discussion
   - Final audit report

## Key Audit Focus Areas

### Revenue Recognition
- Proper recording of sales
- Cut-off procedures
- Credit note management

### Inventory Valuation
- Physical verification
- Valuation methods
- Obsolescence provisions

### Related Party Transactions
- Identification and disclosure
- Arm's length pricing
- Approval procedures

## Preparing for an Audit

### Documentation Checklist
- ✓ Updated books of accounts
- ✓ Bank reconciliations
- ✓ Supporting invoices and receipts
- ✓ Contracts and agreements
- ✓ Board meeting minutes
- ✓ Regulatory compliance certificates

## Common Audit Findings and Solutions

| Finding | Impact | Solution |
|---------|--------|----------|
| Weak internal controls | Fraud risk | Implement segregation of duties |
| Poor documentation | Compliance issues | Establish document retention policy |
| Reconciliation gaps | Inaccurate reporting | Monthly reconciliation process |
| Non-compliance | Penalties | Regular compliance calendar |

## Conclusion

Regular audits are not just a compliance requirement but a valuable tool for business improvement. They provide insights, build credibility, and help maintain financial discipline.

*Looking for professional audit services? Our experienced team provides comprehensive audit and assurance solutions. [Get in touch](/contact) for a consultation.*`,
      status: 'PUBLISHED' as const,
      featured: false,
      publishedAt: new Date('2025-03-01'),
      authorId: editorUser.id,
      tags: ['Audit', 'Compliance', 'Financial Management']
    }
  ];

  // Create tags first
  const tagNames = [...new Set(blogs.flatMap(blog => blog.tags))];
  for (const tagName of tagNames) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-')
      }
    });
  }

  // Create blogs with tags
  for (const blogData of blogs) {
    const { tags, ...blog } = blogData;
    const createdBlog = await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: {
        ...blog,
        tags: {
          connect: tags.map(tagName => ({ name: tagName }))
        }
      }
    });
    console.log('✅ Blog created:', createdBlog.title);
  }

  // Create multiple testimonials
  const testimonials = [
    {
      id: 'testimonial-1',
      name: 'Rahul Sharma',
      designation: 'CEO & Founder',
      company: 'TechStart Solutions',
      location: 'Mumbai',
      content: 'Taxclusive has been instrumental in managing our company finances. Their expertise in tax planning has saved us significant costs while ensuring full compliance. The team is professional, responsive, and always available when we need them.',
      rating: 5,
      featured: true,
      approved: true,
      authorId: adminUser.id
    },
    {
      id: 'testimonial-2',
      name: 'Priya Patel',
      designation: 'Managing Director',
      company: 'Patel Textiles Pvt Ltd',
      location: 'Ahmedabad',
      content: 'We have been working with Taxclusive for over 3 years now. Their GST consultation and compliance services have been exceptional. They helped us navigate the complex GST regulations smoothly and efficiently.',
      rating: 5,
      featured: true,
      approved: true,
      authorId: adminUser.id
    },
    {
      id: 'testimonial-3',
      name: 'Amit Verma',
      designation: 'CFO',
      company: 'GreenTech Industries',
      location: 'Bangalore',
      content: 'The audit services provided by Taxclusive are thorough and professional. They identified several areas for improvement in our internal controls, which has helped us strengthen our financial processes significantly.',
      rating: 5,
      featured: true,
      approved: true,
      authorId: editorUser.id
    },
    {
      id: 'testimonial-4',
      name: 'Sneha Gupta',
      designation: 'Proprietor',
      company: 'Gupta & Associates',
      location: 'Delhi',
      content: 'As a small business owner, I was overwhelmed with tax compliance. Taxclusive simplified everything for me. Their personalized approach and clear explanations have made tax planning stress-free.',
      rating: 5,
      featured: false,
      approved: true,
      authorId: adminUser.id
    },
    {
      id: 'testimonial-5',
      name: 'Rajesh Kumar',
      designation: 'Director',
      company: 'Kumar Exports',
      location: 'Chennai',
      content: 'Excellent financial advisory services! Taxclusive helped us restructure our business for better tax efficiency. Their strategic advice has resulted in substantial savings and improved cash flow.',
      rating: 5,
      featured: false,
      approved: true,
      authorId: editorUser.id
    },
    {
      id: 'testimonial-6',
      name: 'Anita Desai',
      designation: 'Finance Head',
      company: 'Desai Pharmaceuticals',
      location: 'Pune',
      content: 'The team at Taxclusive is highly knowledgeable and professional. They handled our company incorporation and ongoing compliance seamlessly. I highly recommend their services to any business looking for reliable CA services.',
      rating: 5,
      featured: true,
      approved: true,
      authorId: adminUser.id
    }
  ];

  for (const testimonial of testimonials) {
    const created = await prisma.testimonial.upsert({
      where: { id: testimonial.id },
      update: {},
      create: testimonial
    });
    console.log('✅ Testimonial created:', created.name);
  }

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('Admin: admin@taxclusive.com / admin123')
  console.log('Editor: editor@taxclusive.com / editor123')
  console.log('\n📊 Seeded Data:')
  console.log(`- ${blogs.length} blog posts`)
  console.log(`- ${testimonials.length} testimonials`)
  console.log(`- ${tagNames.length} tags`)
  console.log('- 2 users (Admin & Editor)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })