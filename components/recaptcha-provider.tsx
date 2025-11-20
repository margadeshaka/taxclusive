'use client';

/**
 * Google reCAPTCHA v3 Provider Component
 *
 * This component loads the Google reCAPTCHA v3 script and provides
 * a context for accessing reCAPTCHA functionality throughout the app.
 *
 * @see https://developers.google.com/recaptcha/docs/v3
 */

import { createContext, useContext, useEffect, useState } from 'react';

interface RecaptchaContextValue {
  isReady: boolean;
  executeRecaptcha: (action: string) => Promise<string>;
}

const RecaptchaContext = createContext<RecaptchaContextValue | null>(null);

interface RecaptchaProviderProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    // Check if reCAPTCHA is configured
    if (!siteKey) {
      console.error('reCAPTCHA: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured');
      return;
    }

    // Check if script is already loaded
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
    };

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      const scriptElement = document.querySelector(
        `script[src^="https://www.google.com/recaptcha/api.js"]`
      );
      if (scriptElement) {
        scriptElement.remove();
      }

      // Remove reCAPTCHA badge
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) {
        badge.remove();
      }
    };
  }, [siteKey]);

  const executeRecaptcha = async (action: string): Promise<string> => {
    if (!siteKey) {
      throw new Error('reCAPTCHA site key is not configured');
    }

    if (!isReady) {
      throw new Error('reCAPTCHA is not ready yet');
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      throw new Error('Failed to execute reCAPTCHA');
    }
  };

  return (
    <RecaptchaContext.Provider value={{ isReady, executeRecaptcha }}>
      {children}
    </RecaptchaContext.Provider>
  );
}

/**
 * Hook to access reCAPTCHA functionality
 *
 * @example
 * ```tsx
 * const { isReady, executeRecaptcha } = useRecaptcha();
 *
 * const handleSubmit = async () => {
 *   const token = await executeRecaptcha('contact_form');
 *   // Send token with form data
 * };
 * ```
 */
export function useRecaptcha() {
  const context = useContext(RecaptchaContext);

  if (!context) {
    throw new Error('useRecaptcha must be used within a RecaptchaProvider');
  }

  return context;
}
