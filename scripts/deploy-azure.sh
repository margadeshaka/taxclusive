#!/bin/bash

# Azure Deployment Script with Monitoring
# This script deploys the TaxExclusive app to Azure App Service with full monitoring setup

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="taxclusive"
LOCATION="eastus"
APP_NAME="taxexclusive-app"
PLAN_NAME="taxexclusive-plan"
INSIGHTS_NAME="taxexclusive-insights"
WORKSPACE_NAME="taxexclusive-workspace"
SKU="B1" # Basic tier, change to S1 for Standard

# Function to print colored output
print_status() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI is not installed. Please install it first."
    exit 1
fi

# Login to Azure (if not already logged in)
print_status "Checking Azure login status..."
if ! az account show &> /dev/null; then
    print_status "Please log in to Azure..."
    az login
fi

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
print_status "Using subscription: $SUBSCRIPTION_ID"

# Create resource group if it doesn't exist
print_status "Checking resource group..."
if ! az group show --name $RESOURCE_GROUP &> /dev/null; then
    print_status "Creating resource group: $RESOURCE_GROUP"
    az group create --name $RESOURCE_GROUP --location $LOCATION
else
    print_status "Resource group already exists: $RESOURCE_GROUP"
fi

# Create Log Analytics Workspace
print_status "Creating Log Analytics Workspace..."
az monitor log-analytics workspace create \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $WORKSPACE_NAME \
  --location $LOCATION \
  --retention-time 30

WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $WORKSPACE_NAME \
  --query id -o tsv)

# Create Application Insights
print_status "Creating Application Insights..."
az monitor app-insights component create \
  --app $INSIGHTS_NAME \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP \
  --application-type web \
  --kind web \
  --workspace $WORKSPACE_ID

# Get Instrumentation Key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app $INSIGHTS_NAME \
  --resource-group $RESOURCE_GROUP \
  --query instrumentationKey -o tsv)

print_status "Application Insights Instrumentation Key: $INSTRUMENTATION_KEY"

# Create App Service Plan
print_status "Creating App Service Plan..."
az appservice plan create \
  --name $PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku $SKU \
  --is-linux

# Create Web App
print_status "Creating Web App..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $PLAN_NAME \
  --name $APP_NAME \
  --runtime "NODE:20-lts"

# Configure App Settings
print_status "Configuring App Settings..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    WEBSITE_NODE_DEFAULT_VERSION="~20" \
    NODE_ENV="production" \
    PORT="8080" \
    APPINSIGHTS_INSTRUMENTATIONKEY="$INSTRUMENTATION_KEY" \
    ApplicationInsightsAgent_EXTENSION_VERSION="~3" \
    APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=$INSTRUMENTATION_KEY" \
    APPINSIGHTS_PROFILERFEATURE_VERSION="1.0.0" \
    APPINSIGHTS_SNAPSHOTFEATURE_VERSION="1.0.0"

# Configure startup command
print_status "Configuring startup command..."
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --startup-file "npm run start:azure"

# Enable Application Insights
print_status "Enabling Application Insights monitoring..."
az monitor app-insights component connect-webapp \
  --app $INSIGHTS_NAME \
  --resource-group $RESOURCE_GROUP \
  --web-app $APP_NAME

# Configure Diagnostic Settings
print_status "Configuring diagnostic settings..."
az monitor diagnostic-settings create \
  --name "${APP_NAME}-diagnostics" \
  --resource "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME" \
  --workspace $WORKSPACE_ID \
  --logs '[
    {
      "category": "AppServiceHTTPLogs",
      "enabled": true
    },
    {
      "category": "AppServiceConsoleLogs",
      "enabled": true
    },
    {
      "category": "AppServiceAppLogs",
      "enabled": true
    },
    {
      "category": "AppServiceAuditLogs",
      "enabled": true
    }
  ]' \
  --metrics '[
    {
      "category": "AllMetrics",
      "enabled": true
    }
  ]'

# Enable Always On
print_status "Enabling Always On..."
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --always-on true

# Configure Auto-scaling (for Standard tier and above)
if [ "$SKU" != "B1" ]; then
    print_status "Configuring auto-scaling..."
    az monitor autoscale create \
      --resource-group $RESOURCE_GROUP \
      --resource $PLAN_NAME \
      --resource-type Microsoft.Web/serverfarms \
      --name "${APP_NAME}-autoscale" \
      --min-count 1 \
      --max-count 3 \
      --count 1

    # CPU-based scaling rule
    az monitor autoscale rule create \
      --resource-group $RESOURCE_GROUP \
      --autoscale-name "${APP_NAME}-autoscale" \
      --condition "Percentage CPU > 70 avg 5m" \
      --scale out 1

    az monitor autoscale rule create \
      --resource-group $RESOURCE_GROUP \
      --autoscale-name "${APP_NAME}-autoscale" \
      --condition "Percentage CPU < 30 avg 5m" \
      --scale in 1
