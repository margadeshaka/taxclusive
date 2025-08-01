# TaxExclusive Admin Portal Setup

This guide will help you set up the admin portal for TaxExclusive with PostgreSQL database and AWS SES email integration.

## Prerequisites

- Node.js 18+ and npm/pnpm
- Docker and Docker Compose
- AWS account with SES configured

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://admin:admin123@localhost:5432/taxexclusive"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# AWS SES Configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"

# Email Configuration
EMAIL_SENDER_NAME="TaxExclusive"
EMAIL_SENDER_ADDRESS="noreply@yourdomain.com"
EMAIL_RECIPIENT_ADDRESS="contact@yourdomain.com"

# Security
CSRF_SECRET="your-csrf-secret-here"

# Strapi CMS (if using)
NEXT_PUBLIC_STRAPI_API_URL="your-strapi-url"
STRAPI_API_TOKEN="your-strapi-token"
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL Database

```bash
# Start Docker containers
npm run docker:up

# This will start:
# - PostgreSQL on port 5432
# - Adminer (DB admin) on port 8080
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

## Admin Portal Access

Once setup is complete, you can access:

- **Main Website**: http://localhost:3000
- **Admin Portal**: http://localhost:3000/admin
- **Database Admin**: http://localhost:8080

### Default Login Credentials

**Admin User:**
- Email: `admin@taxexclusive.com`
- Password: `admin123`
- Role: ADMIN (full access)

**Editor User:**
- Email: `editor@taxexclusive.com`
- Password: `editor123`
- Role: EDITOR (limited access)

## Admin Portal Features

### Admin Role (Full Access)
- Dashboard with analytics
- User management (create, edit, delete users)
- Blog management (create, edit, delete, publish blogs)
- Testimonial management
- System settings

### Editor Role (Limited Access)
- Dashboard (read-only analytics)
- Blog management (create, edit own blogs)
- Testimonial management
- No user management access

## Database Management

### Useful Commands

```bash
# View database in browser
npm run db:studio

# Create new migration
npm run db:migrate

# Reset database (recreate all tables)
npm run db:push --force-reset

# Re-seed database
npm run db:seed
```

### Docker Commands

```bash
# Start containers
npm run docker:up

# Stop containers
npm run docker:down

# View container logs
docker-compose logs postgres

# Access PostgreSQL directly
docker exec -it taxexclusive-postgres psql -U admin -d taxexclusive
```

## Blog Management

The admin portal includes a rich blog management system:

- **Markdown Editor**: Write blogs using Markdown syntax
- **Draft/Published States**: Control blog visibility
- **Featured Posts**: Mark important blogs as featured
- **Tags System**: Organize blogs with tags
- **SEO Optimization**: Add meta descriptions and cover images
- **Author Attribution**: Track who created each blog

## Testimonial Management

Manage client testimonials with:

- **Approval System**: Review testimonials before publishing
- **Rating System**: 1-5 star ratings
- **Featured Testimonials**: Highlight best testimonials
- **Client Information**: Name, designation, company, location
- **Rich Content**: Full testimonial text with formatting

## Email Integration

The system uses AWS SES for:

- **Contact Form Submissions**: Automatic email notifications
- **Admin Notifications**: System alerts and updates
- **Newsletter Subscriptions**: Email list management

## Security Features

- **Role-Based Access Control**: Admin vs Editor permissions
- **Secure Authentication**: NextAuth.js with bcrypt password hashing
- **CSRF Protection**: Secure API endpoints
- **Session Management**: Secure user sessions
- **Input Validation**: Server-side validation for all forms

## Troubleshooting

### Database Connection Issues

1. Ensure Docker containers are running: `docker ps`
2. Check database URL in `.env.local`
3. Verify PostgreSQL is accessible: `npm run db:studio`

### Authentication Issues

1. Check NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL matches your domain
3. Clear browser cookies and try again

### Email Issues

1. Verify AWS SES credentials
2. Check if sender email is verified in SES
3. Ensure AWS region is correct

### Build Issues

1. Run `npm run db:generate` after schema changes
2. Clear `.next` folder: `rm -rf .next`
3. Restart development server

## Production Deployment

For production deployment:

1. Update environment variables for production URLs
2. Use a managed PostgreSQL database (AWS RDS, Supabase, etc.)
3. Configure AWS SES for production email sending
4. Set up proper domain and SSL certificates
5. Use strong secrets for NEXTAUTH_SECRET and CSRF_SECRET

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all environment variables are correctly set
4. Verify database connectivity and migrations