# AWS Secrets and Environment Variables Setup

This document outlines how to configure secrets and environment variables for the Taxclusive Next.js application deployment on AWS.

## Overview

The application uses a multi-layered approach for configuration management:

1. **GitHub Secrets** - For CI/CD pipeline sensitive data
2. **AWS Systems Manager (SSM) Parameter Store** - For runtime application configuration
3. **Environment Variables** - For non-sensitive configuration

## GitHub Secrets Configuration

### Required Repository Secrets

Configure these secrets in GitHub Settings → Secrets and Variables → Actions:

```bash
# AWS Configuration
AWS_ACCOUNT_ID=123456789012
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# General Configuration
SSL_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/...
```

### Environment-Specific Secrets

#### Staging Environment

Configure in GitHub Settings → Environments → staging:

```bash
# Email Configuration
EMAIL_SENDER_NAME="Taxclusive Staging"
EMAIL_SENDER_ADDRESS="noreply-staging@taxclusive.com"
EMAIL_RECIPIENT_ADDRESS="dev@taxclusive.com"
EMAIL_RECIPIENT_NAME="Taxclusive Dev Team"

# CMS Configuration
STRAPI_API_URL="https://staging-cms.taxclusive.com/api"
STRAPI_API_TOKEN="your-staging-strapi-token"

# Analytics
GOOGLE_ANALYTICS_ID="G-STAGING123"

# Security
CSRF_SECRET="staging-csrf-secret-random-string"
```

#### Production Environment

Configure in GitHub Settings → Environments → production:

```bash
# Email Configuration
EMAIL_SENDER_NAME="Taxclusive"
EMAIL_SENDER_ADDRESS="noreply@taxclusive.com"
EMAIL_RECIPIENT_ADDRESS="contact@taxclusive.com"
EMAIL_RECIPIENT_NAME="Taxclusive Support"

# CMS Configuration
STRAPI_API_URL="https://cms.taxclusive.com/api"
STRAPI_API_TOKEN="your-production-strapi-token"

# Analytics
GOOGLE_ANALYTICS_ID="G-PRODUCTION123"

# Security
CSRF_SECRET="production-csrf-secret-strong-random-string"
```

## AWS SSM Parameter Store Setup

The application reads runtime configuration from AWS Systems Manager Parameter Store. Use the following AWS CLI commands to set up parameters:

### Staging Environment Parameters

```bash
# AWS Region
aws ssm put-parameter \
  --name "/taxclusive/staging/aws/region" \
  --value "us-east-1" \
  --type "String" \
  --description "AWS region for staging environment"

# Email Configuration
aws ssm put-parameter \
  --name "/taxclusive/staging/ses/from-email" \
  --value "noreply-staging@taxclusive.com" \
  --type "String" \
  --description "SES from email for staging"

aws ssm put-parameter \
  --name "/taxclusive/staging/ses/to-email" \
  --value "dev@taxclusive.com" \
  --type "String" \
  --description "SES to email for staging"

# CMS Configuration
aws ssm put-parameter \
  --name "/taxclusive/staging/strapi/url" \
  --value "https://staging-cms.taxclusive.com/api" \
  --type "String" \
  --description "Strapi CMS URL for staging"

aws ssm put-parameter \
  --name "/taxclusive/staging/strapi/token" \
  --value "your-staging-strapi-token" \
  --type "SecureString" \
  --description "Strapi API token for staging"

# Security Configuration
aws ssm put-parameter \
  --name "/taxclusive/staging/csrf/secret" \
  --value "staging-csrf-secret-random-string" \
  --type "SecureString" \
  --description "CSRF secret for staging"

# Application Configuration
aws ssm put-parameter \
  --name "/taxclusive/staging/app/base-url" \
  --value "https://staging.taxclusive.com" \
  --type "String" \
  --description "Base URL for staging environment"

# Rate Limiting
aws ssm put-parameter \
  --name "/taxclusive/staging/rate-limit/max-requests" \
  --value "100" \
  --type "String" \
  --description "Maximum requests per window for staging"

aws ssm put-parameter \
  --name "/taxclusive/staging/rate-limit/window-ms" \
  --value "900000" \
  --type "String" \
  --description "Rate limit window in milliseconds for staging"
```

### Production Environment Parameters

