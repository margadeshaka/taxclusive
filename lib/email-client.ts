"use client";

// Type definitions for email service responses
interface EmailServiceResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string | undefined>;
}

// Email templates are now handled by the API routes

/**
 * Client-side email service for static sites
 * This works with AWS SES via API routes
 */
export class EmailService {
  private static instance: EmailService;
  private apiEndpoint: string;

  private constructor() {
    // Use the same web app's API routes
    this.apiEndpoint = process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api`
      : "/api";
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Email sending is now handled directly by API routes

  /**
   * Submit contact form
   */
  async submitContactForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<EmailServiceResponse> {
    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return {
        success: false,
        message: "Please fill in all required fields.",
        errors: {
          firstName: !formData.firstName ? "First name is required" : undefined,
          lastName: !formData.lastName ? "Last name is required" : undefined,
          email: !formData.email ? "Email is required" : undefined,
          subject: !formData.subject ? "Subject is required" : undefined,
          message: !formData.message ? "Message is required" : undefined,
        },
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        errors: { email: "Invalid email format" },
      };
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          message: "Your message has been sent successfully! We will get back to you soon.",
        };
      }

      return result;
    } catch (error) {
      console.error("Contact form submission error:", error);
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      };
    }
  }

  /**
   * Submit appointment form
   */
  async submitAppointmentForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    meetingType: string;
    message?: string;
  }): Promise<EmailServiceResponse> {
    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.service ||
      !formData.date ||
      !formData.time ||
      !formData.meetingType
    ) {
      return {
        success: false,
        message: "Please fill in all required fields.",
        errors: {
          firstName: !formData.firstName ? "First name is required" : undefined,
          lastName: !formData.lastName ? "Last name is required" : undefined,
          email: !formData.email ? "Email is required" : undefined,
          phone: !formData.phone ? "Phone number is required" : undefined,
          service: !formData.service ? "Service selection is required" : undefined,
          date: !formData.date ? "Preferred date is required" : undefined,
          time: !formData.time ? "Preferred time is required" : undefined,
          meetingType: !formData.meetingType ? "Meeting type is required" : undefined,
        },
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        errors: { email: "Invalid email format" },
      };
    }

    // Date validation
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return {
        success: false,
        message: "Please select a future date for your appointment.",
        errors: { date: "Date cannot be in the past" },
      };
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          message:
            "Your appointment request has been submitted successfully! We will contact you soon to confirm.",
        };
      }

      return result;
    } catch (error) {
      console.error("Appointment form submission error:", error);
      return {
        success: false,
        message: "Failed to submit appointment request. Please try again later.",
      };
    }
  }

  /**
   * Submit newsletter form
   */
  async submitNewsletterForm(formData: {
    email: string;
  }): Promise<EmailServiceResponse> {
    // Validate required fields
    if (!formData.email) {
      return {
        success: false,
        message: "Please provide your email address.",
        errors: { email: "Email is required" },
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        errors: { email: "Invalid email format" },
      };
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          message:
            "Thank you for subscribing to our newsletter! You will receive updates about tax regulations and financial insights.",
        };
      }

      return result;
    } catch (error) {
      console.error("Newsletter form submission error:", error);
      return {
        success: false,
        message: "Failed to subscribe to newsletter. Please try again later.",
      };
    }
  }

  /**
   * Submit query form
   */
  async submitQueryForm(formData: {
    fullName: string;
    email: string;
    phone?: string;
    category: string;
    priority?: string;
    subject: string;
    query: string;
    files?: string[];
  }): Promise<EmailServiceResponse> {
    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.category ||
      !formData.subject ||
      !formData.query
    ) {
      return {
        success: false,
        message: "Please fill in all required fields.",
        errors: {
          fullName: !formData.fullName ? "Full name is required" : undefined,
          email: !formData.email ? "Email is required" : undefined,
          category: !formData.category ? "Category is required" : undefined,
          subject: !formData.subject ? "Subject is required" : undefined,
          query: !formData.query ? "Query is required" : undefined,
        },
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        errors: { email: "Invalid email format" },
      };
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          message:
            "Your query has been submitted successfully! Our experts will review it and get back to you soon.",
        };
      }

      return result;
    } catch (error) {
      console.error("Query form submission error:", error);
      return {
        success: false,
        message: "Failed to submit query. Please try again later.",
      };
    }
  }

  /**
   * Submit message form
   */
  async submitMessageForm(formData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<EmailServiceResponse> {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return {
        success: false,
        message: "Please fill in all required fields.",
        errors: {
          name: !formData.name ? "Name is required" : undefined,
          email: !formData.email ? "Email is required" : undefined,
          subject: !formData.subject ? "Subject is required" : undefined,
          message: !formData.message ? "Message is required" : undefined,
        },
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        errors: { email: "Invalid email format" },
      };
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          message:
            "Your message has been sent successfully! We appreciate your inquiry and will respond promptly.",
        };
      }

      return result;
    } catch (error) {
      console.error("Message form submission error:", error);
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      };
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
