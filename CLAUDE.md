# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Start Development
```bash
npm run dev         # Start Next.js development server at http://localhost:3000
```

### Build & Production
```bash
npm run build       # Build for production (runs prisma generate automatically)
npm start           # Start production server
```

### Testing
```bash
npm test            # Run Jest unit tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run test:e2e    # Run Playwright E2E tests
npm run test:e2e:ui # Run E2E tests with UI
npm run test:all    # Run both unit and E2E tests
./final-test.sh     # Run comprehensive system tests (requires running dev server)
```

### Code Quality
```bash
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
npm run format      # Format code with Prettier
npm run format:check # Check formatting
```

### Database Management
```bash
npm run db:generate # Generate Prisma client
npm run db:push     # Push schema changes to database
npm run db:migrate  # Run migrations
npm run db:seed     # Seed database with sample data
npm run db:studio   # Open Prisma Studio
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
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
   - NextAuth with role-based access (ADMIN, EDITOR)
   - Protected routes using middleware
   - Session management with JWT

2. **API Design**
   - RESTful endpoints under `/api`
   - Separate admin and public routes
   - Consistent error handling and validation
   - Response standardization through `response-handler.ts`

3. **Data Flow**
   - Client components use custom hooks (`use-blogs`, `use-testimonials`)
   - API client with automatic error handling
   - SWR for data fetching and caching

4. **Configuration System**
   - Centralized config in `/lib/config`
   - Type-safe configuration with validation
   - Environment-specific settings

5. **Testing Strategy**
   - Unit tests for components and utilities
   - E2E tests for critical user flows
   - Accessibility and performance tests
   - Mock service worker (MSW) for API mocking

### Critical Files
- `lib/auth.ts` - NextAuth configuration
- `lib/config/website-config.ts` - Site-wide configuration
- `lib/api-client.ts` - Centralized API client
- `app/api/auth/[...nextauth]/route.ts` - Auth endpoints
- `prisma/schema.prisma` - Database schema

### Environment Variables Required
```
DATABASE_URL          # PostgreSQL connection string
NEXTAUTH_URL         # Application URL
NEXTAUTH_SECRET      # Secret for JWT encryption
AWS_REGION           # AWS region for SES
AWS_ACCESS_KEY_ID    # AWS credentials
AWS_SECRET_ACCESS_KEY # AWS credentials
AWS_SES_FROM_EMAIL   # Verified SES email address
```

### Common Development Tasks

To run a single test file:
```bash
npm test path/to/test.test.ts
```

To debug E2E tests:
```bash
npm run test:e2e:debug
```

To analyze bundle size:
```bash
ANALYZE=true npm run build
```

### Important Notes
- Always run `npm run db:generate` after modifying the Prisma schema
- The project uses static export by default (see `next.config.mjs`)
- Email functionality requires AWS SES configuration
- Admin users must be created via database seed or manual entry
- Test data is seeded automatically when running `npm run db:seed`