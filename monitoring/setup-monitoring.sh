#!/bin/bash

# Enhanced Application Insights and Monitoring Setup
# This script creates comprehensive monitoring for the TaxExclusive application

set -e

# Configuration
RESOURCE_GROUP="taxclusive"
LOCATION="eastus"
APP_NAME="taxexclusive-app"
INSIGHTS_NAME="taxexclusive-insights"
WORKSPACE_NAME="taxexclusive-workspace"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

print_status "Setting up comprehensive monitoring for TaxExclusive application..."

# Create custom dashboard
print_status "Creating Application Insights dashboard..."
cat > dashboard.json << 'EOF'
{
  "properties": {
    "lenses": {
      "0": {
        "order": 0,
        "parts": {
          "0": {
            "position": {"x": 0, "y": 0, "colSpan": 6, "rowSpan": 4},
            "metadata": {
              "inputs": [
                {
                  "name": "resourceTypeMode",
                  "isOptional": true
                },
                {
                  "name": "ComponentId",
                  "value": {
                    "SubscriptionId": "'$SUBSCRIPTION_ID'",
                    "ResourceGroup": "'$RESOURCE_GROUP'",
                    "Name": "'$INSIGHTS_NAME'"
                  }
                }
              ],
              "type": "Extension/AppInsightsExtension/PartType/AppMapGalPt"
            }
          },
          "1": {
            "position": {"x": 6, "y": 0, "colSpan": 6, "rowSpan": 4},
            "metadata": {
              "inputs": [
                {
                  "name": "options",
                  "value": {
                    "chart": {
                      "metrics": [
                        {
                          "resourceMetadata": {
                            "id": "/subscriptions/'$SUBSCRIPTION_ID'/resourceGroups/'$RESOURCE_GROUP'/providers/microsoft.insights/components/'$INSIGHTS_NAME'"
                          },
                          "name": "requests/count",
                          "aggregationType": 7,
                          "namespace": "microsoft.insights/components",
                          "metricVisualization": {
                            "displayName": "Server requests"
                          }
                        }
                      ],
                      "title": "Request Rate",
                      "titleKind": 1,
                      "visualization": {
                        "chartType": 2
                      }
                    }
                  }
                }
              ],
              "type": "Extension/HubsExtension/PartType/MonitorChartPart"
            }
          }
        }
      }
    },
    "metadata": {
      "model": {
        "timeRange": {
          "value": {
            "relative": {
              "duration": 24,
              "timeUnit": 1
            }
          },
          "type": "MsPortalFx.Composition.Configuration.ValueTypes.TimeRange"
        }
      }
    }
  },
  "name": "TaxExclusive Application Dashboard",
  "type": "Microsoft.Portal/dashboards",
  "location": "INSERT LOCATION",
  "tags": {
    "hidden-title": "TaxExclusive Application Dashboard"
  }
}
EOF

# Create the dashboard
az portal dashboard create \
  --resource-group $RESOURCE_GROUP \
  --name "taxexclusive-dashboard" \
  --input-path dashboard.json \
  --location $LOCATION

# Setup availability tests
print_status "Creating availability tests..."
az monitor app-insights web-test create \
  --resource-group $RESOURCE_GROUP \
  --app-insights $INSIGHTS_NAME \
  --web-test-name "${APP_NAME}-homepage-test" \
  --enabled true \
  --frequency 300 \
  --timeout 120 \
  --web-test-kind ping \
  --synthetic-monitor-id "${APP_NAME}-homepage" \
  --locations "emea-nl-ams-azr" "us-fl-mia-edge" "apac-sg-sin-azr" \
  --defined-web-test-name "${APP_NAME} Homepage Test" \
  --http-verb GET \
  --url "https://${APP_NAME}.azurewebsites.net"

