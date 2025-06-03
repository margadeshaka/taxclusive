# TaxExclusive Application Architecture

This document outlines the architecture of the TaxExclusive application, including its structure, data flow, and key components.

## Application Structure

The application follows a modular architecture with clear separation of concerns. Here's an overview of the main directories and their purposes:

### Root Directories

- **app/**: Contains Next.js app router pages and layouts
- **components/**: Reusable React components
- **hooks/**: Custom React hooks
- **lib/**: Utility functions, API clients, and shared code
- **public/**: Static assets
- **styles/**: Global styles and CSS utilities

### Components Structure

Components are organized into a consistent folder structure:

- **components/features/**: Feature-specific components that are tied to particular functionality
  - **home/**: Components specific to the home page
  - **blogs/**: Components specific to the blogs feature
  - etc.
- **components/shared/**: Reusable components that can be used across different features
  - **ErrorBoundary**: Component for handling runtime errors gracefully
  - etc.
- **components/layouts/**: Layout components that define the structure of pages
  - Headers, footers, sidebars, etc.

### Library Structure

The `lib` directory contains utility functions and shared code, organized into logical categories:

- **lib/api/**: API clients and functions for data fetching
  - **strapi.ts**: Functions for interacting with the Strapi CMS API
- **lib/helpers/**: Utility functions for common tasks
  - **utils.ts**: General utility functions like CSS class merging
- **lib/types/**: TypeScript interfaces for data models
  - **blog.ts**: Interfaces for blog data models
- **lib/context/**: React Context providers for state management
  - **blog-context.tsx**: Context for managing blog state

## Data Flow

The application follows a unidirectional data flow pattern:

1. **Data Fetching**: API clients in `lib/api` fetch data from external sources (e.g., Strapi CMS)
2. **State Management**: Data is stored and managed in React Context providers in `lib/context`
3. **Component Rendering**: Components consume data from context providers and render UI
4. **User Interaction**: User interactions trigger state updates through context providers
5. **Data Persistence**: Updated data is sent back to external sources through API clients

### Example: Blog Data Flow

1. The `BlogProvider` from `lib/context/blog-context.tsx` provides a centralized store for blog data
2. Components use the `useBlogContext` hook to access blog data and actions
3. When a component needs to fetch blogs, it calls `fetchAllBlogs()` from the context
4. The context uses the `fetchBlogs()` function from `lib/api/strapi.ts` to fetch data from the Strapi CMS
5. The fetched data is stored in the context state and made available to all components
6. Components render the blog data from the context

## Error Handling

The application uses a comprehensive error handling strategy:

1. **API Error Handling**: API functions catch and handle errors, providing meaningful error messages
2. **Context Error Handling**: Context providers store and expose error states for components to handle
3. **Component Error Boundaries**: The `ErrorBoundary` component catches and handles runtime errors in the component tree
4. **Graceful Degradation**: Components handle loading and error states to provide a good user experience

## Styling Approach

The application uses Tailwind CSS for styling, with a consistent approach:

1. **Utility-First**: Components use Tailwind utility classes directly in JSX
2. **Component Composition**: Complex UI elements are composed from simpler components
3. **Theme Customization**: The theme is customized in `tailwind.config.ts`
4. **Global Styles**: Global styles are defined in `styles/globals.css`

## Conclusion

This architecture provides a solid foundation for the TaxExclusive application, with clear separation of concerns, modular components, and a consistent approach to data flow and error handling. It allows for easy maintenance, extension, and testing of the application.
