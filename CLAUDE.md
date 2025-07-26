# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for TaxExclusive, a Chartered Accountancy firm. The application uses static site generation, TypeScript, Shadcn UI components, and integrates with Strapi CMS for content management.

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
```

### Utilities

```bash
pnpm analyze            # Analyze bundle size
pnpm find-unused-deps   # Find unused dependencies
```

### Azure Deployment

```bash
pnpm build:azure        # Build for Azure deployment
pnpm start:azure        # Start Azure production server
```

## Architecture Overview

### Directory Structure

- `/app/` - Next.js App Router pages and layouts. Each route has its own directory (e.g., /about, /services, /blogs)
- `/components/` - React components organized by:
  - `/features/` - Page-specific feature components
  - `/shared/` - Shared components like ErrorBoundary
  - `/ui/` - Shadcn UI components (buttons, cards, forms, etc.)
- `/lib/` - Core business logic:
  - `/api/` - Strapi API client and data fetching logic
  - `/context/` - React Context providers for state management
  - `/helpers/` - Utility functions
  - `/types/` - TypeScript type definitions
- `/hooks/` - Custom React hooks
- `/e2e/` - Playwright E2E tests
- `/__tests__/` - Jest unit tests

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
   - Strapi CMS integration with typed interfaces matching the API schema
   - Type safety enforced throughout the application stack

6. **Hybrid Architecture with Static Pages and API Routes**:
   - Static pages generated at build time for optimal performance
   - Dynamic API routes for email handling and server-side operations
   - Azure Communication Services integration for professional email sending
   - Client-side forms that submit to internal API routes

7. **Component Library Integration**:
   - Shadcn UI as the foundational component library
   - Custom utility function (`cn()`) for conditional class merging using clsx and tailwind-merge
   - Consistent design system with CSS variables for theming

8. **Email Integration Architecture**:
   - Azure Communication Services for professional email delivery
   - API routes (`/api/contact`, `/api/appointment`, `/api/newsletter`, `/api/query`, `/api/message`) for form handling
   - Enhanced email templates with professional styling and branding
   - Client-side email service (`lib/email-client.ts`) that connects to local API routes
   - Form validation and error handling with user-friendly messages

### Important Configuration Files

- `next.config.mjs` - Hybrid configuration with static pages and API routes enabled
- `tailwind.config.ts` - Custom theme configuration, fonts (Poppins, Playfair Display), animations
- `tsconfig.json` - Strict mode TypeScript with path aliases (@/\*)
- `.env.local` - Environment variables for Azure Communication Services and Strapi CMS configuration

### API Integration

The application integrates with Strapi CMS for content management:

**API Structure**:

- Main API client: `/lib/api-client.ts` with enhanced features (retry, caching, interceptors)
- Strapi-specific functions: `/lib/api/strapi.ts` for CMS operations
- Type definitions: `/lib/types/blog.ts` and other domain-specific types

**Key API Endpoints**:

- `/api/articles` - Blog posts with full population (populate=\*)
- `/api/services` - Service offerings
- `/api/faqs` - Frequently asked questions
- `/api/teams` - Team member information
- `/api/contact-page` - Contact page content

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
- Navigation flow testing (`navigation.spec.ts`)
- Blog functionality testing (`blogs.spec.ts`)
- Mobile responsiveness and menu interaction testing

**Testing Patterns**:

- Mock external dependencies (fetch, API responses)
- Test user interactions and component state changes
- Validate accessibility and responsive behavior
- Pre-commit hooks with Husky for linting and formatting

### Development Patterns & Best Practices

**Data Fetching**:

- Use the enhanced API client (`fetchWithRetry`) for all external API calls
- Implement proper error handling and loading states in components
- Leverage React Context for shared state across component trees
- Use custom hooks to encapsulate data fetching logic

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

### Key Dependencies

- Next.js 15.2.4 with React 18.3.1
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI for component library
- React Hook Form + Zod for form handling
- Azure Communication Services for email
- Strapi CMS integration
- Framer Motion for animations
- React Intersection Observer for scroll animations
- Jest + React Testing Library for unit testing
- Playwright for E2E testing
