import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function cleanupTestData() {
  // Clean up test data created during E2E tests
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: '@test.com'
      }
    }
  })

  await prisma.blog.deleteMany({
    where: {
      title: {
        contains: 'E2E Test'
      }
    }
  })

  await prisma.testimonial.deleteMany({
    where: {
      name: {
        contains: 'Test Client'
      }
    }
  })

  await prisma.contactForm.deleteMany({
    where: {
      email: {
        contains: '@test.com'
      }
    }
  })

  await prisma.newsletter.deleteMany({
    where: {
      email: {
        contains: 'test@example.com'
      }
    }
  })
}

export async function seedTestUsers() {
  // Ensure test users exist
  const adminPassword = await bcrypt.hash('admin123', 12)
  const editorPassword = await bcrypt.hash('editor123', 12)

  await prisma.user.upsert({
    where: { email: 'admin@taxexclusive.com' },
    update: {},
    create: {
      email: 'admin@taxexclusive.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  await prisma.user.upsert({
    where: { email: 'editor@taxexclusive.com' },
    update: {},
    create: {
      email: 'editor@taxexclusive.com',
      name: 'Editor User',
      password: editorPassword,
      role: 'EDITOR'
    }
  })
}

export async function setupDatabase() {
  await seedTestUsers()
  await cleanupTestData()
}

export async function teardownDatabase() {
  await cleanupTestData()
  await prisma.$disconnect()
}