# TaxExclusive AWS Deployment Guide

## Quick Start

Deploy to AWS with:

```bash
./deploy-aws.sh
```

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+ and pnpm installed
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Architecture

- **S3 Bucket**: Static website hosting
- **CloudFront**: Global CDN distribution
- **Route53**: DNS management (optional)
- **CloudWatch**: Monitoring and logging

## Deployment Options

### Option 1: Local Deployment

```bash
# Deploy infrastructure and application
./deploy-aws.sh
```

### Option 2: GitHub Actions (Automated)

Push to `main` branch to trigger automatic deployment.

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Core
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://www.taxclusive.com
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-instance.com
STRAPI_API_TOKEN=your-strapi-api-token

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Email (AWS SES)
EMAIL_SENDER_NAME=TaxExclusive
EMAIL_SENDER_ADDRESS=noreply@taxclusive.com
EMAIL_RECIPIENT_ADDRESS=info@taxclusive.com

# Security
CSRF_SECRET=your-csrf-secret
```

### GitHub Secrets Required

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `STRAPI_API_URL`
- `STRAPI_API_TOKEN`
- `EMAIL_SENDER_NAME`
- `EMAIL_SENDER_ADDRESS`
- `EMAIL_RECIPIENT_ADDRESS`
- `CSRF_SECRET`

### GitHub Variables Required

- `NEXT_PUBLIC_BASE_URL`
- `S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `DOMAIN_NAME`

## Deployment Steps

### 1. Build Application

```bash
pnpm install
pnpm build
```

### 2. Deploy Infrastructure

```bash
cd infrastructure
cdk deploy --context environment=production
```

### 3. Upload to S3

```bash
aws s3 sync out/ s3://your-bucket-name/ --delete
```

### 4. Invalidate CloudFront

```bash
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## Monitoring

- **CloudFront**: Distribution metrics in AWS Console
- **CloudWatch**: Application and infrastructure logs
- **SES Console**: Email delivery status
- **GitHub Actions**: Deployment pipeline status

## Useful Commands

```bash
# Check CDK stack status
cdk list
cdk diff

# View S3 bucket contents
aws s3 ls s3://your-bucket-name/

# Check CloudFront distribution
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID

# Monitor GitHub Actions
gh run list
gh run view
```

## Infrastructure as Code

The AWS CDK stack includes:

- S3 bucket with versioning and lifecycle rules
- CloudFront distribution with caching optimization
- Origin Access Identity for secure S3 access
- Optional Route53 DNS configuration
- CloudWatch monitoring

## Cost Optimization

- CloudFront PriceClass 100 (US, Canada, Europe)
- S3 lifecycle rules for old versions
- Efficient caching policies
- Static website hosting (serverless)

## Security

- S3 bucket blocked from public access
- CloudFront Origin Access Identity
- HTTPS enforced
- Environment variables secured in GitHub Secrets
