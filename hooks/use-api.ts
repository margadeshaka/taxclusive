import { useState, useCallback } from "react";
import { fetchWithRetry } from "@/lib/api-client";
import { handleError, withErrorHandling } from "@/lib/error-handler";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (url: string, options?: RequestInit) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (url: string, options: RequestInit = {}): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchWithRetry(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, loading: false, error: err }));
      handleError(err, { url, options });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook for safe async operations with error handling
export function useSafeAsync<T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>
): [(...args: T) => Promise<R | null>, boolean, Error | null] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const safeExecute = useCallback(async (...args: T): Promise<R | null> => {
    setLoading(true);
    setError(null);

    const result = await withErrorHandling(asyncFn(...args));
    
    setLoading(false);
    return result;
  }, [asyncFn]);

  return [safeExecute, loading, error];
}

// Hook for form submissions with error handling
export function useFormSubmission<T = any>(
  submitFn: (data: T) => Promise<any>
): {
  submit: (data: T) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
  success: boolean;
  reset: () => void;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data: T): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitFn(data);
      setSuccess(true);
      setLoading(false);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoading(false);
      handleError(error, { formData: data });
      return false;
    }
  }, [submitFn]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submit,
    loading,
    error,
    success,
    reset,
  };
}