fi

# Create Action Group for Alerts
print_status "Creating action group for alerts..."
az monitor action-group create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-alerts" \
  --short-name "txalerts"

# Create Alerts
print_status "Creating monitoring alerts..."

# High CPU Alert
az monitor metrics alert create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-high-cpu" \
  --description "Alert when CPU usage is above 80%" \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME" \
  --condition "avg Percentage CPU > 80" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Insights/actionGroups/${APP_NAME}-alerts"

# High Memory Alert
az monitor metrics alert create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-high-memory" \
  --description "Alert when memory usage is above 1GB" \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME" \
  --condition "avg Memory working set > 1073741824" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Insights/actionGroups/${APP_NAME}-alerts"

# HTTP 5xx Errors Alert
az monitor metrics alert create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-http-errors" \
  --description "Alert when HTTP 5xx errors occur" \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME" \
  --condition "total Http5xx > 10" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Insights/actionGroups/${APP_NAME}-alerts"

# Response Time Alert
az monitor metrics alert create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-slow-response" \
  --description "Alert when average response time is above 3 seconds" \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME" \
  --condition "avg AverageResponseTime > 3" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Insights/actionGroups/${APP_NAME}-alerts"

# Get deployment credentials
print_status "Getting deployment credentials..."
DEPLOYMENT_URL=$(az webapp deployment source config-local-git \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query url -o tsv)

# Generate deployment information
print_status "Generating deployment information..."
cat > deployment-info.json << EOF
{
  "resourceGroup": "$RESOURCE_GROUP",
  "appName": "$APP_NAME",
  "appUrl": "https://${APP_NAME}.azurewebsites.net",
  "deploymentUrl": "$DEPLOYMENT_URL",
  "instrumentationKey": "$INSTRUMENTATION_KEY",
  "subscriptionId": "$SUBSCRIPTION_ID",
  "monitoringDashboard": "https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/microsoft.insights/components/$INSIGHTS_NAME/overview"
}
EOF

print_status "Deployment information saved to deployment-info.json"

# Configure GitHub Secrets (if in a git repository)
if [ -d .git ]; then
    print_status "Configuring GitHub secrets..."
    
    # Create Azure credentials JSON
    AZURE_CREDENTIALS=$(cat << EOF
{
  "clientId": "REPLACE_WITH_CLIENT_ID",
  "clientSecret": "REPLACE_WITH_CLIENT_SECRET",
  "subscriptionId": "$SUBSCRIPTION_ID",
  "tenantId": "REPLACE_WITH_TENANT_ID"
}
EOF
)
    
    print_warning "To complete GitHub Actions setup, run these commands:"
    echo ""
    echo "# Create a service principal for GitHub Actions:"
    echo "az ad sp create-for-rbac --name \"github-actions-taxexclusive\" --role contributor --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP --sdk-auth"
    echo ""
    echo "# Then set the following GitHub secrets:"
    echo "gh secret set AZURE_CREDENTIALS --body '<output-from-above-command>'"
    echo "gh secret set AZURE_SUBSCRIPTION_ID --body \"$SUBSCRIPTION_ID\""
    echo "gh secret set APPINSIGHTS_INSTRUMENTATIONKEY --body \"$INSTRUMENTATION_KEY\""
    echo "gh secret set NEXT_PUBLIC_STRAPI_URL --body \"your-strapi-url\""
    echo "gh secret set AZURE_COMMUNICATION_CONNECTION_STRING --body \"your-connection-string\""
    echo "gh secret set AZURE_COMMUNICATION_SENDER_ADDRESS --body \"your-email@domain.com\""
    echo "gh secret set ALERT_EMAIL --body \"alerts@yourdomain.com\""
fi

print_status "Azure deployment setup complete!"
print_status "App URL: https://${APP_NAME}.azurewebsites.net"
print_status "Monitoring Dashboard: https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/microsoft.insights/components/$INSIGHTS_NAME/overview"

# Display next steps
echo ""
print_status "Next steps:"
echo "1. Build your application: pnpm run build"
echo "2. Deploy using Git: git push azure main"
echo "3. Or deploy using GitHub Actions: git push origin main"
echo "4. Monitor your application in the Azure Portal"