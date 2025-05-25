# Project Development Guidelines

This document provides guidelines and information for developers working on this project. It includes build/configuration instructions, testing information, and additional development details.

## Build/Configuration Instructions

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm package manager

### Setup

1. Clone the repository:
   ```bash
   git clone git@github.com:margadeshaka/taxexclusive.git
   cd taxexclusive
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Development server:
   ```bash
   pnpm dev
   ```
   This will start the development server at [http://localhost:3000](http://localhost:3000).

4. Build for production:
   ```bash
   pnpm build
   ```
   This project is configured for static export (output: 'export' in next.config.mjs).

5. Start production server:
   ```bash
   pnpm start
   ```

### Configuration Files

- **next.config.mjs**: Contains Next.js configuration, including static export settings, ESLint and TypeScript error handling during builds, and experimental features.
- **tsconfig.json**: TypeScript configuration with path aliases (@/* points to the root directory).
- **tailwind.config.ts**: Tailwind CSS configuration with custom colors, fonts, animations, and background patterns.
- **postcss.config.mjs**: PostCSS configuration for processing CSS.
- **components.json**: Configuration for UI components.

## Testing Information

### Testing Setup

The project uses Jest and React Testing Library for testing React components.

1. Run tests:
   ```bash
   pnpm test
   ```

2. Run tests in watch mode (useful during development):
   ```bash
   pnpm test:watch
   ```

### Adding New Tests

1. Create test files in the `__tests__` directory with the naming convention `[component-name].test.tsx`.
2. Use React Testing Library to render components and assert on their behavior.

### Example Test

Here's a simple example of testing a component:

```tsx
import { render, screen } from '@testing-library/react';
import YourComponent from '@/components/your-component';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    
    // Check if specific elements are rendered
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
    
    // Check if elements with specific roles exist
    expect(screen.getByRole('button', { name: 'Button Text' })).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. Test component behavior, not implementation details.
2. Use user-centric queries (getByRole, getByText) instead of test IDs when possible.
3. Write tests that resemble how users interact with your application.
4. Keep tests simple and focused on a single aspect of functionality.

## Additional Development Information

### Project Structure

- **app/**: Contains Next.js app router pages and layouts
- **components/**: Reusable React components
  - **ui/**: UI components (likely using shadcn/ui)
- **hooks/**: Custom React hooks
- **lib/**: Utility functions and shared code
- **public/**: Static assets
- **styles/**: Global styles and CSS utilities

### Code Style and Conventions

1. **TypeScript**: The project uses TypeScript for type safety. Ensure all components and functions have proper type definitions.

2. **Component Structure**:
   - Functional components with named exports
   - Props interfaces defined at the top of the file
   - Use of React hooks for state and side effects

3. **Styling**:
   - Tailwind CSS for styling components
   - Use className prop for conditional styling
   - Follow the project's color scheme and design tokens

4. **State Management**:
   - React's built-in state management (useState, useContext)
   - Form handling with react-hook-form

### UI Component Library

The project uses a combination of Radix UI primitives and custom components, likely following the shadcn/ui approach. When creating new UI components:

1. Follow the existing pattern of composition
2. Use Radix UI for accessible interactive components
3. Style with Tailwind CSS using the project's design tokens

### Performance Considerations

1. Use Next.js image optimization for images
2. Implement code splitting where appropriate
3. Minimize client-side JavaScript
4. Use server components where possible (for Next.js app router)