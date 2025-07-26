# GitHub Secrets Setup for AWS Deployment

This guide walks you through setting up GitHub repository secrets for automated AWS deployments.

## Required GitHub Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions, then add these secrets:

### 1. AWS Credentials

- **`AWS_ACCESS_KEY_ID`**: Your AWS IAM access key
- **`AWS_SECRET_ACCESS_KEY`**: Your AWS IAM secret key
- **`AWS_REGION`**: `us-east-1` (or your preferred region)

### 2. Environment Variables (from .env.local)

- **`NEXT_PUBLIC_STRAPI_URL`**: `https://beneficial-bell-dbe99c11c9.strapiapp.com`
- **`NEXT_PUBLIC_BASE_URL`**: `https://yourdomain.com` (update with actual domain)
- **`EMAIL_SENDER_NAME`**: `Taxclusive`
- **`EMAIL_SENDER_ADDRESS`**: `noreply@taxclusive.com`
- **`EMAIL_RECIPIENT_ADDRESS`**: `contact@taxclusive.com`
- **`EMAIL_RECIPIENT_NAME`**: `Taxclusive Support`

### 3. Deployment Configuration

- **`STAGING_DOMAIN`**: `staging.taxclusive.com` (your staging domain)
- **`PRODUCTION_DOMAIN`**: `taxclusive.com` (your production domain)
- **`CERTIFICATE_ARN`**: AWS ACM certificate ARN (will be created during setup)

## Setting Secrets via GitHub CLI

If you have GitHub CLI installed, you can set secrets using these commands:

```bash
# Set AWS credentials
gh secret set AWS_ACCESS_KEY_ID --body "YOUR_ACCESS_KEY_ID"
gh secret set AWS_SECRET_ACCESS_KEY --body "YOUR_SECRET_ACCESS_KEY"
gh secret set AWS_REGION --body "us-east-1"

# Set environment variables
gh secret set NEXT_PUBLIC_STRAPI_URL --body "https://beneficial-bell-dbe99c11c9.strapiapp.com"
gh secret set NEXT_PUBLIC_BASE_URL --body "https://taxclusive.com"
gh secret set EMAIL_SENDER_NAME --body "Taxclusive"
gh secret set EMAIL_SENDER_ADDRESS --body "noreply@taxclusive.com"
gh secret set EMAIL_RECIPIENT_ADDRESS --body "contact@taxclusive.com"
gh secret set EMAIL_RECIPIENT_NAME --body "Taxclusive Support"

# Set deployment configuration
gh secret set STAGING_DOMAIN --body "staging.taxclusive.com"
gh secret set PRODUCTION_DOMAIN --body "taxclusive.com"
```

## Environment-Specific Secrets

For different environments, prefix secrets with the environment name:

### Staging

- `STAGING_AWS_ACCESS_KEY_ID`
- `STAGING_AWS_SECRET_ACCESS_KEY`
- `STAGING_NEXT_PUBLIC_BASE_URL`

### Production

- `PRODUCTION_AWS_ACCESS_KEY_ID`
- `PRODUCTION_AWS_SECRET_ACCESS_KEY`
- `PRODUCTION_NEXT_PUBLIC_BASE_URL`

## Verifying Secrets

After setting up secrets, verify they're configured correctly:

1. Go to Actions tab in your repository
2. Run the "Test Deployment" workflow manually
3. Check the logs for successful secret access

## Security Best Practices

1. **Rotate credentials regularly** - Update AWS access keys every 90 days
2. **Use least privilege** - Create IAM users with minimal required permissions
3. **Enable MFA** - Use multi-factor authentication for AWS accounts
4. **Audit access** - Review CloudTrail logs for secret usage
5. **Never commit secrets** - Always use GitHub Secrets, never hardcode

## Required AWS IAM Permissions

Create an IAM user with these permissions for deployment:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "cloudfront:*",
        "lambda:*",
        "iam:*",
        "cloudformation:*",
        "route53:*",
        "acm:*",
        "cloudwatch:*",
        "logs:*",
        "ssm:*",
        "ses:*"
      ],
      "Resource": "*"
    }
  ]
}
```

## Troubleshooting

### Secret not found error

- Ensure secret names match exactly (case-sensitive)
- Check if secrets are set at repository level, not organization level

### Permission denied

- Verify IAM user has required permissions
- Check AWS credentials are active and not expired

### Deployment fails

- Review GitHub Actions logs for specific errors
- Ensure all required secrets are set
- Verify domain ownership in Route53

## Next Steps

After setting up secrets:

1. Run `./scripts/aws/setup-aws-deployment.sh staging` locally first
2. Push to `develop` branch to trigger staging deployment
3. Verify staging deployment works correctly
4. Push to `main` branch for production deployment

For questions or issues, check the AWS_DEPLOYMENT_GUIDE.md or GitHub Actions logs.
