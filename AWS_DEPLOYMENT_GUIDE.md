# AWS Deployment Guide for Taxclusive Next.js Application

This comprehensive guide will help you deploy the Taxclusive Next.js 15 application to AWS with SSR capabilities, monitoring, and CI/CD pipeline.

## Architecture Overview

The deployment uses the following AWS services:
- **AWS Lambda** - Next.js SSR runtime
- **CloudFront** - Global CDN with caching
- **S3** - Static assets and deployment artifacts
- **Route53** - DNS management
- **Certificate Manager** - SSL certificates
- **Systems Manager (SSM)** - Configuration management
- **CloudWatch** - Monitoring and logging
- **SES** - Email service for contact forms

## Prerequisites

### 1. Development Environment
```bash
# Node.js 18+
node --version  # Should be 18.x or higher

# pnpm package manager
npm install -g pnpm

# AWS CLI v2
aws --version  # Should be 2.x

# AWS CDK
npm install -g aws-cdk@latest
```

### 2. AWS Account Setup
- AWS Account with billing enabled
- IAM user with appropriate permissions
- Domain name (optional but recommended)
- Email addresses verified in SES

### 3. Required Permissions
Your AWS user/role needs these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "lambda:*",
        "cloudfront:*",
        "s3:*",
        "route53:*",
        "certificatemanager:*",
        "ssm:*",
        "ses:*",
        "cloudwatch:*",
        "logs:*",
        "iam:*"
      ],
      "Resource": "*"
    }
  ]
}
```

## Quick Start Deployment

### 1. Clone and Setup Repository
```bash
git clone https://github.com/your-repo/taxexclusive.git
cd taxexclusive
pnpm install
```

### 2. Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter output format (json)
```

### 3. Run Automated Setup
```bash
# Make setup script executable
chmod +x scripts/aws/setup-aws-deployment.sh

# Deploy to staging
./scripts/aws/setup-aws-deployment.sh staging us-east-1 yourdomain.com

# Deploy to production (after staging is working)
./scripts/aws/setup-aws-deployment.sh production us-east-1 yourdomain.com
```

### 4. Configure GitHub Secrets
After running the setup script, configure these secrets in GitHub:

**Repository Secrets** (Settings → Secrets and Variables → Actions):
```
AWS_ACCOUNT_ID=your-aws-account-id
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

**Environment Secrets** (Settings → Environments → staging/production):
```
SSL_CERTIFICATE_ARN=your-certificate-arn
EMAIL_SENDER_ADDRESS=noreply@yourdomain.com
EMAIL_RECIPIENT_ADDRESS=contact@yourdomain.com
STRAPI_API_URL=https://your-cms.com/api
STRAPI_API_TOKEN=your-strapi-token
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
CSRF_SECRET=your-random-secret
```

### 5. Deploy via GitHub Actions
```bash
# Push to trigger deployment
git add .
git commit -m "Initial AWS deployment setup"
git push origin main  # Triggers production deployment
git push origin develop  # Triggers staging deployment
```

## Manual Step-by-Step Deployment

If you prefer manual control over the deployment process:

### Step 1: AWS Infrastructure Setup

#### 1.1 Create S3 Buckets
```bash
# Deployment artifacts bucket
aws s3 mb s3://taxclusive-deployments-staging-$(aws sts get-caller-identity --query Account --output text)
aws s3 mb s3://taxclusive-deployments-production-$(aws sts get-caller-identity --query Account --output text)

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket taxclusive-deployments-staging-$(aws sts get-caller-identity --query Account --output text) \
  --versioning-configuration Status=Enabled
```

#### 1.2 Set Up SSL Certificate
```bash
# Request certificate (must be in us-east-1 for CloudFront)
aws acm request-certificate \
  --domain-name "*.yourdomain.com" \
  --validation-method DNS \
  --region us-east-1

# Get certificate ARN
aws acm list-certificates --region us-east-1
```

#### 1.3 Configure Route53 (if using custom domain)
```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name yourdomain.com \
  --caller-reference $(date +%s)
