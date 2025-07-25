import { EmailClient } from "@azure/communication-email";
import * as emailTemplates from './email-templates';

/**
 * Azure Communication Services Email Client configuration
 */
const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;

if (!connectionString) {
  throw new Error(
    'AZURE_COMMUNICATION_CONNECTION_STRING environment variable is required. ' +
    'Please set it in your .env.local file.'
  );
}

/**
 * Creates an Azure Communication Services Email Client
 */
const client = new EmailClient(connectionString);

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
  email: process.env.EMAIL_RECIPIENT_ADDRESS || "contact@taxclusive.com",
};

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
 * Sends an email using Azure Communication Services Email Client
 *
 * @param data - The email data to send
 * @returns A promise that resolves when the email is sent
 */
export async function sendEmail(data: EmailData): Promise<void> {
  try {
    const emailMessage = {
      senderAddress: emailSender.email,
      content: {
        subject: data.subject,
        plainText: data.text,
        html: data.html || data.text,
      },
      recipients: {
        to: [{ address: emailRecipient.email, displayName: emailRecipient.name }],
      },
    };

    if (data.replyTo) {
      // Note: Azure Communication Services doesn't directly support replyTo
      // We're adding it to the email content as a workaround
      emailMessage.content.html = `${emailMessage.content.html}<p><small>Reply to: ${data.replyTo}</small></p>`;
    }

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    console.warn("Sent mail successfully", result);
    // Email sent successfully
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

/**
 * Formats contact form data into an email using enhanced template
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
  const templateData = emailTemplates.getContactEmailTemplate(formData);

  return {
    subject: templateData.subject,
    text: templateData.text,
    html: templateData.html,
    replyTo: formData.email,
  };
}

/**
 * Formats appointment form data into an email using enhanced template
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
  const templateData = emailTemplates.getAppointmentEmailTemplate(formData);

  return {
    subject: templateData.subject,
    text: templateData.text,
    html: templateData.html,
    replyTo: formData.email,
  };
}

/**
 * Formats newsletter subscription data into an email using enhanced template
 *
 * @param formData - The newsletter subscription data
 * @returns The formatted email data
 */
export function formatNewsletterEmail(formData: { email: string }): EmailData {
  const templateData = emailTemplates.getNewsletterEmailTemplate(formData);

  return {
    subject: templateData.subject,
    text: templateData.text,
    html: templateData.html,
    replyTo: formData.email,
  };
}

/**
 * Formats query form data into an email using enhanced template
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
  const templateData = emailTemplates.getQueryEmailTemplate(formData);

  return {
    subject: templateData.subject,
    text: templateData.text,
    html: templateData.html,
    replyTo: formData.email,
  };
}

/**
 * Formats message form data into an email using enhanced template
 * 
 * @param formData - The message form data
 * @returns The formatted email data
 */
export function formatMessageEmail(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): EmailData {
  const templateData = emailTemplates.getMessageEmailTemplate(formData);

  return {
    subject: templateData.subject,
    text: templateData.text,
    html: templateData.html,
    replyTo: formData.email,
  };
}
