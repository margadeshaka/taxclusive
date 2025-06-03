import { ComponentType, lazy, Suspense } from "react";

interface DynamicImportOptions {
  loading?: ComponentType;
  error?: ComponentType<{ error: Error; retry: () => void }>;
  ssr?: boolean;
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
    error: ErrorComponent = ({ retry }) => (
      <div className="w-full py-12 md:py-24 lg:py-32 bg-red-50 text-center">
        <p className="text-red-500">Failed to load component</p>
        <button
          onClick={retry}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    ),
    ssr = false,
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
