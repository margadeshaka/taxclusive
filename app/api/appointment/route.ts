import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, formatAppointmentEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { firstName, lastName, email, phone, service, date, time, meetingType, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !service || !date || !time || !meetingType) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please fill in all required fields.',
          errors: {
            firstName: !firstName ? 'First name is required' : undefined,
            lastName: !lastName ? 'Last name is required' : undefined,
            email: !email ? 'Email is required' : undefined,
            phone: !phone ? 'Phone number is required' : undefined,
            service: !service ? 'Service selection is required' : undefined,
            date: !date ? 'Preferred date is required' : undefined,
            time: !time ? 'Preferred time is required' : undefined,
            meetingType: !meetingType ? 'Meeting type is required' : undefined,
          }
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
          message: 'Please provide a valid email address.',
          errors: { email: 'Invalid email format' }
        },
        { status: 400 }
      );
    }

    // Date validation - ensure date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please select a future date for your appointment.',
          errors: { date: 'Date cannot be in the past' }
        },
        { status: 400 }
      );
    }

    // Format and send the email
    const emailData = formatAppointmentEmail({
      firstName,
      lastName,
      email,
      phone,
      service,
      date,
      time,
      meetingType,
      message,
    });

    await sendEmail(emailData);

    return NextResponse.json({
      success: true,
      message: 'Your appointment request has been submitted successfully! We will contact you soon to confirm.',
      data: { firstName, lastName, email, service, date, time }
    });

  } catch (error) {
    console.error('Error submitting appointment form:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit appointment request. Please try again later.',
        errors: { server: 'Internal server error' }
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}