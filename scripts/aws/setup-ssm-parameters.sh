#!/bin/bash

# AWS SSM Parameters Setup Script for Taxclusive
# This script creates all required SSM parameters for the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment parameter
ENVIRONMENT=${1:-staging}
AWS_REGION=${2:-us-east-1}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
    echo "Usage: $0 <environment> [aws-region]"
    exit 1
fi

echo -e "${BLUE}Setting up SSM parameters for environment: ${ENVIRONMENT}${NC}"
echo ""

# Function to create or update SSM parameter
create_parameter() {
    local name="$1"
    local value="$2"
    local type="${3:-String}"
    local description="$4"
    
    echo -e "${YELLOW}Creating parameter: ${name}${NC}"
    
    # Check if parameter exists
    if aws ssm get-parameter --name "${name}" --region "${AWS_REGION}" &>/dev/null; then
        # Update existing parameter
        aws ssm put-parameter \
            --name "${name}" \
            --value "${value}" \
            --type "${type}" \
            --description "${description}" \
            --overwrite \
            --region "${AWS_REGION}" \
            --no-cli-pager
        echo -e "${GREEN}Updated parameter: ${name}${NC}"
    else
        # Create new parameter
        aws ssm put-parameter \
            --name "${name}" \
            --value "${value}" \
            --type "${type}" \
            --description "${description}" \
            --region "${AWS_REGION}" \
            --no-cli-pager
        echo -e "${GREEN}Created parameter: ${name}${NC}"
    fi
}

# Function to prompt for parameter value
prompt_for_value() {
    local param_name="$1"
    local description="$2"
    local default_value="$3"
    local is_secret="$4"
    
    echo ""
    echo -e "${BLUE}Setting up: ${param_name}${NC}"
    echo -e "${YELLOW}Description: ${description}${NC}"
    
    if [[ -n "$default_value" ]]; then
        echo -e "${YELLOW}Default value: ${default_value}${NC}"
    fi
    
    if [[ "$is_secret" == "true" ]]; then
        echo -e "${RED}Note: This is a sensitive parameter${NC}"
        read -s -p "Enter value (input hidden): " value
        echo ""
    else
        read -p "Enter value [${default_value}]: " value
    fi
    
    # Use default if no value provided
    if [[ -z "$value" && -n "$default_value" ]]; then
        value="$default_value"
    fi
    
    echo "$value"
}

# Set environment-specific defaults
if [[ "$ENVIRONMENT" == "production" ]]; then
    DEFAULT_BASE_URL="https://www.taxclusive.com"
    DEFAULT_FROM_EMAIL="noreply@taxclusive.com"
    DEFAULT_TO_EMAIL="contact@taxclusive.com"
    DEFAULT_STRAPI_URL="https://cms.taxclusive.com/api"
    DEFAULT_RATE_LIMIT="200"
else
    DEFAULT_BASE_URL="https://staging.taxclusive.com"
    DEFAULT_FROM_EMAIL="noreply-staging@taxclusive.com"
    DEFAULT_TO_EMAIL="dev@taxclusive.com"
    DEFAULT_STRAPI_URL="https://staging-cms.taxclusive.com/api"
    DEFAULT_RATE_LIMIT="100"
fi

echo -e "${BLUE}Setting up parameters for ${ENVIRONMENT} environment${NC}"
echo -e "${YELLOW}You will be prompted for each parameter value${NC}"
echo -e "${YELLOW}Press Enter to use default values where provided${NC}"
echo ""

# AWS Configuration Parameters
echo -e "${BLUE}=== AWS Configuration ===${NC}"

aws_region=$(prompt_for_value \
    "AWS Region" \
    "AWS region for the application" \
    "${AWS_REGION}" \
    "false")

create_parameter \
    "/taxclusive/${ENVIRONMENT}/aws/region" \
    "${aws_region}" \
    "String" \
    "AWS region for ${ENVIRONMENT} environment"

