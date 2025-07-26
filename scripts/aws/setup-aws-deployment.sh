#!/bin/bash

# AWS Deployment Setup Script for Taxclusive Next.js Application
# This script sets up the complete AWS infrastructure and deployment pipeline

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-staging}
AWS_REGION=${2:-us-east-1}
DOMAIN_NAME=${3:-taxclusive.com}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
    exit 1
fi

echo -e "${BLUE}Setting up AWS deployment for Taxclusive Next.js application${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}AWS Region: ${AWS_REGION}${NC}"
echo -e "${BLUE}Domain: ${DOMAIN_NAME}${NC}"
echo ""

# Function to check if AWS CLI is installed and configured
check_aws_cli() {
    echo -e "${YELLOW}Checking AWS CLI configuration...${NC}"
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
        echo "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}AWS CLI is not configured. Please run 'aws configure' first.${NC}"
        exit 1
    fi
    
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}AWS CLI configured for account: ${AWS_ACCOUNT_ID}${NC}"
}

# Function to check if CDK is installed
check_cdk() {
    echo -e "${YELLOW}Checking AWS CDK...${NC}"
    
    if ! command -v cdk &> /dev/null; then
        echo -e "${YELLOW}AWS CDK not found. Installing...${NC}"
        npm install -g aws-cdk@latest
    fi
    
    CDK_VERSION=$(cdk --version)
    echo -e "${GREEN}CDK Version: ${CDK_VERSION}${NC}"
}

# Function to bootstrap CDK
bootstrap_cdk() {
    echo -e "${YELLOW}Bootstrapping AWS CDK...${NC}"
    
    cd infrastructure
    cdk bootstrap aws://${AWS_ACCOUNT_ID}/${AWS_REGION} \
        --context environment=${ENVIRONMENT}
    cd ..
    
    echo -e "${GREEN}CDK bootstrap completed${NC}"
}

# Function to create S3 bucket for deployments
create_deployment_bucket() {
    local bucket_name="taxclusive-deployments-${ENVIRONMENT}-${AWS_ACCOUNT_ID}"
    
    echo -e "${YELLOW}Creating S3 deployment bucket: ${bucket_name}${NC}"
    
    # Check if bucket exists
    if aws s3api head-bucket --bucket "${bucket_name}" 2>/dev/null; then
        echo -e "${GREEN}Bucket ${bucket_name} already exists${NC}"
    else
        # Create bucket
        if [[ "${AWS_REGION}" == "us-east-1" ]]; then
            aws s3api create-bucket --bucket "${bucket_name}"
        else
            aws s3api create-bucket \
                --bucket "${bucket_name}" \
                --create-bucket-configuration LocationConstraint=${AWS_REGION}
        fi
        
        # Enable versioning
        aws s3api put-bucket-versioning \
            --bucket "${bucket_name}" \
            --versioning-configuration Status=Enabled
        
        # Block public access
        aws s3api put-public-access-block \
            --bucket "${bucket_name}" \
            --public-access-block-configuration \
            BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
        
        echo -e "${GREEN}Created and configured S3 bucket: ${bucket_name}${NC}"
    fi
}

# Function to set up SSL certificate
setup_ssl_certificate() {
    echo -e "${YELLOW}Setting up SSL certificate...${NC}"
    
    local cert_domain
    if [[ "${ENVIRONMENT}" == "production" ]]; then
        cert_domain="*.${DOMAIN_NAME}"
    else
        cert_domain="*.${ENVIRONMENT}.${DOMAIN_NAME}"
    fi
    
    # Check for existing certificate
    local cert_arn=$(aws acm list-certificates \
        --region us-east-1 \
        --query "CertificateSummaryList[?DomainName=='${cert_domain}'].CertificateArn" \
        --output text)
    
    if [[ -n "${cert_arn}" && "${cert_arn}" != "None" ]]; then
        echo -e "${GREEN}Found existing SSL certificate: ${cert_arn}${NC}"
        echo "CERTIFICATE_ARN=${cert_arn}" >> .env.${ENVIRONMENT}
    else
        echo -e "${YELLOW}No SSL certificate found for ${cert_domain}${NC}"
        echo -e "${YELLOW}Please create an SSL certificate in AWS Certificate Manager (us-east-1)${NC}"
        echo -e "${YELLOW}Domain: ${cert_domain}${NC}"
        echo ""
        echo "You can create it using:"
        echo "aws acm request-certificate --domain-name ${cert_domain} --validation-method DNS --region us-east-1"
        echo ""
        echo -e "${YELLOW}After creating the certificate, update the CERTIFICATE_ARN in your environment configuration.${NC}"
    fi
}

# Function to set up Route53 hosted zone
setup_route53() {
    echo -e "${YELLOW}Checking Route53 hosted zone...${NC}"
    
    local zone_id=$(aws route53 list-hosted-zones-by-name \
        --dns-name "${DOMAIN_NAME}" \
        --query "HostedZones[?Name=='${DOMAIN_NAME}.'].Id" \
        --output text | cut -d'/' -f3)
    
    if [[ -n "${zone_id}" && "${zone_id}" != "None" ]]; then
        echo -e "${GREEN}Found Route53 hosted zone: ${zone_id}${NC}"
    else
        echo -e "${YELLOW}No Route53 hosted zone found for ${DOMAIN_NAME}${NC}"
        echo -e "${YELLOW}Please create a hosted zone in Route53 or update your domain's nameservers${NC}"
    fi
}

