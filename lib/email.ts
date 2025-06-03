import nodemailer from "nodemailer";

/**
 * Configuration for Azure SMTP
 */
const smtpConfig = {
  host: process.env.AZURE_SMTP_HOST || "smtp.azurecomm.net",
  port: parseInt(process.env.AZURE_SMTP_PORT || "587"),
  secure: process.env.AZURE_SMTP_SECURE === "true",
  auth: {
    user: process.env.AZURE_SMTP_USER || "support_taxclusive",
    pass: process.env.AZURE_SMTP_PASSWORD || "m-I8Q~Icpp2NJmkECebaNarpMwWzkInGm3xD5b26",
  },
};

/**
 * Email sender configuration
 */
const emailSender = {
  name: process.env.EMAIL_SENDER_NAME || "Taxclusive",
  email: process.env.EMAIL_SENDER_ADDRESS || "DoNotReply@ce0efb15-b29c-409c-9573-aa3571f3fcef.azurecomm.net",
};

/**
 * Email recipient configuration
 */
const emailRecipient = {
  name: process.env.EMAIL_RECIPIENT_NAME || "Taxclusive Support",
  email: process.env.EMAIL_RECIPIENT_ADDRESS || "hiteshgupta3012@gmail.com",
};

/**
 * Creates a nodemailer transporter with Azure SMTP configuration
 */
const transporter = nodemailer.createTransport(smtpConfig);

/**
 * Interface for email data
 */
export interface EmailData {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

/**
 * Sends an email using Azure SMTP
 *
 * @param data - The email data to send
 * @returns A promise that resolves when the email is sent
 */
export async function sendEmail(data: EmailData): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"${emailSender.name}" <${emailSender.email}>`,
      to: `"${emailRecipient.name}" <${emailRecipient.email}>`,
      replyTo: data.replyTo,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
    console.info("Sent mail successfully");
    // Email sent successfully
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

/**
 * Formats contact form data into an email
 *
 * @param formData - The contact form data
 * @returns The formatted email data
 */
export function formatContactEmail(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): EmailData {
  const text = `
    New Contact Form Submission

    Name: ${formData.firstName} ${formData.lastName}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Subject: ${formData.subject}

    Message:
    ${formData.message}
  `;

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone}</p>
    <p><strong>Subject:</strong> ${formData.subject}</p>
    <h3>Message:</h3>
    <p>${formData.message.replace(/\n/g, "<br>")}</p>
  `;

  return {
    subject: `Contact Form: ${formData.subject}`,
    text,
    html,
    replyTo: formData.email,
  };
}

/**
 * Formats appointment form data into an email
 *
 * @param formData - The appointment form data
 * @returns The formatted email data
 */
export function formatAppointmentEmail(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  meetingType: string;
  message?: string;
}): EmailData {
  const text = `
    New Appointment Request

    Name: ${formData.firstName} ${formData.lastName}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Service: ${formData.service}
    Date: ${formData.date}
    Time: ${formData.time}
    Meeting Type: ${formData.meetingType}

    Additional Information:
    ${formData.message || "None provided"}
  `;

  const html = `
    <h2>New Appointment Request</h2>
    <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone}</p>
    <p><strong>Service:</strong> ${formData.service}</p>
    <p><strong>Date:</strong> ${formData.date}</p>
    <p><strong>Time:</strong> ${formData.time}</p>
    <p><strong>Meeting Type:</strong> ${formData.meetingType}</p>
    <h3>Additional Information:</h3>
    <p>${formData.message ? formData.message.replace(/\n/g, "<br>") : "None provided"}</p>
  `;

  return {
    subject: `Appointment Request: ${formData.service}`,
    text,
    html,
    replyTo: formData.email,
  };
}

/**
 * Formats newsletter subscription data into an email
 *
 * @param formData - The newsletter subscription data
 * @returns The formatted email data
 */
export function formatNewsletterEmail(formData: { email: string }): EmailData {
  const text = `
    New Newsletter Subscription

    Email: ${formData.email}
  `;

  const html = `
    <h2>New Newsletter Subscription</h2>
    <p><strong>Email:</strong> ${formData.email}</p>
  `;

  return {
    subject: "New Newsletter Subscription",
    text,
    html,
    replyTo: formData.email,
  };
}

/**
 * Formats query form data into an email
 * 
 * @param formData - The query form data
 * @returns The formatted email data
 */
export function formatQueryEmail(formData: {
  fullName: string;
  email: string;
  phone?: string;
  category: string;
  priority?: string;
  subject: string;
  query: string;
  files?: string[];
}): EmailData {
  const text = `
    New Query Submission

    Name: ${formData.fullName}
    Email: ${formData.email}
    Phone: ${formData.phone || 'Not provided'}
    Category: ${formData.category}
    Priority: ${formData.priority || 'Normal'}
    Subject: ${formData.subject}

    Query:
    ${formData.query}

    Files Attached: ${formData.files?.length ? 'Yes' : 'No'}
  `;

  const html = `
    <h2>New Query Submission</h2>
    <p><strong>Name:</strong> ${formData.fullName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
    <p><strong>Category:</strong> ${formData.category}</p>
    <p><strong>Priority:</strong> ${formData.priority || 'Normal'}</p>
    <p><strong>Subject:</strong> ${formData.subject}</p>
    <h3>Query:</h3>
    <p>${formData.query.replace(/\n/g, '<br>')}</p>
    <p><strong>Files Attached:</strong> ${formData.files?.length ? 'Yes' : 'No'}</p>
  `;

  return {
    subject: `Query: ${formData.subject}`,
    text,
    html,
    replyTo: formData.email,
  };
}
