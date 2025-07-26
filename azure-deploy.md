# Azure App Service Deployment Guide for TaxExclusive

## Prerequisites

- Azure CLI installed locally
- Azure subscription with appropriate permissions
- Resource group "taxclusive" already created

## Deployment Steps

### 1. Install Dependencies and Build

```bash
pnpm install
pnpm run build
```

### 2. Create Azure App Service

```bash
# Create App Service Plan (Linux)
az appservice plan create \
  --name taxexclusive-plan \
  --resource-group taxclusive \
  --sku B1 \
  --is-linux

# Create Web App (Node.js 20 LTS)
az webapp create \
  --resource-group taxclusive \
  --plan taxexclusive-plan \
  --name taxexclusive-app \
  --runtime "NODE:20-lts"
```

### 3. Configure Application Settings

```bash
# Set Node.js version
az webapp config appsettings set \
  --resource-group taxclusive \
  --name taxexclusive-app \
  --settings WEBSITE_NODE_DEFAULT_VERSION="~20"

# Set environment variables
az webapp config appsettings set \
  --resource-group taxclusive \
  --name taxexclusive-app \
  --settings \
    NEXT_PUBLIC_STRAPI_URL="your-strapi-url" \
    AZURE_COMMUNICATION_CONNECTION_STRING="your-connection-string" \
    AZURE_COMMUNICATION_SENDER_ADDRESS="your-email@domain.com" \
    NODE_ENV="production" \
    PORT="8080"

# Configure startup command
az webapp config set \
  --resource-group taxclusive \
  --name taxexclusive-app \
  --startup-file "npm run start:azure"
```

### 4. Deploy Using Git

```bash
# Configure deployment credentials
az webapp deployment user set \
  --user-name <deployment-username> \
  --password <deployment-password>

# Get deployment URL
az webapp deployment source config-local-git \
  --name taxexclusive-app \
  --resource-group taxclusive

# Add Azure remote
git remote add azure <deployment-url>

# Deploy
git push azure main
```

### 5. Alternative: Deploy Using ZIP

```bash
# Create deployment package
zip -r deploy.zip . -x "node_modules/*" ".git/*" ".next/*" "*.log"

# Deploy ZIP file
az webapp deployment source config-zip \
  --resource-group taxclusive \
  --name taxexclusive-app \
  --src deploy.zip
```

## Post-Deployment Configuration

### Enable Application Insights

```bash
az monitor app-insights component create \
  --app taxexclusive-insights \
  --location "East US" \
  --resource-group taxclusive

# Connect to Web App
az webapp config appsettings set \
  --resource-group taxclusive \
  --name taxexclusive-app \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="<instrumentation-key>"
```

### Configure Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name taxexclusive-app \
  --resource-group taxclusive \
  --hostname www.yourdomain.com

# Add SSL certificate
az webapp config ssl upload \
  --name taxexclusive-app \
  --resource-group taxclusive \
  --certificate-file <path-to-pfx> \
  --certificate-password <password>
```

### Enable Auto-Scaling (Optional)

```bash
# Enable autoscale
az monitor autoscale create \
  --resource-group taxclusive \
  --resource taxexclusive-plan \
  --resource-type Microsoft.Web/serverfarms \
  --name taxexclusive-autoscale \
  --min-count 1 \
  --max-count 3 \
  --count 1

# Add CPU-based rule
az monitor autoscale rule create \
  --resource-group taxclusive \
  --autoscale-name taxexclusive-autoscale \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 1
```

## Monitoring and Logs

### View Application Logs

```bash
# Enable logging
az webapp log config \
  --name taxexclusive-app \
  --resource-group taxclusive \
  --application-logging filesystem \
  --level information

# Stream logs
az webapp log tail \
  --name taxexclusive-app \
  --resource-group taxclusive
```

### Access Kudu Console

Visit: `https://taxexclusive-app.scm.azurewebsites.net`

## Troubleshooting

### Common Issues

1. **Application not starting**
   - Check logs: `az webapp log tail --name taxexclusive-app --resource-group taxclusive`
   - Verify Node.js version: Should be 20.x
   - Check startup command is set to `npm run start:azure`

2. **Environment variables not working**
   - Verify settings: `az webapp config appsettings list --name taxexclusive-app --resource-group taxclusive`
   - Restart app: `az webapp restart --name taxexclusive-app --resource-group taxclusive`

3. **Build failures**
   - Ensure all dependencies are in package.json
   - Check Oryx build logs in Kudu console
   - Verify `out` directory is created after build

## CI/CD with GitHub Actions (Optional)

Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure Web App

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20.x"

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm run build

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: "taxexclusive-app"
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: .
```

Get publish profile:

```bash
az webapp deployment list-publishing-profiles \
  --name taxexclusive-app \
  --resource-group taxclusive \
  --xml
```

Add the XML content as a GitHub secret named `AZURE_WEBAPP_PUBLISH_PROFILE`.
