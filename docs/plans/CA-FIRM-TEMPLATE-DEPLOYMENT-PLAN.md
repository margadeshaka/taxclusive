# CA Firm Template & CMS Deployment Plan

> **Purpose**: Transform TaxClusive into a white-label, multi-tenant SaaS platform for deploying CA/Tax firm websites with integrated CMS.
>
> **Base Project**: `/Users/hitesh.gupta/taxclusive` (Next.js 16 + PostgreSQL + Prisma)

---

## Executive Summary

This plan outlines converting the TaxClusive single-tenant application into a scalable multi-tenant SaaS platform where:
- Each CA firm gets their own branded website
- Centralized CMS for content management
- Self-service admin panel per tenant
- Subdomain or custom domain support
- Shared infrastructure, isolated data

---

## Phase 1: Database Multi-Tenancy (Week 1-2)

### 1.1 Create Tenant Model

```prisma
// Add to prisma/schema.prisma

model Tenant {
  id            String   @id @default(cuid())
  name          String   // "ABC & Associates"
  slug          String   @unique // "abc-associates"
  domain        String?  @unique // "abcassociates.com" (custom domain)
  subdomain     String   @unique // "abc.cafirms.in"

  // Branding
  logo          String?
  favicon       String?
  primaryColor  String   @default("#1e40af")
  secondaryColor String  @default("#3b82f6")

  // Business Info
  legalName     String
  phone         String
  email         String
  address       Json     // { street, city, state, pincode, country }
  gstNumber     String?

  // Settings
  isActive      Boolean  @default(true)
  plan          TenantPlan @default(STARTER)

  // Relations
  users         User[]
  blogs         Blog[]
  testimonials  Testimonial[]
  services      Service[]
  teamMembers   TeamMember[]
  faqs          FAQ[]
  pages         Page[]
  contacts      ContactForm[]
  newsletters   Newsletter[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum TenantPlan {
  STARTER    // 1 admin, basic features
  PROFESSIONAL // 3 admins, all features
  ENTERPRISE   // Unlimited, custom domain, priority support
}
```

### 1.2 Add tenantId to All Models

```prisma
model User {
  // ... existing fields
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
}

model Blog {
  // ... existing fields
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  @@index([tenantId])
  @@unique([tenantId, slug]) // Unique slug per tenant
}

// Repeat for: Testimonial, ContactForm, Newsletter, Service, TeamMember, FAQ, Page
```

### 1.3 Create Prisma Middleware for Tenant Isolation

```typescript
// lib/prisma-tenant-middleware.ts

import { Prisma } from '@prisma/client'

export function createTenantMiddleware(tenantId: string) {
  return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
    const tenantModels = ['Blog', 'User', 'Testimonial', 'ContactForm', 'Newsletter', 'Service', 'TeamMember', 'FAQ', 'Page']

    if (tenantModels.includes(params.model || '')) {
      // Auto-inject tenantId on create
      if (params.action === 'create') {
        params.args.data.tenantId = tenantId
      }

      // Auto-filter on read operations
      if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate'].includes(params.action)) {
        params.args.where = { ...params.args.where, tenantId }
      }

      // Scope updates and deletes
      if (['update', 'updateMany', 'delete', 'deleteMany'].includes(params.action)) {
        params.args.where = { ...params.args.where, tenantId }
      }
    }

    return next(params)
  }
}
```

### 1.4 Migration Strategy

```bash
# Step 1: Create migration for new schema
npx prisma migrate dev --name add_multi_tenancy

# Step 2: Create default tenant for existing data
npx prisma db execute --file ./scripts/migrate-to-multi-tenant.sql

# Step 3: Update all existing records with default tenantId
UPDATE "User" SET "tenantId" = 'default-tenant-id';
UPDATE "Blog" SET "tenantId" = 'default-tenant-id';
# ... repeat for all models
```

---

## Phase 2: Dynamic CMS Models (Week 2-3)

### 2.1 New CMS Models

