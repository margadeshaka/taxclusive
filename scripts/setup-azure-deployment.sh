#!/bin/bash

# Azure Static Web Apps deployment setup script for Taxclusive
# This script helps set up GitHub secrets and Azure resources

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

# Check prerequisites
check_prerequisites() {
    log_header "Checking Prerequisites"
    
    # Check if Azure CLI is installed
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is not installed. Please install it first:"
        echo "https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi
    log_success "Azure CLI is installed"
    
    # Check if GitHub CLI is installed
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI is not installed. Please install it first:"
        echo "https://cli.github.com/"
        exit 1
    fi
    log_success "GitHub CLI is installed"
    
    # Check if user is logged in to Azure
    if ! az account show &> /dev/null; then
        log_error "Please log in to Azure CLI first: az login"
        exit 1
    fi
    log_success "Logged in to Azure CLI"
    
    # Check if user is logged in to GitHub
    if ! gh auth status &> /dev/null; then
        log_error "Please log in to GitHub CLI first: gh auth login"
        exit 1
    fi
    log_success "Logged in to GitHub CLI"
}

# Create Azure Communication Services resource
create_communication_service() {
    log_header "Creating Azure Communication Services"
    
    read -p "Enter resource group name (default: taxclusive-rg): " RESOURCE_GROUP
    RESOURCE_GROUP=${RESOURCE_GROUP:-taxclusive-rg}
    
    read -p "Enter location (default: eastus): " LOCATION
    LOCATION=${LOCATION:-eastus}
    
    read -p "Enter Communication Service name (default: taxclusive-comm): " COMM_SERVICE_NAME
    COMM_SERVICE_NAME=${COMM_SERVICE_NAME:-taxclusive-comm}
    
    # Create resource group if it doesn't exist
    log_info "Creating resource group: $RESOURCE_GROUP"
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none
    log_success "Resource group created/verified"
    
    # Create Communication Services resource
    log_info "Creating Communication Services resource: $COMM_SERVICE_NAME"
    az communication create \
        --name "$COMM_SERVICE_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "global" \
        --data-location "United States" \
        --output none
    log_success "Communication Services resource created"
    
    # Get connection string
    log_info "Retrieving connection string..."
    CONNECTION_STRING=$(az communication list-key --name "$COMM_SERVICE_NAME" --resource-group "$RESOURCE_GROUP" --query "primaryConnectionString" --output tsv)
    
    if [ -z "$CONNECTION_STRING" ]; then
        log_error "Failed to retrieve connection string"
        exit 1
    fi
    
    log_success "Connection string retrieved"
    
    # Store for later use
    echo "$CONNECTION_STRING" > .azure-connection-string.tmp
    echo "$RESOURCE_GROUP" > .azure-resource-group.tmp
}

# Create Azure Static Web App
create_static_web_app() {
    log_header "Creating Azure Static Web App"
    
    RESOURCE_GROUP=$(cat .azure-resource-group.tmp)
    
    read -p "Enter Static Web App name (default: taxclusive-web): " STATIC_APP_NAME
    STATIC_APP_NAME=${STATIC_APP_NAME:-taxclusive-web}
    
    read -p "Enter GitHub repository (owner/repo format): " GITHUB_REPO
    if [ -z "$GITHUB_REPO" ]; then
        log_error "GitHub repository is required"
        exit 1
    fi
    
    read -p "Enter branch name (default: main): " BRANCH
    BRANCH=${BRANCH:-main}
    
    # Create Static Web App
    log_info "Creating Static Web App: $STATIC_APP_NAME"
    DEPLOYMENT_TOKEN=$(az staticwebapp create \
        --name "$STATIC_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --source "https://github.com/$GITHUB_REPO" \
        --location "East US 2" \
        --branch "$BRANCH" \
        --app-location "/" \
        --api-location "" \
        --output-location ".next" \
        --query "repositoryToken" \
        --output tsv)
    
    if [ -z "$DEPLOYMENT_TOKEN" ]; then
        log_error "Failed to create Static Web App"
        exit 1
    fi
    
    log_success "Static Web App created"
    
    # Store deployment token
    echo "$DEPLOYMENT_TOKEN" > .azure-deployment-token.tmp
    
    # Get the app URL
    APP_URL=$(az staticwebapp show --name "$STATIC_APP_NAME" --resource-group "$RESOURCE_GROUP" --query "defaultHostname" --output tsv)
    log_success "Static Web App URL: https://$APP_URL"
    echo "https://$APP_URL" > .azure-app-url.tmp
}

