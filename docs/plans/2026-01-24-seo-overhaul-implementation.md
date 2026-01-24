# SEO & Internet Reachability Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Taxclusive discoverable via local search (Delhi NCR) and content-driven organic traffic through technical SEO fixes, dynamic sitemap, blog SEO admin fields, service pages, location pages, internal linking, and structured data.

**Architecture:** Leverage existing `lib/metadata.ts` and `lib/seo-config.ts` infrastructure. Add SEO fields to Prisma Blog model. Create template-driven service and location pages using `generateStaticParams`. Replace static sitemap with database-driven dynamic one.

**Tech Stack:** Next.js 15 App Router metadata API, Prisma ORM, TypeScript, Tailwind/Shadcn UI

**Note on structured data:** All JSON-LD structured data in this plan uses `dangerouslySetInnerHTML` which is the standard Next.js pattern for inserting schema markup. The content is always generated from our own static configuration (not user input), so there is no XSS risk.

---

## Task 1: Fix Domain Inconsistencies and Delete Conflicting Static Files

**Files:**
- Delete: `public/sitemap.xml`
- Delete: `public/robots.txt`
- Modify: `app/blogs/[slug]/page.tsx:49` (fix domain and param names)
- Modify: `app/services/page.tsx` (fix areaServed "United States")

**Step 1: Delete conflicting static files**

```bash
rm /Users/hitesh.gupta/taxclusive/public/sitemap.xml
rm /Users/hitesh.gupta/taxclusive/public/robots.txt
```

These conflict with the existing `app/sitemap.ts` and the `app/robots.ts` we will create.

**Step 2: Fix blog detail page domain and params**

In `app/blogs/[slug]/page.tsx`, the `generateMetadata` function (lines 45-53) passes wrong parameter names. Change:
```typescript
return generateBlogMetadata({
  title: blog.title,
  description: blog.excerpt || blog.content?.substring(0, 160) + "...",
  image: blog.featured_image?.url,
  url: `https://taxexclusive.com/blogs/${slug}`,
  publishedTime: blog.published_at,
  authorName: blog.author?.name || "Taxclusive Team",
  tags: blog.tags?.map((tag: { name: string }) => tag.name),
});
```
to:
```typescript
return generateBlogMetadata({
  title: blog.title,
  description: blog.excerpt || blog.content?.substring(0, 160),
  image: blog.coverImage,
  type: "article",
  canonical: `/blogs/${slug}`,
  publishedTime: blog.publishedAt?.toISOString(),
  author: blog.author?.name || "Taxclusive Team",
  keywords: blog.tags?.map((tag: { name: string }) => tag.name),
});
```

**Step 3: Fix services page areaServed**

In `app/services/page.tsx`, find the structured data section where `areaServed` is `"United States"` and change to:
```typescript
areaServed: [
  { "@type": "City", name: "Gurugram" },
  { "@type": "City", name: "Delhi" },
  { "@type": "City", name: "Noida" },
  { "@type": "City", name: "Ghaziabad" },
  { "@type": "City", name: "Faridabad" },
  { "@type": "City", name: "Greater Noida" },
]
```

**Step 4: Commit**

```bash
git add -A && git commit -m "fix: resolve domain inconsistencies and delete conflicting static SEO files"
```

---

## Task 2: Create Dynamic robots.ts

**Files:**
- Create: `app/robots.ts`

**Step 1: Create the file**

Create `app/robots.ts`:
```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.taxclusive.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services/", "/blogs/", "/locations/", "/about", "/contact", "/faq", "/expertise", "/appointment", "/insights"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: ["AhrefsBot", "MJ12bot", "SemrushBot", "DotBot"],
        disallow: "/",
      },
      {
        userAgent: ["GPTBot", "Claude-Web", "CCBot"],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

**Step 2: Commit**

```bash
git add app/robots.ts && git commit -m "feat: add dynamic robots.ts replacing static robots.txt"
```

---

## Task 3: Make Sitemap Dynamic (Database-Driven)

**Files:**
- Modify: `app/sitemap.ts`

**Step 1: Rewrite sitemap**

Replace entire content of `app/sitemap.ts`:
```typescript
import { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.taxclusive.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    blogEntries = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    blogEntries = [];
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/expertise`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/appointment`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/insights`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/ask-query`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const servicePages: MetadataRoute.Sitemap = [
    "tax-planning", "gst-compliance", "audit-assurance", "business-registration", "financial-advisory",
  ].map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const locationPages: MetadataRoute.Sitemap = [
    "gurugram", "delhi", "noida", "ghaziabad", "faridabad", "greater-noida",
  ].map((city) => ({
    url: `${baseUrl}/locations/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages, ...locationPages, ...blogEntries];
}
```

**Step 2: Commit**

```bash
git add app/sitemap.ts && git commit -m "feat: make sitemap dynamic with database-driven blog entries"
```

---

## Task 4: Add SEO Fields to Prisma Blog Model

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Add fields to Blog model**

After `featured Boolean @default(false)` (line 89), add:
```prisma
  metaTitle       String?
  metaDescription String?
  focusKeyword    String?
  ogImage         String?
