"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Mail, MapPin, Phone } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitMessageForm } from "@/lib/form-actions";
import { simpleContactFormSchema } from "@/lib/validation";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(simpleContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      // Create FormData object from form values
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('subject', data.subject);
      formData.append('message', data.message);

      // Submit the form using the submitMessageForm function
      const result = await submitMessageForm(formData);

      if (result.success) {
        // Show success message
        toast({
          title: "Message sent!",
          description: "Thank you for your message. We'll get back to you soon.",
          variant: "default",
        });

        // Reset form
        form.reset();
      } else {
        // Show error message
        toast({
          title: "Something went wrong",
          description: result.message || "Your message couldn't be sent. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Show error message
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again later.",
        variant: "destructive",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="w-16 h-1 bg-primary mb-4"></div>
              <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">
                Get in Touch
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Ready to take the next step? Whether you&rsquo;re looking for expert advice or have a
                quick question, we&rsquo;re here to help you every step of the way. Get in touch today!
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary" aria-hidden="true" />
                <div className="space-y-1">
                  <h3 className="font-bold">Phone</h3>
                  <p className="text-muted-foreground">(+91)97739-79042</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                <div className="space-y-1">
                  <h3 className="font-bold">Email</h3>
                  <p className="text-muted-foreground">contact@taxclusive.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
                <div className="space-y-1">
                  <h3 className="font-bold">Address</h3>
                  <p className="text-muted-foreground">
                    JMD Megapolis, Sector 48
                    <br />
                    Sohna road ,Gurugram - 122001 ,HARYANA
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Send us a Message</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            {...field}
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="subject">Subject</FormLabel>
                      <FormControl>
                        <Input
                          id="subject"
                          placeholder="Enter subject"
                          {...field}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="message">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          id="message"
                          placeholder="Enter your message"
                          className="min-h-[120px]"
                          {...field}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
