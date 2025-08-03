import { z } from "zod";

// Common validation patterns
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reusable field schemas
export const validationSchemas = {
  email: z
    .string()
    .min(1, "Email is required")
    .regex(emailRegex, "Please enter a valid email address"),
  
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Please enter a valid phone number"),
  
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
  
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be less than 100 characters"),
};

// Contact form schema
export const contactFormSchema = z.object({
  name: validationSchemas.name,
  email: validationSchemas.email,
  phone: validationSchemas.phone.optional(),
  subject: validationSchemas.subject,
  message: validationSchemas.message,
});

// Appointment form schema
export const appointmentFormSchema = z.object({
  name: validationSchemas.name,
  email: validationSchemas.email,
  phone: validationSchemas.phone,
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  message: validationSchemas.message.optional(),
});

// Newsletter form schema
export const newsletterFormSchema = z.object({
  email: validationSchemas.email,
  name: validationSchemas.name.optional(),
});

// Query form schema
export const queryFormSchema = z.object({
  name: validationSchemas.name,
  email: validationSchemas.email,
  phone: validationSchemas.phone.optional(),
  query: validationSchemas.message,
  category: z.string().min(1, "Please select a category"),
});

// Login form schema
export const loginFormSchema = z.object({
  email: validationSchemas.email,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Blog form schema
export const blogFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  featuredImage: z.string().url("Please enter a valid image URL").optional(),
  category: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean().optional(),
});

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
export type NewsletterFormData = z.infer<typeof newsletterFormSchema>;
export type QueryFormData = z.infer<typeof queryFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type BlogFormData = z.infer<typeof blogFormSchema>;