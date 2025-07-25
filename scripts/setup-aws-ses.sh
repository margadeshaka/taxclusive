#!/bin/bash

# Taxclusive AWS SES Setup Script
# This script sets up AWS SES for the Taxclusive application
# Prerequisites: AWS CLI installed and configured with admin access

set -e

# Configuration
DOMAIN="taxclusive.com"
USER_NAME="taxclusive-ses-user"
POLICY_NAME="TaxclusiveSESPolicy"
AWS_REGION="us-east-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Taxclusive AWS SES Setup Script ===${NC}"
echo ""

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}AWS Account ID: $ACCOUNT_ID${NC}"
echo ""

# Step 1: Create IAM User
echo -e "${YELLOW}Step 1: Creating IAM user for SES operations...${NC}"
if aws iam get-user --user-name $USER_NAME &> /dev/null; then
    echo -e "${YELLOW}IAM user '$USER_NAME' already exists. Skipping creation.${NC}"
else
    aws iam create-user --user-name $USER_NAME
    echo -e "${GREEN}IAM user '$USER_NAME' created successfully.${NC}"
fi
echo ""

# Step 2: Create and attach SES policy
echo -e "${YELLOW}Step 2: Creating and attaching SES policy...${NC}"

# Create policy document
POLICY_DOCUMENT='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:GetSendQuota",
        "ses:GetSendStatistics",
        "ses:GetIdentityVerificationAttributes",
        "ses:GetIdentityDkimAttributes"
      ],
      "Resource": "*"
    }
  ]
}'

# Check if policy exists
POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"
if aws iam get-policy --policy-arn $POLICY_ARN &> /dev/null; then
    echo -e "${YELLOW}Policy '$POLICY_NAME' already exists. Skipping creation.${NC}"
else
    aws iam create-policy --policy-name $POLICY_NAME --policy-document "$POLICY_DOCUMENT"
    echo -e "${GREEN}Policy '$POLICY_NAME' created successfully.${NC}"
fi

# Attach policy to user
aws iam attach-user-policy --user-name $USER_NAME --policy-arn $POLICY_ARN
echo -e "${GREEN}Policy attached to user successfully.${NC}"
echo ""

# Step 3: Verify domain identity
echo -e "${YELLOW}Step 3: Verifying domain identity in SES...${NC}"
aws ses verify-domain-identity --domain $DOMAIN --region $AWS_REGION
echo -e "${GREEN}Domain verification initiated for '$DOMAIN'.${NC}"
echo ""

# Step 4: Get DKIM tokens
echo -e "${YELLOW}Step 4: Getting DKIM tokens for domain...${NC}"
DKIM_TOKENS=$(aws ses get-identity-dkim-attributes --identities $DOMAIN --region $AWS_REGION --query "DkimAttributes.\"$DOMAIN\".DkimTokens" --output table)
echo -e "${GREEN}DKIM tokens for domain verification:${NC}"
echo "$DKIM_TOKENS"
echo ""

# Step 5: Generate access keys
echo -e "${YELLOW}Step 5: Generating access keys for IAM user...${NC}"

# Check if access keys already exist
EXISTING_KEYS=$(aws iam list-access-keys --user-name $USER_NAME --query 'AccessKeyMetadata[*].AccessKeyId' --output text)
if [ ! -z "$EXISTING_KEYS" ]; then
    echo -e "${YELLOW}Access keys already exist for user '$USER_NAME':${NC}"
    echo "$EXISTING_KEYS"
    echo -e "${YELLOW}Delete existing keys if you want to create new ones.${NC}"
else
    ACCESS_KEY_OUTPUT=$(aws iam create-access-key --user-name $USER_NAME)
    ACCESS_KEY_ID=$(echo $ACCESS_KEY_OUTPUT | jq -r '.AccessKey.AccessKeyId')
    SECRET_ACCESS_KEY=$(echo $ACCESS_KEY_OUTPUT | jq -r '.AccessKey.SecretAccessKey')
    
    echo -e "${GREEN}Access keys created successfully:${NC}"
    echo -e "Access Key ID: ${BLUE}$ACCESS_KEY_ID${NC}"
    echo -e "Secret Access Key: ${BLUE}$SECRET_ACCESS_KEY${NC}"
    echo ""
    
    # Create .env.local file
    echo -e "${YELLOW}Step 6: Creating .env.local file...${NC}"
    cat > .env.local << EOF
# AWS SES Configuration
AWS_REGION="$AWS_REGION"
AWS_ACCESS_KEY_ID="$ACCESS_KEY_ID"
AWS_SECRET_ACCESS_KEY="$SECRET_ACCESS_KEY"

# Email Configuration
EMAIL_SENDER_NAME="Taxclusive"
EMAIL_SENDER_ADDRESS="noreply@$DOMAIN"
EMAIL_RECIPIENT_ADDRESS="contact@$DOMAIN"
EMAIL_RECIPIENT_NAME="Taxclusive Support"

# Other configurations (copy from .env.example as needed)
NEXT_PUBLIC_BASE_URL="https://www.$DOMAIN"
NODE_ENV="production"
EOF
    
    echo -e "${GREEN}.env.local file created with AWS SES configuration.${NC}"
    echo ""
fi

# Step 6: Display DNS records needed
echo -e "${YELLOW}Step 7: DNS Records Required${NC}"
echo -e "${RED}IMPORTANT: Add the following DNS records to your domain:${NC}"
echo ""

# Get domain verification token
VERIFICATION_TOKEN=$(aws ses get-identity-verification-attributes --identities $DOMAIN --region $AWS_REGION --query "VerificationAttributes.\"$DOMAIN\".VerificationToken" --output text)

echo -e "${BLUE}1. Domain Verification TXT Record:${NC}"
echo "   Name: _amazonses.$DOMAIN"
echo "   Type: TXT"
echo "   Value: $VERIFICATION_TOKEN"
echo ""

echo -e "${BLUE}2. DKIM CNAME Records (add all 3):${NC}"
# Get DKIM tokens again for display
DKIM_TOKENS_LIST=$(aws ses get-identity-dkim-attributes --identities $DOMAIN --region $AWS_REGION --query "DkimAttributes.\"$DOMAIN\".DkimTokens[]" --output text)
counter=1
for token in $DKIM_TOKENS_LIST; do
    echo "   Name: ${token}._domainkey.$DOMAIN"
    echo "   Type: CNAME"
    echo "   Value: ${token}.dkim.amazonses.com"
    echo ""
    counter=$((counter + 1))
done

echo -e "${BLUE}3. SPF Record (if not already exists):${NC}"
echo "   Name: $DOMAIN"
echo "   Type: TXT"
echo "   Value: \"v=spf1 include:amazonses.com ~all\""
echo ""

echo -e "${BLUE}4. DMARC Record (recommended):${NC}"
echo "   Name: _dmarc.$DOMAIN"
echo "   Type: TXT"
echo "   Value: \"v=DMARC1; p=quarantine; rua=mailto:admin@$DOMAIN\""
echo ""

# Step 7: Display next steps
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Add the DNS records shown above to your domain"
echo "2. Wait for DNS propagation (can take up to 48 hours)"
echo "3. Check verification status with: aws ses get-identity-verification-attributes --identities $DOMAIN --region $AWS_REGION"
echo "4. Test email sending with the test script: node scripts/test-aws-ses.js"
echo "5. Request production access through AWS Console to remove sandbox limitations"
echo ""

echo -e "${GREEN}=== AWS SES Setup Complete ===${NC}"
echo -e "${YELLOW}⚠️  Remember to securely store your access keys and never commit .env.local to version control!${NC}"