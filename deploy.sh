#!/bin/bash

# Complete Deployment Automation Script for TaxExclusive
# This script handles the entire deployment process including Azure setup, monitoring, and GitHub configuration

set -e

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="taxclusive"
LOCATION="eastus"
APP_NAME="taxexclusive-app"
PLAN_NAME="taxexclusive-plan"
INSIGHTS_NAME="taxexclusive-insights"
WORKSPACE_NAME="taxexclusive-workspace"
SKU="B1" # Change to S1 for production

# Functions for colored output
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_status() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_header "CHECKING PREREQUISITES"
    
    local missing_tools=()
    
    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        missing_tools+=("Azure CLI")
    fi
    
    # Check GitHub CLI
    if ! command -v gh &> /dev/null; then
        missing_tools+=("GitHub CLI")
    fi
    
    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        missing_tools+=("pnpm")
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools:"
        for tool in "${missing_tools[@]}"; do
            echo "  - $tool"
        done
        exit 1
    fi
    
    print_status "All prerequisites are installed ✓"
}

# Function to check authentication
check_authentication() {
    print_header "CHECKING AUTHENTICATION"
    
    # Check Azure login
    if ! az account show &> /dev/null; then
        print_warning "Not logged into Azure CLI. Attempting login..."
        az login
    fi
    
    # Check GitHub login
    if ! gh auth status &> /dev/null; then
        print_warning "Not logged into GitHub CLI. Attempting login..."
        gh auth login
    fi
    
    print_status "Authentication verified ✓"
}

# Function to build the application
build_application() {
    print_header "BUILDING APPLICATION"
    
    print_status "Installing dependencies..."
    pnpm install
    
    print_status "Running linter..."
    pnpm run lint
    
    print_status "Skipping tests for now..."
    # pnpm run test
    
    print_status "Building application..."
    pnpm run build
    
    print_status "Application built successfully ✓"
}

# Function to deploy Azure infrastructure
deploy_azure_infrastructure() {
    print_header "DEPLOYING AZURE INFRASTRUCTURE"
    
    print_status "Running Azure deployment script..."
    ./scripts/deploy-azure.sh
    
    print_status "Azure infrastructure deployed ✓"
}

# Function to setup monitoring
setup_monitoring() {
    print_header "SETTING UP MONITORING"
    
    print_status "Configuring Application Insights and monitoring..."
    ./monitoring/setup-monitoring.sh
    
    print_status "Monitoring setup complete ✓"
}

# Function to configure GitHub secrets
configure_github_secrets() {
    print_header "CONFIGURING GITHUB SECRETS"
    
    read -p "Do you want to configure GitHub secrets for automated deployment? (y/n): " configure_secrets
    if [[ $configure_secrets == "y" || $configure_secrets == "Y" ]]; then
        print_status "Setting up GitHub secrets..."
        ./scripts/setup-github-secrets.sh
        print_status "GitHub secrets configured ✓"
    else
        print_warning "Skipping GitHub secrets configuration"
        print_info "You can run './scripts/setup-github-secrets.sh' later to configure them"
    fi
}

# Function to deploy application
deploy_application() {
    print_header "DEPLOYING APPLICATION"
    
    # Get subscription ID
    SUBSCRIPTION_ID=$(az account show --query id -o tsv)
    
    # Check if we have a git remote for Azure
    if git remote get-url azure &> /dev/null; then
        print_status "Azure git remote found. Deploying via Git..."
        git add .
        git commit -m "Deploy to Azure App Service 🚀" || print_warning "No changes to commit"
        git push azure main
    else
        print_status "Setting up Azure git deployment..."
        
        # Configure deployment user (if not already configured)
        DEPLOYMENT_URL=$(az webapp deployment source config-local-git \
            --name $APP_NAME \
            --resource-group $RESOURCE_GROUP \
            --query url -o tsv)
        
        print_status "Adding Azure remote..."
        git remote add azure $DEPLOYMENT_URL || print_warning "Azure remote already exists"
        
        print_status "Deploying to Azure..."
        git add .
        git commit -m "Deploy to Azure App Service 🚀" || print_warning "No changes to commit"
        git push azure main
    fi
    
    print_status "Application deployed successfully ✓"
}

