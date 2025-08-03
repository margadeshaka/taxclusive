import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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

  // Create sample blog
  const sampleBlog = await prisma.blog.upsert({
    where: { slug: 'welcome-to-taxclusive' },
    update: {},
    create: {
      title: 'Welcome to Taxclusive',
      slug: 'welcome-to-taxclusive',
      excerpt: 'Learn about our comprehensive chartered accountancy services and how we can help your business grow.',
      content: `# Welcome to Taxclusive

We are delighted to welcome you to Taxclusive, your trusted partner in comprehensive chartered accountancy services.

## Our Mission

At Taxclusive, we believe in **mastering taxes and delivering excellence**. Our mission is to provide:

- Expert tax planning and compliance
- Professional audit and assurance services
- Strategic financial advisory
- Business growth consultation

## Why Choose Us?

### 1. Experienced Team
Our qualified Chartered Accountants bring over 15 years of combined experience in taxation and financial management.

### 2. Comprehensive Services
From individual tax returns to complex corporate restructuring, we handle it all with precision and care.

### 3. Client-First Approach
We prioritize your success and work closely with you to achieve your financial goals.

## Get Started Today

Ready to experience the Taxclusive difference? [Contact us](/contact) for a free consultation.

---

*This blog post was created to demonstrate the content management capabilities of our admin portal.*`,
      status: 'PUBLISHED',
      featured: true,
      publishedAt: new Date(),
      authorId: adminUser.id
    }
  })

  console.log('✅ Sample blog created:', sampleBlog.title)

  // Create MDX blog post
  const mdxContent = `# Understanding Tax Deductions for Small Businesses

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

## Calculating Your Deductions

Here's a simple example of how deductions work:

\`\`\`javascript
// Example tax calculation
const grossIncome = 100000;
const deductions = {
  homeOffice: 1500,
  vehicleExpenses: 3000,
  officeSupplies: 2000,
  professionalServices: 5000
};

const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
const taxableIncome = grossIncome - totalDeductions;

console.log(\`Taxable Income: $\${taxableIncome}\`);
// Output: Taxable Income: $88500
\`\`\`

## Important Considerations

> **Note:** Always keep detailed records and receipts for all business expenses. The IRS may request documentation during an audit.

### Record Keeping Tips

- Use accounting software to track expenses
- Scan and digitally store all receipts
- Maintain a mileage log for vehicle deductions
- Keep records for at least 3-7 years

## Professional Services Deductions

Professional services that are deductible include:

| Service Type | Examples | Typical Deductibility |
|-------------|----------|----------------------|
| Legal Services | Business formation, contracts | 100% deductible |
| Accounting | Tax preparation, bookkeeping | 100% deductible |
| Consulting | Business strategy, marketing | 100% deductible |
| Insurance | Professional liability, business | 100% deductible |

## Maximizing Your Deductions

To maximize your tax deductions:

1. **Plan Ahead**: Track expenses throughout the year
2. **Stay Informed**: Tax laws change regularly
3. **Consult Professionals**: Work with a qualified tax professional
4. **Document Everything**: Maintain comprehensive records

## Conclusion

Understanding and properly claiming tax deductions is crucial for small business success. By taking advantage of all available deductions, you can significantly reduce your tax liability and keep more money in your business.

---

*Need help with your business taxes? [Contact our expert team](/contact) for personalized tax planning and preparation services.*`;

  const mdxBlog = await prisma.blog.upsert({
    where: { slug: 'understanding-tax-deductions-small-business' },
    update: {},
    create: {
      title: 'Understanding Tax Deductions for Small Businesses',
      slug: 'understanding-tax-deductions-small-business',
      excerpt: 'A comprehensive guide to tax deductions available for small businesses, including home office, vehicle expenses, and professional services.',
      content: mdxContent,
      status: 'PUBLISHED',
      featured: true,
      publishedAt: new Date(),
      authorId: adminUser.id
    }
  })

  console.log('✅ MDX blog created:', mdxBlog.title)

  // Create sample testimonial
  const sampleTestimonial = await prisma.testimonial.upsert({
    where: { id: 'sample-testimonial' },
    update: {},
    create: {
      id: 'sample-testimonial',
      name: 'Rahul Sharma',
      designation: 'Business Owner',
      company: 'Sharma Enterprises',
      location: 'Delhi',
      content: 'Taxclusive has been instrumental in managing our company finances. Their expertise in tax planning has saved us significant costs while ensuring full compliance.',
      rating: 5,
      featured: true,
      approved: true,
      authorId: adminUser.id
    }
  })

  console.log('✅ Sample testimonial created:', sampleTestimonial.name)

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('Admin: admin@taxclusive.com / admin123')
  console.log('Editor: editor@taxclusive.com / editor123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })