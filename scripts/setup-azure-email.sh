#!/bin/bash

# Azure Communication Services Email Setup Script for Taxclusive CA Firm
# This script sets up Azure Communication Services for email functionality

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration variables
RESOURCE_GROUP_NAME="taxclusive"
LOCATION="centralindia"  # Best location for Delhi NCR region
ACS_NAME="taxclusive-communication"
EMAIL_SERVICE_NAME="taxclusive-email-service"
DOMAIN_NAME="taxclusive.com"
SUBSCRIPTION_ID=""  # Will be populated during script execution

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Azure CLI is installed
check_azure_cli() {
    print_status "Checking if Azure CLI is installed..."
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed. Please install it first:"
        echo "  macOS: brew install azure-cli"
        echo "  Ubuntu: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
        echo "  Windows: https://aka.ms/installazurecliwindows"
        exit 1
    fi
    print_success "Azure CLI is installed"
}

# Function to login to Azure
azure_login() {
    print_status "Checking Azure authentication..."
    if ! az account show &> /dev/null; then
        print_status "Please log in to Azure CLI:"
        az login
    fi
    
    # Get subscription ID
    SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    print_success "Logged in to Azure (Subscription: $SUBSCRIPTION_ID)"
}

# Function to create resource group
create_resource_group() {
    print_status "Creating resource group: $RESOURCE_GROUP_NAME"
    
    if az group show --name "$RESOURCE_GROUP_NAME" &> /dev/null; then
        print_warning "Resource group $RESOURCE_GROUP_NAME already exists"
    else
        az group create \
            --name "$RESOURCE_GROUP_NAME" \
            --location "$LOCATION" \
            --tags \
                "Environment=Production" \
                "Project=Taxclusive" \
                "Purpose=Email Communications"
        print_success "Resource group created successfully"
    fi
}

# Function to create Azure Communication Services resource
create_acs_resource() {
    print_status "Creating Azure Communication Services resource: $ACS_NAME"
    
    # Check if ACS resource exists
    if az communication show --name "$ACS_NAME" --resource-group "$RESOURCE_GROUP_NAME" &> /dev/null; then
        print_warning "ACS resource $ACS_NAME already exists"
    else
        az communication create \
            --name "$ACS_NAME" \
            --resource-group "$RESOURCE_GROUP_NAME" \
            --location "Global" \
            --data-location "India"
        print_success "Azure Communication Services resource created successfully"
    fi
}

# Function to create Email Communication Service
create_email_service() {
    print_status "Creating Email Communication Service: $EMAIL_SERVICE_NAME"
    
    # Check if email service exists
    if az communication email show --name "$EMAIL_SERVICE_NAME" --resource-group "$RESOURCE_GROUP_NAME" &> /dev/null; then
        print_warning "Email service $EMAIL_SERVICE_NAME already exists"
    else
        az communication email create \
            --name "$EMAIL_SERVICE_NAME" \
            --resource-group "$RESOURCE_GROUP_NAME" \
            --location "Global" \
            --data-location "India"
        print_success "Email Communication Service created successfully"
    fi
}

# Function to link ACS with Email Service
link_email_service() {
    print_status "Linking Email Service to ACS resource..."
    
    # Get email service resource ID
    EMAIL_SERVICE_ID=$(az communication email show \
        --name "$EMAIL_SERVICE_NAME" \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --query id --output tsv)
    
    az communication email domain create \
        --name "AzureManagedDomain" \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --email-service-name "$EMAIL_SERVICE_NAME" \
        --domain-management "AzureManaged"
    
    print_success "Email service linked successfully"
}

# Function to get connection string
get_connection_string() {
    print_status "Retrieving connection string..."
    
    CONNECTION_STRING=$(az communication list-key \
        --name "$ACS_NAME" \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --query primaryConnectionString --output tsv)
    
    print_success "Connection string retrieved successfully"
    echo ""
    echo "=================================================="
    echo "AZURE COMMUNICATION SERVICES SETUP COMPLETE"
    echo "=================================================="
    echo ""
    echo "Add the following environment variables to your .env.local file:"
    echo ""
    echo "AZURE_COMMUNICATION_CONNECTION_STRING=\"$CONNECTION_STRING\""
    echo "EMAIL_SENDER_NAME=\"Taxclusive\""
    echo "EMAIL_RECIPIENT_ADDRESS=\"contact@taxclusive.com\""
    echo "EMAIL_RECIPIENT_NAME=\"Taxclusive Support\""
    echo ""
    
    # Get the sender email from Azure managed domain
    SENDER_EMAIL=$(az communication email domain show \
        --name "AzureManagedDomain" \
        --resource-group "$RESOURCE_GROUP_NAME" \
        --email-service-name "$EMAIL_SERVICE_NAME" \
        --query fromSenderDomain --output tsv 2>/dev/null || echo "DoNotReply@<domain>.azurecomm.net")
    
    echo "EMAIL_SENDER_ADDRESS=\"DoNotReply@${SENDER_EMAIL}\""
    echo ""
    echo "=================================================="
    echo ""
    print_warning "IMPORTANT: Save these credentials securely!"
    print_warning "The sender email will be in format: DoNotReply@<random-id>.azurecomm.net"
}

# Function to create custom domain (optional)
setup_custom_domain() {
    read -p "Do you want to set up a custom domain for email? (y/N): " setup_custom
    
    if [[ $setup_custom =~ ^[Yy]$ ]]; then
        print_status "Setting up custom domain..."
        print_warning "Custom domain setup requires DNS verification."
        print_warning "You'll need to add DNS records to your domain provider."
        
        read -p "Enter your custom domain (e.g., taxclusive.com): " custom_domain
        
        if [[ -n "$custom_domain" ]]; then
            az communication email domain create \
                --name "$custom_domain" \
                --resource-group "$RESOURCE_GROUP_NAME" \
                --email-service-name "$EMAIL_SERVICE_NAME" \
                --domain-management "CustomerManaged" \
                --user-engagement-tracking "Enabled"
            
            print_success "Custom domain added. Please verify DNS records in Azure portal."
            print_warning "Email sending will only work after DNS verification is complete."
        fi
    fi
}

# Function to test email configuration
test_email_setup() {
    print_status "Testing email configuration..."
    
    # Create a simple test script
    cat > test-email.js << 'EOF'
const { EmailClient } = require("@azure/communication-email");

async function testEmail() {
    try {
        const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
        if (!connectionString) {
            console.error("Connection string not found in environment variables");
            return;
        }
        
        const client = new EmailClient(connectionString);
        
        const emailMessage = {
            senderAddress: process.env.EMAIL_SENDER_ADDRESS || "DoNotReply@<domain>.azurecomm.net",
            content: {
                subject: "Test Email from Taxclusive",
                plainText: "This is a test email to verify Azure Communication Services setup.",
                html: "<h1>Test Email</h1><p>This is a test email to verify Azure Communication Services setup.</p>"
            },
            recipients: {
                to: [{ address: process.env.EMAIL_RECIPIENT_ADDRESS || "contact@taxclusive.com" }]
            }
        };
        
        console.log("Sending test email...");
        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();
        
        console.log("Test email sent successfully!");
        console.log("Message ID:", result.id);
        console.log("Status:", result.status);
        
    } catch (error) {
        console.error("Error sending test email:", error.message);
    }
}

testEmail();
EOF

    print_success "Test script created as 'test-email.js'"
    print_status "To test the email setup:"
    echo "  1. Set the environment variables in your .env.local"
    echo "  2. Install dependencies: npm install @azure/communication-email"
    echo "  3. Run: node test-email.js"
}

# Main execution
main() {
    echo ""
    echo "=================================================="
    echo "  AZURE COMMUNICATION SERVICES EMAIL SETUP"
    echo "  for Taxclusive CA Firm"
    echo "=================================================="
    echo ""
    
    check_azure_cli
    azure_login
    create_resource_group
    create_acs_resource
    create_email_service
    link_email_service
    get_connection_string
    setup_custom_domain
    test_email_setup
    
    print_success "Azure Communication Services setup completed!"
    print_warning "Remember to update your environment variables and test the configuration."
}

# Run main function
main "$@"