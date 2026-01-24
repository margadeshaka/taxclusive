# SEO & Internet Reachability Overhaul

## Goal

Mature Taxclusive for SEO and internet discoverability, targeting both local search (Delhi NCR service queries) and content-driven organic traffic (tax/finance informational queries).

## Current State

- Site is live at taxclusive.com, indexed by Google
- Basic SEO exists: robots.txt, static sitemap (27 URLs), structured data on homepage, OG tags
- Bugs: homepage canonical points to /contact, OG tags show wrong content
- No SEO fields in admin blog form
- No individual service pages (only /services overview)
- Location pages referenced in sitemap but may not exist
- Static sitemap doesn't auto-update with new blogs

---

## Section 1: Bug Fixes & Technical SEO Foundation

### Canonical URL Fix
Each page needs its own correct canonical URL set in its Next.js metadata export. The homepage currently incorrectly sets canonical to `/contact`.

### OG Tag Fix
Each page needs OG title, description, and image matching its actual content. Homepage currently references a blog post.

### Dynamic Sitemap (`/app/sitemap.ts`)
Replace static `public/sitemap.xml` with Next.js dynamic sitemap:
- Pull published blogs from database with `updatedAt` timestamps
- Include all static pages with correct priorities
- Include new service and location pages
- Regenerate on each request

### Per-Page Metadata
Each page's `metadata` export includes:
- Unique title: `{Page Topic} | Taxclusive - Tax & Financial Services Delhi NCR`
- Unique meta description (150-160 chars, keyword-rich)
- Correct canonical URL
- Proper OG image (page-specific or default fallback)
- `alternates.languages` for `en-IN` and `hi-IN`

### robots.txt
Convert to dynamic `app/robots.ts`. Fix Host directive for consistency (www vs non-www with redirect for the other).

---

## Section 2: Blog SEO Management in Admin

### Database Changes (Prisma)
Add fields to Blog model:
- `metaTitle` (String?, optional) — custom SEO title, falls back to blog title
- `metaDescription` (String?, optional) — custom meta description, falls back to excerpt
- `focusKeyword` (String?, optional) — primary target keyword
- `ogImage` (String?, optional) — custom OG image, falls back to coverImage
- `slug` — already exists, make editable in form

### Admin Form Changes
Add "SEO" card in sidebar with:
- Meta title input (character counter, 50-60 char target)
- Meta description textarea (counter, 150-160 char target)
- Focus keyword input
- Custom slug input (auto-generated from title, editable)
- OG image URL (defaults to cover image if blank)

### Live SEO Score Panel
Collapsible panel showing real-time checks:
- Title contains focus keyword (yes/no)
- Meta description contains focus keyword (yes/no)
- Title length (red/yellow/green, 50-60 chars)
- Description length (red/yellow/green, 150-160 chars)
- Content length (flag if under 300 words)
- Focus keyword in first paragraph (yes/no)
- Slug contains focus keyword (yes/no)
- Image alt text reminder
- Contains at least one internal link (yes/no)
- Overall score: "X/9 checks passed"

### Blog Detail Page Update
`/blogs/[slug]` uses SEO fields in metadata, renders Article schema with focusKeyword, proper OG tags.

---

## Section 3: Individual Service Pages

### Routes
- `/services/tax-planning` — Income Tax Filing & Planning
- `/services/gst-compliance` — GST Registration & Filing
- `/services/audit-assurance` — Audit & Assurance Services
- `/services/business-registration` — Company Incorporation
- `/services/financial-advisory` — Financial Planning & Advisory

### Page Structure (shared template)
- Hero: service title, description, CTA
- "What We Offer": 4-6 sub-service bullet points
- "Who It's For": target audience
- "Our Process": 3-4 step breakdown
- FAQ: 4-5 service-specific questions (generates FAQ schema)
- CTA: "Book a Consultation" → /appointment

### SEO Per Service Page
- Unique metadata targeting high-volume queries
- `Service` schema markup with provider, area served
- Breadcrumbs: Home > Services > {Service Name}
- Internal links to related blog posts (by matching tags)
- Canonical URL

### Navigation Update
`/services` overview page cards become links to individual service pages.

### Content
Static, keyword-targeted content per page (not placeholder text).

---

## Section 4: Location Pages for Local SEO

### Routes
- `/locations/gurugram` (primary office)
- `/locations/delhi`
- `/locations/noida`
- `/locations/ghaziabad`
- `/locations/faridabad`
- `/locations/greater-noida`

