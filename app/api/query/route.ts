import { NextRequest, NextResponse } from "next/server";

import { sendEmail, formatQueryEmail } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { fullName, email, phone, category, priority, subject, query, files, recaptchaToken } = body;

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(
      recaptchaToken,
      'query_submission',
      0.5 // Moderate security for query submissions
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
    if (!fullName || !email || !category || !subject || !query) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
          errors: {
            fullName: !fullName ? "Full name is required" : undefined,
            email: !email ? "Email is required" : undefined,
            category: !category ? "Category is required" : undefined,
            subject: !subject ? "Subject is required" : undefined,
            query: !query ? "Query is required" : undefined,
          },
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
    const emailData = formatQueryEmail({
      fullName,
      email,
      phone,
      category,
      priority,
      subject,
      query,
      files,
    });

    await sendEmail(emailData);

    return NextResponse.json({
      success: true,
      message:
        "Your query has been submitted successfully! Our experts will review it and get back to you soon.",
      data: { fullName, email, category, subject },
    });
  } catch (error) {
    console.error("Error submitting query form:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit query. Please try again later.",
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
