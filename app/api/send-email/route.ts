import { NextRequest, NextResponse } from "next/server";

import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { subject, text, html, replyTo } = body;

    // Validate required fields
    if (!subject || !text) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject and text are required",
        },
        { status: 400 }
      );
    }

    // Send email using the existing email service
    await sendEmail({
      subject,
      text,
      html: html || text,
      replyTo,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
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
