/**
 * Professional email templates for Taxclusive communications
 */

export interface EmailTemplateData {
  recipientName?: string;
  senderName?: string;
  companyName?: string;
  contactEmail?: string;
  websiteUrl?: string;
}

/**
 * Base HTML template with professional styling
 */
function getBaseTemplate(content: string, data: EmailTemplateData = {}): string {
  const {
    companyName = "Taxclusive",
    contactEmail = "contact@taxclusive.com",
    websiteUrl = "https://www.taxclusive.com",
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${companyName} - Professional Tax & Accounting Services</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #f8f9fa;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
            margin: 20px auto;
        }
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #1e40af;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        .field-group {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            border-radius: 0 4px 4px 0;
        }
        .field-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .field-value {
            color: #1f2937;
            font-size: 16px;
            word-break: break-word;
        }
        .message-content {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 20px;
            margin-top: 10px;
            font-style: italic;
            color: #4b5563;
        }
        .footer {
            background-color: #f3f4f6;
            padding: 30px 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
            color: #6b7280;
            font-size: 14px;
        }
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .priority-high {
            border-left-color: #ef4444;
        }
        .priority-medium {
            border-left-color: #f59e0b;
        }
        .priority-low {
            border-left-color: #10b981;
        }
        .timestamp {
            color: #9ca3af;
            font-size: 12px;
            text-align: right;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #f3f4f6;
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 4px;
            }
            .content {
                padding: 20px 15px;
            }
            .header {
                padding: 20px 15px;
            }
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>${companyName}</h1>
            <p>Professional Tax & Accounting Services</p>
        </div>
        <div class="content">
            ${content}
            <div class="timestamp">
                Received on ${new Date().toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "full",
                  timeStyle: "short",
                })} IST
            </div>
        </div>
        <div class="footer">
            <p><strong>${companyName}</strong> - Your Trusted Financial Partners</p>
            <p>Email: <a href="mailto:${contactEmail}">${contactEmail}</a></p>
            <p>Website: <a href="${websiteUrl}" target="_blank">${websiteUrl}</a></p>
            <p style="margin-top: 15px; font-size: 12px;">
                This email was sent from your website contact form. 
                Please respond promptly to maintain excellent client service.
            </p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Enhanced contact form email template
 */
export function getContactEmailTemplate(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const content = `
    <h2>📧 New Contact Form Submission</h2>
    
    <div class="field-group">
        <div class="field-label">Client Name</div>
        <div class="field-value">${formData.firstName} ${formData.lastName}</div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Email Address</div>
        <div class="field-value">
            <a href="mailto:${formData.email}" style="color: #3b82f6; text-decoration: none;">
                ${formData.email}
            </a>
        </div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Phone Number</div>
        <div class="field-value">
            <a href="tel:${formData.phone}" style="color: #3b82f6; text-decoration: none;">
                ${formData.phone}
            </a>
        </div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Subject</div>
        <div class="field-value">${formData.subject}</div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Message</div>
        <div class="message-content">
            ${formData.message.replace(/\n/g, "<br>")}
        </div>
    </div>
    
    <p style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 6px; border-left: 4px solid #3b82f6;">
        <strong>Next Steps:</strong> Please respond to this inquiry within 24 hours to maintain our excellent client service standards.
    </p>
  `;

  const html = getBaseTemplate(content);

  const text = `
New Contact Form Submission - Taxclusive

Client: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}

Message:
${formData.message}

Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST

Please respond within 24 hours to maintain excellent client service.
`;

  return {
    subject: `🔔 Contact Form: ${formData.subject} - ${formData.firstName} ${formData.lastName}`,
    html,
    text,
  };
}

/**
 * Enhanced appointment request email template
 */
export function getAppointmentEmailTemplate(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  meetingType: string;
  message?: string;
}): { subject: string; html: string; text: string } {
  const content = `
    <h2>📅 New Appointment Request</h2>
    
    <div class="field-group priority-high">
        <div class="field-label">Client Name</div>
        <div class="field-value">${formData.firstName} ${formData.lastName}</div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Contact Information</div>
        <div class="field-value">
            Email: <a href="mailto:${formData.email}" style="color: #3b82f6;">${formData.email}</a><br>
            Phone: <a href="tel:${formData.phone}" style="color: #3b82f6;">${formData.phone}</a>
        </div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Service Requested</div>
        <div class="field-value">${formData.service}</div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Preferred Date & Time</div>
        <div class="field-value">
            <strong>${new Date(formData.date).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</strong><br>
            Time: ${formData.time}
        </div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Meeting Type</div>
        <div class="field-value">${formData.meetingType}</div>
    </div>
    
    ${
      formData.message
        ? `
    <div class="field-group">
        <div class="field-label">Additional Information</div>
        <div class="message-content">
            ${formData.message.replace(/\n/g, "<br>")}
        </div>
    </div>`
        : ""
    }
    
    <p style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
        <strong>⚡ Action Required:</strong> Please confirm this appointment within 4 hours and send calendar invite to the client.
    </p>
  `;

  const html = getBaseTemplate(content);

  const text = `
New Appointment Request - Taxclusive

Client: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${formData.service}
Date: ${new Date(formData.date).toLocaleDateString("en-IN")}
Time: ${formData.time}
Meeting Type: ${formData.meetingType}

${formData.message ? `Additional Information:\n${formData.message}\n` : ""}

URGENT: Please confirm within 4 hours and send calendar invite.

Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
`;

  return {
    subject: `🚨 URGENT: Appointment Request - ${formData.service} on ${new Date(formData.date).toLocaleDateString("en-IN")}`,
    html,
    text,
  };
}