```

### Step 2: Configure SSM Parameters
```bash
# Run parameter setup
chmod +x scripts/aws/setup-ssm-parameters.sh
./scripts/aws/setup-ssm-parameters.sh staging
./scripts/aws/setup-ssm-parameters.sh production
```

### Step 3: Deploy Infrastructure with CDK
```bash
cd infrastructure

# Install dependencies
npm install

# Bootstrap CDK (only needed once per account/region)
cdk bootstrap

# Deploy staging infrastructure
cdk deploy --all --context environment=staging \
  --context domainName=staging.yourdomain.com \
  --context certificateArn=your-certificate-arn

# Deploy production infrastructure
cdk deploy --all --context environment=production \
  --context domainName=yourdomain.com \
  --context certificateArn=your-certificate-arn
```

### Step 4: Build and Deploy Application
```bash
# Build the application
pnpm build

# Upload to S3
aws s3 sync .next/ s3://your-assets-bucket/current/.next/ --delete
aws s3 sync public/ s3://your-assets-bucket/current/public/ --delete

# Update Lambda function (if needed)
# This is handled by the CDK deployment
```

### Step 5: Configure DNS (for custom domain)
```bash
# Get CloudFront distribution domain
CLOUDFRONT_DOMAIN=$(aws ssm get-parameter \
  --name "/taxclusive/production/cloudfront/domain-name" \
  --query "Parameter.Value" --output text)

# The CDK stack automatically creates Route53 records
# If manual setup is needed:
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR-ZONE-ID \
  --change-batch file://dns-change-batch.json
```

## CI/CD Pipeline Configuration

### GitHub Actions Workflow
The workflow file `.github/workflows/aws-deploy.yml` includes:

1. **Test Stage**: Runs linting, unit tests, and E2E tests
2. **Build Stage**: Creates optimized production build
3. **Deploy Stage**: Deploys to AWS infrastructure
4. **Post-Deploy Stage**: Runs smoke tests and updates monitoring

### Environment-Specific Deployments
- **Staging**: Triggered by pushes to `develop` branch
- **Production**: Triggered by pushes to `main` branch
- **Manual**: Can be triggered via GitHub Actions UI

### Rollback Strategy
The pipeline includes automatic rollback on deployment failure:
```bash
# Manual rollback if needed
aws s3 sync s3://your-bucket/releases/previous-build-id/ s3://your-bucket/current/ --delete
aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"
```

## Monitoring and Observability

### CloudWatch Dashboard
Access your monitoring dashboard:
```
https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=Taxclusive-production
```

### Key Metrics Monitored
- **Lambda Performance**: Duration, errors, concurrent executions
- **CloudFront**: Request count, cache hit ratio, error rates
- **Application**: Custom SSR performance metrics
- **Cost**: Estimated monthly charges (production only)

### Alerts Configuration
Alerts are sent to SNS topic for:
- High error rates (>5 errors in 5 minutes)
- High response times (>10 seconds average)
- High traffic spikes (>10k requests in 5 minutes)
- Cost thresholds (>$100/month in production)

### Log Analysis
```bash
# View Lambda logs
aws logs tail /aws/lambda/your-function-name --follow

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/your-function-name \
  --filter-pattern "ERROR"
```

## Performance Optimization

### Caching Strategy
- **Static Assets**: Cached for 1 year via CloudFront
- **API Responses**: Cached for 5 minutes with proper headers
- **HTML Pages**: Cached for 5 minutes with stale-while-revalidate

### Lambda Optimization
- **Memory**: 1024MB for optimal price/performance
- **Timeout**: 30 seconds for SSR pages
- **Concurrent Executions**: Limited based on environment
- **Cold Start Mitigation**: Provisioned concurrency for production

### CloudFront Configuration
- **Price Class**: 100 (US, Canada, Europe) for cost optimization
- **HTTP Version**: HTTP/2 and HTTP/3 enabled
- **Compression**: Gzip and Brotli enabled
- **Security**: Modern TLS 1.2+ only

## Security Best Practices

### IAM Permissions
- Least privilege access for all roles
- Separate roles for different environments
- Regular access key rotation

### Data Protection
- All SSM parameters encrypted with KMS
- HTTPS enforced everywhere
- Security headers via Lambda@Edge

### Monitoring Security
- CloudTrail enabled for API auditing
- Config rules for compliance monitoring
- AWS Security Hub for security findings

## Cost Optimization

### Expected Monthly Costs (Production)
```
CloudFront: $5-15 (based on traffic)
Lambda: $10-30 (based on requests)
S3: $1-5 (storage and requests)
Route53: $0.50 (hosted zone)
Certificate Manager: Free
SSM Parameters: Free (under 10k requests)
CloudWatch: $5-15 (logs and metrics)

