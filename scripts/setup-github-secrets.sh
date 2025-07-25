#!/bin/bash

# GitHub Secrets Setup Script for Taxclusive AWS EKS Deployment
# This script helps configure GitHub secrets for automated EKS deployment
# Prerequisites: GitHub CLI (gh) installed and authenticated

set -e

# Configuration
REPO_OWNER="your-github-username"  # Update this with your GitHub username
REPO_NAME="taxexclusive"           # Update if your repo name is different

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

echo -e "${BLUE}=== Taxclusive GitHub Secrets Setup for AWS EKS ===${NC}"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI is not installed. Please install it first."
    print_info "Visit: https://cli.github.com/"
    exit 1
fi

# Check if logged into GitHub
if ! gh auth status &> /dev/null; then
    print_error "Not logged into GitHub CLI. Please run 'gh auth login' first."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found."
    print_info "Please ensure you're in the project root directory."
    exit 1
fi

# Function to set GitHub secret
set_github_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3
    
    if [ -n "$secret_value" ]; then
        print_info "Setting secret: $secret_name"
        echo "$secret_value" | gh secret set "$secret_name" --repo "$REPO_OWNER/$REPO_NAME"
        print_status "$secret_name set successfully"
        print_info "Description: $description"
    else
        print_warning "Skipping $secret_name (empty value)"
    fi
    echo ""
}

# Read values from .env.local
print_status "Reading values from .env.local..."

# Source the .env.local file to get variables
set -a  # automatically export all variables
source .env.local
set +a  # stop automatically exporting

print_status "Environment variables loaded"
echo ""

# AWS SES Configuration Secrets
print_info "=== Setting AWS SES Configuration Secrets ==="

set_github_secret "AWS_REGION" "$AWS_REGION" "AWS region for SES and EKS deployment"
set_github_secret "AWS_ACCESS_KEY_ID" "$AWS_ACCESS_KEY_ID" "AWS access key for deployment"
set_github_secret "AWS_SECRET_ACCESS_KEY" "$AWS_SECRET_ACCESS_KEY" "AWS secret key for deployment"

# Email Configuration Secrets
print_info "=== Setting Email Configuration Secrets ==="

set_github_secret "EMAIL_SENDER_NAME" "$EMAIL_SENDER_NAME" "Display name for email sender"
set_github_secret "EMAIL_SENDER_ADDRESS" "$EMAIL_SENDER_ADDRESS" "Verified sender email address"
set_github_secret "EMAIL_RECIPIENT_ADDRESS" "$EMAIL_RECIPIENT_ADDRESS" "Email address for form submissions"
set_github_secret "EMAIL_RECIPIENT_NAME" "$EMAIL_RECIPIENT_NAME" "Display name for email recipient"

# Application Configuration Secrets
print_info "=== Setting Application Configuration Secrets ==="

# For production, we'll use a different base URL
PRODUCTION_BASE_URL="https://taxclusive.com"  # Update this with your production domain
set_github_secret "NEXT_PUBLIC_BASE_URL" "$PRODUCTION_BASE_URL" "Production base URL for the application"

set_github_secret "NEXT_PUBLIC_STRAPI_URL" "$NEXT_PUBLIC_STRAPI_URL" "Strapi CMS API URL"
set_github_secret "NODE_ENV" "production" "Node.js environment for production"

# Additional secrets for EKS deployment
print_info "=== Setting EKS Deployment Secrets ==="

# Prompt for additional EKS-specific secrets
read -p "Enter your EKS cluster name (default: taxclusive-cluster): " EKS_CLUSTER_NAME
EKS_CLUSTER_NAME=${EKS_CLUSTER_NAME:-taxclusive-cluster}

read -p "Enter your ECR repository URI (e.g., 123456789012.dkr.ecr.us-east-1.amazonaws.com/taxclusive): " ECR_REPOSITORY

read -p "Enter your domain name (e.g., taxclusive.com): " DOMAIN_NAME
DOMAIN_NAME=${DOMAIN_NAME:-taxclusive.com}

set_github_secret "EKS_CLUSTER_NAME" "$EKS_CLUSTER_NAME" "EKS cluster name for deployment"
set_github_secret "ECR_REPOSITORY" "$ECR_REPOSITORY" "ECR repository URI for Docker images"
set_github_secret "DOMAIN_NAME" "$DOMAIN_NAME" "Production domain name"

# Optional: Set up database secrets if using RDS
echo ""
print_info "Optional: Database Configuration"
read -p "Do you want to set up database secrets? (y/N): " setup_db
if [[ $setup_db =~ ^[Yy]$ ]]; then
    read -p "Enter database host: " DB_HOST
    read -p "Enter database name: " DB_NAME
    read -p "Enter database username: " DB_USER
    read -s -p "Enter database password: " DB_PASSWORD
    echo ""
    
    set_github_secret "DB_HOST" "$DB_HOST" "Database host"
    set_github_secret "DB_NAME" "$DB_NAME" "Database name"
    set_github_secret "DB_USER" "$DB_USER" "Database username"
    set_github_secret "DB_PASSWORD" "$DB_PASSWORD" "Database password"
fi

# Summary
print_status "Setup Complete"
echo ""
print_status "GitHub secrets have been configured for your repository"
print_info "Repository: $REPO_OWNER/$REPO_NAME"
echo ""

print_info "Next Steps:"
echo "1. Verify secrets in GitHub: https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions"
echo "2. Set up AWS EKS cluster using the provided Terraform scripts"
echo "3. Create ECR repository for Docker images"
echo "4. Update DNS records to point to your EKS load balancer"
echo "5. Push code to trigger the GitHub Actions deployment workflow"
echo ""

print_status "Your repository is now ready for AWS EKS deployment!"

# Show current secrets (names only, not values)
print_info "Current GitHub Secrets:"
gh secret list --repo "$REPO_OWNER/$REPO_NAME" || print_warning "Could not list secrets (this is normal)"