### Page Structure (template with city-specific config)
- Hero: "Tax & Financial Services in {City}"
- Services available in this location
- "Why Choose Taxclusive in {City}": trust signals
- Areas/localities served (e.g., Sector 14, DLF Cyber City for Gurugram)
- Testimonials (filtered by location if available, otherwise general)
- Contact: office address for Gurugram, "Serving {City} from Gurugram office" for others
- FAQ: 3-4 city-specific questions
- CTA: "Book a Consultation" → /appointment

### SEO Per Location Page
- Title: "Tax Consultant in {City} | GST, Income Tax, Audit Services | Taxclusive"
- Meta description targeting "{city} + service" queries
- `LocalBusiness` schema with `areaServed`
- `BreadcrumbList` schema
- Keywords: "tax consultant {city}", "GST filing {city}"

### Implementation
Single page component `app/locations/[city]/page.tsx` with config object for city data. `generateStaticParams` exports all six cities.

---

## Section 5: Internal Linking & Breadcrumbs

### Breadcrumb Component
- Renders on all pages except homepage
- Auto-generates `BreadcrumbList` schema
- Hierarchy: Home > Section > Page
- Styled subtly below header

### Related Content (Blog Posts)
- "Related Articles" at bottom of each blog post
- 3 posts with matching tags
- Fallback to most recent if no tag matches

### Service-to-Blog Linking
- "Latest Insights" section on each service page
- 2-3 blog posts tagged with relevant service keyword
- Keeps pages fresh for crawlers

### Footer Enhancement
- Links to all 5 service pages
- Links to all 6 location pages
- Site-wide internal link graph for discovery

### Sitemap Priorities
- Homepage: 1.0
- Services overview, About: 0.9
- Individual service pages, location pages: 0.8
- Blogs, Contact, Expertise: 0.7
- Appointment, FAQ, Insights: 0.6

---

## Section 6: Structured Data Per Page Type

### Blog Posts — `Article` schema
- headline, description, author, datePublished, dateModified
- image, keywords (focus keyword + tags)
- publisher as Organization

### Service Pages — `Service` schema
- name, description, provider (Organization)
- areaServed (Delhi NCR cities)
- serviceType, nested Offer

### Location Pages — `LocalBusiness` schema
- name, address, areaServed (neighborhoods)
- geo coordinates, openingHours, telephone, email

### FAQ — `FAQPage` schema
- On every page with FAQ content (service pages, location pages, /faq)

### Breadcrumbs — `BreadcrumbList` schema
- Auto-generated by Breadcrumb component

### Implementation
`lib/seo/schema.ts` with builder functions:
- `buildArticleSchema()`
- `buildServiceSchema()`
- `buildLocalBusinessSchema()`
- `buildFAQSchema()`
- `buildBreadcrumbSchema()`

Each page renders relevant schema via `<script type="application/ld+json">`.

---

## File Changes

### New Files
```
lib/seo/schema.ts                          # Schema builder functions
lib/seo/metadata.ts                        # Shared metadata helpers
components/seo/breadcrumbs.tsx             # Breadcrumb component
components/seo/seo-score-panel.tsx         # Admin SEO score panel
components/seo/related-posts.tsx           # Related articles component
app/sitemap.ts                             # Dynamic sitemap
app/robots.ts                              # Dynamic robots.txt
app/services/[slug]/page.tsx               # Service detail pages
app/locations/[city]/page.tsx              # Location pages
lib/data/services.ts                       # Service page content/config
lib/data/locations.ts                      # Location page content/config
```

### Modified Files
```
prisma/schema.prisma                       # Add SEO fields to Blog
app/admin/blogs/new/page.tsx               # Add SEO fields + score panel
app/admin/blogs/[id]/page.tsx              # Same for edit form
app/api/admin/blogs/route.ts               # Handle new SEO fields
app/blogs/[slug]/page.tsx                  # Use SEO fields in metadata
app/page.tsx                               # Fix canonical/OG bugs
app/layout.tsx                             # Add breadcrumbs
app/services/page.tsx                      # Link to individual service pages
components/features/home/footer.tsx        # Add service + location links
```

### Deleted Files
```
public/sitemap.xml                         # Replaced by app/sitemap.ts
public/robots.txt                          # Replaced by app/robots.ts
```

### Database Migration
One migration adding nullable columns to `blogs`:
- `metaTitle` (String?)
- `metaDescription` (String?)
- `focusKeyword` (String?)
- `ogImage` (String?)

No breaking changes. No external dependencies required.