/**
 * Enhanced query form email template
 */
export function getQueryEmailTemplate(formData: {
  fullName: string;
  email: string;
  phone?: string;
  category: string;
  priority?: string;
  subject: string;
  query: string;
  files?: string[];
}): { subject: string; html: string; text: string } {
  const priorityClass =
    formData.priority === "High"
      ? "priority-high"
      : formData.priority === "Medium"
        ? "priority-medium"
        : "priority-low";

  const content = `
    <h2>❓ New Query Submission</h2>
    
    <div class="field-group ${priorityClass}">
        <div class="field-label">Client Name</div>
        <div class="field-value">${formData.fullName}</div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Contact Information</div>
        <div class="field-value">
            Email: <a href="mailto:${formData.email}" style="color: #3b82f6;">${formData.email}</a>
            ${formData.phone ? `<br>Phone: <a href="tel:${formData.phone}" style="color: #3b82f6;">${formData.phone}</a>` : ""}
        </div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Category</div>
        <div class="field-value">${formData.category}</div>
    </div>
    
    ${
      formData.priority
        ? `
    <div class="field-group ${priorityClass}">
        <div class="field-label">Priority Level</div>
        <div class="field-value">
            <span style="font-weight: bold; color: ${
              formData.priority === "High"
                ? "#ef4444"
                : formData.priority === "Medium"
                  ? "#f59e0b"
                  : "#10b981"
            };">
                ${formData.priority}
            </span>
        </div>
    </div>`
        : ""
    }
    
    <div class="field-group">
        <div class="field-label">Subject</div>
        <div class="field-value">${formData.subject}</div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Query Details</div>
        <div class="message-content">
            ${formData.query.replace(/\n/g, "<br>")}
        </div>
    </div>
    
    ${
      formData.files && formData.files.length > 0
        ? `
    <div class="field-group">
        <div class="field-label">Files Attached</div>
        <div class="field-value">
            ${formData.files.map((file) => `📎 ${file}`).join("<br>")}
        </div>
    </div>`
        : ""
    }
    
    <p style="margin-top: 30px; padding: 15px; background-color: #ecfdf5; border-radius: 6px; border-left: 4px solid #10b981;">
        <strong>📋 Assignment:</strong> Please review this query and assign to the appropriate specialist within 2 hours.
    </p>
  `;

  const html = getBaseTemplate(content);

  const text = `
New Query Submission - Taxclusive

Client: ${formData.fullName}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ""}
Category: ${formData.category}
${formData.priority ? `Priority: ${formData.priority}` : ""}
Subject: ${formData.subject}

Query:
${formData.query}

${formData.files && formData.files.length > 0 ? `Files: ${formData.files.join(", ")}` : ""}

Please assign to appropriate specialist within 2 hours.

Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
`;

  const priorityIcon =
    formData.priority === "High" ? "🔴" : formData.priority === "Medium" ? "🟡" : "🟢";

  return {
    subject: `${priorityIcon} Query: ${formData.category} - ${formData.subject}`,
    html,
    text,
  };
}

/**
 * Enhanced newsletter subscription email template
 */
export function getNewsletterEmailTemplate(formData: { email: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const content = `
    <h2>📰 New Newsletter Subscription</h2>
    
    <div class="field-group">
        <div class="field-label">New Subscriber</div>
        <div class="field-value">
            <a href="mailto:${formData.email}" style="color: #3b82f6; text-decoration: none;">
                ${formData.email}
            </a>
        </div>
    </div>
    
    <p style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 6px; border-left: 4px solid #3b82f6;">
        <strong>📧 Action Required:</strong> Add this email to your newsletter mailing list and send welcome email.
    </p>
  `;

  const html = getBaseTemplate(content);

  const text = `
New Newsletter Subscription - Taxclusive

New Subscriber: ${formData.email}

Action Required: Add to mailing list and send welcome email.

Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
`;

  return {
    subject: `📬 New Newsletter Subscription from ${formData.email}`,
    html,
    text,
  };
}

/**
 * Enhanced message form email template
 */
export function getMessageEmailTemplate(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const content = `
    <h2>💬 New Message</h2>
    
    <div class="field-group">
        <div class="field-label">From</div>
        <div class="field-value">${formData.name}</div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Contact Information</div>
        <div class="field-value">
            Email: <a href="mailto:${formData.email}" style="color: #3b82f6;">${formData.email}</a>
            ${formData.phone ? `<br>Phone: <a href="tel:${formData.phone}" style="color: #3b82f6;">${formData.phone}</a>` : ""}
        </div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Subject</div>
        <div class="field-value">${formData.subject}</div>
    </div>
    
    <div class="field-group">
        <div class="field-label">Message</div>
        <div class="message-content">
            ${formData.message.replace(/\n/g, "<br>")}
        </div>
    </div>
    
    <p style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 6px; border-left: 4px solid #3b82f6;">
        <strong>💼 Follow-up:</strong> Please respond to this message within 24 hours to maintain client satisfaction.
    </p>
  `;

  const html = getBaseTemplate(content);

  const text = `
New Message - Taxclusive

From: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ""}
Subject: ${formData.subject}

Message:
${formData.message}

Please respond within 24 hours.

Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
`;

  return {
    subject: `💌 Message: ${formData.subject} - ${formData.name}`,
    html,
    text,
  };
}
