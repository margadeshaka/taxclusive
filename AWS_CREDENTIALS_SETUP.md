# AWS Credentials Setup Guide

Follow these steps to configure AWS credentials for deployment.

## Step 1: Create AWS Account (if needed)

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Follow the signup process
4. Verify your email and phone number

## Step 2: Create IAM User for Deployment

1. **Login to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com)
   - Navigate to IAM (Identity and Access Management)

2. **Create New User**

   ```
   IAM → Users → Add User
   - User name: taxclusive-deployer
   - Access type: ✓ Programmatic access
   ```

3. **Attach Permissions**
   - Choose "Attach existing policies directly"
   - For quick setup, select: `AdministratorAccess`
   - For production, create a custom policy (see below)

4. **Save Credentials**
   - Download the CSV file with Access Key ID and Secret Access Key
   - Store these securely - you won't see the secret key again!

## Step 3: Create Custom IAM Policy (Recommended)

Instead of using AdministratorAccess, create a least-privilege policy:

1. **Go to IAM → Policies → Create Policy**

2. **Use this JSON policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Permissions",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketPolicy",
        "s3:PutBucketPolicy",
        "s3:DeleteBucketPolicy",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListAllMyBuckets",
        "s3:GetBucketVersioning",
        "s3:PutBucketVersioning"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFrontPermissions",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateDistribution",
        "cloudfront:UpdateDistribution",
        "cloudfront:DeleteDistribution",
        "cloudfront:GetDistribution",
        "cloudfront:ListDistributions",
        "cloudfront:TagResource",
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "LambdaPermissions",
      "Effect": "Allow",
      "Action": [
        "lambda:CreateFunction",
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:DeleteFunction",
        "lambda:GetFunction",
        "lambda:ListFunctions",
        "lambda:InvokeFunction",
        "lambda:AddPermission",
        "lambda:RemovePermission",
        "lambda:TagResource",
        "lambda:CreateFunctionUrlConfig",
        "lambda:UpdateFunctionUrlConfig",
        "lambda:DeleteFunctionUrlConfig",
        "lambda:GetFunctionUrlConfig"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRole",
        "iam:GetRolePolicy",
        "iam:PassRole",
        "iam:ListRolePolicies",
        "iam:TagRole"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFormationPermissions",
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:GetTemplate",
        "cloudformation:ValidateTemplate",
        "cloudformation:CreateChangeSet",
        "cloudformation:ExecuteChangeSet"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Route53Permissions",
      "Effect": "Allow",
      "Action": [
        "route53:CreateHostedZone",
        "route53:GetHostedZone",
        "route53:ListHostedZones",
        "route53:ChangeResourceRecordSets",
        "route53:ListResourceRecordSets"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ACMPermissions",
      "Effect": "Allow",
      "Action": [
        "acm:RequestCertificate",
        "acm:DescribeCertificate",
        "acm:ListCertificates",
        "acm:AddTagsToCertificate"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchPermissions",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricAlarm",
        "cloudwatch:DeleteAlarms",
        "cloudwatch:DescribeAlarms",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:PutDashboard",
        "cloudwatch:DeleteDashboards",
        "cloudwatch:GetDashboard"
      ],
      "Resource": "*"
    },
    {
      "Sid": "LogsPermissions",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:DeleteLogGroup",
        "logs:PutRetentionPolicy",
        "logs:TagLogGroup"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SSMPermissions",
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter",
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:DeleteParameter",
        "ssm:DescribeParameters"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SESPermissions",
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:VerifyEmailIdentity",
        "ses:VerifyDomainIdentity",
        "ses:GetSendQuota",
        "ses:GetSendStatistics"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SNSPermissions",
      "Effect": "Allow",
      "Action": [
        "sns:CreateTopic",
        "sns:DeleteTopic",
        "sns:Subscribe",
        "sns:Unsubscribe",
        "sns:Publish"
      ],
      "Resource": "*"
    }
  ]
}
```

3. **Name the policy**: `TaxclusiveDeploymentPolicy`

4. **Attach to your IAM user**

## Step 4: Configure AWS CLI

1. **Install AWS CLI** (if not already installed):

   ```bash
   # macOS
   brew install awscli

   # or download from
   # https://aws.amazon.com/cli/
   ```

2. **Configure credentials**:

   ```bash
   aws configure

   # Enter when prompted:
   AWS Access Key ID: [Your Access Key]
   AWS Secret Access Key: [Your Secret Key]
   Default region name: us-east-1
   Default output format: json
   ```

3. **Test configuration**:

   ```bash
   aws sts get-caller-identity
   ```

   Should return:

   ```json
   {
     "UserId": "AIDAXXXXXXXXXXXXXXXXX",
     "Account": "123456789012",
     "Arn": "arn:aws:iam::123456789012:user/taxclusive-deployer"
   }
   ```

## Step 5: Set GitHub Secrets

Use the credentials from Step 2 to set GitHub secrets:

```bash
# Using GitHub CLI
gh secret set AWS_ACCESS_KEY_ID --repo margadeshaka/taxexclusive
gh secret set AWS_SECRET_ACCESS_KEY --repo margadeshaka/taxexclusive
gh secret set AWS_REGION --body "us-east-1" --repo margadeshaka/taxexclusive
```

## Step 6: Verify SES Configuration

Since you're using AWS SES for emails:

1. **Verify email addresses** in SES:

   ```bash
   aws ses verify-email-identity --email-address noreply@taxclusive.com
   aws ses verify-email-identity --email-address contact@taxclusive.com
   ```

2. **Request production access** (if needed):
   - By default, SES is in sandbox mode
   - Request production access in AWS Console → SES → Account dashboard

## Security Best Practices

1. **Enable MFA** on your AWS root account
2. **Rotate access keys** every 90 days
3. **Use AWS CloudTrail** to audit API calls
4. **Set up billing alerts** to monitor costs
5. **Never commit credentials** to Git

## Troubleshooting

### Permission Denied Errors

- Ensure IAM user has all required policies attached
- Check if you're in the correct AWS region

### SES Not Sending Emails

- Verify email addresses are confirmed
- Check if account is still in SES sandbox mode
- Review SES sending limits

### Deployment Fails

- Check CloudFormation stack events for errors
- Verify all required secrets are set in GitHub
- Ensure Docker is running for Lambda bundling

## Next Steps

After setting up credentials:

1. Run the deployment setup script:

   ```bash
   ./scripts/aws/setup-aws-deployment.sh staging us-east-1
   ```

2. Push to GitHub to trigger deployment:

   ```bash
   git push origin main
   ```

3. Monitor deployment in GitHub Actions tab

For additional help, refer to AWS_DEPLOYMENT_GUIDE.md
