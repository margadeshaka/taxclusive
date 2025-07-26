# AWS Deployment Quick Start Guide

Follow these steps to deploy your Next.js application to AWS.

## Prerequisites Checklist

- [ ] AWS Account with administrative access
- [ ] Docker Desktop installed and running
- [ ] GitHub repository access (margadeshaka/taxexclusive)
- [ ] Domain name (optional, but recommended)

## Step 1: Configure AWS Credentials

1. **Create IAM User** in AWS Console:
   - Go to IAM → Users → Add User
   - User name: `taxclusive-deployer`
   - Access type: Programmatic access
   - Attach policy: `AdministratorAccess` (or use custom policy from GITHUB_SECRETS_SETUP.md)
   - Save the Access Key ID and Secret Access Key

2. **Configure AWS CLI**:
   ```bash
   aws configure
   # Enter your Access Key ID
   # Enter your Secret Access Key
   # Default region: us-east-1
   # Default output format: json
   ```

## Step 2: Set GitHub Secrets

Using the credentials from Step 1, run:

```bash
# Basic AWS credentials
gh secret set AWS_ACCESS_KEY_ID --repo margadeshaka/taxexclusive
gh secret set AWS_SECRET_ACCESS_KEY --repo margadeshaka/taxexclusive
gh secret set AWS_REGION --body "us-east-1" --repo margadeshaka/taxexclusive

# Application secrets (from .env.local)
gh secret set NEXT_PUBLIC_STRAPI_URL --body "https://beneficial-bell-dbe99c11c9.strapiapp.com" --repo margadeshaka/taxexclusive
gh secret set EMAIL_SENDER_ADDRESS --body "noreply@taxclusive.com" --repo margadeshaka/taxexclusive
gh secret set EMAIL_RECIPIENT_ADDRESS --body "contact@taxclusive.com" --repo margadeshaka/taxexclusive
```

## Step 3: Initial Infrastructure Setup

1. **Start Docker** (required for Lambda bundling):

   ```bash
   open -a Docker
   # Wait for Docker to fully start
   ```

2. **Run setup script**:

   ```bash
   ./scripts/aws/setup-aws-deployment.sh staging us-east-1
   ```

   This will:
   - Create S3 buckets
   - Set up CloudFront distribution
   - Deploy Lambda functions
   - Configure Route53 (if domain provided)
   - Set up monitoring dashboards

## Step 4: Deploy via GitHub Actions

1. **Commit deployment files**:

   ```bash
   git add .
   git commit -m "Add AWS deployment configuration"
   git push origin main
   ```

2. **Monitor deployment**:
   - Go to GitHub → Actions tab
   - Watch the "Deploy to AWS" workflow
   - First deployment takes ~15-20 minutes

## Step 5: Verify Deployment

1. **Check CloudFront URL**:

   ```bash
   aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='Taxclusive staging'].DomainName" --output text
   ```

2. **Test the application**:
   - Visit the CloudFront URL
   - Test form submissions (contact, newsletter)
   - Verify SSR pages load correctly

## Common Commands

### Deploy to staging

```bash
git push origin develop
```

### Deploy to production

```bash
git push origin main
```

### Check deployment status

```bash
aws cloudformation describe-stacks --stack-name taxclusive-staging --query "Stacks[0].StackStatus"
```

### View logs

```bash
aws logs tail /aws/lambda/taxclusive-nextjs-staging --follow
```

### Update environment variables

```bash
./scripts/aws/setup-ssm-parameters.sh staging
```

## Troubleshooting

### Docker not running

```bash
# macOS
open -a Docker

# Linux
sudo systemctl start docker
```

### Deployment fails

1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Ensure AWS credentials have sufficient permissions

### SSL Certificate issues

1. Verify domain ownership in Route53
2. Wait for ACM certificate validation (can take 30 minutes)
3. Check certificate status:
   ```bash
   aws acm list-certificates --region us-east-1
   ```

### Application errors

1. Check Lambda logs in CloudWatch
2. Verify environment variables in SSM Parameter Store
3. Test API endpoints directly

## Next Steps

1. **Set up custom domain** (if not done):

   ```bash
   ./scripts/aws/setup-aws-deployment.sh staging us-east-1 yourdomain.com
   ```

2. **Configure monitoring alerts**:
   - Set up email alerts in CloudWatch
   - Configure budget alerts for cost management

3. **Enable WAF** (optional):
   - Add AWS WAF to CloudFront for additional security

4. **Set up CI/CD environments**:
   - Configure staging branch protections
   - Set up approval workflow for production

## Support

- Check `AWS_DEPLOYMENT_GUIDE.md` for detailed information
- Review GitHub Actions logs for deployment issues
- Monitor CloudWatch dashboards for application health

Remember to always test in staging before deploying to production!
