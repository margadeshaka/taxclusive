import { HelpCircle, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { submitQueryForm } from "@/app/actions/form-actions";
import Footer from "@/components/footer";
import Header from "@/components/header";

export const metadata = {
  title: "Ask a Query - Taxclusive",
  description:
    "Submit your accounting, taxation, or financial questions to our expert team for personalized assistance.",
};

export default function AskQueryPage() {
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  async function handleSubmit(formData: FormData) {
    try {
      const result = await submitQueryForm(formData);
      setFormStatus({
        submitted: true,
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 ethnic-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
                <h1 className="text-3xl font-bold tracking-tighter font-serif sm:text-5xl">
                  Ask a Query
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have a specific question? Submit your query and our expert team will provide
                  personalized assistance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="ethnic-divider text-left">
                  <span className="text-primary font-serif pl-0 pr-4">How It Works</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif md:text-4xl/tight">
                  Get Expert Answers to Your Questions
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our team of experienced professionals is ready to address your specific
                  accounting, taxation, or financial questions with personalized guidance.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold">Submit Your Query</h3>
                    <p className="text-muted-foreground">
                      Fill out the form with your question and any relevant details. The more
                      specific you are, the better we can assist you.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold">Expert Review</h3>
                    <p className="text-muted-foreground">
                      Our team will review your query and assign it to the appropriate specialist
                      based on the subject matter and complexity.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold">Receive Your Answer</h3>
                    <p className="text-muted-foreground">
                      You&apos;ll receive a personalized response via email within 1-2 business days. For
                      complex queries, we may schedule a follow-up call.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                <h3 className="text-lg font-bold mb-2">Common Query Topics</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Tax planning strategies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Business deductions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Financial statement analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Retirement planning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Business structure optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Cash flow management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Audit preparation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>International taxation</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border bg-background p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Submit Your Query</h3>

              {formStatus.submitted && (
                <div className={`p-4 mb-6 rounded-md ${formStatus.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                  <p className="text-sm font-medium">{formStatus.message}</p>
                </div>
              )}

              <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="full-name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="full-name"
                    name="full-name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Query Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="tax">Taxation</option>
                    <option value="audit">Audit & Assurance</option>
                    <option value="advisory">Financial Advisory</option>
                    <option value="bookkeeping">Bookkeeping & Accounting</option>
                    <option value="payroll">Payroll Services</option>
                    <option value="business">Business Consulting</option>
                    <option value="personal">Personal Finance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="priority"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Priority Level
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="normal">Normal - Response within 1-2 business days</option>
                    <option value="urgent">Urgent - Response within 24 hours</option>
                    <option value="immediate">
                      Immediate - Response ASAP (additional fees may apply)
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Brief description of your query"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="query"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Your Query <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="query"
                    name="query"
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Please provide detailed information about your question or concern"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="file-upload"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Attach Relevant Documents (optional)
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Max file size: 10MB. Accepted formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground">
                    I consent to Taxclusive processing my personal data to respond to my query. I
                    understand that my information will be handled in accordance with the{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    . <span className="text-red-500">*</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Submit Query
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Fields marked with <span className="text-red-500">*</span> are required
                </p>
              </form>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="ethnic-divider">
                  <span className="text-primary font-serif px-4">Response Policy</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter font-serif sm:text-4xl">
                  Our Commitment to You
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We strive to provide timely, accurate, and helpful responses to all queries.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 pt-12 lg:grid-cols-3">
              <div className="space-y-2 p-6 border border-border bg-background rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">Response Time</h3>
                <p className="text-muted-foreground">
                  We aim to respond to all standard queries within 1-2 business days. Urgent queries
                  are prioritized and typically addressed within 24 hours during business days.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border bg-background rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">Confidentiality</h3>
                <p className="text-muted-foreground">
                  All information shared with us is treated with the utmost confidentiality. We
                  adhere to strict professional standards and privacy regulations to protect your
                  data.
                </p>
              </div>
              <div className="space-y-2 p-6 border border-border bg-background rounded-lg hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-bold">Follow-up Process</h3>
                <p className="text-muted-foreground">
                  For complex queries that require additional information or discussion, we may
                  suggest a follow-up call or meeting to ensure your question is fully addressed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
