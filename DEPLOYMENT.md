# Azure App Service Deployment Guide - TaxExclusive

## Quick Start

To deploy your TaxExclusive application to Azure App Service with comprehensive monitoring, run:

```bash
./deploy.sh
```

This will handle the complete deployment process including infrastructure setup, monitoring configuration, and application deployment.

## Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed and logged in
- [GitHub CLI](https://cli.github.com/) installed and logged in
- [pnpm](https://pnpm.io/) installed
- Active Azure subscription
- GitHub repository for the project

## What Gets Deployed

### Azure Resources
- **Resource Group**: `taxclusive`
- **App Service Plan**: `taxexclusive-plan` (B1 SKU, Linux)
- **Web App**: `taxexclusive-app` (Node.js 20 LTS)
- **Application Insights**: `taxexclusive-insights`
- **Log Analytics Workspace**: `taxexclusive-workspace`
- **Action Groups**: For monitoring alerts
- **Availability Tests**: Multi-region uptime monitoring
- **Alerts**: CPU, Memory, HTTP errors, Response time
- **Custom Dashboard**: Performance and business metrics

### Monitoring Features
- **Application Performance Monitoring**: Request tracking, dependency monitoring, exception tracking
- **Business Metrics**: User engagement, conversion funnel, geographic distribution
- **Infrastructure Monitoring**: CPU, memory, disk usage
- **Availability Testing**: Synthetic tests from multiple regions
- **Smart Detection**: Automatic anomaly detection
- **Custom Alerts**: Configurable thresholds for various metrics
- **Log Analytics**: Centralized logging with KQL queries

### GitHub Actions
- **Automated CI/CD**: Triggers on push to main branch
- **Quality Gates**: Linting, testing, building
- **Security**: Uses service principal with least privilege access
- **Environment Variables**: Secure secret management
- **Performance Testing**: Lighthouse CI integration
- **Rollback Capability**: Easy revert to previous versions

## Deployment Options

### Option 1: One-Command Deployment (Recommended)
```bash
./deploy.sh
```

### Option 2: Step-by-Step Deployment
```bash
# 1. Deploy Azure infrastructure
./scripts/deploy-azure.sh

# 2. Setup monitoring
./monitoring/setup-monitoring.sh

# 3. Configure GitHub secrets
./scripts/setup-github-secrets.sh

# 4. Deploy application
git push azure main
```

### Option 3: GitHub Actions Deployment
```bash
# Setup secrets first
./scripts/setup-github-secrets.sh

# Then push to trigger deployment
git push origin main
```

## Configuration

### Environment Variables
Configure these in Azure App Service or GitHub Secrets:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi CMS endpoint | Yes |
| `AZURE_COMMUNICATION_CONNECTION_STRING` | Azure Communication Services | Yes |
| `AZURE_COMMUNICATION_SENDER_ADDRESS` | Email sender address | Yes |
| `APPINSIGHTS_INSTRUMENTATIONKEY` | Application Insights key | Auto-set |
| `NODE_ENV` | Environment (production) | Auto-set |
| `PORT` | Application port (8080) | Auto-set |

### Azure App Service Settings
The deployment automatically configures:
- Node.js 20 LTS runtime
- Always On enabled
- Application Insights integration
- Diagnostic logging enabled
- Health check endpoint monitoring

## Monitoring and Alerts

### Default Alerts
- **High CPU Usage**: >80% for 5 minutes
- **High Memory Usage**: >1GB for 5 minutes
- **HTTP 5xx Errors**: >10 in 5 minutes
- **Slow Response Time**: >3 seconds average
- **Low Availability**: <95% uptime

### Monitoring Dashboards
- **Azure Portal**: Complete infrastructure monitoring
- **Application Insights**: Application performance and user analytics
- **Custom Workbook**: Business metrics and KPIs
- **GitHub Actions**: Deployment status and history

### Key Metrics Tracked
- Request rate and response times
- Error rates and exception details
- User sessions and page views
- Geographic distribution
- Conversion funnel analysis
- Infrastructure resource usage

## Commands Reference

### Deployment
```bash
# Full deployment
./deploy.sh

# Skip application build
./deploy.sh --skip-build

# Skip GitHub secrets setup
./deploy.sh --skip-secrets

# Use different SKU
./deploy.sh --sku S1
```

### Monitoring
```bash
# Setup comprehensive monitoring
./monitoring/setup-monitoring.sh

# View application logs
az webapp log tail --name taxexclusive-app --resource-group taxclusive

# Stream deployment logs
az webapp log deployment show --name taxexclusive-app --resource-group taxclusive
```

### GitHub Operations
```bash
# List secrets
gh secret list

# Set a secret
gh secret set SECRET_NAME --body "value"

# View workflow runs
gh run list

# View specific run
gh run view RUN_ID --log
```

### Azure Operations
```bash
# Restart application
az webapp restart --name taxexclusive-app --resource-group taxclusive

# Scale application
az appservice plan update --name taxexclusive-plan --resource-group taxclusive --sku S1

# Update app settings
az webapp config appsettings set --resource-group taxclusive --name taxexclusive-app --settings KEY=VALUE
```

## Troubleshooting

### Common Issues

1. **Application Not Starting**
   ```bash
   # Check logs
   az webapp log tail --name taxexclusive-app --resource-group taxclusive
   
   # Verify Node.js version
   az webapp config show --name taxexclusive-app --resource-group taxclusive
   ```

2. **Build Failures**
   ```bash
   # Check build logs in Kudu
   # URL: https://taxexclusive-app.scm.azurewebsites.net
   
   # Or via Azure CLI
   az webapp deployment source show --name taxexclusive-app --resource-group taxclusive
   ```

3. **GitHub Actions Failures**
   ```bash
   # View failed run
   gh run list --status failure
   gh run view RUN_ID --log
   
   # Check secrets
   gh secret list
   ```

4. **Monitoring Issues**
   ```bash
   # Verify Application Insights
   az monitor app-insights component show --app taxexclusive-insights --resource-group taxclusive
   
   # Check alert rules
   az monitor metrics alert list --resource-group taxclusive
   ```

### Performance Optimization

1. **Enable CDN** (Optional)
   ```bash
   # Create CDN profile
   az cdn profile create --name taxexclusive-cdn --resource-group taxclusive --sku Standard_Microsoft
   
   # Create CDN endpoint
   az cdn endpoint create --name taxexclusive --profile-name taxexclusive-cdn --resource-group taxclusive --origin taxexclusive-app.azurewebsites.net
   ```

2. **Scale Up/Out**
   ```bash
   # Scale up (better hardware)
   az appservice plan update --name taxexclusive-plan --resource-group taxclusive --sku S2
   
   # Scale out (more instances)
   az appservice plan update --name taxexclusive-plan --resource-group taxclusive --number-of-workers 3
   ```

## Security Best Practices

1. **Service Principal Rotation**
   ```bash
   # Rotate credentials every 90 days
   az ad sp credential reset --id APP_ID --append
   ```

2. **Access Reviews**
   - Regularly review service principal permissions
   - Monitor access logs in Azure AD
   - Use Azure Security Center recommendations

3. **Network Security**
   - Consider VNet integration for production
   - Enable Azure DDoS protection
   - Configure Web Application Firewall

## Backup and Recovery

### Backup Configuration
```bash
# Enable backup
az webapp config backup update --resource-group taxclusive --webapp-name taxexclusive-app --backup-name daily-backup --frequency 1440 --retain-one true --retentionPeriodInDays 30
```

### Disaster Recovery
- Application source code: GitHub repository
- Configuration: Infrastructure as Code scripts
- Data: Strapi CMS backup (separate process)
- Monitoring: Configuration in scripts

## Cost Optimization

### Cost Monitoring
```bash
# View costs
az consumption usage list --billing-period-name $(az billing period list --query '[0].name' -o tsv)
```

### Cost Saving Tips
- Use B1 tier for development/staging
- Enable auto-shutdown for non-production
- Monitor and adjust retention policies
- Use Azure Cost Management alerts

## Support and Maintenance

### Regular Tasks
- [ ] Weekly: Review monitoring dashboards
- [ ] Monthly: Rotate service principal credentials
- [ ] Monthly: Review and optimize costs
- [ ] Quarterly: Update dependencies and review security
- [ ] Annually: Disaster recovery testing

### Getting Help
- Azure Support Portal for infrastructure issues
- GitHub Issues for application bugs
- Application Insights for performance troubleshooting
- Azure Cost Management for billing questions

## URLs and Access

After deployment, access your resources at:

- **Application**: https://taxexclusive-app.azurewebsites.net
- **Azure Portal**: https://portal.azure.com
- **Application Insights**: Find in Azure Portal under taxexclusive-insights
- **GitHub Actions**: https://github.com/your-username/taxexclusive/actions
- **Kudu Console**: https://taxexclusive-app.scm.azurewebsites.net