```bash
# AWS Region
aws ssm put-parameter \
  --name "/taxclusive/production/aws/region" \
  --value "us-east-1" \
  --type "String" \
  --description "AWS region for production environment"

# Email Configuration
aws ssm put-parameter \
  --name "/taxclusive/production/ses/from-email" \
  --value "noreply@taxclusive.com" \
  --type "String" \
  --description "SES from email for production"

aws ssm put-parameter \
  --name "/taxclusive/production/ses/to-email" \
  --value "contact@taxclusive.com" \
  --type "String" \
  --description "SES to email for production"

# CMS Configuration
aws ssm put-parameter \
  --name "/taxclusive/production/strapi/url" \
  --value "https://cms.taxclusive.com/api" \
  --type "String" \
  --description "Strapi CMS URL for production"

aws ssm put-parameter \
  --name "/taxclusive/production/strapi/token" \
  --value "your-production-strapi-token" \
  --type "SecureString" \
  --description "Strapi API token for production"

# Security Configuration
aws ssm put-parameter \
  --name "/taxclusive/production/csrf/secret" \
  --value "production-csrf-secret-strong-random-string" \
  --type "SecureString" \
  --description "CSRF secret for production"

# Application Configuration
aws ssm put-parameter \
  --name "/taxclusive/production/app/base-url" \
  --value "https://www.taxclusive.com" \
  --type "String" \
  --description "Base URL for production environment"

# Rate Limiting
aws ssm put-parameter \
  --name "/taxclusive/production/rate-limit/max-requests" \
  --value "200" \
  --type "String" \
  --description "Maximum requests per window for production"

aws ssm put-parameter \
  --name "/taxclusive/production/rate-limit/window-ms" \
  --value "900000" \
  --type "String" \
  --description "Rate limit window in milliseconds for production"
```

## AWS SES Configuration

### 1. Verify Email Addresses/Domains

```bash
# Verify sender email domain
aws ses verify-domain-identity --domain taxclusive.com

# Verify individual email addresses (for testing)
aws ses verify-email-identity --email-address noreply@taxclusive.com
aws ses verify-email-identity --email-address contact@taxclusive.com
```

### 2. Set Up DKIM and Domain Authentication

After domain verification, add the required DNS records:

```dns
# DKIM Records (AWS will provide these)
_amazonses.taxclusive.com. TXT "verification-token-from-aws"

# SPF Record
taxclusive.com. TXT "v=spf1 include:amazonses.com ~all"

# DMARC Record
_dmarc.taxclusive.com. TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@taxclusive.com"
```

### 3. Move Out of SES Sandbox (Production)

For production, request to move out of SES sandbox:

```bash
# Create support case via AWS CLI or console
aws support create-case \
  --subject "Request to move out of Amazon SES sandbox" \
  --service-code "amazon-ses" \
  --category-code "other" \
  --communication-body "Please move our account out of the SES sandbox for production email sending."
```

## IAM Permissions

### Lambda Execution Role Permissions

The CDK stack automatically creates the necessary IAM roles, but ensure these permissions are included:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ses:SendEmail", "ses:SendRawEmail", "ses:GetSendQuota", "ses:GetSendStatistics"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["ssm:GetParameter", "ssm:GetParameters", "ssm:GetParametersByPath"],
      "Resource": ["arn:aws:ssm:*:*:parameter/taxclusive/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::taxclusive-assets-*", "arn:aws:s3:::taxclusive-assets-*/*"]
    }
  ]
}
```

## Security Best Practices

1. **Rotate Secrets Regularly**: Set up automatic rotation for sensitive parameters
2. **Use SecureString**: Always use SecureString type for sensitive SSM parameters
3. **Least Privilege**: Grant minimum required permissions to IAM roles
4. **Environment Isolation**: Keep staging and production parameters completely separate
5. **Audit Access**: Enable CloudTrail to audit parameter access

## Automated Setup Script

For convenience, you can use the deployment scripts:

```bash
# Make scripts executable
chmod +x scripts/setup-aws-secrets.sh

# Run setup for staging
./scripts/setup-aws-secrets.sh staging

# Run setup for production
./scripts/setup-aws-secrets.sh production
```

## Verification

After setup, verify the configuration:

```bash
# Test parameter retrieval
aws ssm get-parameters-by-path \
  --path "/taxclusive/staging/" \
  --recursive \
  --with-decryption

# Test SES configuration
aws ses get-send-quota
aws ses get-send-statistics

# Test email sending
node scripts/test-aws-ses.js
```

## Troubleshooting

### Common Issues

1. **SES Sandbox**: Emails only work with verified addresses in sandbox mode
2. **Parameter Not Found**: Ensure parameter names match exactly
3. **IAM Permissions**: Check Lambda execution role has required permissions
4. **Regional Settings**: Ensure SES is configured in the same region as Lambda

### Monitoring

Monitor configuration usage through:

- CloudWatch Logs for Lambda function
- CloudWatch Metrics for SES usage
- AWS Config for parameter changes
- CloudTrail for access auditing

## Cost Optimization

1. **Parameter Store**: Free tier includes 10,000 parameter requests per month
2. **SES Pricing**: $0.10 per 1,000 emails sent
3. **Lambda**: Free tier includes 1M requests per month
4. **CloudFront**: Free tier includes 50GB data transfer

Monitor costs through AWS Cost Explorer and set up billing alerts.
