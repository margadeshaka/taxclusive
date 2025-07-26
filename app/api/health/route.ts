import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if email configuration is available
    const hasEmailConfig = !!(
      process.env.AWS_ACCESS_KEY_ID && 
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.EMAIL_SENDER_ADDRESS
    );

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        email: hasEmailConfig ? "configured" : "not_configured",
        api: "operational",
      },
    };

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
