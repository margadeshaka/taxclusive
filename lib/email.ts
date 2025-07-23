import { EmailClient } from "@azure/communication-email";

/**
 * Azure Communication Services Email Client configuration
 */
const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING || 
  "endpoint=https://taxclusive-email.india.communication.azure.com/;accesskey=HaZyuNn1mNnOeb7npt2aZMRVo00seBTRAI4wtCzeiLNEhOkKkV2fJQQJ99BFACULyCpdfitoAAAAAZCS9QUr";

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

/**
 * Formats message form data into an email
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
  const text = `
    New Message Submission

    Name: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone || 'Not provided'}
    Subject: ${formData.subject}

    Message:
    ${formData.message}
  `;

  const html = `
    <h2>New Message Submission</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${formData.subject}</p>
    <h3>Message:</h3>
    <p>${formData.message.replace(/\n/g, '<br>')}</p>
  `;

  return {
    subject: `Message: ${formData.subject}`,
    text,
    html,
    replyTo: formData.email,
  };
}
