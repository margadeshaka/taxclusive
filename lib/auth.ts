import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "./prisma"
import { verifyRecaptcha } from "./recaptcha"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Verify reCAPTCHA token for login attempts
        if (credentials.recaptchaToken) {
          const recaptchaResult = await verifyRecaptcha(
            credentials.recaptchaToken,
            'admin_login',
            0.7 // Higher threshold for admin login security
          )

          if (!recaptchaResult.success) {
            console.error('reCAPTCHA verification failed for login:', recaptchaResult.error)
            // Return null to deny login on reCAPTCHA failure
            return null
          }
        } else {
          // Deny login if no reCAPTCHA token provided
          console.error('No reCAPTCHA token provided for login attempt')
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

declare module "next-auth" {
  interface User {
    role: string
  }
  interface Session {
    user: User & {
      id: string
      role: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
}