export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  encoding?: string;
  contentType?: string;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  generateHtml: (data: any) => string;
  generateText?: (data: any) => string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailServiceConfig {
  provider: "ses" | "sendgrid" | "smtp";
  region?: string;
  apiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  defaultFrom: string;
  defaultReplyTo?: string;
}