import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import * as emailTemplates from "./email-templates";

/**
 * AWS SES Client configuration
 */
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Email sender configuration
 */
const emailSender = {
  name: process.env.EMAIL_SENDER_NAME || "Taxclusive",
  email: process.env.EMAIL_SENDER_ADDRESS || "noreply@taxclusive.com",
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
 * Sends an email using AWS SES
 *
 * @param data - The email data to send
 * @returns A promise that resolves when the email is sent
 */
export async function sendEmail(data: EmailData): Promise<void> {
  try {
    const params = {
      Destination: {
        ToAddresses: [emailRecipient.email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: data.html || data.text,
          },
          Text: {
            Charset: "UTF-8",
            Data: data.text,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: data.subject,
        },
      },
      Source: emailSender.email,
      ReplyToAddresses: data.replyTo ? [data.replyTo] : [],
    };

    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log("Email sent successfully", result.MessageId);
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
