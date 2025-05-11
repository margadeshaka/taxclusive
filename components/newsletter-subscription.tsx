import { Mail } from "lucide-react"

export default function NewsletterSubscription({ className }: { className?: string }) {
  return (
    <div className={`rounded-lg border bg-background p-6 shadow-sm ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Mail className="h-6 w-6 text-primary mt-1" />
        <div>
          <h3 className="font-bold">Subscribe to Our Newsletter</h3>
          <p className="text-muted-foreground mt-2">
          Stay updated with the latest tax regulations, compliance deadlines, and expert financial tips from our chartered accountants. Subscribe to receive curated insights straight to your inbox.
          </p>
        </div>
      </div>
      <form className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email-newsletter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <div className="flex gap-2">
            <input
              id="email-newsletter"
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your email"
              required
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Subscribe
            </button>
          </div>
        </div>
        {/* <p className="text-xs text-muted-foreground">
          By subscribing, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>{" "}
          and consent to receive updates from our company.
        </p> */}
      </form>
    </div>
  )
}

