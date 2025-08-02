# AWS Deployment Guide for TaxExclusive

This comprehensive guide covers deploying the TaxExclusive Next.js 15 application to AWS.

## Architecture Overview

The deployment uses:
- **AWS Lambda** - Next.js SSR runtime
- **CloudFront** - Global CDN with caching
- **S3** - Static assets and deployment artifacts
- **Route53** - DNS management (optional)
- **Certificate Manager** - SSL certificates
- **Systems Manager (SSM)** - Configuration management
- **CloudWatch** - Monitoring and logging
- **SES** - Email service for contact forms

## Quick Start

### Prerequisites

1. **Development Environment**:
   ```bash
   node --version  # Should be 18.x or higher
   npm install -g pnpm
   aws --version  # Should be 2.x
   npm install -g aws-cdk@latest
   ```

2. **AWS Account Setup**:
   - AWS Account with billing enabled
   - IAM user with administrative permissions
   - Docker Desktop installed and running (for Lambda bundling)

### Step 1: Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output format: json
```

### Step 2: Set GitHub Secrets

Configure in GitHub Settings → Secrets and Variables → Actions:

```bash
# Using GitHub CLI
gh secret set AWS_ACCESS_KEY_ID --repo margadeshaka/taxexclusive
gh secret set AWS_SECRET_ACCESS_KEY --repo margadeshaka/taxexclusive
gh secret set AWS_REGION --body "us-east-1" --repo margadeshaka/taxexclusive
```

### Step 3: Deploy Infrastructure

```bash
# Run setup script
./scripts/aws/setup-aws-deployment.sh staging us-east-1 yourdomain.com

# For production
./scripts/aws/setup-aws-deployment.sh production us-east-1 yourdomain.com
```

### Step 4: Deploy via GitHub Actions

```bash
git push origin develop  # Deploys to staging
git push origin main     # Deploys to production
```

## Environment Configuration

### Required Environment Variables

Configure these in GitHub Secrets:

**Repository Secrets**:
- `AWS_ACCOUNT_ID`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

**Environment Secrets** (per environment):
- `SSL_CERTIFICATE_ARN`
- `EMAIL_SENDER_ADDRESS`
- `EMAIL_RECIPIENT_ADDRESS`
- `STRAPI_API_URL`
- `STRAPI_API_TOKEN`
- `GOOGLE_ANALYTICS_ID`
- `CSRF_SECRET`

### AWS SSM Parameters

The application reads runtime configuration from SSM Parameter Store:

```bash
# Email Configuration
/taxclusive/{environment}/ses/from-email
/taxclusive/{environment}/ses/to-email

# CMS Configuration
/taxclusive/{environment}/strapi/url
/taxclusive/{environment}/strapi/token

# Security
/taxclusive/{environment}/csrf/secret

# Application
/taxclusive/{environment}/app/base-url
```

## AWS SES Setup

1. **Verify Domain**:
   ```bash
   aws ses verify-domain-identity --domain taxclusive.com
   ```

2. **Add DNS Records**:
   - DKIM records (provided by AWS)
   - SPF: `"v=spf1 include:amazonses.com ~all"`
   - DMARC: `"v=DMARC1; p=quarantine; rua=mailto:dmarc@taxclusive.com"`

3. **Move Out of Sandbox** (for production):
   Create AWS support case to enable production email sending

## Monitoring

### CloudWatch Dashboard

Access monitoring at:
```
https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=Taxclusive-production
```

### Key Metrics
- Lambda performance (duration, errors, concurrent executions)
- CloudFront metrics (request count, cache hit ratio, error rates)
- SES email delivery statistics
- Cost tracking (production only)

### Alerts
Configured for:
- High error rates (>5 errors in 5 minutes)
- High response times (>10 seconds average)
- Traffic spikes (>10k requests in 5 minutes)
- Cost thresholds (>$100/month in production)

## Cost Optimization

### Expected Monthly Costs
- CloudFront: $5-15 (based on traffic)
- Lambda: $10-30 (based on requests)
- S3: $1-5 (storage and requests)
- Route53: $0.50 (hosted zone)
- Certificate Manager: Free
- SSM Parameters: Free (under 10k requests)
- CloudWatch: $5-15 (logs and metrics)

**Total: ~$25-70/month for typical traffic**

### Cost Reduction Strategies
1. Optimize CloudFront caching
2. Right-size Lambda memory allocation
3. S3 lifecycle policies for old deployments
4. Shorter log retention for non-production

## Troubleshooting

### Common Issues

1. **Lambda Timeout**:
   ```bash
   aws lambda update-function-configuration \
     --function-name your-function \
     --timeout 30
   ```

2. **CloudFront Cache Issues**:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR-DIST-ID \
     --paths "/*"
   ```

3. **SSL Certificate Problems**:
   ```bash
   aws acm describe-certificate \
     --certificate-arn YOUR-CERT-ARN \
     --region us-east-1
   ```

4. **Email Sending Issues**:
   ```bash
   aws ses get-send-quota
   aws ses verify-email-identity --email-address your-email@domain.com
   ```

### Health Checks

```bash
# Run deployment tests
./scripts/aws/test-deployment.sh production

# Manual health check
curl -I https://yourdomain.com/api/health
```

## Maintenance

### Regular Tasks
- **Weekly**: Review CloudWatch metrics and costs
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and rotate access keys
- **Annually**: Review architecture and cost optimization

### Backup Strategy
- Code: GitHub repository with branch protection
- Configuration: SSM parameters backed up via CLI
- Data: S3 versioning for deployment artifacts
- Infrastructure: CDK code is infrastructure as code

## Support Resources

- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [CloudFront Performance](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ConfiguringCaching.html)
- [Next.js Deployment](https://nextjs.org/docs/deployment)