Total: ~$25-70/month for typical traffic
```

### Cost Reduction Strategies
1. **CloudFront Caching**: Reduce origin requests
2. **Lambda Optimization**: Right-size memory allocation
3. **S3 Lifecycle**: Move old deployments to cheaper storage
4. **Log Retention**: Shorter retention for non-production
5. **Reserved Capacity**: Consider for consistent workloads

## Troubleshooting

### Common Issues

#### 1. Lambda Function Timeout
```bash
# Check function configuration
aws lambda get-function-configuration --function-name your-function

# Increase timeout if needed
aws lambda update-function-configuration \
  --function-name your-function \
  --timeout 30
```

#### 2. CloudFront Cache Issues
```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR-DIST-ID \
  --paths "/*"

# Check cache behaviors
aws cloudfront get-distribution-config --id YOUR-DIST-ID
```

#### 3. SSL Certificate Problems
```bash
# Check certificate status
aws acm describe-certificate --certificate-arn YOUR-CERT-ARN --region us-east-1

# List all certificates
aws acm list-certificates --region us-east-1
```

#### 4. Email Sending Issues
```bash
# Check SES quota
aws ses get-send-quota

# Verify email address
aws ses verify-email-identity --email-address your-email@domain.com

# Check sandbox status
aws ses get-send-statistics
```

### Debugging Steps
1. **Check CloudWatch Logs**: Start with Lambda function logs
2. **Verify Parameters**: Ensure all SSM parameters are set
3. **Test Locally**: Use `sam local` for Lambda testing
4. **Check Permissions**: Verify IAM roles and policies
5. **Network Issues**: Check VPC configuration if used

### Health Checks
```bash
# Run deployment tests
chmod +x scripts/aws/test-deployment.sh
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
- **Code**: GitHub repository with branch protection
- **Configuration**: SSM parameters backed up via CLI
- **Data**: S3 versioning for deployment artifacts
- **Infrastructure**: CDK code is infrastructure as code

### Updates and Patches
```bash
# Update CDK
npm update -g aws-cdk

# Update dependencies
cd infrastructure && npm update

# Update Lambda runtime (via CDK)
# Modify runtime version in CDK code and redeploy
```

## Support and Resources

### Documentation Links
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [CloudFront Performance](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ConfiguringCaching.html)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Monitoring Resources
- CloudWatch Dashboard: Monitor real-time metrics
- AWS Cost Explorer: Track and optimize costs
- AWS Health Dashboard: Monitor service status

### Getting Help
1. **Check AWS Documentation**: Start with official docs
2. **Review CloudWatch Logs**: Most issues show up in logs
3. **AWS Support**: Use support cases for complex issues
4. **Community**: Stack Overflow and AWS forums

## Conclusion

This deployment setup provides:
- ✅ Scalable serverless architecture
- ✅ Global CDN with optimal caching
- ✅ Comprehensive monitoring and alerting
- ✅ Automated CI/CD pipeline
- ✅ Cost-optimized configuration
- ✅ Security best practices
- ✅ Easy rollback capabilities

The infrastructure is designed to handle traffic spikes automatically while maintaining cost efficiency during low-traffic periods. The monitoring setup ensures you'll be alerted to any issues before they impact users.

For questions or issues, refer to the troubleshooting section or check the CloudWatch logs for detailed error information.