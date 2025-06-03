/**
 * Form Validation Schemas
 *
 * This module provides Zod schemas for validating and sanitizing form inputs
 * to protect against injection attacks and ensure data integrity.
 */

import { z } from "zod";

/**
 * Contact Form Schema
 * Validates and sanitizes contact form inputs
 */
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .trim()
    .regex(/^[a-zA-Z\s]+$/, { message: "First name must contain only letters and spaces" }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .trim()
    .regex(/^[a-zA-Z\s]+$/, { message: "Last name must contain only letters and spaces" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9+\-\s()]+$/, {
      message:
        "Phone number must contain only digits, spaces, and the following characters: + - ( )",
    })
    .trim(),

  subject: z
    .string()
    .min(1, { message: "Subject is required" })
    .max(100, { message: "Subject must be less than 100 characters" })
    .trim(),

  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(1000, { message: "Message must be less than 1000 characters" })
    .trim(),
});

/**
 * Simple Contact Form Schema
 * Validates and sanitizes simple contact form inputs (name, email, subject, message)
 */
export const simpleContactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .trim()
    .regex(/^[a-zA-Z\s]+$/, { message: "Name must contain only letters and spaces" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),

  subject: z
    .string()
    .min(1, { message: "Subject is required" })
    .max(100, { message: "Subject must be less than 100 characters" })
    .trim(),

  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(1000, { message: "Message must be less than 1000 characters" })
    .trim(),
});

/**
 * Newsletter Subscription Schema
 * Validates and sanitizes newsletter subscription form inputs
 */
export const newsletterSubscriptionSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
});

/**
 * Appointment Form Schema
 * Validates and sanitizes appointment form inputs
 */
export const appointmentFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .trim()
    .regex(/^[a-zA-Z\s]+$/, { message: "First name must contain only letters and spaces" }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .trim()
    .regex(/^[a-zA-Z\s]+$/, { message: "Last name must contain only letters and spaces" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9+\-\s()]+$/, {
      message:
        "Phone number must contain only digits, spaces, and the following characters: + - ( )",
    })
    .trim(),

  date: z.string().min(1, { message: "Date is required" }),

  time: z.string().min(1, { message: "Time is required" }),

  service: z.string().min(1, { message: "Service is required" }),

  message: z
    .string()
    .max(1000, { message: "Message must be less than 1000 characters" })
    .trim()
    .optional()
    .nullable()
    .transform((val) => val || ""),
});

/**
 * Sanitize a string to prevent XSS attacks
 * @param input - The string to sanitize
 * @returns The sanitized string
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;");
}

/**
 * Type for form validation errors
 */
export type FormErrors<T> = {
  [K in keyof T]?: string[];
};

/**
 * Validate form data against a schema
 * @param schema - The Zod schema to validate against
 * @param data - The form data to validate
 * @returns An object containing the validated data and any errors
 */
export function validateForm<T>(
  schema: z.ZodType<T>,
  data: unknown
): {
  data: T | null;
  errors: FormErrors<T> | null;
} {
  try {
    // Validate and sanitize the data
    const validData = schema.parse(data);
    return { data: validData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert Zod errors to a more usable format
      const errors: FormErrors<T> = {};

      error.errors.forEach((err) => {
        const path = err.path[0] as keyof T;
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path]?.push(err.message);
      });

      return { data: null, errors };
    }

    // If it's not a Zod error, return a generic error
    return {
      data: null,
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      } as unknown as FormErrors<T>,
    };
  }
}