```

**Step 2: Push to database**

```bash
DATABASE_URL="postgresql://hitesh.gupta@localhost:5432/taxclusive" npx prisma db push
```

**Step 3: Commit**

```bash
git add prisma/schema.prisma && git commit -m "feat: add SEO fields to Blog model"
```

---

## Task 5: Create SEO Score Panel Component

**Files:**
- Create: `components/admin/seo-score-panel.tsx`

**Step 1: Create the component**

Create `components/admin/seo-score-panel.tsx` with a client component that:
- Accepts: title, metaTitle, metaDescription, focusKeyword, slug, content, coverImage
- Evaluates 9 checks: title length (50-60 chars), description length (150-160 chars), keyword in title, keyword in description, keyword in slug, keyword in first paragraph, content length (300+ words), cover image present, internal links present
- Shows colored indicators (green/yellow/red) with CheckCircle/AlertCircle/XCircle icons
- Shows overall score as "X/9 passed"
- Wrapped in a Collapsible Card

Each check returns `{label, status: "pass"|"warn"|"fail", message}`. The panel renders them as a list.

**Step 2: Commit**

```bash
git add components/admin/seo-score-panel.tsx && git commit -m "feat: add SEO score panel component for blog admin"
```

---

## Task 6: Update Admin Blog Forms with SEO Fields

**Files:**
- Modify: `app/admin/blogs/new/page.tsx`
- Modify: `app/admin/blogs/[id]/page.tsx`

**Step 1: Update new blog form**

1. Add to formData state: `slug`, `metaTitle`, `metaDescription`, `focusKeyword`, `ogImage` (all empty strings)
2. Import `SeoScorePanel` from `@/components/admin/seo-score-panel`
3. Add `generateSlug` helper function
4. Auto-generate slug from title on change (only if slug is still empty/auto)
5. Replace the "Media & SEO" card with expanded fields: slug input (with preview), meta title (with char counter), meta description textarea (with char counter), focus keyword, cover image URL, OG image URL, tags
6. Add `<SeoScorePanel ... />` below the SEO card
7. Include new fields in handleSubmit POST body

**Step 2: Update edit blog form**

Same changes as Step 1, plus:
- Populate SEO fields from fetched blog data in `fetchBlog()`
- Allow slug editing (with uniqueness handled by API)
- Include new fields in PUT body

**Step 3: Commit**

```bash
git add app/admin/blogs/new/page.tsx app/admin/blogs/[id]/page.tsx && git commit -m "feat: add SEO fields and score panel to blog admin forms"
```

---

## Task 7: Update Blog API Routes for SEO Fields

**Files:**
- Modify: `app/api/admin/blogs/route.ts`
- Modify: `app/api/admin/blogs/[id]/route.ts`

**Step 1: Update POST route**

In `app/api/admin/blogs/route.ts`:
- Destructure `slug: customSlug, metaTitle, metaDescription, focusKeyword, ogImage` from request body
- If `customSlug` is non-empty, use it (after uniqueness check); otherwise generate from title
- Add SEO fields to `prisma.blog.create` data (null if empty)

**Step 2: Update PUT route**

In `app/api/admin/blogs/[id]/route.ts`:
- Destructure new fields from request body
- If `customSlug` provided and different from current, use it (check uniqueness excluding current blog)
- Add SEO fields to `prisma.blog.update` data

**Step 3: Commit**

```bash
git add app/api/admin/blogs/route.ts app/api/admin/blogs/[id]/route.ts && git commit -m "feat: handle SEO fields in blog API routes"
```

---

## Task 8: Update Blog Detail Page to Use SEO Fields

**Files:**
- Modify: `app/blogs/[slug]/page.tsx`

**Step 1: Update generateMetadata**

Use SEO fields with fallbacks:
```typescript
return generateBlogMetadata({
  title: blog.metaTitle || blog.title,
  description: blog.metaDescription || blog.excerpt || blog.content?.substring(0, 160),
  image: blog.ogImage || blog.coverImage,
  type: "article",
  canonical: `/blogs/${slug}`,
  publishedTime: blog.publishedAt?.toISOString(),
  modifiedTime: blog.updatedAt?.toISOString(),
  author: blog.author?.name || "Taxclusive Team",
  keywords: [
    ...(blog.focusKeyword ? [blog.focusKeyword] : []),
    ...(blog.tags?.map((tag: { name: string }) => tag.name) || []),
  ],
});
```

**Step 2: Add Article structured data**

Import `generateArticleStructuredData` from `@/lib/metadata` and render as a script tag in the page body with blog data.

**Step 3: Commit**

```bash
git add app/blogs/[slug]/page.tsx && git commit -m "feat: use SEO fields in blog detail page metadata and structured data"
```

---

## Task 9: Create Service Pages Data Config

**Files:**
- Create: `lib/data/services.ts`

**Step 1: Create the file**

Define `ServicePageData` interface with: slug, title, headline, description, metaTitle, metaDescription, keywords, whatWeOffer, whoItsFor, process, faqs.

Export `SERVICES` array with 5 entries:
1. `tax-planning` — Income Tax Filing & Planning
2. `gst-compliance` — GST Registration & Filing
3. `audit-assurance` — Audit & Assurance Services
4. `business-registration` — Company Incorporation
5. `financial-advisory` — Financial Planning & Advisory

Each has: localized meta titles targeting Delhi NCR queries, 4-6 sub-services in whatWeOffer, 6 target audience items, 4-step process, 4 FAQs with detailed answers.

Export helpers: `getServiceBySlug(slug)`, `getAllServiceSlugs()`.

**Step 2: Commit**

```bash
git add lib/data/services.ts && git commit -m "feat: add service pages data configuration"
```

---

## Task 10: Create Service Detail Page

**Files:**
- Create: `app/services/[slug]/page.tsx`

**Step 1: Create the page**

Server component with:
- `generateStaticParams()` from `getAllServiceSlugs()`
- `generateMetadata()` using `generatePageMetadata()` from `lib/metadata.ts`
- Page sections: Hero (with breadcrumb nav, h1, description, CTA), What We Offer (3-col grid), Who It's For (checkmark list), Our Process (4-col steps), FAQ (details/summary), CTA footer
- Three JSON-LD scripts: Service schema, FAQ schema, BreadcrumbList schema
- Uses existing `generateServiceStructuredData`, `generateFAQStructuredData`, `generateBreadcrumbStructuredData` from `lib/metadata.ts`

**Step 2: Commit**

```bash
git add app/services/[slug]/page.tsx && git commit -m "feat: add individual service detail pages with structured data"
```

---

## Task 11: Create Location Pages Data Config

**Files:**
- Create: `lib/data/locations.ts`

**Step 1: Create the file**

Define `LocationPageData` interface with: slug, city, metaTitle, metaDescription, keywords, isPrimaryOffice, description, localities, whyChooseUs, faqs.

Export `LOCATIONS` array with 6 entries:
1. `gurugram` (isPrimaryOffice: true) — primary office, Sector 48 Sohna Road
2. `delhi` — South Delhi, Central Delhi, Dwarka etc.
3. `noida` — Sector 18, 62, 63 etc.
4. `ghaziabad` — Indirapuram, Vaishali, Raj Nagar
5. `faridabad` — Neharpar, Sector 15, Ballabgarh
6. `greater-noida` — Knowledge Park, Pari Chowk, Noida Extension

Each has: city-specific meta titles, 12 localities, 4 trust signals in whyChooseUs, 3 city-specific FAQs.

Export helpers: `getLocationBySlug(slug)`, `getAllLocationSlugs()`.

**Step 2: Commit**

```bash
git add lib/data/locations.ts && git commit -m "feat: add location pages data for Delhi NCR cities"
```

---

## Task 12: Create Location Page Component

**Files:**
- Create: `app/locations/[city]/page.tsx`

**Step 1: Create the page**

Server component with:
- `generateStaticParams()` from `getAllLocationSlugs()`
- `generateMetadata()` using `generatePageMetadata()`
- Page sections: Hero (city name, description, CTA), Services Available (5 linked cards), Why Choose Us (2-col grid), Areas Served (pill/tag layout), Contact Info (office address for Gurugram, "serving from Gurugram" for others), FAQ, CTA footer
- Three JSON-LD scripts: LocalBusiness schema (with areaServed localities), FAQ schema, BreadcrumbList schema
- LocalBusiness schema built inline with proper `address` (including state: Haryana or UP depending on city)

**Step 2: Commit**

```bash
git add app/locations/[city]/page.tsx && git commit -m "feat: add location pages for Delhi NCR cities"
```

---

## Task 13: Update Footer with Service and Location Links

**Files:**
- Modify: `components/footer.tsx`

**Step 1: Update Services column**

Replace the existing services list (which all point to `/services`) with links to individual service pages: `/services/tax-planning`, `/services/gst-compliance`, etc.

**Step 2: Add Locations column**

Add a new column (or nest under existing) with links to all 6 location pages. Adjust grid layout if needed (e.g., `lg:grid-cols-5` or combine Quick Links and Locations).

**Step 3: Commit**

```bash
git add components/footer.tsx && git commit -m "feat: add service and location links to footer"
```

---

## Task 14: Link Services Overview Cards to Detail Pages

**Files:**
- Find and modify the component rendering service cards (likely in `components/features/services/`)

**Step 1: Update service cards**

Each of the 5 core service cards should link to its detail page. Find the component (probably `CoreServicesSection`) and wrap each card in `<Link href="/services/{slug}">` or add a "Learn More" link.

Map service names to slugs:
- Tax Planning → `/services/tax-planning`
- GST Compliance → `/services/gst-compliance`
- Audit & Assurance → `/services/audit-assurance`
- Business Registration → `/services/business-registration`
- Financial Advisory → `/services/financial-advisory`

**Step 2: Commit**

```bash
git add . && git commit -m "feat: link service overview cards to detail pages"
```

---

## Task 15: Add Related Posts to Blog Detail Page

**Files:**
- Create: `components/blog/related-posts.tsx`
- Modify: `app/blogs/[slug]/page.tsx`

**Step 1: Create RelatedPosts server component**

Accepts `currentSlug` and `tagIds`. Queries database for 3 published blogs sharing tags (excluding current). Falls back to 3 most recent if no matches. Renders as a grid of linked cards with title and excerpt.

**Step 2: Add to blog page**

Import and render `<RelatedPosts>` after blog content, passing current slug and tag IDs.

**Step 3: Commit**

```bash
git add components/blog/related-posts.tsx app/blogs/[slug]/page.tsx && git commit -m "feat: add related posts to blog detail pages"
```

---

## Task 16: Final Build Verification

**Step 1: Full build**

```bash
cd /Users/hitesh.gupta/taxclusive && pnpm build
```

Fix any type errors or build failures.

**Step 2: Spot-check routes**

Start dev server and verify:
- `/services/tax-planning` renders with structured data
- `/locations/gurugram` renders with LocalBusiness schema
- `/sitemap.xml` includes all new pages and database blogs
- `/robots.txt` renders correctly
- Blog admin shows SEO fields and score panel
- Blog detail pages show Article schema

**Step 3: Fix and commit if needed**

```bash
git add -A && git commit -m "fix: address issues found during final verification"
```
