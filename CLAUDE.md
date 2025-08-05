# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taxclusive is a Next.js 15 application for a Chartered Accountancy firm providing taxation and financial services. Built with TypeScript, Shadcn UI, Prisma ORM (PostgreSQL), and NextAuth authentication. Features a comprehensive admin panel for managing blogs, testimonials, and users with role-based access control (ADMIN/EDITOR).

## Essential Commands

### Development

```bash
pnpm dev                 # Start development server
pnpm build              # Build for production (hybrid - static pages + API routes)
pnpm start              # Start production server
```

### Code Quality

```bash
pnpm lint               # Run ESLint
pnpm lint:fix           # Auto-fix linting issues
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting
```

### Testing

```bash
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:coverage      # Generate test coverage report
pnpm test:e2e           # Run Playwright E2E tests

# Run specific tests
pnpm test -- --testPathPattern=utils  # Run tests matching 'utils'
pnpm test -- header.test.tsx          # Run specific test file
pnpm test -- -t "should render"       # Run tests with matching description
```

### Database

```bash
pnpm db:generate        # Generate Prisma client
pnpm db:push           # Push schema to database
pnpm db:migrate        # Run database migrations
pnpm db:seed           # Seed database with initial data
pnpm db:studio         # Open Prisma Studio (database GUI)
```

### Docker

```bash
pnpm docker:up         # Start Docker services
pnpm docker:down       # Stop Docker services
```

### Utilities

```bash
pnpm analyze            # Analyze bundle size (requires @next/bundle-analyzer)
pnpm find-unused-deps   # Find unused dependencies (requires depcheck)
```

### Deployment

```bash
# Deploy to Vercel (recommended for Next.js)
vercel --prod

# Or use manual deployment
pnpm build
# Upload .next directory to hosting provider
```


## Architecture Overview

### Directory Structure

- `/app/` - Next.js App Router pages and layouts. Each route has its own directory (e.g., /about, /services, /blogs)
  - `/app/admin/` - Complete admin panel for content management (blogs, testimonials, users)
  - API routes in `/app/api/` for email handling (contact, appointment, newsletter, query, message) and admin operations
- `/components/` - React components organized by:
  - `/features/` - Page-specific feature components (home sections, etc.)
  - `/shared/` - Shared components like ErrorBoundary
  - `/ui/` - Shadcn UI components (buttons, cards, forms, etc.)
- `/lib/` - Core business logic:
  - `/api/` - Database API functions and data fetching logic
  - `/config/` - Configuration management system with validation and presets
  - `/context/` - React Context providers for state management
  - `/helpers/` - Utility functions
  - `/types/` - TypeScript type definitions
  - `auth.ts` - NextAuth configuration
  - `prisma.ts` - Prisma client instance
- `/hooks/` - Custom React hooks
- `/e2e/` - Playwright E2E tests with fixtures and helpers
- `/__tests__/` - Jest unit tests with snapshots in `__snapshots__/`
- `/prisma/` - Database schema, migrations, and seed scripts
- `/components/admin/` - Admin-specific components (navigation, rich text editor, session provider)

### Key Architectural Patterns

1. **Configuration Management System**:
   - Comprehensive configuration system in `/lib/config/` with validation, environment-specific settings, and business presets
   - Supports theme customization, feature toggles, and SEO configuration
   - Includes utility functions for config migration, color palette generation, and Tailwind integration
   - Use `useConfig()`, `useTheme()`, and related hooks to access configuration throughout the app

2. **Enhanced API Client Architecture**:
   - Custom API client (`/lib/api-client.ts`) with interceptors, retry logic, rate limiting, and CSRF protection
   - Built-in timeout handling, exponential backoff, and error recovery
   - Request/response/error interceptors for cross-cutting concerns
   - Rate limiting (100 requests/minute) to prevent API abuse

3. **State Management Pattern**:
   - React Context providers for domain-specific state (e.g., `BlogContext` in `/lib/context/`)
   - Custom hooks pattern for consuming context data (`useBlogContext()`)
   - Centralized error handling and loading states within contexts
   - Context providers wrap application sections that need shared state

4. **Feature-Based Component Organization**:
   - Components organized by features (`/components/features/home/`, etc.)
   - Each feature exports components via index files for clean imports
   - Clear separation between UI components (`/components/ui/`) and business logic components
   - Shared components (`/components/shared/`) for cross-cutting concerns like ErrorBoundary

5. **Type-Safe Data Layer**:
   - Comprehensive TypeScript interfaces in `/lib/types/` for all data models
   - Strongly typed API responses, component props, and configuration objects
   - Type safety enforced throughout the application stack with Prisma-generated types

6. **Database-First Architecture with Prisma**:
   - PostgreSQL database with Prisma ORM for type-safe database operations
   - Database schema defined in `prisma/schema.prisma` with models for Users, Blogs, Testimonials
   - Role-based access control (ADMIN, EDITOR roles)
   - Database migrations and seeding for consistent deployments

7. **Authentication & Authorization System**:
   - NextAuth v4 with credentials provider for secure authentication
   - Role-based access control with ADMIN and EDITOR roles
   - Secure password hashing with bcryptjs
   - Session management with Prisma adapter

8. **Component Library Integration**:
   - Shadcn UI as the foundational component library
   - Custom utility function (`cn()`) for conditional class merging using clsx and tailwind-merge
   - Consistent design system with CSS variables for theming

