# TaxExclusive

Welcome to the TaxExclusive project - a modern web application for a Chartered Accountancy firm committed to delivering excellence in financial and taxation services.

## 📋 Project Overview

TaxExclusive is a Next.js-based web application that provides information about taxation services and allows clients to access resources like blogs and contact information. The project uses modern web technologies including:

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Prisma ORM with PostgreSQL
- NextAuth for authentication
- AWS SES for email services
- Jest & Playwright for testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm package manager

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:margadeshaka/taxexclusive.git
   cd taxexclusive
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update the variables with your own values

### Development

Start the development server:

```bash
pnpm dev
```

This will start the application at [http://localhost:3000](http://localhost:3000).

### Building for Production

Build the application:

```bash
pnpm build
```

This project is configured for static export (output: 'export' in next.config.mjs).

Start the production server:

```bash
pnpm start
```

## 🧪 Testing

Run tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

## 📁 Project Structure

- **app/**: Next.js app router pages and layouts
- **components/**: Reusable React components
- **hooks/**: Custom React hooks
- **lib/**: Utility functions and shared code
- **public/**: Static assets
- **styles/**: Global styles and CSS utilities
- **docs/**: Project documentation

## 🏢 About Us

We are a Chartered Accountancy firm based in Noida, serving clients PAN India.

### 🌟 Our Key Services

- Income Tax Filing
- GST Registration & Filing
- Bookkeeping & Accounting
- Company Incorporation
- Financial Planning & Advisory
- TDS Return Filing
- Audit & Assurance

### 💼 Why Choose Us?

- Experienced Chartered Accountants
- Transparent and Timely Service
- Customized Solutions for Individuals & Businesses
- Strong Data Security and Compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
