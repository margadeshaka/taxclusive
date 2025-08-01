import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@taxexclusive.com' },
    update: {},
    create: {
      email: 'admin@taxexclusive.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 12)
  
  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@taxexclusive.com' },
    update: {},
    create: {
      email: 'editor@taxexclusive.com',
      name: 'Editor User',
      password: editorPassword,
      role: 'EDITOR'
    }
  })

  console.log('✅ Editor user created:', editorUser.email)

  // Create sample blog
  const sampleBlog = await prisma.blog.upsert({
    where: { slug: 'welcome-to-taxexclusive' },
    update: {},
    create: {
      title: 'Welcome to TaxExclusive',
      slug: 'welcome-to-taxexclusive',
      excerpt: 'Learn about our comprehensive chartered accountancy services and how we can help your business grow.',
      content: `# Welcome to TaxExclusive

We are delighted to welcome you to TaxExclusive, your trusted partner in comprehensive chartered accountancy services.

## Our Mission

At TaxExclusive, we believe in **mastering taxes and delivering excellence**. Our mission is to provide:

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

Ready to experience the TaxExclusive difference? [Contact us](/contact) for a free consultation.

---

*This blog post was created to demonstrate the content management capabilities of our admin portal.*`,
      status: 'PUBLISHED',
      featured: true,
      publishedAt: new Date(),
      authorId: adminUser.id
    }
  })

  console.log('✅ Sample blog created:', sampleBlog.title)

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
      content: 'TaxExclusive has been instrumental in managing our company finances. Their expertise in tax planning has saved us significant costs while ensuring full compliance.',
      rating: 5,
      featured: true,
      approved: true,
      authorId: adminUser.id
    }
  })

  console.log('✅ Sample testimonial created:', sampleTestimonial.name)

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('Admin: admin@taxexclusive.com / admin123')
  console.log('Editor: editor@taxexclusive.com / editor123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })