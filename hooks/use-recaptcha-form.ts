'use client';

/**
 * Custom hook for integrating reCAPTCHA with form submissions
 *
 * This hook provides a simple way to add reCAPTCHA protection to any form.
 * It automatically executes reCAPTCHA when the form is submitted and includes
 * the token in the submission data.
 */

import { useState } from 'react';
import { useRecaptcha } from '@/components/recaptcha-provider';

interface UseRecaptchaFormOptions {
  action: string;
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
}

interface UseRecaptchaFormReturn {
  isExecuting: boolean;
  executeRecaptchaForForm: () => Promise<string | null>;
  error: Error | null;
}

/**
 * Hook for executing reCAPTCHA before form submission
 *
 * @param options - Configuration options
 * @returns Object with reCAPTCHA execution function and state
 *
 * @example
 * ```tsx
 * const { executeRecaptchaForForm, isExecuting } = useRecaptchaForm({
 *   action: 'contact_form',
 *   onSuccess: (token) => console.log('Got token:', token),
 *   onError: (error) => console.error('reCAPTCHA error:', error)
 * });
 *
 * const handleSubmit = async (formData) => {
 *   const token = await executeRecaptchaForForm();
 *   if (token) {
 *     // Submit form with token
 *     await submitForm({ ...formData, recaptchaToken: token });
 *   }
 * };
 * ```
 */
export function useRecaptchaForm({
  action,
  onSuccess,
  onError,
}: UseRecaptchaFormOptions): UseRecaptchaFormReturn {
  const { isReady, executeRecaptcha } = useRecaptcha();
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeRecaptchaForForm = async (): Promise<string | null> => {
    // Reset error state
    setError(null);

    // Check if reCAPTCHA is ready
    if (!isReady) {
      const notReadyError = new Error('reCAPTCHA is not ready. Please wait and try again.');
      setError(notReadyError);
      onError?.(notReadyError);
      return null;
    }

    setIsExecuting(true);

    try {
      // Execute reCAPTCHA with the specified action
      const token = await executeRecaptcha(action);

      // Call success callback
      onSuccess?.(token);

      return token;
    } catch (err) {
      const executionError = err instanceof Error
        ? err
        : new Error('Failed to execute reCAPTCHA');

      setError(executionError);
      onError?.(executionError);

      return null;
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    isExecuting,
    executeRecaptchaForForm,
    error,
  };
}

/**
 * Hook for automatically executing reCAPTCHA on form submit
 *
 * This is a simpler version that wraps a submit handler with reCAPTCHA execution
 *
 * @param action - The reCAPTCHA action name
 * @param onSubmit - The original submit handler that receives the token
 * @returns Enhanced submit handler with reCAPTCHA
 *
 * @example
 * ```tsx
 * const handleSubmitWithRecaptcha = useRecaptchaSubmit(
 *   'contact_form',
 *   async (token, formData) => {
 *     await submitForm({ ...formData, recaptchaToken: token });
 *   }
 * );
 *
 * <form onSubmit={(e) => {
 *   e.preventDefault();
 *   handleSubmitWithRecaptcha(formData);
 * }}>
 * ```
 */
export function useRecaptchaSubmit<T extends any[]>(
  action: string,
  onSubmit: (token: string, ...args: T) => Promise<void> | void
) {
  const { executeRecaptcha, isReady } = useRecaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmitWithRecaptcha = async (...args: T) => {
    setError(null);

    if (!isReady) {
      const notReadyError = new Error('reCAPTCHA is not ready. Please wait and try again.');
      setError(notReadyError);
      throw notReadyError;
    }

    setIsSubmitting(true);

    try {
      const token = await executeRecaptcha(action);
      await onSubmit(token, ...args);
    } catch (err) {
      const submitError = err instanceof Error ? err : new Error('Form submission failed');
      setError(submitError);
      throw submitError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit: handleSubmitWithRecaptcha,
    isSubmitting,
    error,
  };
}