```prisma
model Service {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  title       String   // "GST Registration & Filing"
  slug        String
  icon        String   // Lucide icon name
  excerpt     String   @db.Text
  content     String   @db.Text // Markdown

  // SEO
  metaTitle       String?
  metaDescription String?

  order       Int      @default(0)
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([tenantId, slug])
  @@index([tenantId])
}

model TeamMember {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  name        String
  designation String   // "Senior Partner"
  photo       String?
  bio         String?  @db.Text
  email       String?
  phone       String?
  linkedin    String?

  qualifications String[] // ["CA", "CPA", "MBA"]
  specializations String[] // ["Taxation", "Audit"]

  order       Int      @default(0)
  isActive    Boolean  @default(true)

  @@index([tenantId])
}

model FAQ {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  question    String
  answer      String   @db.Text
  category    String?  // "GST", "Income Tax", "General"

  order       Int      @default(0)
  isActive    Boolean  @default(true)

  @@index([tenantId])
}

model Page {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  title       String
  slug        String   // "about", "privacy-policy"
  content     String   @db.Text // Markdown or JSON blocks
  template    PageTemplate @default(STANDARD)

  // SEO
  metaTitle       String?
  metaDescription String?

  isPublished Boolean  @default(false)
  publishedAt DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([tenantId, slug])
  @@index([tenantId])
}

enum PageTemplate {
  STANDARD    // Simple content page
  ABOUT       // About with team section
  CONTACT     // Contact with form
  SERVICES    // Services listing
  LANDING     // Marketing landing page
}
```

### 2.2 Tenant Configuration Model

```prisma
model TenantConfig {
  id          String   @id @default(cuid())
  tenantId    String   @unique
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  // Theme
  theme       Json     // { primaryColor, secondaryColor, fonts, etc. }

  // Navigation
  headerMenu  Json     // [{ label, href, children }]
  footerMenu  Json

  // Homepage Sections
  heroConfig      Json?  // { title, subtitle, cta, backgroundImage }
  servicesConfig  Json?  // { title, subtitle, displayCount }
  testimonialsConfig Json?

  // Features
  enableBlog      Boolean @default(true)
  enableAppointment Boolean @default(true)
  enableNewsletter Boolean @default(true)
  enableWhatsApp  Boolean @default(false)
  whatsAppNumber  String?

  // Integrations
  googleAnalyticsId String?
  googleTagManagerId String?
  facebookPixelId String?

  // Email Settings
  contactEmail    String?
  notificationEmails String[] // Multiple recipients

  updatedAt   DateTime @updatedAt
}
```

---

## Phase 3: Tenant Resolution & Routing (Week 3-4)

### 3.1 Middleware for Tenant Resolution

```typescript
// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Extract tenant from subdomain or custom domain
  let tenantSlug: string | null = null

  // Pattern 1: Subdomain (abc.cafirms.in)
  const subdomain = hostname.split('.')[0]
  if (hostname.includes('cafirms.in') && subdomain !== 'www' && subdomain !== 'cafirms') {
    tenantSlug = subdomain
  }

  // Pattern 2: Custom domain lookup (would need edge function or KV store)
  if (!tenantSlug) {
    // Check custom domain mapping
    tenantSlug = await resolveCustomDomain(hostname)
  }

  // Skip for admin/api routes without tenant context
  if (request.nextUrl.pathname.startsWith('/superadmin')) {
    return NextResponse.next()
  }

  if (!tenantSlug) {
    // Redirect to main marketing site or show 404
    return NextResponse.redirect(new URL('https://cafirms.in'))
  }

  // Inject tenant context into headers
  const response = NextResponse.next()
  response.headers.set('x-tenant-slug', tenantSlug)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### 3.2 Tenant Context Provider

```typescript
// lib/tenant-context.tsx

import { createContext, useContext } from 'react'
import { Tenant, TenantConfig } from '@prisma/client'

interface TenantContextType {
  tenant: Tenant & { config: TenantConfig }
  isLoading: boolean
}

const TenantContext = createContext<TenantContextType | null>(null)

