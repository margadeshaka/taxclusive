#!/bin/bash

# Taxclusive AWS SES Status Checker
# This script checks the current status of AWS SES configuration
# Prerequisites: AWS CLI installed and configured

set -e

# Configuration
DOMAIN="taxclusive.com"
AWS_REGION="us-east-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Taxclusive AWS SES Status Check ===${NC}"
echo ""

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed.${NC}"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not configured.${NC}"
    exit 1
fi

# Check domain verification status
echo -e "${YELLOW}🔍 Checking domain verification status...${NC}"
DOMAIN_STATUS=$(aws ses get-identity-verification-attributes --identities $DOMAIN --region $AWS_REGION --query "VerificationAttributes.\"$DOMAIN\".VerificationStatus" --output text 2>/dev/null || echo "NotFound")

if [ "$DOMAIN_STATUS" = "Success" ]; then
    echo -e "${GREEN}✅ Domain $DOMAIN is verified${NC}"
elif [ "$DOMAIN_STATUS" = "Pending" ]; then
    echo -e "${YELLOW}⏳ Domain $DOMAIN verification is pending${NC}"
    echo -e "${CYAN}   Please check your DNS records and wait for propagation.${NC}"
elif [ "$DOMAIN_STATUS" = "Failed" ]; then
    echo -e "${RED}❌ Domain $DOMAIN verification failed${NC}"
    echo -e "${CYAN}   Please check your DNS records.${NC}"
else
    echo -e "${RED}❌ Domain $DOMAIN is not found in SES identities${NC}"
    echo -e "${CYAN}   Run the setup script to add domain verification.${NC}"
fi

# Check DKIM status
echo -e "\n${YELLOW}🔐 Checking DKIM status...${NC}"
DKIM_STATUS=$(aws ses get-identity-dkim-attributes --identities $DOMAIN --region $AWS_REGION --query "DkimAttributes.\"$DOMAIN\".DkimEnabled" --output text 2>/dev/null || echo "NotFound")

if [ "$DKIM_STATUS" = "True" ]; then
    echo -e "${GREEN}✅ DKIM is enabled for $DOMAIN${NC}"
    
    # Check DKIM verification status
    DKIM_VERIFICATION=$(aws ses get-identity-dkim-attributes --identities $DOMAIN --region $AWS_REGION --query "DkimAttributes.\"$DOMAIN\".DkimVerificationStatus" --output text 2>/dev/null || echo "NotFound")
    
    if [ "$DKIM_VERIFICATION" = "Success" ]; then
        echo -e "${GREEN}✅ DKIM verification successful${NC}"
    elif [ "$DKIM_VERIFICATION" = "Pending" ]; then
        echo -e "${YELLOW}⏳ DKIM verification pending${NC}"
        echo -e "${CYAN}   Please ensure DKIM CNAME records are added to DNS.${NC}"
    else
        echo -e "${RED}❌ DKIM verification status: $DKIM_VERIFICATION${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  DKIM is not enabled for $DOMAIN${NC}"
fi

# Check sending quota
echo -e "\n${YELLOW}📊 Checking SES sending quota...${NC}"
QUOTA_INFO=$(aws ses get-send-quota --region $AWS_REGION 2>/dev/null || echo "Error")

if [ "$QUOTA_INFO" != "Error" ]; then
    MAX_24H=$(echo $QUOTA_INFO | jq -r '.Max24HourSend')
    SENT_24H=$(echo $QUOTA_INFO | jq -r '.SentLast24Hours')
    MAX_RATE=$(echo $QUOTA_INFO | jq -r '.MaxSendRate')
    
    echo -e "${CYAN}   Max emails per 24h: $MAX_24H${NC}"
    echo -e "${CYAN}   Sent in last 24h: $SENT_24H${NC}"
    echo -e "${CYAN}   Max send rate: $MAX_RATE emails/second${NC}"
    
    if [ "$MAX_24H" = "200" ]; then
        echo -e "${YELLOW}⚠️  Account is in SES Sandbox mode (limited to 200 emails/day)${NC}"
        echo -e "${CYAN}   Request production access through AWS Console to increase limits.${NC}"
    else
        echo -e "${GREEN}✅ Account has production access${NC}"
    fi
