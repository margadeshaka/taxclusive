import { ComponentType, lazy, Suspense } from "react";

interface DynamicImportOptions {
  loading?: ComponentType;
  error?: ComponentType<{ error: Error; retry: () => void }>;
}

/**
 * Enhanced dynamic import utility with consistent loading and error states
 * @param importFn - Function that returns a dynamic import
 * @param options - Configuration options
 * @returns Dynamically imported component with loading and error states
 */
export function dynamicImport<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {}
) {
  const {
    loading: LoadingComponent = () => (
      <div className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 animate-pulse"></div>
    ),
  } = options;

  const LazyComponent = lazy(importFn);

  return function DynamicComponent(props: T) {
    return (
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