export function TenantProvider({
  children,
  tenant
}: {
  children: React.ReactNode
  tenant: Tenant & { config: TenantConfig }
}) {
  return (
    <TenantContext.Provider value={{ tenant, isLoading: false }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}
```

### 3.3 Server Component Tenant Loading

```typescript
// app/layout.tsx

import { headers } from 'next/headers'
import { getTenantBySlug } from '@/lib/tenant'
import { TenantProvider } from '@/lib/tenant-context'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const tenantSlug = headersList.get('x-tenant-slug')

  if (!tenantSlug) {
    return <MarketingSiteLayout>{children}</MarketingSiteLayout>
  }

  const tenant = await getTenantBySlug(tenantSlug)

  if (!tenant || !tenant.isActive) {
    notFound()
  }

  return (
    <html lang="en">
      <body>
        <TenantProvider tenant={tenant}>
          <ThemeProvider tenant={tenant}>
            {children}
          </ThemeProvider>
        </TenantProvider>
      </body>
    </html>
  )
}
```

---

## Phase 4: Dynamic Theming (Week 4-5)

### 4.1 Theme Generator

```typescript
// lib/theme-generator.ts

export function generateTenantTheme(tenant: Tenant & { config: TenantConfig }) {
  const { primaryColor, secondaryColor } = tenant
  const theme = tenant.config?.theme as ThemeConfig || {}

  return {
    colors: {
      primary: generateColorPalette(primaryColor),
      secondary: generateColorPalette(secondaryColor),
      accent: theme.accentColor ? generateColorPalette(theme.accentColor) : undefined,
    },
    fonts: {
      heading: theme.headingFont || 'Playfair Display',
      body: theme.bodyFont || 'Poppins',
    },
    borderRadius: theme.borderRadius || '0.5rem',
    // ... other theme properties
  }
}

function generateColorPalette(baseColor: string) {
  // Generate 50-950 shades from base color
  return {
    50: lighten(baseColor, 0.95),
    100: lighten(baseColor, 0.9),
    // ... etc
    500: baseColor,
    // ... etc
    900: darken(baseColor, 0.8),
    950: darken(baseColor, 0.9),
  }
}
```

### 4.2 CSS Variables Injection

```typescript
// components/theme-provider.tsx

export function ThemeProvider({
  children,
  tenant
}: {
  children: React.ReactNode
  tenant: Tenant & { config: TenantConfig }
}) {
  const theme = generateTenantTheme(tenant)

  return (
    <>
      <style jsx global>{`
        :root {
          --color-primary-50: ${theme.colors.primary[50]};
          --color-primary-100: ${theme.colors.primary[100]};
          --color-primary-500: ${theme.colors.primary[500]};
          --color-primary-600: ${theme.colors.primary[600]};
          --color-primary-700: ${theme.colors.primary[700]};

          --color-secondary-500: ${theme.colors.secondary[500]};

          --font-heading: '${theme.fonts.heading}', serif;
          --font-body: '${theme.fonts.body}', sans-serif;

          --radius: ${theme.borderRadius};
        }
      `}</style>
      {children}
    </>
  )
}
```

---

## Phase 5: Admin Panel Enhancement (Week 5-6)

### 5.1 Admin Dashboard Structure

```
/admin
├── /dashboard          # Stats & overview
├── /content
│   ├── /blogs          # Blog management
│   ├── /services       # Service pages
│   ├── /team           # Team members
│   ├── /testimonials   # Testimonials
│   ├── /faqs           # FAQs
│   └── /pages          # Custom pages
├── /media              # File/image manager
├── /leads
│   ├── /contacts       # Contact form submissions
│   ├── /appointments   # Appointment requests
│   └── /newsletter     # Subscribers
├── /settings
│   ├── /branding       # Logo, colors, fonts
│   ├── /business       # Business info
│   ├── /seo            # SEO defaults
│   ├── /integrations   # Analytics, email
│   └── /users          # Team access
└── /preview            # Live site preview
```

### 5.2 Content Editor Component

```typescript
// components/admin/content-editor.tsx

import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

export function ContentEditor({
  content,
  onChange
}: {
  content: string
  onChange: (content: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border rounded-lg">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  )
}
```

### 5.3 Media Manager

```typescript
// app/api/admin/media/route.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function POST(request: Request) {
  const { tenantId } = await getTenantFromSession()
  const formData = await request.formData()
  const file = formData.get('file') as File

  const key = `tenants/${tenantId}/media/${Date.now()}-${file.name}`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: file.type,
  })

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  // Upload to S3
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })

  return Response.json({
    url: `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${key}`,
    key,
  })
}
```

---

## Phase 6: Super Admin Panel (Week 6-7)

### 6.1 Super Admin Features

```
/superadmin
├── /dashboard          # Platform-wide stats
├── /tenants
│   ├── /list           # All tenants
│   ├── /create         # Onboard new tenant
│   └── /[id]           # Tenant details & management
├── /billing            # Subscription management
├── /analytics          # Cross-tenant analytics
├── /support            # Support tickets
└── /settings           # Platform settings
```

### 6.2 Tenant Onboarding Flow

```typescript
// lib/tenant-onboarding.ts

