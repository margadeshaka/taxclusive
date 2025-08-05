import { z } from "zod";

import {
  contactFormSchema,
  simpleContactFormSchema,
  newsletterSubscriptionSchema,
  appointmentFormSchema,
} from "@/lib/validation";

// Infer types from Zod schemas
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SimpleContactFormData = z.infer<typeof simpleContactFormSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSubscriptionSchema>;
export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

// Form submission response types
export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Form state types
export interface FormState<T = any> {
  data: T;
  errors: Record<string, string[]>;
  isSubmitting: boolean;
  isSuccess: boolean;
  message?: string;
}