# Set up GitHub secrets
setup_github_secrets() {
    log_header "Setting up GitHub Secrets"
    
    CONNECTION_STRING=$(cat .azure-connection-string.tmp)
    DEPLOYMENT_TOKEN=$(cat .azure-deployment-token.tmp)
    APP_URL=$(cat .azure-app-url.tmp)
    
    # Set up required secrets
    log_info "Setting GitHub secrets..."
    
    gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body "$DEPLOYMENT_TOKEN"
    log_success "Set AZURE_STATIC_WEB_APPS_API_TOKEN"
    
    gh secret set AZURE_COMMUNICATION_CONNECTION_STRING --body "$CONNECTION_STRING"
    log_success "Set AZURE_COMMUNICATION_CONNECTION_STRING"
    
    # Prompt for email configuration
    echo ""
    log_info "Email Configuration Setup"
    echo "Please provide the following email settings:"
    
    read -p "Email sender name (default: Taxclusive Support): " EMAIL_SENDER_NAME
    EMAIL_SENDER_NAME=${EMAIL_SENDER_NAME:-"Taxclusive Support"}
    
    read -p "Email sender address (must be verified domain): " EMAIL_SENDER_ADDRESS
    while [ -z "$EMAIL_SENDER_ADDRESS" ]; do
        log_warning "Email sender address is required"
        read -p "Email sender address (must be verified domain): " EMAIL_SENDER_ADDRESS
    done
    
    read -p "Email recipient address: " EMAIL_RECIPIENT_ADDRESS
    while [ -z "$EMAIL_RECIPIENT_ADDRESS" ]; do
        log_warning "Email recipient address is required"
        read -p "Email recipient address: " EMAIL_RECIPIENT_ADDRESS
    done
    
    read -p "Email recipient name (default: Taxclusive Team): " EMAIL_RECIPIENT_NAME
    EMAIL_RECIPIENT_NAME=${EMAIL_RECIPIENT_NAME:-"Taxclusive Team"}
    
    # Set email secrets
    gh secret set EMAIL_SENDER_NAME --body "$EMAIL_SENDER_NAME"
    log_success "Set EMAIL_SENDER_NAME"
    
    gh secret set EMAIL_SENDER_ADDRESS --body "$EMAIL_SENDER_ADDRESS"
    log_success "Set EMAIL_SENDER_ADDRESS"
    
    gh secret set EMAIL_RECIPIENT_ADDRESS --body "$EMAIL_RECIPIENT_ADDRESS"
    log_success "Set EMAIL_RECIPIENT_ADDRESS"
    
    gh secret set EMAIL_RECIPIENT_NAME --body "$EMAIL_RECIPIENT_NAME"
    log_success "Set EMAIL_RECIPIENT_NAME"
    
    gh secret set NEXT_PUBLIC_BASE_URL --body "$APP_URL"
    log_success "Set NEXT_PUBLIC_BASE_URL"
    
    # Strapi URL (if applicable)
    read -p "Strapi URL (optional, press Enter to skip): " STRAPI_URL
    if [ ! -z "$STRAPI_URL" ]; then
        gh secret set NEXT_PUBLIC_STRAPI_URL --body "$STRAPI_URL"
        log_success "Set NEXT_PUBLIC_STRAPI_URL"
    fi
}

# Verify domain for email
verify_email_domain() {
    log_header "Email Domain Verification"
    
    RESOURCE_GROUP=$(cat .azure-resource-group.tmp)
    COMM_SERVICE_NAME="taxclusive-comm"  # Use the default name
    EMAIL_SENDER_ADDRESS=$(gh secret list --json name,value | grep EMAIL_SENDER_ADDRESS | jq -r '.value' 2>/dev/null || echo "")
    
    if [ ! -z "$EMAIL_SENDER_ADDRESS" ]; then
        DOMAIN=$(echo "$EMAIL_SENDER_ADDRESS" | cut -d'@' -f2)
        
        log_info "To send emails, you need to verify the domain: $DOMAIN"
        log_info "Follow these steps in Azure Portal:"
        echo "1. Go to Communication Services > $COMM_SERVICE_NAME"
        echo "2. Navigate to 'Email' > 'Provision domains'"
        echo "3. Add your custom domain: $DOMAIN"
        echo "4. Follow the DNS verification steps"
        echo "5. Wait for domain verification to complete"
        echo ""
        log_warning "Email functionality will not work until domain verification is complete"
    fi
}