export async function createTenant(data: CreateTenantInput) {
  // 1. Validate and sanitize input
  const validated = tenantSchema.parse(data)

  // 2. Create tenant record
  const tenant = await prisma.tenant.create({
    data: {
      name: validated.name,
      slug: generateSlug(validated.name),
      subdomain: generateSubdomain(validated.name),
      legalName: validated.legalName,
      email: validated.email,
      phone: validated.phone,
      address: validated.address,
      plan: validated.plan,
    },
  })

  // 3. Create default config
  await prisma.tenantConfig.create({
    data: {
      tenantId: tenant.id,
      theme: DEFAULT_THEME,
      headerMenu: DEFAULT_HEADER_MENU,
      footerMenu: DEFAULT_FOOTER_MENU,
    },
  })

  // 4. Create admin user
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: validated.adminEmail,
      name: validated.adminName,
      password: await hashPassword(generateTempPassword()),
      role: 'ADMIN',
    },
  })

  // 5. Seed default content
  await seedDefaultContent(tenant.id)

  // 6. Configure DNS (if custom domain)
  if (validated.customDomain) {
    await configureDNS(tenant.id, validated.customDomain)
  }

  // 7. Send welcome email
  await sendWelcomeEmail(tenant, validated.adminEmail)

  return tenant
}
```

### 6.3 Default Content Seeding

```typescript
// lib/seed-default-content.ts

export async function seedDefaultContent(tenantId: string) {
  // Default services
  const defaultServices = [
    { title: 'GST Registration & Filing', slug: 'gst-services', icon: 'FileText', order: 1 },
    { title: 'Income Tax Returns', slug: 'income-tax', icon: 'Calculator', order: 2 },
    { title: 'Audit & Assurance', slug: 'audit', icon: 'ClipboardCheck', order: 3 },
    { title: 'Company Registration', slug: 'company-registration', icon: 'Building2', order: 4 },
    { title: 'Accounting Services', slug: 'accounting', icon: 'BookOpen', order: 5 },
    { title: 'Tax Planning', slug: 'tax-planning', icon: 'TrendingUp', order: 6 },
  ]

  await prisma.service.createMany({
    data: defaultServices.map(s => ({ ...s, tenantId, isActive: true, isFeatured: true })),
  })

  // Default FAQs
  const defaultFAQs = [
    { question: 'What documents are needed for GST registration?', answer: '...', category: 'GST' },
    { question: 'What is the due date for ITR filing?', answer: '...', category: 'Income Tax' },
    // ... more FAQs
  ]

  await prisma.faq.createMany({
    data: defaultFAQs.map((f, i) => ({ ...f, tenantId, order: i, isActive: true })),
  })

  // Default pages
  await prisma.page.createMany({
    data: [
      { tenantId, title: 'About Us', slug: 'about', template: 'ABOUT', content: DEFAULT_ABOUT_CONTENT },
      { tenantId, title: 'Privacy Policy', slug: 'privacy-policy', template: 'STANDARD', content: DEFAULT_PRIVACY },
      { tenantId, title: 'Terms of Service', slug: 'terms', template: 'STANDARD', content: DEFAULT_TERMS },
    ],
  })
}
```

---

## Phase 7: Deployment Infrastructure (Week 7-8)

### 7.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLOUDFLARE                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  DNS Management + SSL + DDoS Protection + Edge Caching      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         VERCEL / AWS                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐   │
│  │   Next.js App    │  │   API Routes     │  │   Edge Runtime  │   │
│  │   (SSR + SSG)    │  │   (Serverless)   │  │   (Middleware)  │   │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
           ┌──────────────┐ ┌──────────┐ ┌──────────────┐
           │  PostgreSQL  │ │  Redis   │ │     S3       │
           │  (Neon/RDS)  │ │ (Upstash)│ │ (CloudFront) │
           └──────────────┘ └──────────┘ └──────────────┘
```

### 7.2 Environment Configuration

