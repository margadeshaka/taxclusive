# Google reCAPTCHA v3 Implementation

This document provides comprehensive documentation for the Google reCAPTCHA v3 implementation in Taxclusive.

## Overview

All user-facing forms in the application are protected by Google reCAPTCHA v3, an invisible bot protection system that provides automatic risk analysis without user interaction.

## Why reCAPTCHA v3?

- **Invisible Protection**: No user interaction required (no "I'm not a robot" checkbox)
- **Risk Analysis**: Returns a score (0.0-1.0) indicating the likelihood of bot activity
- **Adaptive Security**: Different forms can have different security thresholds
- **Better UX**: Seamless user experience while maintaining security

## Architecture

### Client-Side Components

1. **RecaptchaProvider** (`components/recaptcha-provider.tsx`)
   - Global provider component that loads the reCAPTCHA script
   - Wraps the entire application in `app/layout.tsx`
   - Provides context for accessing reCAPTCHA functionality

2. **useRecaptchaForm Hook** (`hooks/use-recaptcha-form.ts`)
   - Custom React hook for form-level integration
   - Handles token execution and error states
   - Provides loading indicators

### Server-Side Components

1. **verifyRecaptcha** (`lib/recaptcha.ts`)
   - Server-side verification utility
   - Validates tokens with Google's API
   - Supports action verification and score thresholds

## Protected Forms

| Form | Action Name | Threshold | Location |
|------|-------------|-----------|----------|
| Newsletter Signup | `newsletter_signup` | 0.3 | `/components/newsletter-subscription.tsx` |
| Simple Contact | `contact_message` | 0.5 | `/components/features/home/contact-section.tsx` |
| Full Contact Form | `contact_form` | 0.5 | `/app/contact/page.tsx` |
| Appointment Booking | `appointment_booking` | 0.5 | `/app/appointment/page.tsx` |
| Query Submission | `query_submission` | 0.5 | `/app/ask-query/page.tsx` |
| Admin Login | `admin_login` | 0.7 | `/app/admin/login/page.tsx` |

## Security Thresholds

The threshold determines the minimum acceptable score for a submission:

- **0.3**: Low-risk actions (newsletter subscriptions)
- **0.5**: Moderate-risk actions (contact forms, appointments)
- **0.7+**: High-risk actions (admin login, payments)

Higher thresholds provide stronger security but may occasionally flag legitimate users.

## Setup Instructions

### 1. Get reCAPTCHA Keys

1. Visit [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "+" to register a new site
3. Select **reCAPTCHA v3**
4. Enter your domain(s)
5. Accept terms and submit
6. Copy your **Site Key** (public) and **Secret Key** (private)

### 2. Configure Environment Variables

Add to your `.env.local` file:

```bash
# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key-here"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key-here"
```

⚠️ **Important**:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is exposed to the client (public)
- `RECAPTCHA_SECRET_KEY` is server-only (never expose to client)

### 3. Update .env.example

The `.env.example` file has been updated with reCAPTCHA configuration:

```bash
# Google reCAPTCHA v3 (get keys from https://www.google.com/recaptcha/admin)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
```

## Usage Guide

### Adding reCAPTCHA to a New Form

#### Client-Side Implementation

```tsx
'use client';

import { useRecaptchaForm } from '@/hooks/use-recaptcha-form';
import { useToast } from '@/hooks/use-toast';

export default function MyForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize reCAPTCHA hook
  const { executeRecaptchaForForm, isExecuting } = useRecaptchaForm({
    action: 'my_custom_action', // Unique action name
    onError: (error) => {
      toast({
        title: "Security verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Execute reCAPTCHA first
      const recaptchaToken = await executeRecaptchaForForm();

      if (!recaptchaToken) {
        toast({
          title: "Security verification failed",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Submit form with token
      const response = await fetch('/api/my-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      // Handle response
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}

      <button
        type="submit"
        disabled={isSubmitting || isExecuting}
      >
        {isSubmitting || isExecuting ? 'Processing...' : 'Submit'}
      </button>

      {/* Required reCAPTCHA disclosure */}
      <p className="text-xs text-muted-foreground">
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>{" "}
        apply.
      </p>
    </form>
  );
}
```

#### Server-Side Verification

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recaptchaToken, ...formData } = body;

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(
      recaptchaToken,
      'my_custom_action', // Must match client-side action
      0.5 // Minimum acceptable score
    );

    if (!recaptchaResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Security verification failed. Please try again.",
          errors: {
            recaptcha: recaptchaResult.error || "reCAPTCHA verification failed"
          },
        },
        { status: 403 }
      );
    }

    // Process the form submission
    // ...

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## API Reference

### Client-Side

#### `useRecaptchaForm(options)`

Custom hook for integrating reCAPTCHA with forms.

**Parameters:**
- `options.action` (string, required): Unique identifier for the action
- `options.onSuccess` (function, optional): Callback when token is generated successfully
- `options.onError` (function, optional): Callback when reCAPTCHA execution fails

