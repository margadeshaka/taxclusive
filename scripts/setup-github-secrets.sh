#!/bin/bash

# GitHub Secrets Setup Script for TaxExclusive Azure Deployment
# This script helps configure GitHub secrets for automated deployment

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Configuration
RESOURCE_GROUP="taxclusive"
APP_NAME="taxexclusive-app"
INSIGHTS_NAME="taxexclusive-insights"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI is not installed. Please install it first."
    print_info "Visit: https://cli.github.com/"
    exit 1
fi

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if logged into GitHub
if ! gh auth status &> /dev/null; then
    print_error "Not logged into GitHub CLI. Please run 'gh auth login' first."
    exit 1
fi

# Check if logged into Azure
if ! az account show &> /dev/null; then
    print_error "Not logged into Azure CLI. Please run 'az login' first."
    exit 1
fi

print_status "Setting up GitHub secrets for TaxExclusive Azure deployment..."

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
print_info "Using Azure subscription: $SUBSCRIPTION_ID"

# Create service principal for GitHub Actions
print_status "Creating service principal for GitHub Actions..."
SP_NAME="github-actions-taxexclusive"

# Check if service principal already exists
if az ad sp list --display-name "$SP_NAME" --query "[0].appId" -o tsv | grep -q "."; then
    print_warning "Service principal '$SP_NAME' already exists. Using existing one."
    SP_APP_ID=$(az ad sp list --display-name "$SP_NAME" --query "[0].appId" -o tsv)
    
    # Reset credentials
    print_status "Resetting service principal credentials..."
    SP_CREDENTIALS=$(az ad sp credential reset --id $SP_APP_ID --sdk-auth)
else
    # Create new service principal
    SP_CREDENTIALS=$(az ad sp create-for-rbac \
        --name "$SP_NAME" \
        --role contributor \
        --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
        --sdk-auth)
fi

print_status "Service principal created successfully!"

# Get Application Insights instrumentation key
print_status "Retrieving Application Insights instrumentation key..."
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
    --app $INSIGHTS_NAME \
    --resource-group $RESOURCE_GROUP \
    --query instrumentationKey -o tsv)

if [ -z "$INSTRUMENTATION_KEY" ]; then
    print_warning "Application Insights not found. The key will need to be set manually after creating Application Insights."
    INSTRUMENTATION_KEY="PLACEHOLDER_INSTRUMENTATION_KEY"
fi

# Function to prompt for secret values
prompt_for_secret() {
    local secret_name=$1
    local description=$2
    local default_value=$3
    
    echo ""
    print_info "Setting up secret: $secret_name"
    print_info "Description: $description"
    
    if [ -n "$default_value" ]; then
        echo "Current/Default value: $default_value"
        read -p "Press Enter to use current value, or type new value: " user_input
        if [ -n "$user_input" ]; then
            echo "$user_input"
        else
            echo "$default_value"
        fi
    else
        read -p "Enter value for $secret_name: " user_input
        echo "$user_input"
    fi
}

# Set GitHub secrets
print_status "Setting GitHub secrets..."

# Azure credentials (auto-generated)
echo "$SP_CREDENTIALS" | gh secret set AZURE_CREDENTIALS

# Azure subscription ID (auto-retrieved)
echo "$SUBSCRIPTION_ID" | gh secret set AZURE_SUBSCRIPTION_ID

# Application Insights key (auto-retrieved or placeholder)
echo "$INSTRUMENTATION_KEY" | gh secret set APPINSIGHTS_INSTRUMENTATIONKEY

# Prompt for Strapi URL
STRAPI_URL=$(prompt_for_secret "NEXT_PUBLIC_STRAPI_URL" "Your Strapi CMS URL" "https://your-strapi-instance.com")
echo "$STRAPI_URL" | gh secret set NEXT_PUBLIC_STRAPI_URL

# Prompt for Azure Communication Services
ACS_CONNECTION=$(prompt_for_secret "AZURE_COMMUNICATION_CONNECTION_STRING" "Azure Communication Services connection string" "")
echo "$ACS_CONNECTION" | gh secret set AZURE_COMMUNICATION_CONNECTION_STRING

# Prompt for sender email
SENDER_EMAIL=$(prompt_for_secret "AZURE_COMMUNICATION_SENDER_ADDRESS" "Sender email address for Azure Communication Services" "noreply@yourdomain.com")
echo "$SENDER_EMAIL" | gh secret set AZURE_COMMUNICATION_SENDER_ADDRESS

# Prompt for alert email
ALERT_EMAIL=$(prompt_for_secret "ALERT_EMAIL" "Email address for monitoring alerts" "alerts@yourdomain.com")
echo "$ALERT_EMAIL" | gh secret set ALERT_EMAIL

print_status "GitHub secrets configured successfully!"

# Display summary
echo ""
print_status "Summary of configured secrets:"
echo "✓ AZURE_CREDENTIALS (auto-generated)"
echo "✓ AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
echo "✓ APPINSIGHTS_INSTRUMENTATIONKEY: $INSTRUMENTATION_KEY"
echo "✓ NEXT_PUBLIC_STRAPI_URL: $STRAPI_URL"
echo "✓ AZURE_COMMUNICATION_CONNECTION_STRING: [HIDDEN]"
echo "✓ AZURE_COMMUNICATION_SENDER_ADDRESS: $SENDER_EMAIL"
echo "✓ ALERT_EMAIL: $ALERT_EMAIL"

# Create deployment info file
print_status "Creating deployment information file..."
cat > deployment-secrets-info.json << EOF
{
  "servicePrincipal": {
    "name": "$SP_NAME",
    "subscriptionId": "$SUBSCRIPTION_ID",
    "resourceGroup": "$RESOURCE_GROUP"
  },
  "githubSecrets": {
    "AZURE_CREDENTIALS": "Auto-generated service principal credentials",
    "AZURE_SUBSCRIPTION_ID": "$SUBSCRIPTION_ID",
    "APPINSIGHTS_INSTRUMENTATIONKEY": "$INSTRUMENTATION_KEY",
    "NEXT_PUBLIC_STRAPI_URL": "$STRAPI_URL",
    "AZURE_COMMUNICATION_CONNECTION_STRING": "Azure Communication Services connection string",
    "AZURE_COMMUNICATION_SENDER_ADDRESS": "$SENDER_EMAIL",
    "ALERT_EMAIL": "$ALERT_EMAIL"
  },
  "instructions": {
    "deployment": "Push to main branch to trigger deployment",
    "monitoring": "Check Azure Portal for Application Insights dashboard",
    "secrets": "Update secrets using 'gh secret set SECRET_NAME --body VALUE'"
  }
}
EOF

print_status "Deployment information saved to deployment-secrets-info.json"

echo ""
print_status "Next steps:"
echo "1. Verify all secrets are correctly set: gh secret list"
echo "2. Update any placeholder values if needed"
echo "3. Push your code to trigger the deployment: git push origin main"
echo "4. Monitor deployment in GitHub Actions tab"
echo "5. Check application status in Azure Portal"

echo ""
print_info "Useful commands:"
echo "• List all secrets: gh secret list"
echo "• Update a secret: gh secret set SECRET_NAME --body 'new-value'"
echo "• Delete a secret: gh secret delete SECRET_NAME"
echo "• View workflow runs: gh run list"
echo "• View specific run: gh run view RUN_ID"

echo ""
print_warning "Security reminders:"
echo "• Never commit secrets to your repository"
echo "• Regularly rotate service principal credentials"
echo "• Monitor access logs for unusual activity"
echo "• Use least privilege principle for permissions"