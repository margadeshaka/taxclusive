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
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isDev = process.env.NODE_ENV === 'development';
  const [isReady, setIsReady] = useState(() => isDev && !siteKey);

  useEffect(() => {
    // Check if reCAPTCHA is configured
    console.log('reCAPTCHA Provider: siteKey =', siteKey ? siteKey.substring(0, 10) + '...' : 'NOT SET');
    console.log('reCAPTCHA Provider: isDev =', isDev);

    if (!siteKey) {
      console.warn('reCAPTCHA: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured');
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
      console.log('reCAPTCHA script loaded successfully');
      window.grecaptcha.ready(() => {
        console.log('reCAPTCHA is ready');
        setIsReady(true);
      });
    };

    script.onerror = (e) => {
      console.error('Failed to load reCAPTCHA script:', e);
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
  }, [siteKey, isDev]);

  const executeRecaptcha = async (action: string): Promise<string> => {
    // In development mode without a site key, return a dev token
    if (!siteKey && isDev) {
      console.log('reCAPTCHA: Development mode - returning dev token for action:', action);
      return 'dev-token-skip-verification';
    }

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
      // In development, return dev token on failure
      if (isDev) {
        console.log('reCAPTCHA: Development mode - returning dev token after error');
        return 'dev-token-skip-verification';
      }
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
