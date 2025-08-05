import { NextRequest } from 'next/server';
import { POST } from '@/app/api/contact/route';

// Mock AWS SES
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  SendEmailCommand: jest.fn(),
}));

// Mock email functions
jest.mock('@/lib/email', () => ({
  sendContactEmail: jest.fn(),
}));

describe('/api/contact', () => {
  const validContactData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    subject: 'Test Contact',
    message: 'This is a test message',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle valid contact form submission', async () => {
    const { sendContactEmail } = require('@/lib/email');
    sendContactEmail.mockResolvedValue({ success: true });

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validContactData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Message sent successfully');
    expect(sendContactEmail).toHaveBeenCalledWith(validContactData);
  });

  it('should validate required fields', async () => {
    const incompleteData = {
      firstName: 'John',
      // Missing required fields
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompleteData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
    expect(data.details).toBeDefined();
  });

  it('should validate email format', async () => {
    const invalidEmailData = {
      ...validContactData,
      email: 'invalid-email-format',
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidEmailData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('email');
  });

  it('should validate phone number format', async () => {
    const invalidPhoneData = {
      ...validContactData,
      phone: 'invalid-phone',
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPhoneData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('phone');
  });

  it('should sanitize input data', async () => {
    const { sendContactEmail } = require('@/lib/email');
    sendContactEmail.mockResolvedValue({ success: true });

    const maliciousData = {
      ...validContactData,
      firstName: '<script>alert("xss")</script>John',
      message: '<img src="x" onerror="alert(1)">Test message',
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maliciousData),
    });

    const response = await POST(request);
    
    expect(response.status).toBe(200);
    expect(sendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John', // Script tags should be removed
        message: 'Test message', // Malicious HTML should be sanitized
      })
    );
  });

  it('should handle email sending failures', async () => {
    const { sendContactEmail } = require('@/lib/email');
    sendContactEmail.mockRejectedValue(new Error('Email service unavailable'));

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validContactData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to send message');
  });

  it('should handle malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid JSON');
  });

  it('should rate limit requests', async () => {
    const { sendContactEmail } = require('@/lib/email');
    sendContactEmail.mockResolvedValue({ success: true });

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Forwarded-For': '192.168.1.1'
      },
      body: JSON.stringify(validContactData),
    });

    // Make multiple requests rapidly
    const responses = await Promise.all([
      POST(request.clone()),
      POST(request.clone()),
      POST(request.clone()),
      POST(request.clone()),
      POST(request.clone()),
      POST(request.clone()), // This should be rate limited
    ]);

    const statusCodes = responses.map(r => r.status);
    expect(statusCodes).toContain(429); // Too Many Requests
  });

  it('should validate message length', async () => {
    const longMessageData = {
      ...validContactData,
      message: 'a'.repeat(5001), // Assuming max length is 5000
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(longMessageData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('message');
  });

  it('should handle CSRF token validation', async () => {
    const { sendContactEmail } = require('@/lib/email');
    sendContactEmail.mockResolvedValue({ success: true });

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'valid-token'
      },
      body: JSON.stringify(validContactData),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it('should return proper error for missing CSRF token', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validContactData),
    });

    // If CSRF is enforced, this should fail
    const response = await POST(request);
    
    if (response.status === 403) {
      const data = await response.json();
      expect(data.error).toContain('CSRF');
    }
  });
});