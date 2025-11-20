import { NextRequest, NextResponse } from "next/server";

import { sendEmail, formatNewsletterEmail } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { email, recaptchaToken } = body;

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(
      recaptchaToken,
      'newsletter_signup',
      0.3 // Low-risk action, lower threshold
    );

    if (!recaptchaResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Security verification failed. Please try again.",
          errors: { recaptcha: recaptchaResult.error || "reCAPTCHA verification failed" },
        },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide your email address.",
          errors: { email: "Email is required" },
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
          errors: { email: "Invalid email format" },
        },
        { status: 400 }
      );
    }

    // Format and send the email
    const emailData = formatNewsletterEmail({ email });
    await sendEmail(emailData);

    return NextResponse.json({
      success: true,
      message:
        "Thank you for subscribing to our newsletter! You will receive updates about tax regulations and financial insights.",
      data: { email },
    });
  } catch (error) {
    console.error("Error submitting newsletter form:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to subscribe to newsletter. Please try again later.",
        errors: { server: "Internal server error" },
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
