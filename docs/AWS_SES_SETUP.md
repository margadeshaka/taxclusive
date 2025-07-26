# AWS SES Setup Guide for Taxclusive

This guide walks you through setting up AWS Simple Email Service (SES) for the Taxclusive application.

## Prerequisites

- AWS CLI installed and configured with administrative access
- Domain ownership (taxclusive.com)
- DNS management access for your domain
- Node.js and npm/pnpm installed

## Quick Setup

### 1. Run the Setup Script

```bash
# Make the script executable
chmod +x scripts/setup-aws-ses.sh

# Run the setup script
./scripts/setup-aws-ses.sh
```

This script will:

- Create an IAM user with SES permissions
- Set up domain verification in AWS SES
- Generate access keys
- Create a `.env.local` file with configuration
- Display DNS records that need to be added

### 2. Add DNS Records

After running the setup script, you'll need to add the following DNS records to your domain:

#### Domain Verification Record

```
Name: _amazonses.taxclusive.com
Type: TXT
Value: [verification token from script output]
```

#### DKIM Records (add all 3)

```
Name: [token1]._domainkey.taxclusive.com
Type: CNAME
Value: [token1].dkim.amazonses.com

Name: [token2]._domainkey.taxclusive.com
Type: CNAME
Value: [token2].dkim.amazonses.com

Name: [token3]._domainkey.taxclusive.com
Type: CNAME
Value: [token3].dkim.amazonses.com
```

#### SPF Record (if not already exists)

```
Name: taxclusive.com
Type: TXT
Value: "v=spf1 include:amazonses.com ~all"
```

#### DMARC Record (recommended)

```
Name: _dmarc.taxclusive.com
Type: TXT
Value: "v=DMARC1; p=quarantine; rua=mailto:admin@taxclusive.com"
```

### 3. Wait for DNS Propagation

DNS changes can take up to 48 hours to propagate. You can check the status using:

```bash
# Check SES configuration status
./scripts/check-ses-status.sh
```

### 4. Test Email Functionality

Once your domain is verified, test the email functionality:

```bash
# Test AWS SES configuration
node scripts/test-aws-ses.js

# Or test the application email endpoints
pnpm dev
# Then submit a contact form on the website
```

## Manual Setup (Alternative)

If you prefer to set up AWS SES manually:

### 1. Create IAM User

```bash
# Create IAM user
aws iam create-user --user-name taxclusive-ses-user

# Create policy
aws iam create-policy --policy-name TaxclusiveSESPolicy --policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:GetSendQuota",
        "ses:GetSendStatistics"
      ],
      "Resource": "*"
    }
  ]
}'

# Attach policy to user
aws iam attach-user-policy --user-name taxclusive-ses-user --policy-arn arn:aws:iam::YOUR-ACCOUNT-ID:policy/TaxclusiveSESPolicy

# Create access key
aws iam create-access-key --user-name taxclusive-ses-user
```

### 2. Verify Domain

```bash
# Verify domain in SES
aws ses verify-domain-identity --domain taxclusive.com --region us-east-1

# Get DKIM tokens
aws ses get-identity-dkim-attributes --identities taxclusive.com --region us-east-1
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
# AWS SES Configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"

# Email Configuration
EMAIL_SENDER_NAME="Taxclusive"
EMAIL_SENDER_ADDRESS="noreply@taxclusive.com"
EMAIL_RECIPIENT_ADDRESS="contact@taxclusive.com"
EMAIL_RECIPIENT_NAME="Taxclusive Support"
```

## Environment Variables Reference

| Variable                  | Description                | Required | Example                                    |
| ------------------------- | -------------------------- | -------- | ------------------------------------------ |
| `AWS_REGION`              | AWS region for SES         | Yes      | `us-east-1`                                |
| `AWS_ACCESS_KEY_ID`       | IAM user access key ID     | Yes      | `AKIAIOSFODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY`   | IAM user secret access key | Yes      | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `EMAIL_SENDER_NAME`       | Display name for sender    | No       | `Taxclusive`                               |
| `EMAIL_SENDER_ADDRESS`    | Verified sender email      | Yes      | `noreply@taxclusive.com`                   |
| `EMAIL_RECIPIENT_ADDRESS` | Where form emails are sent | Yes      | `contact@taxclusive.com`                   |
| `EMAIL_RECIPIENT_NAME`    | Display name for recipient | No       | `Taxclusive Support`                       |

## Troubleshooting

### Domain Not Verified

**Problem:** Domain verification is pending or failed.

**Solutions:**

1. Check that DNS records are correctly added
2. Wait for DNS propagation (up to 48 hours)
3. Use online DNS checkers to verify records
4. Check for typos in DNS record values

### Email Not Sending

**Problem:** Emails are not being sent or received.

**Solutions:**

1. Verify sender domain/email address
2. Check if account is in sandbox mode
3. Ensure recipient email is verified (sandbox mode only)
4. Check AWS CloudWatch logs for errors
5. Verify IAM permissions

### Sandbox Mode Limitations

**Problem:** Can only send emails to verified addresses.

**Solutions:**

1. Request production access through AWS Console
2. Go to SES → Account dashboard → Request production access
3. Provide use case and expected sending volume
4. Wait for AWS approval (usually 24-48 hours)

### High Bounce/Complaint Rates

**Problem:** AWS SES has suspended sending due to high bounce/complaint rates.

**Solutions:**

1. Monitor bounce and complaint rates in SES console
2. Implement proper bounce/complaint handling
3. Maintain clean email lists
4. Use double opt-in for subscriptions

## Monitoring and Maintenance

### Regular Checks

1. **Monitor sending statistics:**

   ```bash
   aws ses get-send-statistics --region us-east-1
   ```

2. **Check reputation metrics:**
   - Bounce rate should be < 5%
   - Complaint rate should be < 0.1%

3. **Review CloudWatch logs:**
   - Check for delivery failures
   - Monitor API errors

### Security Best Practices

1. **Rotate access keys regularly**
2. **Use least privilege IAM policies**
3. **Enable CloudTrail for audit logging**
4. **Monitor for unusual sending patterns**
5. **Implement proper error handling in application**

## Cost Considerations

- **Free tier:** 62,000 emails per month when sent from EC2
- **Standard pricing:** $0.10 per 1,000 emails
- **Data transfer:** Additional charges may apply
- **Dedicated IP:** $24.95/month (optional)

Monitor usage in AWS Billing dashboard to avoid unexpected charges.

## Support and Resources

- **AWS SES Documentation:** https://docs.aws.amazon.com/ses/
- **AWS SES Console:** https://console.aws.amazon.com/sesv2/
- **AWS Support:** https://aws.amazon.com/support/
- **Taxclusive Scripts:**
  - Setup: `./scripts/setup-aws-ses.sh`
  - Status Check: `./scripts/check-ses-status.sh`
  - Testing: `node scripts/test-aws-ses.js`