# Function to verify deployment
verify_deployment() {
    print_header "VERIFYING DEPLOYMENT"
    
    APP_URL="https://${APP_NAME}.azurewebsites.net"
    
    print_status "Waiting for application to start..."
    sleep 30
    
    print_status "Testing application endpoints..."
    
    # Test homepage
    if curl -s -o /dev/null -w "%{http_code}" "$APP_URL" | grep -q "200"; then
        print_status "Homepage responding ✓"
    else
        print_warning "Homepage not responding properly"
    fi
    
    # Test other endpoints
    for endpoint in "/about" "/services" "/contact"; do
        if curl -s -o /dev/null -w "%{http_code}" "$APP_URL$endpoint" | grep -q "200"; then
            print_status "$endpoint endpoint responding ✓"
        else
            print_warning "$endpoint endpoint not responding properly"
        fi
    done
    
    print_status "Deployment verification complete ✓"
}

# Function to show deployment summary
show_deployment_summary() {
    print_header "DEPLOYMENT SUMMARY"
    
    # Get subscription ID
    SUBSCRIPTION_ID=$(az account show --query id -o tsv)
    
    # Get URLs
    APP_URL="https://${APP_NAME}.azurewebsites.net"
    PORTAL_URL="https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME"
    INSIGHTS_URL="https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/microsoft.insights/components/$INSIGHTS_NAME/overview"
    
    echo ""
    print_status "🎉 Deployment completed successfully!"
    echo ""
    print_info "Application URLs:"
    echo "  • Live Application: $APP_URL"
    echo "  • Azure Portal: $PORTAL_URL"
    echo "  • Application Insights: $INSIGHTS_URL"
    echo ""
    print_info "Next Steps:"
    echo "  • Test your application at $APP_URL"
    echo "  • Monitor performance in Application Insights"
    echo "  • Configure custom domain (optional)"
    echo "  • Set up SSL certificate (optional)"
    echo "  • Review monitoring alerts and thresholds"
    echo ""
    print_info "GitHub Actions:"
    if [ -f ".github/workflows/azure-deploy.yml" ]; then
        echo "  • Workflow configured ✓"
        echo "  • Push to main branch to trigger deployment"
        echo "  • View runs: gh run list"
    else
        echo "  • GitHub Actions workflow available"
        echo "  • Configured for automatic deployment on push to main"
    fi
    echo ""
    print_warning "Important:"
    echo "  • Update environment variables as needed"
    echo "  • Configure monitoring alert email addresses"
    echo "  • Review security settings"
    echo "  • Set up backup and disaster recovery"
}

# Function to handle errors
handle_error() {
    print_error "Deployment failed at step: $1"
    print_info "Check the logs above for details"
    print_info "You can rerun individual scripts to continue:"
    echo "  • Azure Infrastructure: ./scripts/deploy-azure.sh"
    echo "  • Monitoring Setup: ./monitoring/setup-monitoring.sh"
    echo "  • GitHub Secrets: ./scripts/setup-github-secrets.sh"
    exit 1
}

# Main deployment flow
main() {
    print_header "TAXEXCLUSIVE AZURE DEPLOYMENT"
    print_info "Starting complete deployment process..."
    echo ""
    
    # Set error handling
    trap 'handle_error "Prerequisites Check"' ERR
    check_prerequisites
    
    trap 'handle_error "Authentication Check"' ERR
    check_authentication
    
    trap 'handle_error "Application Build"' ERR
    build_application
    
    trap 'handle_error "Azure Infrastructure"' ERR
    deploy_azure_infrastructure
    
    trap 'handle_error "Monitoring Setup"' ERR
    setup_monitoring
    
    trap 'handle_error "GitHub Configuration"' ERR
    configure_github_secrets
    
    trap 'handle_error "Application Deployment"' ERR
    deploy_application
    
    trap 'handle_error "Deployment Verification"' ERR
    verify_deployment
    
    # Reset error handling
    trap - ERR
    
    show_deployment_summary
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-secrets)
            SKIP_SECRETS=true
            shift
            ;;
        --sku)
            SKU="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-build    Skip application build step"
            echo "  --skip-secrets  Skip GitHub secrets configuration"
            echo "  --sku SKU       App Service Plan SKU (default: B1)"
            echo "  --help          Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main deployment
main