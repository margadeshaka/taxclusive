"use client"

import { Loader2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRecaptchaForm } from "@/hooks/use-recaptcha-form"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Initialize reCAPTCHA for login form
  const { executeRecaptchaForForm, isExecuting } = useRecaptchaForm({
    action: 'admin_login',
    onError: (error) => {
      setError(error.message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Execute reCAPTCHA first
      const recaptchaToken = await executeRecaptchaForForm()

      if (!recaptchaToken) {
        setError("Security verification failed. Please try again.")
        setIsLoading(false)
        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        recaptchaToken,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        // Check session to get user role
        const session = await getSession()
        if (session?.user) {
          router.push("/admin")
          router.refresh()
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Admin Portal</CardTitle>
          <CardDescription>
            Sign in to access the Taxclusive admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@taxexclusive.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || isExecuting}>
              {(isLoading || isExecuting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}