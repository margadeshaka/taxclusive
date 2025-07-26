import { NextRequest, NextResponse } from "next/server";

import { sendEmail, formatMessageEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
          errors: {
            name: !name ? "Name is required" : undefined,
            email: !email ? "Email is required" : undefined,
            subject: !subject ? "Subject is required" : undefined,
            message: !message ? "Message is required" : undefined,
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
    const emailData = formatMessageEmail({
      name,
      email,
      phone,
      subject,
      message,
    });

    await sendEmail(emailData);

    return NextResponse.json({
      success: true,
      message:
        "Your message has been sent successfully! We appreciate your inquiry and will respond promptly.",
      data: { name, email, subject },
    });
  } catch (error) {
    console.error("Error submitting message form:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again later.",
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
