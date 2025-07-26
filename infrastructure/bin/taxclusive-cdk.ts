#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TaxclusiveCdkStack } from '../lib/taxclusive-cdk-stack';
import { TaxclusiveMonitoringStack } from '../lib/taxclusive-monitoring-stack';

const app = new cdk.App();

// Get context values
const environment = app.node.tryGetContext('environment') || 'staging';
const domainName = app.node.tryGetContext('domainName') || 'taxclusive.com';
const certificateArn = app.node.tryGetContext('certificateArn');

// Define environment-specific configurations
const envConfig = {
  staging: {
    domainName: `staging.${domainName}`,
    certificateArn: certificateArn,
    logRetentionDays: 7,
    enableXRayTracing: false,
    minCapacity: 1,
    maxCapacity: 5
  },
  production: {
    domainName: domainName,
    certificateArn: certificateArn,
    logRetentionDays: 30,
    enableXRayTracing: true,
    minCapacity: 2,
    maxCapacity: 10
  }
};

const config = envConfig[environment as keyof typeof envConfig] || envConfig.staging;

// Main infrastructure stack
const mainStack = new TaxclusiveCdkStack(app, `TaxclusiveCdkStack-${environment}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: `Taxclusive Next.js application infrastructure - ${environment}`,
  environment,
  domainName: config.domainName,
  certificateArn: config.certificateArn,
  logRetentionDays: config.logRetentionDays,
  enableXRayTracing: config.enableXRayTracing,
  minCapacity: config.minCapacity,
  maxCapacity: config.maxCapacity,
});

// Monitoring stack
const monitoringStack = new TaxclusiveMonitoringStack(app, `TaxclusiveMonitoring-${environment}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: `Taxclusive monitoring and observability - ${environment}`,
  environment,
  cloudFrontDistribution: mainStack.cloudFrontDistribution,
  lambdaFunction: mainStack.nextjsLambda,
  s3Bucket: mainStack.s3Bucket,
});

// Add dependencies
monitoringStack.addDependency(mainStack);

// Add tags to all stacks
const tags = {
  Project: 'Taxclusive',
  Environment: environment,
  ManagedBy: 'CDK',
  CostCenter: 'Engineering',
  Owner: 'DevOps'
};

Object.entries(tags).forEach(([key, value]) => {
  cdk.Tags.of(mainStack).add(key, value);
  cdk.Tags.of(monitoringStack).add(key, value);
});

app.synth();