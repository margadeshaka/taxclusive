# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Next.js 15 application for TaxExclusive, a Chartered Accountancy firm. The application uses static site generation, TypeScript, Shadcn UI components, and integrates with Strapi CMS for content management.

## Essential Commands

### Development
```bash
pnpm dev                 # Start development server
pnpm build              # Build for production (static export)
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

1. **Data Flow**: Components fetch data from Strapi CMS via API clients in `/lib/api/`. Data is managed through React Context providers and consumed via custom hooks.

2. **Static Export**: The application is configured for static site generation with `output: 'export'` in next.config.js. This means no server-side runtime is available.

3. **Component Structure**: Uses Shadcn UI as the base component library. Components follow a modular pattern with clear separation between UI and business logic.

4. **Form Handling**: Forms use React Hook Form with Zod validation. Contact forms integrate with Azure Communication Services for email delivery.

5. **Theme System**: Supports dark/light mode switching using Tailwind CSS class-based theming with CSS variables.

### Important Configuration Files

- `next.config.mjs` - Static export configuration, security headers (requires server-side implementation)
- `tailwind.config.ts` - Custom theme configuration, fonts (Poppins, Playfair Display), animations
- `tsconfig.json` - Strict mode TypeScript with path aliases (@/*)
- `.env.local` - Environment variables for Strapi URL and Azure email configuration

### API Integration

The application integrates with Strapi CMS for content management. Key API endpoints:
- `/api/blogs` - Blog posts
- `/api/services` - Service offerings
- `/api/faqs` - Frequently asked questions
- `/api/teams` - Team member information
- `/api/contact-page` - Contact page content

API client configuration can be found in `/lib/api/config.ts` with specific fetchers in `/lib/api/`.

### Testing Strategy

- **Unit Tests**: Jest with React Testing Library for component testing
- **E2E Tests**: Playwright for browser-based testing across Chrome, Firefox, and Safari
- **Pre-commit Hooks**: Husky runs linting and formatting checks before commits

### Key Dependencies

- Next.js 15.2.4 with React 19
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI for component library
- React Hook Form + Zod for form handling
- Azure Communication Services for email
- Strapi CMS integration
- Framer Motion for animations
- React Intersection Observer for scroll animations