```bash
# .env.production

# Database (Use Neon for serverless PostgreSQL)
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/cafirms?sslmode=require"

# Redis (Upstash for serverless Redis)
REDIS_URL="rediss://default:xxx@xxx.upstash.io:6379"

# AWS S3 for media storage
AWS_S3_BUCKET="cafirms-media"
AWS_CLOUDFRONT_DOMAIN="media.cafirms.in"
AWS_ACCESS_KEY_ID="xxx"
AWS_SECRET_ACCESS_KEY="xxx"

# Email (AWS SES or Resend)
EMAIL_PROVIDER="resend"
RESEND_API_KEY="re_xxx"

# Auth
NEXTAUTH_URL="https://cafirms.in"
NEXTAUTH_SECRET="xxx"

# Wildcard domain for subdomains
WILDCARD_DOMAIN="*.cafirms.in"
```

### 7.3 Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["bom1"], // Mumbai for India
  "env": {
    "DATABASE_URL": "@database-url",
    "REDIS_URL": "@redis-url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### 7.4 Custom Domain Setup

```typescript
// lib/domain-manager.ts

import { Cloudflare } from 'cloudflare'

export async function addCustomDomain(tenantId: string, domain: string) {
  const cf = new Cloudflare({ apiToken: process.env.CLOUDFLARE_API_TOKEN })

  // 1. Add domain to Cloudflare
  const zone = await cf.zones.create({ name: domain, account: { id: ACCOUNT_ID } })

  // 2. Create DNS records
  await cf.dnsRecords.create(zone.id, {
    type: 'CNAME',
    name: '@',
    content: 'cname.vercel-dns.com',
    proxied: true,
  })

  // 3. Add domain to Vercel
  await vercel.domains.add(domain, { projectId: PROJECT_ID })

  // 4. Update tenant record
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { domain },
  })

  // 5. Store zone info for SSL management
  await prisma.tenantDomain.create({
    data: {
      tenantId,
      domain,
      cloudflareZoneId: zone.id,
      sslStatus: 'PENDING',
    },
  })
}
```

---

## Phase 8: Billing & Subscriptions (Week 8-9)

### 8.1 Pricing Plans

| Feature | Starter | Professional | Enterprise |
|---------|---------|--------------|------------|
| **Price** | ₹999/mo | ₹2,499/mo | ₹4,999/mo |
| Admin Users | 1 | 3 | Unlimited |
| Blog Posts | 10 | Unlimited | Unlimited |
| Services | 6 | 12 | Unlimited |
| Team Members | 3 | 10 | Unlimited |
| Custom Domain | ❌ | ✅ | ✅ |
| Remove Branding | ❌ | ✅ | ✅ |
| Analytics | Basic | Advanced | Advanced |
| Support | Email | Priority | Dedicated |
| Backup | Weekly | Daily | Real-time |

### 8.2 Razorpay Integration

```typescript
// lib/billing/razorpay.ts

import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function createSubscription(tenantId: string, planId: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 12, // 12 months
    notes: {
      tenantId,
      tenantName: tenant!.name,
    },
  })

  await prisma.tenantSubscription.create({
    data: {
      tenantId,
      razorpaySubscriptionId: subscription.id,
      planId,
      status: 'CREATED',
      currentPeriodStart: new Date(),
      currentPeriodEnd: addMonths(new Date(), 1),
    },
  })

  return subscription
}

// Webhook handler for subscription events
export async function handleWebhook(event: RazorpayWebhookEvent) {
  switch (event.event) {
    case 'subscription.activated':
      await activateTenant(event.payload.subscription.entity.notes.tenantId)
      break
    case 'subscription.charged':
      await recordPayment(event.payload.subscription.entity)
      break
    case 'subscription.cancelled':
      await deactivateTenant(event.payload.subscription.entity.notes.tenantId)
      break
  }
}
```

---

## Phase 9: Analytics & Monitoring (Week 9-10)

### 9.1 Per-Tenant Analytics

```typescript
// lib/analytics.ts

export async function trackPageView(tenantId: string, data: PageViewData) {
  await redis.lpush(`analytics:${tenantId}:pageviews`, JSON.stringify({
    ...data,
    timestamp: Date.now(),
  }))

  // Aggregate daily stats
  const dayKey = `analytics:${tenantId}:daily:${format(new Date(), 'yyyy-MM-dd')}`
  await redis.hincrby(dayKey, 'pageviews', 1)
  await redis.expire(dayKey, 90 * 24 * 60 * 60) // 90 days retention
}

export async function getAnalytics(tenantId: string, range: 'week' | 'month' | 'year') {
  const days = range === 'week' ? 7 : range === 'month' ? 30 : 365
  const results = []

  for (let i = 0; i < days; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const dayKey = `analytics:${tenantId}:daily:${date}`
    const data = await redis.hgetall(dayKey)
    results.push({ date, ...data })
  }

  return results.reverse()
}
```

### 9.2 Platform Monitoring

```typescript
// lib/monitoring.ts

export async function getPlatformStats() {
  const [
    totalTenants,
    activeTenants,
    totalUsers,
    totalBlogs,
    totalContacts,
    mrr,
  ] = await Promise.all([
    prisma.tenant.count(),
    prisma.tenant.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.blog.count(),
    prisma.contactForm.count(),
    calculateMRR(),
  ])

  return {
    totalTenants,
    activeTenants,
    churnRate: ((totalTenants - activeTenants) / totalTenants) * 100,
    totalUsers,
    totalBlogs,
    totalContacts,
    mrr,
  }
}
```

---

## Implementation Checklist

### Database & Backend
- [ ] Create Tenant model and migrations
- [ ] Add tenantId to all existing models
- [ ] Create Prisma middleware for tenant isolation
- [ ] Migrate existing TaxClusive data to default tenant
- [ ] Create Service, TeamMember, FAQ, Page models
- [ ] Create TenantConfig model
- [ ] Build tenant resolution middleware
- [ ] Update all API routes for multi-tenancy

### Admin Panel
- [ ] Create content management CRUD for Services
- [ ] Create content management CRUD for Team
- [ ] Create content management CRUD for FAQs
- [ ] Create content management CRUD for Pages
- [ ] Build rich text editor with image upload
- [ ] Build media manager with S3 integration
- [ ] Create branding settings page
- [ ] Create SEO settings page
- [ ] Create integrations settings page

### Super Admin
- [ ] Build tenant list view
- [ ] Build tenant creation wizard
- [ ] Build tenant management (edit, deactivate)
- [ ] Build platform analytics dashboard
- [ ] Build billing management

### Frontend
- [ ] Create dynamic theme provider
- [ ] Update all components to use theme variables
- [ ] Make services section dynamic
- [ ] Make team section dynamic
- [ ] Make FAQ section dynamic
- [ ] Support dynamic page rendering

### Infrastructure
- [ ] Set up Neon PostgreSQL
- [ ] Set up Upstash Redis
- [ ] Set up S3 + CloudFront
- [ ] Configure Vercel for wildcard domains
- [ ] Set up Cloudflare for DNS
- [ ] Configure custom domain automation

### Billing
- [ ] Integrate Razorpay subscriptions
- [ ] Build subscription management UI
- [ ] Implement webhook handlers
- [ ] Build invoice generation

### Testing
- [ ] Unit tests for tenant isolation
- [ ] Integration tests for multi-tenant flows
- [ ] E2E tests for admin panel
- [ ] Load testing for concurrent tenants

---

## Timeline Summary

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | Week 1-2 | Database Multi-Tenancy |
| Phase 2 | Week 2-3 | Dynamic CMS Models |
| Phase 3 | Week 3-4 | Tenant Resolution & Routing |
| Phase 4 | Week 4-5 | Dynamic Theming |
| Phase 5 | Week 5-6 | Admin Panel Enhancement |
| Phase 6 | Week 6-7 | Super Admin Panel |
| Phase 7 | Week 7-8 | Deployment Infrastructure |
| Phase 8 | Week 8-9 | Billing & Subscriptions |
| Phase 9 | Week 9-10 | Analytics & Monitoring |

**Total Estimated Time: 10 Weeks**

---

## Usage in Another Claude Instance

To use this plan in another Claude Code session:

1. Open Claude Code in the TaxClusive project directory
2. Share this plan file or paste the relevant phase
3. Ask Claude to implement specific phases, e.g.:
   - "Implement Phase 1: Database Multi-Tenancy as per the plan"
   - "Create the Tenant and TenantConfig models from the plan"
   - "Build the admin content editor for services"

The plan provides:
- Complete Prisma schema definitions
- TypeScript code snippets for key features
- API route structures
- Component patterns
- Infrastructure configuration

---

*Generated: 2026-01-27*
*Base Project: TaxClusive v1.0*
*Target: Multi-tenant CA Firm SaaS Platform*