9. **Email Integration Architecture**:
   - AWS SES (Simple Email Service) for professional email delivery
   - API routes (`/api/contact`, `/api/appointment`, `/api/newsletter`, `/api/query`, `/api/message`) for form handling
   - Enhanced email templates with professional styling and branding
   - Client-side email service (`lib/email-client.ts`) that connects to local API routes
   - Form validation and error handling with user-friendly messages

### Important Configuration Files

- `next.config.mjs` - Hybrid configuration with static pages and API routes enabled
- `tailwind.config.ts` - Custom theme configuration, fonts (Poppins, Playfair Display), animations
- `tsconfig.json` - Strict mode TypeScript with path aliases (@/\*)
- `.env.local` - Environment variables for AWS SES and database configuration
- `jest.config.js` - Jest configuration with path aliases and custom setup
- `playwright.config.ts` - E2E test configuration for multiple browsers (Chrome, Firefox, Safari, Mobile)

### Database & API Integration

The application uses a local PostgreSQL database with Prisma ORM:

**Database Structure**:

- Main database client: `/lib/prisma.ts` - Prisma client instance
- Database functions: `/lib/api/blogs.ts` and other domain-specific API functions
- Type definitions: `/lib/types/blog.ts`, `/lib/types/auth.ts` and other domain-specific types

**Key Database Models**:

- `User` - Admin users with roles (ADMIN, EDITOR)
- `Blog` - Blog posts with status (DRAFT, PUBLISHED, ARCHIVED)
- `Testimonial` - Customer testimonials
- `Account` & `Session` - NextAuth authentication tables

**Key API Endpoints**:

- `/api/admin/blogs` - CRUD operations for blog posts
- `/api/admin/testimonials` - CRUD operations for testimonials
- `/api/admin/users` - User management
- `/api/auth/[...nextauth]` - NextAuth authentication

**API Client Features**:

- Automatic retry with exponential backoff for failed requests
- Request/response/error interceptors for cross-cutting concerns
- CSRF token injection for non-GET requests
- Rate limiting (100 requests/minute)
- Timeout handling (10s default)
- Response caching with configurable strategies

### Testing Strategy

**Unit Testing** (`/__tests__/`):

- Jest with React Testing Library for component testing
- API client testing with mocked fetch responses
- Context providers and custom hooks testing
- Utility function testing (e.g., `utils.test.ts`)
- Snapshot testing for components (stored in `__snapshots__/`)

**E2E Testing** (`/e2e/`):

- Playwright for cross-browser testing (Chrome, Firefox, Safari)
- Admin authentication testing (`admin-auth.spec.ts`)
- Admin panel functionality testing (`admin-blogs.spec.ts`, `admin-testimonials.spec.ts`, `admin-users.spec.ts`)
- Public navigation and API endpoint testing (`public-navigation.spec.ts`, `api-endpoints.spec.ts`)
- Role-based access control testing (`role-based-access.spec.ts`)
- Form functionality testing (`forms.spec.ts`)
- Test fixtures and helpers in `/e2e/fixtures/` and `/e2e/helpers/`

**Testing Patterns**:

- Mock external dependencies (fetch, API responses)
- Test user interactions and component state changes
- Validate accessibility and responsive behavior
- Pre-commit hooks with Husky for linting and formatting

### Development Patterns & Best Practices

**Data Fetching**:

- Use Prisma client for all database operations with type safety
- Implement proper error handling and loading states in components
- Leverage React Context for shared state across component trees
- Use custom hooks to encapsulate data fetching logic
- NextAuth for authentication state management

**Component Development**:

- Follow the feature-based organization pattern
- Use the `cn()` utility for conditional CSS class names
- Export components through index files for clean imports
- Separate UI components from business logic components

**Configuration Management**:

- Access configuration through provided hooks (`useConfig`, `useTheme`, etc.)
- Use environment-specific configurations for different deployment stages
- Leverage preset configurations for common business types

**Testing Guidelines**:

- Write unit tests for all utility functions and custom hooks
- Test user interactions and error states in components
- Use Playwright for testing complete user workflows
- Mock external dependencies to ensure test reliability

**Code Quality**:

- Follow TypeScript strict mode for maximum type safety
- Use ESLint and Prettier configurations as defined in the project
- Implement proper error boundaries for graceful error handling
- Follow the established patterns for interceptors and middleware

### Environment Variables

Required environment variables for full functionality:

```bash
# Database Configuration
DATABASE_URL=                  # PostgreSQL connection string

# NextAuth Configuration
NEXTAUTH_URL=                  # Application URL
NEXTAUTH_SECRET=               # NextAuth encryption secret

# AWS Configuration
AWS_REGION=                    # AWS region (e.g., us-east-1)
AWS_ACCESS_KEY_ID=             # AWS access key for SES
AWS_SECRET_ACCESS_KEY=         # AWS secret key for SES

# Email Configuration
EMAIL_SENDER_NAME=             # Email sender display name
EMAIL_SENDER_ADDRESS=          # Verified SES email address
EMAIL_RECIPIENT_ADDRESS=       # Default recipient for form submissions

# Security
CSRF_SECRET=                   # Secret for CSRF token generation

# Production
NEXT_PUBLIC_BASE_URL=          # Production URL
```

### Key Dependencies

- Next.js 15.2.4 with React 18.3.1
- TypeScript for type safety
- Prisma ORM with PostgreSQL for database
- NextAuth v4 for authentication
- Tailwind CSS for styling
- Shadcn UI for component library
- React Hook Form + Zod for form handling
- AWS SES (@aws-sdk/client-ses) for email
- bcryptjs for password hashing
- SWR for data fetching
- Jest + React Testing Library for unit testing
- Playwright for E2E testing
- Husky + Lint-staged for pre-commit hooks
