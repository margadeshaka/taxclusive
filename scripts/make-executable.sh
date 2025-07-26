#!/bin/bash

# Make all AWS deployment scripts executable
# This script should be run once after cloning the repository

echo "Making AWS deployment scripts executable..."

# AWS deployment scripts
chmod +x scripts/aws/setup-aws-deployment.sh
chmod +x scripts/aws/setup-ssm-parameters.sh  
chmod +x scripts/aws/test-deployment.sh

# Other deployment scripts
chmod +x scripts/setup-github-secrets.sh
chmod +x scripts/check-ses-status.sh
chmod +x scripts/setup-aws-ses.sh

echo "✅ All deployment scripts are now executable"
echo ""
echo "Available AWS deployment commands:"
echo "  ./scripts/aws/setup-aws-deployment.sh staging"
echo "  ./scripts/aws/setup-aws-deployment.sh production" 
echo "  ./scripts/aws/setup-ssm-parameters.sh staging"
echo "  ./scripts/aws/test-deployment.sh staging"
echo ""
echo "Run ./scripts/aws/setup-aws-deployment.sh --help for more information"