# Create multi-step availability test for critical user flows
cat > availability-test.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<WebTest Name="TaxExclusive User Flow Test" Id="12345678-1234-1234-1234-123456789012" Enabled="True" CssProjectStructure="" CssIteration="" Timeout="120" WorkItemIds="" xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010" Description="" CredentialUserName="" CredentialPassword="" PreAuthenticate="True" Proxy="default" StopOnError="False" RecordedResultFile="" ResultsLocale="">
  <Items>
    <Request Method="GET" Guid="a5f10126-e4cd-570d-961c-cea43999a200" Version="1.1" Url="https://taxexclusive-app.azurewebsites.net" ThinkTime="0" Timeout="120" ParseDependentRequests="True" FollowRedirects="True" RecordResult="True" Cache="False" ResponseTimeGoal="0" Encoding="utf-8" ExpectedHttpStatusCode="200" ExpectedResponseUrl="" ReportingName="" IgnoreHttpStatusCode="False" />
    <Request Method="GET" Guid="a5f10126-e4cd-570d-961c-cea43999a201" Version="1.1" Url="https://taxexclusive-app.azurewebsites.net/services" ThinkTime="2" Timeout="120" ParseDependentRequests="True" FollowRedirects="True" RecordResult="True" Cache="False" ResponseTimeGoal="0" Encoding="utf-8" ExpectedHttpStatusCode="200" ExpectedResponseUrl="" ReportingName="" IgnoreHttpStatusCode="False" />
    <Request Method="GET" Guid="a5f10126-e4cd-570d-961c-cea43999a202" Version="1.1" Url="https://taxexclusive-app.azurewebsites.net/contact" ThinkTime="2" Timeout="120" ParseDependentRequests="True" FollowRedirects="True" RecordResult="True" Cache="False" ResponseTimeGoal="0" Encoding="utf-8" ExpectedHttpStatusCode="200" ExpectedResponseUrl="" ReportingName="" IgnoreHttpStatusCode="False" />
  </Items>
</WebTest>
EOF

# Setup workbooks for custom monitoring
print_status "Creating custom workbook..."
cat > workbook.json << 'EOF'
{
  "version": "Notebook/1.0",
  "items": [
    {
      "type": 1,
      "content": {
        "json": "# TaxExclusive Application Monitoring\n\nThis workbook provides comprehensive monitoring for the TaxExclusive application including performance metrics, user analytics, and business insights."
      },
      "name": "text - 0"
    },
    {
      "type": 3,
      "content": {
        "version": "KqlItem/1.0",
        "query": "requests\n| where timestamp > ago(24h)\n| summarize count() by bin(timestamp, 1h)\n| render timechart",
        "size": 0,
        "title": "Request Volume (24h)",
        "queryType": 0,
        "resourceType": "microsoft.insights/components"
      },
      "name": "query - 1"
    },
    {
      "type": 3,
      "content": {
        "version": "KqlItem/1.0",
        "query": "requests\n| where timestamp > ago(24h)\n| summarize avg(duration) by bin(timestamp, 1h)\n| render timechart",
        "size": 0,
        "title": "Average Response Time (24h)",
        "queryType": 0,
        "resourceType": "microsoft.insights/components"
      },
      "name": "query - 2"
    },
    {
      "type": 3,
      "content": {
        "version": "KqlItem/1.0",
        "query": "pageViews\n| where timestamp > ago(24h)\n| summarize count() by name\n| top 10 by count_\n| render barchart",
        "size": 0,
        "title": "Top 10 Pages (24h)",
        "queryType": 0,
        "resourceType": "microsoft.insights/components"
      },
      "name": "query - 3"
    }
  ],
  "fallbackResourceIds": [
    "/subscriptions/'$SUBSCRIPTION_ID'/resourceGroups/'$RESOURCE_GROUP'/providers/microsoft.insights/components/'$INSIGHTS_NAME'"
  ]
}
EOF

