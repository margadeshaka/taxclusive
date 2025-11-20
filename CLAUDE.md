# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Start Development
```bash
pnpm dev         # Start Next.js development server at http://localhost:3000
```

### Build & Production
```bash
pnpm build       # Build for production (runs prisma generate automatically via prebuild hook)
pnpm start       # Start production server
```

### Testing
```bash
pnpm test            # Run Jest unit tests
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Run tests with coverage report
pnpm test:e2e        # Run Playwright E2E tests
pnpm test:e2e:ui     # Run E2E tests with UI
pnpm test:e2e:debug  # Debug E2E tests
pnpm test:all        # Run both unit and E2E tests
./final-test.sh      # Run comprehensive system tests (requires running dev server at localhost:3000)
```

To run a single test file:
```bash
pnpm test path/to/test.test.ts
```

### Code Quality
```bash
pnpm lint        # Run ESLint
pnpm lint:fix    # Fix linting issues
pnpm format      # Format code with Prettier
pnpm format:check # Check formatting
```

### Database Management
```bash
pnpm db:generate # Generate Prisma client
pnpm db:push     # Push schema changes to database
pnpm db:migrate  # Run migrations
pnpm db:seed     # Seed database with sample data
pnpm db:studio   # Open Prisma Studio
```

### Other Utilities
```bash
ANALYZE=true pnpm build  # Analyze bundle size
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Bot Protection**: Google reCAPTCHA v3 for all forms
- **Data Fetching**: SWR for client-side data fetching and caching
- **Email**: AWS SES
- **Testing**: Jest (unit), Playwright (E2E)

### Project Structure
- `/app` - Next.js App Router pages and API routes
  - `/api` - API endpoints (auth, admin, public)
  - `/admin` - Protected admin dashboard
  - Page-specific layouts and components
- `/components` - Reusable React components
  - `/ui` - Shadcn UI components
  - `/features` - Feature-specific components (home, about, services)
  - `/admin` - Admin-specific components
- `/lib` - Core utilities and business logic
  - `/config` - Configuration management
  - `/types` - TypeScript type definitions
  - `/validation` - Zod schemas for form validation
- `/hooks` - Custom React hooks
- `/prisma` - Database schema and migrations

### Key Architectural Patterns

1. **Authentication & Authorization**
   - NextAuth.js with JWT-based sessions (configured in `lib/auth.ts`)
   - Credentials provider with bcrypt password hashing
   - Role-based access control: ADMIN and EDITOR roles (defined in Prisma schema)
   - Custom session callbacks to inject user role and ID
   - Protected admin routes under `/app/admin`
   - Custom sign-in page at `/admin/login`

2. **API Architecture**
   - RESTful API routes under `/app/api`
   - Separate namespaces: `/api/admin/*` (protected) and `/api/public/*` (public)
   - All routes use Next.js 15 Route Handlers (not Pages Router API routes)
   - Standardized responses via `ApiResponseHandler` class (in `lib/api/response-handler.ts`)
   - Force dynamic rendering with `export const dynamic = 'force-dynamic'`
   - CSRF protection via `lib/csrf.ts` (automatically added to non-GET requests)

3. **Data Fetching & State Management**
   - **Client-side**: SWR for data fetching with automatic revalidation
   - Custom hooks pattern: `use-dashboard-stats.ts`, `use-testimonials.ts`, etc.
   - Dashboard stats auto-refresh every 30 seconds (configured in SWR hook)
   - **API Client**: `lib/api-client.ts` with retry logic, timeout handling, and rate limiting
   - Request/response/error interceptors for cross-cutting concerns
   - Exponential backoff for failed requests
   - Rate limiting: 100 requests per minute

4. **Database Layer**
   - Prisma ORM with PostgreSQL
   - Models: User, Blog, Tag, Testimonial, ContactForm, Newsletter
   - Blog statuses: DRAFT, PUBLISHED, ARCHIVED
   - User roles: ADMIN, EDITOR
   - Prisma client singleton pattern (in `lib/prisma.ts`)
   - Seeding script in `prisma/seed.ts`

5. **Configuration System**
   - Centralized type-safe config in `/lib/config`
   - `website-config.ts` contains comprehensive configuration interfaces for:
     - Theme (colors, fonts, spacing, animations)
     - Content (business info, page content, navigation)
     - Assets (images, icons, videos, documents)
     - Features (integrations, analytics, performance)
   - Configuration validation and type checking
   - Separate client and server configs

6. **Error Handling**
   - Custom error classes: `NetworkError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `RateLimitError`
   - Centralized error handler in `lib/error-handler.ts`
   - API errors include status codes and detailed messages
   - Error interceptors for consistent error handling across API calls

7. **Form Validation**
   - Zod schemas in `lib/validation/form-schemas.ts`
   - React Hook Form for form state management
   - Client-side and server-side validation
   - Type-safe form data with Zod inference

8. **Bot Protection with Google reCAPTCHA v3**
   - Invisible reCAPTCHA v3 protection on all user-facing forms
   - Client-side: `RecaptchaProvider` component wraps the entire app
   - Custom hooks: `useRecaptchaForm` for form-level integration
   - Server-side verification: `verifyRecaptcha` utility in `lib/recaptcha.ts`
   - Protected forms:
     - Newsletter subscription (action: `newsletter_signup`, threshold: 0.3)
     - Contact forms (action: `contact_form`/`contact_message`, threshold: 0.5)
     - Appointment booking (action: `appointment_booking`, threshold: 0.5)
     - Query submission (action: `query_submission`, threshold: 0.5)
     - Admin login (action: `admin_login`, threshold: 0.7)
   - Score-based security: Higher scores (0.7+) for critical actions like login
   - API routes validate tokens before processing requests
   - Compliance: All forms display required Google reCAPTCHA disclosure text

### Critical Files & Their Purposes
- `lib/auth.ts` - NextAuth configuration with JWT strategy, role injection, and reCAPTCHA verification
- `lib/recaptcha.ts` - Server-side reCAPTCHA v3 verification utility with score-based validation
- `components/recaptcha-provider.tsx` - Client-side reCAPTCHA provider component
- `hooks/use-recaptcha-form.ts` - Custom React hook for integrating reCAPTCHA with forms
- `lib/api-client.ts` - Enhanced fetch wrapper with retry, timeout, interceptors, rate limiting
- `lib/api/response-handler.ts` - Standardized API response formatting
- `lib/config/website-config.ts` - Comprehensive configuration type definitions
- `lib/error-handler.ts` - Custom error classes and error handling utilities
- `lib/csrf.ts` - CSRF token generation and validation
- `lib/rate-limit.ts` - Rate limiting implementation
- `lib/prisma.ts` - Prisma client singleton
- `app/api/admin/dashboard/stats/route.ts` - Dashboard statistics endpoint
- `hooks/use-dashboard-stats.ts` - SWR hook for dashboard data with 30s refresh
- `prisma/schema.prisma` - Database schema with User, Blog, Testimonial, etc.

### Environment Variables Required
```
DATABASE_URL                      # PostgreSQL connection string
NEXTAUTH_URL                      # Application URL (e.g., http://localhost:3000)
NEXTAUTH_SECRET                   # Secret for JWT encryption (generate with: openssl rand -base64 32)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY    # Google reCAPTCHA v3 site key (public)
RECAPTCHA_SECRET_KEY              # Google reCAPTCHA v3 secret key (server-side only)
AWS_REGION                        # AWS region for SES (e.g., us-east-1)
AWS_ACCESS_KEY_ID                 # AWS IAM credentials for SES
AWS_SECRET_ACCESS_KEY             # AWS IAM secret key
AWS_SES_FROM_EMAIL                # Verified SES sender email address
```

### Setting Up Google reCAPTCHA v3

1. **Get reCAPTCHA Keys**:
   - Visit https://www.google.com/recaptcha/admin
   - Register your site with reCAPTCHA v3
   - Copy the Site Key (public) and Secret Key (private)

2. **Configure Environment Variables**:
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-site-key-here"
   RECAPTCHA_SECRET_KEY="your-secret-key-here"
   ```

3. **How It Works**:
   - **Client-side**: `RecaptchaProvider` in `app/layout.tsx` loads reCAPTCHA script globally
   - **Form Integration**: Use `useRecaptchaForm` hook in any form component
   - **Token Generation**: reCAPTCHA executes invisibly when form is submitted
   - **Server Verification**: API routes verify tokens using `verifyRecaptcha` function
   - **Score-based Decision**: Tokens include score (0.0-1.0) indicating bot likelihood

4. **Security Thresholds**:
   - **0.3**: Low-risk actions (newsletter signup)
   - **0.5**: Moderate-risk actions (contact forms, appointments)
   - **0.7+**: High-risk actions (admin login, payments)

5. **Adding reCAPTCHA to New Forms**:
   ```tsx
   import { useRecaptchaForm } from '@/hooks/use-recaptcha-form';

   function MyForm() {
     const { executeRecaptchaForForm, isExecuting } = useRecaptchaForm({
       action: 'my_form_action',
       onError: (error) => console.error(error)
     });

     const handleSubmit = async (data) => {
       const token = await executeRecaptchaForForm();
       if (!token) return;

       // Submit with token
       await submitForm({ ...data, recaptchaToken: token });
     };
   }
   ```

6. **API Route Verification**:
   ```ts
   import { verifyRecaptcha } from '@/lib/recaptcha';

   export async function POST(req: NextRequest) {
     const { recaptchaToken, ...data } = await req.json();

     const result = await verifyRecaptcha(recaptchaToken, 'my_form_action', 0.5);
     if (!result.success) {
       return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
     }

     // Process request
   }
   ```

### Important Development Notes

**Next.js 15 Specifics:**
- All dynamic route parameters must be awaited before use (e.g., `const { id } = await params`)
- This project does NOT use static export (commented out in `next.config.mjs`)
- API routes are enabled (static export is disabled)
- Force dynamic rendering for real-time data: `export const dynamic = 'force-dynamic'`

**Database Workflow:**
- Always run `pnpm db:generate` after modifying `prisma/schema.prisma`
- Use `pnpm db:push` for development (syncs schema without migrations)
- Use `pnpm db:migrate` for production (creates migration files)
- Seed data is available via `pnpm db:seed`

**Testing:**
- `final-test.sh` requires dev server running at localhost:3000
- Tests database connection, API endpoints, page rendering, and admin panel
- Mock Service Worker (MSW) configured for API mocking in tests

**Authentication:**
- Admin users must be created via seed script or manually in database
- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens include user role for authorization checks

**Package Manager:**
- Project uses `pnpm` (version 10.14.0+)
- Do not use `npm` or `yarn` - use `pnpm` for all commands

**Build Optimization:**
- Bundle analyzer available with `ANALYZE=true pnpm build`
- Webpack configured for code splitting and vendor chunks
- Images are unoptimized for static hosting compatibility

**Legal and Regulatory Compliance:**
- This project does NOT use direct references to "Chartered Accountant" or "CA" designations
- All branding uses "Tax and Financial Services" or "Tax Professional" terminology
- This is for legal and regulatory compliance purposes
- When making content changes, avoid introducing "Chartered Accountant", "CA", or "accounting firm" terminology
- Professional credentials reference "Professional Tax Services Association (PTSA)" instead of ICAI
- Site manifest, metadata, and all user-facing content follow this naming convention