# Function to set up SSM parameters
setup_ssm_parameters() {
    echo -e "${YELLOW}Setting up SSM parameters...${NC}"
    
    # Check if parameters setup script exists
    if [[ -f "scripts/aws/setup-ssm-parameters.sh" ]]; then
        chmod +x scripts/aws/setup-ssm-parameters.sh
        ./scripts/aws/setup-ssm-parameters.sh ${ENVIRONMENT}
    else
        echo -e "${YELLOW}SSM parameters script not found. Please run it manually.${NC}"
    fi
}

# Function to install infrastructure dependencies
install_infrastructure_deps() {
    echo -e "${YELLOW}Installing infrastructure dependencies...${NC}"
    
    cd infrastructure
    npm install
    npm run build
    cd ..
    
    echo -e "${GREEN}Infrastructure dependencies installed${NC}"
}

# Function to deploy infrastructure
deploy_infrastructure() {
    echo -e "${YELLOW}Deploying infrastructure...${NC}"
    
    cd infrastructure
    
    # Deploy with context
    cdk deploy --all --require-approval=never \
        --context environment=${ENVIRONMENT} \
        --context domainName=${DOMAIN_NAME} \
        --outputs-file cdk-outputs.json
    
    cd ..
    
    echo -e "${GREEN}Infrastructure deployment completed${NC}"
}

# Function to create GitHub environment file
create_github_env_file() {
    echo -e "${YELLOW}Creating GitHub environment configuration...${NC}"
    
    local env_file=".github/environments/${ENVIRONMENT}.env"
    mkdir -p .github/environments
    
    cat > "${env_file}" << EOF
# GitHub Environment Variables for ${ENVIRONMENT}
# Set these in GitHub Settings -> Environments -> ${ENVIRONMENT}

# AWS Configuration
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}
AWS_REGION=${AWS_REGION}

# Domain Configuration
DOMAIN_NAME=${DOMAIN_NAME}
NEXT_PUBLIC_BASE_URL=https://${ENVIRONMENT == "production" && echo "www." || echo "${ENVIRONMENT}."}${DOMAIN_NAME}

# S3 Configuration
S3_DEPLOYMENT_BUCKET=taxclusive-deployments-${ENVIRONMENT}-${AWS_ACCOUNT_ID}

# Add these secrets manually in GitHub:
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - SSL_CERTIFICATE_ARN
# - EMAIL_SENDER_ADDRESS
# - EMAIL_RECIPIENT_ADDRESS
# - STRAPI_API_URL
# - STRAPI_API_TOKEN
# - GOOGLE_ANALYTICS_ID
# - CSRF_SECRET
EOF

    echo -e "${GREEN}Created GitHub environment file: ${env_file}${NC}"
}

# Function to run post-deployment tests
run_post_deployment_tests() {
    echo -e "${YELLOW}Running post-deployment tests...${NC}"
    
    # Check if test script exists
    if [[ -f "scripts/aws/test-deployment.sh" ]]; then
        chmod +x scripts/aws/test-deployment.sh
        ./scripts/aws/test-deployment.sh ${ENVIRONMENT}
    else
        echo -e "${YELLOW}Deployment test script not found${NC}"
    fi
}

# Function to display next steps
display_next_steps() {
    echo ""
    echo -e "${GREEN}=== AWS Deployment Setup Complete ===${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo ""
    
    if [[ "${ENVIRONMENT}" == "production" ]]; then
        echo -e "${YELLOW}1. Production Environment Setup:${NC}"
        echo "   - Verify SSL certificate in AWS Certificate Manager"
        echo "   - Update DNS records to point to AWS nameservers"
        echo "   - Request to move out of SES sandbox for production email"
    else
        echo -e "${YELLOW}1. Staging Environment Setup:${NC}"
        echo "   - SSL certificate and DNS setup is optional for staging"
        echo "   - Staging can use AWS-provided CloudFront domain"
    fi
    
    echo ""
    echo -e "${YELLOW}2. GitHub Configuration:${NC}"
    echo "   - Go to GitHub Settings -> Environments"
    echo "   - Create '${ENVIRONMENT}' environment"
    echo "   - Add the secrets listed in .github/environments/${ENVIRONMENT}.env"
    echo "   - Configure protection rules as needed"
    echo ""
    
    echo -e "${YELLOW}3. Deployment:${NC}"
    echo "   - Push code to trigger GitHub Actions workflow"
    echo "   - Monitor deployment in GitHub Actions tab"
    echo "   - Check CloudWatch logs for any issues"
    echo ""
    
    echo -e "${YELLOW}4. Monitoring:${NC}"
    echo "   - Access CloudWatch dashboard for monitoring"
    echo "   - Set up SNS subscriptions for alerts"
    echo "   - Review and adjust alarm thresholds"
    echo ""
    
    echo -e "${YELLOW}5. Testing:${NC}"
    echo "   - Run smoke tests against deployed application"
    echo "   - Test form submissions and email functionality"
    echo "   - Verify SSL certificate and security headers"
    echo ""
    
    if [[ -f "infrastructure/cdk-outputs.json" ]]; then
        echo -e "${BLUE}Deployment Outputs:${NC}"
        cat infrastructure/cdk-outputs.json | jq '.'
    fi
}

# Main execution
main() {
    echo -e "${BLUE}Starting AWS deployment setup for Taxclusive...${NC}"
    echo ""
    
    check_aws_cli
    check_cdk
    create_deployment_bucket
    setup_ssl_certificate
    setup_route53
    install_infrastructure_deps
    bootstrap_cdk
    setup_ssm_parameters
    deploy_infrastructure
    create_github_env_file
    run_post_deployment_tests
    display_next_steps
    
    echo ""
    echo -e "${GREEN}AWS deployment setup completed successfully!${NC}"
}

# Run main function
main "$@"