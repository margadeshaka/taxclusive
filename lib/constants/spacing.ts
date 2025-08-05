export const SPACING = {
  // Section padding
  section: {
    mobile: "py-12",
    tablet: "md:py-16",
    desktop: "lg:py-24",
    full: "py-12 md:py-16 lg:py-24"
  },
  
  // Container padding
  container: {
    mobile: "px-4",
    tablet: "md:px-6",
    desktop: "lg:px-8",
    full: "px-4 md:px-6 lg:px-8"
  },
  
  // Component spacing
  component: {
    xs: "p-2",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  },
  
  // Gap spacing
  gap: {
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12"
  },
  
  // Margin spacing
  margin: {
    xs: "m-2",
    sm: "m-4",
    md: "m-6",
    lg: "m-8",
    xl: "m-12"
  }
} as const;

export const TYPOGRAPHY = {
  // Heading sizes
  h1: "text-4xl sm:text-5xl lg:text-6xl font-normal",
  h2: "text-3xl sm:text-4xl font-normal",
  h3: "text-2xl sm:text-3xl font-normal",
  h4: "text-xl sm:text-2xl font-normal",
  h5: "text-lg sm:text-xl font-normal",
  h6: "text-base sm:text-lg font-normal",
  
  // Body text
  body: {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  },
  
  // Special text
  lead: "text-lg sm:text-xl text-royal-blue/80",
  muted: "text-sm text-royal-blue/60",
  small: "text-xs text-royal-blue/60"
} as const;