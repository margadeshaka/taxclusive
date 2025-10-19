"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { emailService } from "@/lib/email-client";
import { newsletterSubscriptionSchema } from "@/lib/validation";

/**
 * Form values for the newsletter subscription form
 * @interface FormValues
 * @property {string} email - The email address for newsletter subscription
 */
type FormValues = {
  email: string;
};

/**
 * Newsletter subscription component that allows users to subscribe to the newsletter
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.className] - Optional CSS class name for styling the component
 * @returns {JSX.Element} Newsletter subscription form
 */
export default function NewsletterSubscription({ className }: { className?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(newsletterSubscriptionSchema),
    defaultValues: {
      email: "",
    },
  });

  /**
   * Handles the form submission for newsletter subscription
   *
   * @async
   * @param {FormValues} data - Form data containing the email address
   * @returns {Promise<void>}
   */
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      // Submit using email service
      const result = await emailService.submitNewsletterForm(data);

      if (result.success) {
        // Show success message
        toast({
          title: "Subscription successful!",
          description: result.message,
          variant: "default",
        });

        // Reset form
        form.reset();
      } else {
        // Show error message
        toast({
          title: "Subscription failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Show error message
      toast({
        title: "Subscription failed",
        description: "We couldn't process your subscription. Please try again later.",
        variant: "destructive",
      });
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={`rounded-lg border bg-background p-6 shadow-sm ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Mail className="h-6 w-6 text-primary mt-1" />
        <div>
          <h3 className="font-bold">Subscribe to Our Newsletter</h3>
          <p className="text-muted-foreground mt-2">
            Stay updated with the latest tax regulations, compliance deadlines, and expert financial
            tips from our tax professionals. Subscribe to receive curated insights straight to
            your inbox.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="email-newsletter">Email</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      id="email-newsletter"
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      aria-required="true"
                    />
                  </FormControl>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>{" "}
            and consent to receive updates from our company.
          </p>
        </form>
      </Form>
    </div>
  );
}