# Application Configuration Parameters
echo -e "${BLUE}=== Application Configuration ===${NC}"

base_url=$(prompt_for_value \
    "Base URL" \
    "Base URL for the application" \
    "${DEFAULT_BASE_URL}" \
    "false")

create_parameter \
    "/taxclusive/${ENVIRONMENT}/app/base-url" \
    "${base_url}" \
    "String" \
    "Base URL for ${ENVIRONMENT} environment"

# Email Configuration Parameters
echo -e "${BLUE}=== Email Configuration (SES) ===${NC}"

from_email=$(prompt_for_value \
    "From Email Address" \
    "Email address to send emails from (must be verified in SES)" \
    "${DEFAULT_FROM_EMAIL}" \
    "false")

create_parameter \
    "/taxclusive/${ENVIRONMENT}/ses/from-email" \
    "${from_email}" \
    "String" \
    "SES from email for ${ENVIRONMENT}"

to_email=$(prompt_for_value \
    "To Email Address" \
    "Email address to send contact forms to" \
    "${DEFAULT_TO_EMAIL}" \
    "false")

create_parameter \
    "/taxclusive/${ENVIRONMENT}/ses/to-email" \
    "${to_email}" \
    "String" \
    "SES recipient email for ${ENVIRONMENT}"

from_name=$(prompt_for_value \
    "From Name" \
    "Display name for sent emails" \
    "Taxclusive" \
    "false")

create_parameter \
    "/taxclusive/${ENVIRONMENT}/ses/from-name" \
    "${from_name}" \
    "String" \
    "SES from name for ${ENVIRONMENT}"

# CMS Configuration Parameters
echo -e "${BLUE}=== CMS Configuration (Strapi) ===${NC}"

strapi_url=$(prompt_for_value \
    "Strapi API URL" \
    "URL for Strapi CMS API" \
    "${DEFAULT_STRAPI_URL}" \
    "false")

create_parameter \
    "/taxclusive/${ENVIRONMENT}/strapi/url" \
    "${strapi_url}" \
    "String" \
    "Strapi CMS URL for ${ENVIRONMENT}"

strapi_token=$(prompt_for_value \
    "Strapi API Token" \
    "API token for Strapi CMS access" \
    "" \
    "true")

if [[ -n "$strapi_token" ]]; then
    create_parameter \
        "/taxclusive/${ENVIRONMENT}/strapi/token" \
        "${strapi_token}" \
        "SecureString" \
        "Strapi API token for ${ENVIRONMENT}"
fi

# Security Configuration Parameters
echo -e "${BLUE}=== Security Configuration ===${NC}"

csrf_secret=$(prompt_for_value \
    "CSRF Secret" \
    "Random string for CSRF protection (leave empty to generate)" \
    "" \
    "true")

if [[ -z "$csrf_secret" ]]; then
    csrf_secret=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated CSRF secret${NC}"
fi

create_parameter \
    "/taxclusive/${ENVIRONMENT}/csrf/secret" \
    "${csrf_secret}" \
    "SecureString" \
    "CSRF secret for ${ENVIRONMENT}"

# Rate Limiting Configuration
echo -e "${BLUE}=== Rate Limiting Configuration ===${NC}"

rate_limit_max=$(prompt_for_value \
    "Max Requests" \
    "Maximum requests per window" \
    "${DEFAULT_RATE_LIMIT}" \
    "false")

create_parameter \
    "/taxclusive/${ENVIRONMENT}/rate-limit/max-requests" \
    "${rate_limit_max}" \
    "String" \
    "Maximum requests per window for ${ENVIRONMENT}"

rate_limit_window=$(prompt_for_value \
    "Rate Limit Window (ms)" \
    "Rate limit window in milliseconds" \
    "900000" \
    "false")

create_parameter \
    "/taxclusive/${ENVIRONMENT}/rate-limit/window-ms" \
    "${rate_limit_window}" \
    "String" \
    "Rate limit window in milliseconds for ${ENVIRONMENT}"