**Returns:**
- `executeRecaptchaForForm()`: Async function to execute reCAPTCHA and get token
- `isExecuting` (boolean): Whether reCAPTCHA is currently executing
- `error` (Error | null): Any error that occurred during execution

### Server-Side

#### `verifyRecaptcha(token, expectedAction?, minimumScore?)`

Verifies a reCAPTCHA token with Google's API.

**Parameters:**
- `token` (string, required): The reCAPTCHA token from the client
- `expectedAction` (string, optional): The expected action name to verify
- `minimumScore` (number, optional): Minimum acceptable score (default: 0.5)

**Returns:**
```typescript
{
  success: boolean;
  score?: number;        // Score from 0.0 to 1.0
  action?: string;       // Action that was executed
  error?: string;        // Error message if failed
  errorCodes?: string[]; // Error codes from Google API
}
```

#### `getRecommendedMinimumScore(action)`

Returns recommended minimum score based on action type.

**Parameters:**
- `action` (string): The action name

**Returns:**
- `number`: Recommended minimum score (0.3, 0.5, or 0.7)

## Troubleshooting

### reCAPTCHA Script Not Loading

**Problem**: Forms show "reCAPTCHA is not ready" error

**Solutions**:
1. Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in `.env.local`
2. Check browser console for script loading errors
3. Ensure domain is registered in Google reCAPTCHA admin console
4. Check for ad blockers or privacy extensions blocking the script

### Low Scores for Legitimate Users

**Problem**: Real users getting blocked due to low scores

**Solutions**:
1. Lower the threshold for that specific action
2. Review Google reCAPTCHA analytics for score distribution
3. Ensure proper action names are being used
4. Consider implementing score-based fallbacks (e.g., show CAPTCHA v2 for low scores)

### Token Verification Failing

**Problem**: Server returns "Security verification failed"

**Solutions**:
1. Verify `RECAPTCHA_SECRET_KEY` is correctly set on server
2. Ensure action names match between client and server
3. Check that tokens aren't being reused (they expire after ~2 minutes)
4. Verify server can reach `https://www.google.com/recaptcha/api/siteverify`

### CORS Issues

**Problem**: CORS errors when submitting forms

**Solutions**:
1. reCAPTCHA tokens should be in request body, not headers
2. Ensure API routes have proper CORS configuration
3. Verify `NEXTAUTH_URL` matches your actual domain

## Testing

### Development Testing

For local development, you can use Google's test keys:

```bash
# Test keys (always return score 0.9)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
RECAPTCHA_SECRET_KEY="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
```

⚠️ **Warning**: Never use test keys in production!

### Testing Low Scores

To test behavior with low scores:
1. Use automated tools (Selenium, Puppeteer) - these typically get low scores
2. Rapidly submit forms multiple times
3. Use browser automation detection tools

## Compliance

### Required Disclosure

All forms with reCAPTCHA must include this disclosure:

```html
<p class="text-xs text-muted-foreground">
  This site is protected by reCAPTCHA and the Google
  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
    Privacy Policy
  </a>
  and
  <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
    Terms of Service
  </a>
  apply.
</p>
```

This is **required** by Google's Terms of Service.

### Privacy Considerations

- reCAPTCHA collects user data (IP address, cookies, device info)
- Update your Privacy Policy to disclose reCAPTCHA usage
- Inform users about data collection and Google's privacy practices

## Best Practices

1. **Unique Action Names**: Use descriptive, unique action names for each form
2. **Appropriate Thresholds**: Don't set thresholds too high (false positives)
3. **Error Handling**: Provide clear error messages to users
4. **Loading States**: Show loading indicators during reCAPTCHA execution
5. **Server-Side Only**: Always verify tokens server-side, never trust client
6. **Score Logging**: Log scores for analysis and threshold optimization
7. **Fallback Strategy**: Consider fallbacks for legitimate users with low scores

## Monitoring

### Google reCAPTCHA Analytics

Monitor your reCAPTCHA performance:
1. Visit [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Select your site
3. Review score distribution and verification counts
4. Adjust thresholds based on data

### Server-Side Logging

The implementation logs verification failures:
```typescript
console.error('reCAPTCHA verification failed:', result.error)
```

Consider implementing structured logging for production monitoring.

## Further Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [reCAPTCHA Best Practices](https://developers.google.com/recaptcha/docs/v3#best_practices)
- [Score Interpretation Guide](https://developers.google.com/recaptcha/docs/v3#interpreting_the_score)

## Support

For issues with the implementation:
1. Check this documentation
2. Review code in `lib/recaptcha.ts` and `components/recaptcha-provider.tsx`
3. Check Google reCAPTCHA admin console for API errors
4. Review browser console for client-side errors
5. Check server logs for verification failures

---

**Last Updated**: 2025-11-20
**Implementation Version**: 1.0.0
