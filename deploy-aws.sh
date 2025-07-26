#!/bin/bash

# AWS CDK Infrastructure Deployment Script
# Minimal script for deploying Taxclusive infrastructure

set -e

# Environment variables
export AWS_DEFAULT_REGION=${AWS_REGION:-us-east-1}
export ENVIRONMENT=${ENVIRONMENT:-production}

echo "🚀 Starting AWS CDK deployment..."
echo "📋 Environment: $ENVIRONMENT"
echo "🌍 Region: $AWS_DEFAULT_REGION"

# Check AWS CLI configuration
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Run 'aws configure' first"
    exit 1
fi

echo "✅ AWS credentials validated"

# Navigate to infrastructure directory
cd infrastructure

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Bootstrap CDK (if needed)
echo "🏗️  Bootstrapping CDK..."
npx cdk bootstrap aws://$(aws sts get-caller-identity --query Account --output text)/$AWS_DEFAULT_REGION || true

# Deploy CDK stack
echo "🚀 Deploying infrastructure..."
npx cdk deploy TaxclusiveCdkStack \
    --require-approval never \
    --context environment=$ENVIRONMENT \
    --context domainName=${DOMAIN_NAME:-taxclusive.com}

echo "✅ Deployment completed!"