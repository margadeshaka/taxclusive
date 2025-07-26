# Environment Variables Setup Guide

This guide explains how to configure environment variables for secure access to AWS SES and other secrets.

## Development Setup

### 1. Local Development (.env.local)

Create a `.env.local` file with the following configuration:

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Email Configuration
EMAIL_SENDER_NAME="Taxclusive"
EMAIL_SENDER_ADDRESS="noreply@taxclusive.com"
EMAIL_RECIPIENT_ADDRESS="contact@taxclusive.com"
EMAIL_RECIPIENT_NAME="Taxclusive Support"

# Strapi CMS Configuration (if applicable)
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token
```

### 2. Security Features

✅ **Secure File Handling**: `.env*` files are properly gitignored
✅ **Environment Variable Access**: Application uses `process.env.*` for secure access
✅ **Error Handling**: Proper validation with helpful error messages

## Production Deployment

### AWS Deployment

When deploying to AWS, set environment variables through:

1. **AWS Systems Manager Parameter Store** (Recommended)
2. **AWS Secrets Manager** (For sensitive data)
3. **Environment variables in your deployment platform**

### Required Environment Variables

| Variable                    | Description                         | Required |
| --------------------------- | ----------------------------------- | -------- |
| `AWS_REGION`                | AWS region (e.g., us-east-1)        | Yes      |
| `AWS_ACCESS_KEY_ID`         | AWS access key ID                   | Yes      |
| `AWS_SECRET_ACCESS_KEY`     | AWS secret access key               | Yes      |
| `EMAIL_SENDER_NAME`         | Display name for emails             | Yes      |
| `EMAIL_SENDER_ADDRESS`      | Verified SES sender email           | Yes      |
| `EMAIL_RECIPIENT_ADDRESS`   | Email to receive form submissions   | Yes      |
| `EMAIL_RECIPIENT_NAME`      | Display name for recipient          | Yes      |

### GitHub Secrets (for CI/CD)

If using GitHub Actions, set secrets at: **Repository → Settings → Secrets and variables → Actions**

### Vercel Deployment

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add the same variables as listed above

## AWS SES Setup

### Prerequisites

1. Verify sender email address in AWS SES
2. Move out of SES sandbox for production use
3. Configure proper IAM permissions

### IAM Policy for SES

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

## Testing Email Configuration

### Test Script

Run the email test script to verify configuration:

```bash
node scripts/test-email.js
```

### Manual Testing

1. Start development server: `pnpm dev`
2. Visit contact form: `http://localhost:3000/contact`
3. Submit a test message
4. Check console for success/error messages

## Security Best Practices

### ✅ What's Already Implemented

- Environment variables properly excluded from version control
- Secure access patterns in application code
- Proper error handling without exposing secrets
- AWS credentials validation on startup

### 🔒 Additional Security Recommendations

1. **Use IAM Roles**: Prefer IAM roles over access keys in production
2. **Rotate Keys Regularly**: Update AWS access keys monthly
3. **Monitor Usage**: Use CloudWatch to monitor SES activity
4. **Environment Separation**: Use different AWS accounts/keys for dev/staging/production
5. **Access Control**: Limit who can view production secrets

## Troubleshooting

### Common Issues

**Issue**: `AWS_ACCESS_KEY_ID environment variable is required`
**Solution**: Ensure `.env.local` exists and contains AWS credentials

**Issue**: Email sending fails with "MessageRejected"
**Solution**: Verify sender email is verified in SES and you're out of sandbox mode

**Issue**: Development server not loading environment variables
**Solution**: Restart the development server after modifying `.env.local`

### Debug Mode

Enable AWS SDK debug logging:

```bash
AWS_SDK_LOAD_CONFIG=1 DEBUG="aws-sdk:*" pnpm dev
```

## Architecture Notes

The application uses:

- **lib/email.ts**: Core email functionality with AWS SES integration
- **API Routes**: `/api/contact`, `/api/appointment`, etc. for form handling
- **AWS SES**: For reliable email delivery
- **Error Boundaries**: Graceful handling of email service failures

---

**⚠️ Important**: Never commit `.env.local` or any file containing actual secrets to version control.