# Optional: Analytics Configuration
echo -e "${BLUE}=== Analytics Configuration (Optional) ===${NC}"

read -p "Do you want to set up Google Analytics? (y/n): " setup_analytics

if [[ "$setup_analytics" =~ ^[Yy]$ ]]; then
    ga_id=$(prompt_for_value \
        "Google Analytics ID" \
        "Google Analytics measurement ID (e.g., G-XXXXXXXXXX)" \
        "" \
        "false")
    
    if [[ -n "$ga_id" ]]; then
        create_parameter \
            "/taxclusive/${ENVIRONMENT}/analytics/google-id" \
            "${ga_id}" \
            "String" \
            "Google Analytics ID for ${ENVIRONMENT}"
    fi
fi

# Feature Flags (Optional)
echo -e "${BLUE}=== Feature Flags ===${NC}"

create_parameter \
    "/taxclusive/${ENVIRONMENT}/features/maintenance-mode" \
    "false" \
    "String" \
    "Maintenance mode flag for ${ENVIRONMENT}"

create_parameter \
    "/taxclusive/${ENVIRONMENT}/features/debug-mode" \
    "$([[ $ENVIRONMENT == "staging" ]] && echo "true" || echo "false")" \
    "String" \
    "Debug mode flag for ${ENVIRONMENT}"

# Cache Configuration
echo -e "${BLUE}=== Cache Configuration ===${NC}"

create_parameter \
    "/taxclusive/${ENVIRONMENT}/cache/ttl-seconds" \
    "300" \
    "String" \
    "Default cache TTL in seconds for ${ENVIRONMENT}"

create_parameter \
    "/taxclusive/${ENVIRONMENT}/cache/api-ttl-seconds" \
    "60" \
    "String" \
    "API cache TTL in seconds for ${ENVIRONMENT}"

# Deployment tracking
create_parameter \
    "/taxclusive/${ENVIRONMENT}/deployment/last-updated" \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    "String" \
    "Last parameter update timestamp for ${ENVIRONMENT}"

echo ""
echo -e "${GREEN}=== SSM Parameters Setup Complete ===${NC}"
echo ""

# Verify parameters were created
echo -e "${BLUE}Verifying created parameters...${NC}"
aws ssm get-parameters-by-path \
    --path "/taxclusive/${ENVIRONMENT}/" \
    --recursive \
    --region "${AWS_REGION}" \
    --query "Parameters[*].[Name,Type,LastModifiedDate]" \
    --output table

echo ""
echo -e "${GREEN}All parameters have been successfully created!${NC}"
echo ""

# Security reminder
echo -e "${YELLOW}=== Security Reminders ===${NC}"
echo -e "${YELLOW}1. SecureString parameters are encrypted with AWS KMS${NC}"
echo -e "${YELLOW}2. Only Lambda functions with proper IAM permissions can access these parameters${NC}"
echo -e "${YELLOW}3. Consider setting up parameter rotation for sensitive values${NC}"
echo -e "${YELLOW}4. Monitor parameter access through CloudTrail${NC}"
echo ""

# Cost information
echo -e "${BLUE}=== Cost Information ===${NC}"
echo -e "${BLUE}Standard parameters: Free for up to 10,000 requests per month${NC}"
echo -e "${BLUE}Advanced parameters: $0.05 per 10,000 requests${NC}"
echo -e "${BLUE}SecureString parameters: Additional KMS charges may apply${NC}"
echo ""

# Next steps
echo -e "${BLUE}=== Next Steps ===${NC}"
echo -e "${YELLOW}1. Update your Lambda function to use these parameters${NC}"
echo -e "${YELLOW}2. Test parameter retrieval in your application${NC}"
echo -e "${YELLOW}3. Set up monitoring for parameter access${NC}"
echo -e "${YELLOW}4. Configure parameter rotation if needed${NC}"
echo ""