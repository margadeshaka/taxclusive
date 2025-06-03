# Azure SMTP Implementation for Forms

This document outlines the implementation of Azure SMTP for form submissions in the Taxclusive website.

## Overview

The Taxclusive website is a static website that needs to handle form submissions without using APIs. To achieve this, we've implemented Azure SMTP for sending emails when forms are submitted. This implementation uses Next.js server actions to handle form submissions and send emails using the Azure SMTP service.

## Implementation Details

### Email Configuration

The email configuration is defined in `/lib/email.ts`. This file contains:

- Configuration for Azure SMTP using environment variables
- Email sender and recipient configuration
- Functions for formatting emails for different form types
- A function for sending emails using nodemailer

### Server Actions

Server actions for form submissions are defined in `/app/actions/form-actions.ts`. This file contains:

- `submitContactForm`: Handles contact form submissions
- `submitAppointmentForm`: Handles appointment form submissions
- `submitQueryEmail`: Handles query form submissions
- `submitNewsletterForm`: Handles newsletter subscription form submissions

Each server action:
1. Extracts form data
2. Validates required fields
3. Formats the email using the appropriate function from `/lib/email.ts`
4. Sends the email using the `sendEmail` function
5. Returns a result object indicating success or failure

### Form Components

The following form components have been modified to use the server actions:

- Contact form (`/app/contact/page.tsx`)
- Appointment form (`/app/appointment/page.tsx`)
- Ask Query form (`/app/ask-query/page.tsx`)
- Newsletter subscription form (`/app/insights/page.tsx`)

Each form component:
1. Imports the necessary server action
2. Uses React state to manage form submission status
3. Defines a form submission handler that calls the server action
4. Displays success or error messages after form submission
5. Includes the `name` attribute on all form fields so they can be accessed in the server action

## Environment Variables

The following environment variables need to be set for the Azure SMTP configuration:

```
AZURE_SMTP_HOST=<smtp-host>
AZURE_SMTP_PORT=<smtp-port>
AZURE_SMTP_SECURE=<true|false>
AZURE_SMTP_USER=<smtp-username>
AZURE_SMTP_PASSWORD=<smtp-password>
EMAIL_SENDER_NAME=<sender-name>
EMAIL_SENDER_ADDRESS=<sender-email>
EMAIL_RECIPIENT_NAME=<recipient-name>
EMAIL_RECIPIENT_ADDRESS=<recipient-email>
```

## Testing

To test the implementation:

1. Set the environment variables
2. Fill out and submit each form
3. Check that the email is received by the recipient
4. Verify that the form displays the appropriate success or error message

## Conclusion

This implementation allows the Taxclusive website to handle form submissions without using APIs. When a form is submitted, the data is sent to the server, formatted into an email, and sent using the Azure SMTP service. The user receives immediate feedback on the success or failure of their submission.