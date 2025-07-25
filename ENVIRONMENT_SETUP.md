# Environment Variables Setup Guide

This guide explains how to configure environment variables for secure access to Azure Communication Services and other secrets.

## Development Setup

### 1. Local Development (.env.local)

Your `.env.local` file is already configured with:

```bash
# Azure Communication Services Configuration
AZURE_COMMUNICATION_CONNECTION_STRING="endpoint=https://taxclusive-communication.india.communication.azure.com/;accesskey=50751d46yjZTeuEyOBfs0QYMGpwCIoLWW768GSRIFlK5bRlUYnysJQQJ99BGACULyCpdfitoAAAAAZCSjHWQ"

# Email Configuration
EMAIL_SENDER_NAME="Taxclusive"
EMAIL_SENDER_ADDRESS="DoNotReply@taxclusive.com"
EMAIL_RECIPIENT_ADDRESS="contact@taxclusive.com"
EMAIL_RECIPIENT_NAME="Taxclusive Support"
```

### 2. Security Features

✅ **Secure File Handling**: `.env*` files are properly gitignored
✅ **Environment Variable Access**: Application uses `process.env.*` for secure access
✅ **Error Handling**: Proper validation with helpful error messages

## Production Deployment

### Azure Static Web Apps
Set environment variables in Azure portal:

1. Go to Azure Portal → Static Web Apps → Your App
2. Navigate to **Settings → Configuration**
3. Add the following variables:

| Variable | Value | Required |
|----------|-------|----------|
| `AZURE_COMMUNICATION_CONNECTION_STRING` | Your connection string | Yes |
| `EMAIL_SENDER_NAME` | Taxclusive | Yes |
| `EMAIL_SENDER_ADDRESS` | DoNotReply@taxclusive.com | Yes |
| `EMAIL_RECIPIENT_ADDRESS` | contact@taxclusive.com | Yes |
| `EMAIL_RECIPIENT_NAME` | Taxclusive Support | Yes |

### GitHub Secrets (for CI/CD)
If using GitHub Actions, set secrets at: **Repository → Settings → Secrets and variables → Actions**

Use the provided script: `./scripts/setup-github-secrets.sh`

### Vercel Deployment
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add the same variables as listed above

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
- Connection string validation on startup

### 🔒 Additional Security Recommendations
1. **Rotate Keys Regularly**: Update Azure access keys monthly
2. **Monitor Usage**: Check Azure portal for unusual activity
3. **Environment Separation**: Use different keys for dev/staging/production
4. **Access Control**: Limit who can view production secrets

## Troubleshooting

### Common Issues

**Issue**: `AZURE_COMMUNICATION_CONNECTION_STRING environment variable is required`
**Solution**: Ensure `.env.local` exists and contains the connection string

**Issue**: Email sending fails
**Solution**: Verify the connection string format and Azure service status

**Issue**: Development server not loading environment variables
**Solution**: Restart the development server after modifying `.env.local`

### Debug Mode
Enable debug logging:
```bash
DEBUG="azure:communication:email" pnpm dev
```

## Architecture Notes

The application uses:
- **lib/email.ts**: Core email functionality with environment variable access
- **API Routes**: `/api/contact`, `/api/appointment`, etc. for form handling
- **Azure Communication Services**: For reliable email delivery
- **Error Boundaries**: Graceful handling of email service failures

---

**⚠️ Important**: Never commit `.env.local` or any file containing actual secrets to version control.