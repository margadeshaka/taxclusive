'use client';

import { 
  sendEmail, 
  formatContactEmail, 
  formatAppointmentEmail, 
  formatNewsletterEmail, 
  formatQueryEmail,
  formatMessageEmail
} from '@/lib/email';

/**
 * Handles contact form submissions
 * 
 * @param formData - The form data from the contact form
 * @returns A result object indicating success or failure
 */
export async function submitContactForm(formData: FormData) {
  try {
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    // Format and send the email
    const emailData = formatContactEmail({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    });

    await sendEmail(emailData);

    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, message: 'Failed to send message. Please try again later.' };
  }
}

/**
 * Handles appointment form submissions
 * 
 * @param formData - The form data from the appointment form
 * @returns A result object indicating success or failure
 */
export async function submitAppointmentForm(formData: FormData) {
  try {
    const fullName = formData.get('full-name') as string;
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const service = formData.get('service') as string;
    const date = formData.get('preferred-date') as string;
    const time = formData.get('preferred-time') as string;
    const meetingType = formData.get('meeting-type') as string;
    const message = formData.get('message') as string;

    // Validate required fields
    if (!fullName || !email || !phone || !service || !date || !time || !meetingType) {
      return { success: false, message: 'Please fill in all required fields.' };
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

    return { success: true, message: 'Your appointment request has been submitted successfully!' };
  } catch (error) {
    console.error('Error submitting appointment form:', error);
    return { success: false, message: 'Failed to submit appointment request. Please try again later.' };
  }
}

/**
 * Handles newsletter subscription form submissions
 * 
 * @param formData - The form data from the newsletter subscription form
 * @returns A result object indicating success or failure
 */
export async function submitNewsletterForm(formData: FormData) {
  try {
    const email = formData.get('email') as string;

    // Validate required fields
    if (!email) {
      return { success: false, message: 'Please provide your email address.' };
    }

    // Format and send the email
    const emailData = formatNewsletterEmail({ email });

    await sendEmail(emailData);

    return { success: true, message: 'You have been subscribed to our newsletter!' };
  } catch (error) {
    console.error('Error submitting newsletter form:', error);
    return { success: false, message: 'Failed to subscribe to newsletter. Please try again later.' };
  }
}

/**
 * Handles query form submissions
 * 
 * @param formData - The form data from the query form
 * @returns A result object indicating success or failure
 */
export async function submitQueryForm(formData: FormData) {
  try {
    const fullName = formData.get('full-name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const category = formData.get('category') as string;
    const priority = formData.get('priority') as string;
    const subject = formData.get('subject') as string;
    const query = formData.get('query') as string;

    // Handle file uploads (in a static site, we can't actually process files,
    // but we can acknowledge their presence in the email)
    const fileInput = formData.get('file-upload') as File;
    const files = fileInput ? [fileInput.name] : [];

    // Validate required fields
    if (!fullName || !email || !category || !subject || !query) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    // Format and send the email
    const emailData = formatQueryEmail({
      fullName,
      email,
      phone,
      category,
      priority,
      subject,
      query,
      files,
    });

    await sendEmail(emailData);

    return { success: true, message: 'Your query has been submitted successfully!' };
  } catch (error) {
    console.error('Error submitting query form:', error);
    return { success: false, message: 'Failed to submit query. Please try again later.' };
  }
}

/**
 * Handles message form submissions
 * 
 * @param formData - The form data from the message form
 * @returns A result object indicating success or failure
 */
export async function submitMessageForm(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    // Format and send the email
    const emailData = formatMessageEmail({
      name,
      email,
      phone,
      subject,
      message,
    });

    await sendEmail(emailData);

    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (error) {
    console.error('Error submitting message form:', error);
    return { success: false, message: 'Failed to send message. Please try again later.' };
  }
}