# Create workbook
az monitor app-insights workbook create \
  --resource-group $RESOURCE_GROUP \
  --name "taxexclusive-workbook" \
  --display-name "TaxExclusive Monitoring Workbook" \
  --source-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/microsoft.insights/components/$INSIGHTS_NAME" \
  --serialized-data "$(cat workbook.json)"

# Setup smart detection rules
print_status "Configuring smart detection..."
az monitor app-insights component smart-detection update \
  --app $INSIGHTS_NAME \
  --resource-group $RESOURCE_GROUP \
  --enabled true

# Create action group with multiple notification channels
print_status "Creating comprehensive action group..."
az monitor action-group create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-comprehensive-alerts" \
  --short-name "txcomp" \
  --email-receiver name="DevOps Team" email="devops@taxexclusive.com" \
  --sms-receiver name="On-Call" phone-number="+1234567890" country-code="1" \
  --webhook-receiver name="Slack Webhook" uri="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

# Business metrics alerts
print_status "Creating business metrics alerts..."

# Contact form submission failures
az monitor scheduled-query create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-contact-form-failures" \
  --description "Alert when contact form submissions fail" \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/microsoft.insights/components/$INSIGHTS_NAME" \
  --condition-query "requests | where name contains 'contact' and success == false | summarize count()" \
  --condition-operator "GreaterThan" \
  --condition-threshold 5 \
  --condition-time-aggregation "Count" \
  --evaluation-frequency "PT5M" \
  --window-size "PT15M" \
  --severity 2 \
  --action-group "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Insights/actionGroups/${APP_NAME}-comprehensive-alerts"

# Low traffic alert (potential issues)
az monitor scheduled-query create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-low-traffic" \
  --description "Alert when traffic drops significantly" \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/microsoft.insights/components/$INSIGHTS_NAME" \
  --condition-query "requests | where timestamp > ago(1h) | summarize count()" \
  --condition-operator "LessThan" \
  --condition-threshold 10 \
  --condition-time-aggregation "Count" \
  --evaluation-frequency "PT15M" \
  --window-size "PT1H" \
  --severity 3 \
  --action-group "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Insights/actionGroups/${APP_NAME}-comprehensive-alerts"

# Setup log retention policies
print_status "Configuring log retention..."
az monitor log-analytics workspace update \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $WORKSPACE_NAME \
  --retention-time 90

# Create custom metrics
print_status "Setting up custom metrics tracking..."
cat > custom-metrics.kql << 'EOF'
// Business Metrics Queries
// Save these as functions in Log Analytics

// Function: UserEngagementMetrics
requests
| join kind=inner (pageViews) on operation_Id
| summarize 
    UniqueUsers = dcount(user_Id),
    TotalSessions = dcount(session_Id),
    AvgSessionDuration = avg(session_Id),
    PageViewsPerSession = count() / dcount(session_Id)
by bin(timestamp, 1d)

// Function: ConversionFunnel
pageViews
| where name in ("Home", "Services", "Contact", "Appointment")
| summarize count() by name, bin(timestamp, 1d)
| evaluate pivot(name, count_)

// Function: GeographicDistribution
pageViews
| extend Country = client_CountryOrRegion
| where isnotempty(Country)
| summarize count() by Country, bin(timestamp, 1d)
| top 10 by count_
EOF

print_status "Custom monitoring setup complete!"
print_status "Dashboard URL: https://portal.azure.com/#@/dashboard/arm/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Portal/dashboards/taxexclusive-dashboard"
print_status "Application Insights URL: https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/microsoft.insights/components/$INSIGHTS_NAME/overview"

# Cleanup temporary files
rm -f dashboard.json workbook.json availability-test.xml

print_status "Monitoring setup completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Configure notification email addresses in the action group"
echo "2. Set up Slack webhook URL for notifications"
echo "3. Customize alert thresholds based on your requirements"
echo "4. Import the custom KQL queries into Log Analytics"
echo "5. Schedule regular review of monitoring data"