else
    echo -e "${RED}❌ Unable to retrieve sending quota${NC}"
fi

# Check sending statistics
echo -e "\n${YELLOW}📈 Checking recent sending statistics...${NC}"
STATS_INFO=$(aws ses get-send-statistics --region $AWS_REGION 2>/dev/null || echo "Error")

if [ "$STATS_INFO" != "Error" ]; then
    SEND_DATA_POINTS=$(echo $STATS_INFO | jq '.SendDataPoints | length')
    
    if [ "$SEND_DATA_POINTS" -gt "0" ]; then
        echo -e "${CYAN}   Recent sending activity found ($SEND_DATA_POINTS data points)${NC}"
        
        # Get latest statistics
        LATEST_STATS=$(echo $STATS_INFO | jq '.SendDataPoints[-1]')
        DELIVERY_ATTEMPTS=$(echo $LATEST_STATS | jq -r '.DeliveryAttempts')
        BOUNCES=$(echo $LATEST_STATS | jq -r '.Bounces')
        COMPLAINTS=$(echo $LATEST_STATS | jq -r '.Complaints')
        REJECTS=$(echo $LATEST_STATS | jq -r '.Rejects')
        
        echo -e "${CYAN}   Latest period stats:${NC}"
        echo -e "${CYAN}     Delivery attempts: $DELIVERY_ATTEMPTS${NC}"
        echo -e "${CYAN}     Bounces: $BOUNCES${NC}"
        echo -e "${CYAN}     Complaints: $COMPLAINTS${NC}"
        echo -e "${CYAN}     Rejects: $REJECTS${NC}"
    else
        echo -e "${YELLOW}   No recent sending activity${NC}"
    fi
else
    echo -e "${RED}❌ Unable to retrieve sending statistics${NC}"
fi

# Check if email addresses are verified (for sandbox mode)
echo -e "\n${YELLOW}📧 Checking verified email addresses...${NC}"
VERIFIED_EMAILS=$(aws ses list-verified-email-addresses --region $AWS_REGION --query 'VerifiedEmailAddresses' --output text 2>/dev/null || echo "Error")

if [ "$VERIFIED_EMAILS" != "Error" ]; then
    if [ ! -z "$VERIFIED_EMAILS" ]; then
        echo -e "${GREEN}✅ Verified email addresses found:${NC}"
        for email in $VERIFIED_EMAILS; do
            echo -e "${CYAN}   - $email${NC}"
        done
    else
        echo -e "${YELLOW}⚠️  No individual email addresses verified${NC}"
        echo -e "${CYAN}   This is normal if you're using domain verification.${NC}"
    fi
else
    echo -e "${RED}❌ Unable to retrieve verified email addresses${NC}"
fi

# Summary and recommendations
echo -e "\n${BLUE}=== Summary and Recommendations ===${NC}"

if [ "$DOMAIN_STATUS" = "Success" ] && [ "$DKIM_VERIFICATION" = "Success" ]; then
    echo -e "${GREEN}🎉 Your AWS SES configuration looks good!${NC}"
    echo -e "\n${CYAN}Next steps:${NC}"
    echo -e "${CYAN}1. Test email sending with: node scripts/test-aws-ses.js${NC}"
    echo -e "${CYAN}2. Monitor email delivery in AWS SES console${NC}"
    echo -e "${CYAN}3. Set up bounce and complaint handling if needed${NC}"
else
    echo -e "${YELLOW}⚠️  Some configuration issues detected:${NC}"
    
    if [ "$DOMAIN_STATUS" != "Success" ]; then
        echo -e "${CYAN}- Complete domain verification by adding DNS records${NC}"
    fi
    
    if [ "$DKIM_VERIFICATION" != "Success" ]; then
        echo -e "${CYAN}- Add DKIM CNAME records to your DNS${NC}"
    fi
    
    echo -e "\n${CYAN}Run the setup script again if needed: ./scripts/setup-aws-ses.sh${NC}"
fi

echo -e "\n${BLUE}For more details, visit AWS SES Console:${NC}"
echo -e "${CYAN}https://console.aws.amazon.com/sesv2/home?region=$AWS_REGION${NC}"

echo ""