# Clean up temporary files
cleanup() {
    log_header "Cleaning Up"
    
    rm -f .azure-connection-string.tmp
    rm -f .azure-resource-group.tmp
    rm -f .azure-deployment-token.tmp
    rm -f .azure-app-url.tmp
    
    log_success "Temporary files cleaned up"
}

# Update environment file for local development
update_local_env() {
    log_header "Updating Local Environment"
    
    CONNECTION_STRING=$(gh secret list --json name,value | grep AZURE_COMMUNICATION_CONNECTION_STRING | jq -r '.value' 2>/dev/null || echo "")
    EMAIL_SENDER_ADDRESS=$(gh secret list --json name,value | grep EMAIL_SENDER_ADDRESS | jq -r '.value' 2>/dev/null || echo "")
    EMAIL_RECIPIENT_ADDRESS=$(gh secret list --json name,value | grep EMAIL_RECIPIENT_ADDRESS | jq -r '.value' 2>/dev/null || echo "")
    
    if [ ! -f ".env.local" ]; then
        log_info "Creating .env.local file..."
        cat > .env.local << EOF
# Azure Communication Services
AZURE_COMMUNICATION_CONNECTION_STRING="$CONNECTION_STRING"

# Email Configuration
EMAIL_SENDER_NAME="Taxclusive Support"
EMAIL_SENDER_ADDRESS="$EMAIL_SENDER_ADDRESS"
EMAIL_RECIPIENT_ADDRESS="$EMAIL_RECIPIENT_ADDRESS"
EMAIL_RECIPIENT_NAME="Taxclusive Team"

# Base URL for local development
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Strapi CMS (if applicable)
# NEXT_PUBLIC_STRAPI_URL="your-strapi-url"
EOF
        log_success "Created .env.local with configuration"
    else
        log_info ".env.local already exists, please update it manually with the new values"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Taxclusive Azure Deployment Setup${NC}"
    echo -e "${BLUE}This script will set up Azure resources and GitHub secrets${NC}\n"
    
    # Confirm before proceeding
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Setup cancelled"
        exit 0
    fi
    
    check_prerequisites
    create_communication_service
    create_static_web_app
    setup_github_secrets
    verify_email_domain
    update_local_env
    cleanup
    
    log_header "🎉 Setup Complete!"
    
    echo -e "${GREEN}Your Taxclusive application is now configured for Azure deployment!${NC}\n"
    
    log_info "Next steps:"
    echo "1. Verify your email domain in Azure Portal (see instructions above)"
    echo "2. Push changes to trigger GitHub Actions deployment"
    echo "3. Test email functionality once domain is verified"
    echo "4. Monitor deployments in GitHub Actions"
    echo ""
    
    APP_URL=$(cat .azure-app-url.tmp 2>/dev/null || echo "your-app-url")
    log_success "Your app will be available at: $APP_URL"
    
    log_info "Use 'node scripts/test-email-integration.js' to test email functionality"
}

# Handle help argument
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Taxclusive Azure Deployment Setup Script"
    echo ""
    echo "This script automates the setup of:"
    echo "- Azure Communication Services for email"
    echo "- Azure Static Web Apps for hosting"
    echo "- GitHub secrets for deployment"
    echo ""
    echo "Prerequisites:"
    echo "- Azure CLI installed and logged in"
    echo "- GitHub CLI installed and logged in"
    echo "- Proper permissions on Azure subscription"
    echo "- Admin access to GitHub repository"
    echo ""
    echo "Usage:"
    echo "  ./scripts/setup-azure-deployment.sh"
    echo "  ./scripts/setup-azure-deployment.sh --help"
    echo ""
    exit 0
fi

# Run main function
main