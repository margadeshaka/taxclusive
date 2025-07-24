# Azure Communication Services Email Setup for Taxclusive

This guide explains how to set up Azure Communication Services for email functionality in the Taxclusive CA firm website.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **Azure CLI**: Install Azure CLI on your machine
3. **Domain Access**: Access to your domain's DNS settings (for custom domain setup)

## Quick Setup

### 1. Install Azure CLI

**macOS:**
```bash
brew install azure-cli
```

**Ubuntu/Debian:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

**Windows:**
Download from: https://aka.ms/installazurecliwindows

### 2. Run Setup Script

```bash
cd scripts
./setup-azure-email.sh
```

The script will:
- Create Azure resource group in Central India region (optimal for Delhi NCR)
- Set up Azure Communication Services resource
- Create Email Communication Service
- Configure Azure Managed Domain for email sending
- Provide connection string and configuration details

### 3. Environment Variables

After running the script, add these variables to your `.env.local` file:

```env
# Azure Communication Services
AZURE_COMMUNICATION_CONNECTION_STRING="endpoint=https://taxclusive-communication.india.communication.azure.com/;accesskey=YOUR_ACCESS_KEY"

# Email Configuration
EMAIL_SENDER_NAME="Taxclusive"
EMAIL_SENDER_ADDRESS="DoNotReply@your-domain.azurecomm.net"
EMAIL_RECIPIENT_ADDRESS="contact@taxclusive.com"
EMAIL_RECIPIENT_NAME="Taxclusive Support"

# SEO Configuration (optional)
NEXT_PUBLIC_BASE_URL="https://www.taxclusive.com"
GOOGLE_SITE_VERIFICATION="your-google-verification-code"
GOOGLE_ANALYTICS_ID="your-ga-tracking-id"
```

## Custom Domain Setup (Optional)

To use your own domain (e.g., noreply@taxclusive.com) instead of Azure's managed domain:

### 1. Add Custom Domain in Azure

The setup script will prompt you to add a custom domain. If you choose to set it up:

1. Enter your domain name (e.g., `taxclusive.com`)
2. Azure will provide DNS records that need to be added to your domain

### 2. DNS Records Required

Add these DNS records to your domain provider:

**TXT Record for Domain Verification:**
```
Name: @
Value: ms-domain-verification=<verification-string>
```

**CNAME Records for DKIM:**
```
Name: selector1._domainkey
Value: selector1-<domain-guid>._domainkey.<region>.azurecomm.net

Name: selector2._domainkey  
Value: selector2-<domain-guid>._domainkey.<region>.azurecomm.net
```

**MX Record (if using custom domain for receiving emails):**
```
Name: @
Value: <domain-guid>.azurecomm.net
Priority: 10
```

### 3. Verify Domain

After adding DNS records:
1. Go to Azure Portal > Communication Services > Email
2. Select your email service
3. Click on your custom domain
4. Click "Verify" to complete the verification

## Testing Email Functionality

### 1. Test with Node.js Script

```bash
# Install dependencies
npm install @azure/communication-email

# Run test script
node scripts/test-email.js
```

### 2. Test with Your Application

```bash
# Start development server
pnpm dev

# Go to contact page and submit a form
# Check the browser console and server logs for any errors
```

## Troubleshooting

### Common Issues

1. **Connection String Error**
   - Verify the connection string is correctly set in `.env.local`
   - Ensure there are no extra spaces or quotes

2. **Sender Address Error**
   - Use the Azure-provided domain initially
   - For custom domains, ensure DNS verification is complete

3. **Permission Errors**
   - Verify your Azure account has proper permissions
   - Check if the Communication Services resource is properly created

4. **Rate Limiting**
   - Azure has sending limits for new accounts
   - Request limit increases if needed

### Logs and Debugging

Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=azure:communication:email
```

### Azure Portal Monitoring

Monitor email sending in Azure Portal:
1. Go to Azure Communication Services
2. Select your resource
3. Click on "Metrics" to view email sending statistics
4. Use "Logs" for detailed troubleshooting

## Cost Considerations

### Pricing (as of 2024)

- **Azure Communication Services**: Pay-per-use
- **Email Sending**: ₹0.75 per 1000 emails (approximately)
- **Data Storage**: Minimal costs for logs and metadata

### Cost Optimization

1. **Email Batching**: Group similar emails together
2. **Template Reuse**: Use templates for common email types
3. **Monitoring**: Set up billing alerts in Azure Portal

## Security Best Practices

1. **Environment Variables**: Never commit connection strings to version control
2. **Access Control**: Use Azure RBAC to limit access to email services
3. **Monitoring**: Enable logging and monitoring for suspicious activity
4. **Encryption**: All communications are encrypted by default

## Production Considerations

### Scaling

- Azure Communication Services auto-scales based on demand
- No manual scaling configuration required
- Monitor usage and costs in Azure Portal

### High Availability

- Service is managed by Microsoft with 99.9% uptime SLA
- Multi-region redundancy built-in
- No additional configuration needed

### Compliance

- GDPR compliant
- SOC 2 Type 2 certified
- HIPAA compliant (if required)

## Support and Resources

- **Azure Documentation**: https://docs.microsoft.com/en-us/azure/communication-services/
- **Pricing Calculator**: https://azure.microsoft.com/en-us/pricing/calculator/
- **Support**: Create support tickets through Azure Portal

## Migration from Other Email Services

If migrating from other email services (SendGrid, SES, etc.):

1. Update environment variables
2. Replace email client initialization
3. Test thoroughly in development
4. Gradual rollout in production

The existing email formatting functions in `/lib/email.ts` will work without changes.