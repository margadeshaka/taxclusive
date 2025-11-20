/**
 * Google reCAPTCHA v3 Server-Side Verification Utility
 *
 * This module provides server-side verification for Google reCAPTCHA v3 tokens.
 * reCAPTCHA v3 returns a score (0.0 - 1.0) for each request without user interaction.
 *
 * @see https://developers.google.com/recaptcha/docs/v3
 */

interface RecaptchaVerificationResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

interface RecaptchaVerificationResult {
  success: boolean;
  score?: number;
  action?: string;
  error?: string;
  errorCodes?: string[];
}

/**
 * Verify a reCAPTCHA token with Google's API
 *
 * @param token - The reCAPTCHA token from the client
 * @param expectedAction - Optional action name to verify (e.g., 'contact_form', 'login')
 * @param minimumScore - Minimum acceptable score (default: 0.5, range: 0.0 - 1.0)
 * @returns Verification result with success status and score
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction?: string,
  minimumScore: number = 0.5
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // Validate environment configuration
  if (!secretKey) {
    console.error('reCAPTCHA: RECAPTCHA_SECRET_KEY is not configured');
    return {
      success: false,
      error: 'reCAPTCHA is not configured on the server',
    };
  }

  // Validate token
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return {
      success: false,
      error: 'Invalid reCAPTCHA token',
    };
  }

  try {
    // Call Google's reCAPTCHA verification API
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    if (!response.ok) {
      throw new Error(`reCAPTCHA API returned ${response.status}: ${response.statusText}`);
    }

    const data: RecaptchaVerificationResponse = await response.json();

    // Check if verification was successful
    if (!data.success) {
      return {
        success: false,
        error: 'reCAPTCHA verification failed',
        errorCodes: data['error-codes'],
      };
    }

    // Verify action if specified
    if (expectedAction && data.action !== expectedAction) {
      return {
        success: false,
        score: data.score,
        action: data.action,
        error: `Action mismatch. Expected '${expectedAction}', got '${data.action}'`,
      };
    }

    // Check if score meets minimum threshold
    if (data.score < minimumScore) {
      return {
        success: false,
        score: data.score,
        action: data.action,
        error: `Score ${data.score} is below minimum threshold ${minimumScore}`,
      };
    }

    // Verification successful
    return {
      success: true,
      score: data.score,
      action: data.action,
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify reCAPTCHA',
    };
  }
}

/**
 * Get recommended minimum score based on action type
 *
 * Different actions may require different security levels:
 * - Critical actions (login, payment): 0.7+
 * - Moderate actions (contact forms, comments): 0.5+
 * - Low-risk actions (newsletter signup): 0.3+
 *
 * @param action - The action being performed
 * @returns Recommended minimum score
 */
export function getRecommendedMinimumScore(action: string): number {
  const criticalActions = ['login', 'signup', 'payment', 'admin'];
  const moderateActions = ['contact', 'appointment', 'query', 'message'];
  const lowRiskActions = ['newsletter', 'search'];

  if (criticalActions.some(a => action.toLowerCase().includes(a))) {
    return 0.7;
  }

  if (moderateActions.some(a => action.toLowerCase().includes(a))) {
    return 0.5;
  }

  if (lowRiskActions.some(a => action.toLowerCase().includes(a))) {
    return 0.3;
  }

  // Default to moderate security
  return 0.5;
}

/**
 * Middleware helper to extract and verify reCAPTCHA token from request
 *
 * @param request - Next.js request object
 * @param action - Expected action name
 * @returns Verification result
 */
export async function verifyRecaptchaFromRequest(
  request: Request,
  action?: string
): Promise<RecaptchaVerificationResult> {
  try {
    // Try to get token from headers first
    let token = request.headers.get('x-recaptcha-token');

    // If not in headers, try to parse from body
    if (!token) {
      const contentType = request.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const body = await request.json();
        token = body.recaptchaToken;
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        token = formData.get('recaptchaToken') as string;
      } else if (contentType?.includes('multipart/form-data')) {
        const formData = await request.formData();
        token = formData.get('recaptchaToken') as string;
      }
    }

    if (!token) {
      return {
        success: false,
        error: 'reCAPTCHA token is missing from request',
      };
    }

    // Determine minimum score based on action
    const minimumScore = action ? getRecommendedMinimumScore(action) : 0.5;

    return await verifyRecaptcha(token, action, minimumScore);
  } catch (error) {
    console.error('Error extracting reCAPTCHA token from request:', error);
    return {
      success: false,
      error: 'Failed to extract reCAPTCHA token from request',
    };
  }
}
