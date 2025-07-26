#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TaxExclusiveStack } from '../lib/taxexclusive-stack';

const app = new cdk.App();

const environment = app.node.tryGetContext('environment') || 'production';
const domainName = app.node.tryGetContext('domainName');
const certificateArn = app.node.tryGetContext('certificateArn');

new TaxExclusiveStack(app, 'TaxExclusiveStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  environment,
  domainName,
  certificateArn,
  description: `TaxExclusive ${environment} Infrastructure`,
});