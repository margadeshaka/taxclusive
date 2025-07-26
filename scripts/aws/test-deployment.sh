#!/bin/bash

# AWS Deployment Testing Script for Taxclusive
# This script tests the deployed application and infrastructure

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment parameter
ENVIRONMENT=${1:-staging}
AWS_REGION=${2:-us-east-1}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
    echo "Usage: $0 <environment> [aws-region]"
    exit 1
fi

echo -e "${BLUE}Testing AWS deployment for environment: ${ENVIRONMENT}${NC}"
echo ""

# Global variables
FAILED_TESTS=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}Test ${TOTAL_TESTS}: ${test_name}${NC}"
    
    if eval "$test_command"; then
        if [[ -n "$expected_result" ]]; then
            echo -e "${GREEN}✓ PASS: ${test_name} - ${expected_result}${NC}"
        else
            echo -e "${GREEN}✓ PASS: ${test_name}${NC}"
        fi
    else
        echo -e "${RED}✗ FAIL: ${test_name}${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

# Function to check HTTP response
check_http_response() {
    local url="$1"
    local expected_status="$2"
    local timeout="${3:-10}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" 2>/dev/null || echo "000")
    
    if [[ "$response" == "$expected_status" ]]; then
        return 0
    else
        echo "Expected status: $expected_status, Got: $response"
        return 1
    fi
}

# Function to check if URL is reachable
check_url_reachable() {
    local url="$1"
    local timeout="${2:-10}"
    
    curl -s --head --max-time "$timeout" "$url" > /dev/null 2>&1
}

# Function to check SSL certificate
check_ssl_certificate() {
    local domain="$1"
    
    echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null
}

# Function to get SSM parameter
get_ssm_parameter() {
    local param_name="$1"
    
    aws ssm get-parameter \
        --name "$param_name" \
        --region "$AWS_REGION" \
        --query "Parameter.Value" \
        --output text 2>/dev/null
}

# Function to get CloudFormation stack output
get_stack_output() {
    local stack_name="$1"
    local output_key="$2"
    
    aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --region "$AWS_REGION" \
        --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" \
        --output text 2>/dev/null
}

# Get deployment information
echo -e "${BLUE}Gathering deployment information...${NC}"

# Get CloudFront distribution ID
DISTRIBUTION_ID=$(get_ssm_parameter "/taxclusive/${ENVIRONMENT}/cloudfront/distribution-id")
if [[ -n "$DISTRIBUTION_ID" && "$DISTRIBUTION_ID" != "None" ]]; then
    echo -e "${GREEN}CloudFront Distribution ID: ${DISTRIBUTION_ID}${NC}"
else
    echo -e "${RED}Could not retrieve CloudFront Distribution ID${NC}"
fi

# Get CloudFront domain
CLOUDFRONT_DOMAIN=$(get_ssm_parameter "/taxclusive/${ENVIRONMENT}/cloudfront/domain-name")
if [[ -n "$CLOUDFRONT_DOMAIN" && "$CLOUDFRONT_DOMAIN" != "None" ]]; then
    echo -e "${GREEN}CloudFront Domain: ${CLOUDFRONT_DOMAIN}${NC}"
    BASE_URL="https://${CLOUDFRONT_DOMAIN}"
else
    echo -e "${RED}Could not retrieve CloudFront domain${NC}"
    BASE_URL=""
fi

# Get custom domain if available
CUSTOM_DOMAIN=$(get_ssm_parameter "/taxclusive/${ENVIRONMENT}/app/base-url")
if [[ -n "$CUSTOM_DOMAIN" && "$CUSTOM_DOMAIN" != "None" ]]; then
    echo -e "${GREEN}Custom Domain: ${CUSTOM_DOMAIN}${NC}"
    CUSTOM_BASE_URL="$CUSTOM_DOMAIN"
else
    CUSTOM_BASE_URL=""
fi

# Get S3 bucket name
S3_BUCKET=$(get_ssm_parameter "/taxclusive/${ENVIRONMENT}/s3/bucket-name")
if [[ -n "$S3_BUCKET" && "$S3_BUCKET" != "None" ]]; then
    echo -e "${GREEN}S3 Bucket: ${S3_BUCKET}${NC}"
else
    echo -e "${RED}Could not retrieve S3 bucket name${NC}"
fi

# Get Lambda function name
LAMBDA_FUNCTION=$(get_ssm_parameter "/taxclusive/${ENVIRONMENT}/lambda/function-name")
if [[ -n "$LAMBDA_FUNCTION" && "$LAMBDA_FUNCTION" != "None" ]]; then
    echo -e "${GREEN}Lambda Function: ${LAMBDA_FUNCTION}${NC}"
else
    echo -e "${RED}Could not retrieve Lambda function name${NC}"
fi

echo ""
echo -e "${BLUE}Starting deployment tests...${NC}"
echo ""

# Test 1: AWS CLI Configuration
run_test "AWS CLI Configuration" \
    "aws sts get-caller-identity --region ${AWS_REGION} > /dev/null" \
    "AWS CLI is properly configured"

# Test 2: SSM Parameters Access
run_test "SSM Parameters Access" \
    "aws ssm get-parameters-by-path --path '/taxclusive/${ENVIRONMENT}/' --region ${AWS_REGION} > /dev/null" \
    "Can access SSM parameters"

# Test 3: S3 Bucket Exists
if [[ -n "$S3_BUCKET" ]]; then
    run_test "S3 Bucket Accessibility" \
        "aws s3 ls s3://${S3_BUCKET}/ > /dev/null" \
        "S3 bucket is accessible"
fi

# Test 4: Lambda Function Exists
if [[ -n "$LAMBDA_FUNCTION" ]]; then
    run_test "Lambda Function Status" \
        "aws lambda get-function --function-name ${LAMBDA_FUNCTION} --region ${AWS_REGION} > /dev/null" \
        "Lambda function exists and is accessible"
fi

# Test 5: CloudFront Distribution Status
if [[ -n "$DISTRIBUTION_ID" ]]; then
    run_test "CloudFront Distribution Status" \
        "aws cloudfront get-distribution --id ${DISTRIBUTION_ID} --query 'Distribution.Status' --output text | grep -q 'Deployed'" \
        "CloudFront distribution is deployed"
fi

# Test 6: Application Health Check via CloudFront
if [[ -n "$BASE_URL" ]]; then
    run_test "Application Health Check (CloudFront)" \
        "check_http_response '${BASE_URL}/api/health' '200'" \
        "Health endpoint returns 200"
fi

# Test 7: Homepage Accessibility via CloudFront
if [[ -n "$BASE_URL" ]]; then
    run_test "Homepage Accessibility (CloudFront)" \
        "check_http_response '${BASE_URL}/' '200'" \
        "Homepage returns 200"
fi

# Test 8: Custom Domain Health Check
if [[ -n "$CUSTOM_BASE_URL" ]]; then
    run_test "Application Health Check (Custom Domain)" \
        "check_http_response '${CUSTOM_BASE_URL}/api/health' '200'" \
        "Health endpoint returns 200 on custom domain"
        
    run_test "Homepage Accessibility (Custom Domain)" \
        "check_http_response '${CUSTOM_BASE_URL}/' '200'" \
        "Homepage returns 200 on custom domain"
fi

# Test 9: SSL Certificate Check
if [[ -n "$CUSTOM_BASE_URL" ]]; then
    DOMAIN=$(echo "$CUSTOM_BASE_URL" | sed 's|https://||' | sed 's|http://||' | sed 's|/.*||')
    run_test "SSL Certificate Validity" \
        "check_ssl_certificate '${DOMAIN}'" \
        "SSL certificate is valid"
fi

# Test 10: Static Assets Loading
if [[ -n "$BASE_URL" ]]; then
    run_test "Static Assets Loading" \
        "check_http_response '${BASE_URL}/favicon.ico' '200'" \
        "Static assets are accessible"
fi

# Test 11: API Routes Testing
if [[ -n "$BASE_URL" ]]; then
    # Test various API routes
    run_test "Contact API Route" \
        "check_http_response '${BASE_URL}/api/contact' '405'" \
        "Contact API route exists (returns 405 for GET)"
        
    run_test "Newsletter API Route" \
        "check_http_response '${BASE_URL}/api/newsletter' '405'" \
        "Newsletter API route exists (returns 405 for GET)"
fi

# Test 12: Page Loading Tests
if [[ -n "$BASE_URL" ]]; then
    PAGES=("about" "services" "contact" "blogs" "faq")
    
    for page in "${PAGES[@]}"; do
        run_test "Page Loading: /${page}" \
            "check_http_response '${BASE_URL}/${page}' '200'" \
            "Page /${page} loads successfully"
    done
fi

# Test 13: Performance Test
if [[ -n "$BASE_URL" ]]; then
    run_test "Homepage Performance Test" \
        "curl -s -w '%{time_total}' -o /dev/null '${BASE_URL}/' | awk '{exit (\$1 > 3) ? 1 : 0}'" \
        "Homepage loads in under 3 seconds"
fi

# Test 14: Security Headers Test
if [[ -n "$BASE_URL" ]]; then
    run_test "Security Headers Present" \
        "curl -s -I '${BASE_URL}/' | grep -q 'X-Content-Type-Options'" \
        "Security headers are present"
fi

# Test 15: Lambda Function Invocation Test
if [[ -n "$LAMBDA_FUNCTION" ]]; then
    run_test "Lambda Function Invocation" \
        "aws lambda invoke --function-name ${LAMBDA_FUNCTION} --payload '{\"httpMethod\":\"GET\",\"path\":\"/api/health\"}' --region ${AWS_REGION} /tmp/lambda-response.json > /dev/null && cat /tmp/lambda-response.json | jq -r '.statusCode' | grep -q '200'" \
        "Lambda function can be invoked directly"
fi

# Test 16: CloudWatch Logs Test
if [[ -n "$LAMBDA_FUNCTION" ]]; then
    LOG_GROUP="/aws/lambda/${LAMBDA_FUNCTION}"
    run_test "CloudWatch Logs Accessibility" \
        "aws logs describe-log-groups --log-group-name-prefix '${LOG_GROUP}' --region ${AWS_REGION} > /dev/null" \
        "CloudWatch logs are accessible"
fi

# Test 17: Monitoring Dashboard Test
run_test "CloudWatch Dashboard Exists" \
    "aws cloudwatch list-dashboards --region ${AWS_REGION} --query 'DashboardEntries[?contains(DashboardName, \`Taxclusive-${ENVIRONMENT}\`)]' --output text | wc -l | grep -q -v '^0$'" \
    "CloudWatch dashboard exists"

# Performance and Load Testing
echo -e "${BLUE}Running performance tests...${NC}"

if [[ -n "$BASE_URL" ]]; then
    # Test response times for key pages
    echo -e "${YELLOW}Measuring response times...${NC}"
    
    PAGES=("/" "/about" "/services" "/api/health")
    for page in "${PAGES[@]}"; do
        response_time=$(curl -s -w '%{time_total}' -o /dev/null "${BASE_URL}${page}" 2>/dev/null || echo "999")
        if (( $(echo "$response_time < 2.0" | bc -l) )); then
            echo -e "${GREEN}✓ ${page}: ${response_time}s (Good)${NC}"
        elif (( $(echo "$response_time < 5.0" | bc -l) )); then
            echo -e "${YELLOW}⚠ ${page}: ${response_time}s (Acceptable)${NC}"
        else
            echo -e "${RED}✗ ${page}: ${response_time}s (Slow)${NC}"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    done
fi

# Summary
echo ""
echo -e "${BLUE}=== Test Summary ===${NC}"
echo -e "${BLUE}Total Tests: ${TOTAL_TESTS}${NC}"
echo -e "${GREEN}Passed: $((TOTAL_TESTS - FAILED_TESTS))${NC}"
echo -e "${RED}Failed: ${FAILED_TESTS}${NC}"

if [[ $FAILED_TESTS -eq 0 ]]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! Deployment is successful.${NC}"
    echo ""
    
    if [[ -n "$CUSTOM_BASE_URL" ]]; then
        echo -e "${BLUE}Your application is live at: ${CUSTOM_BASE_URL}${NC}"
    elif [[ -n "$BASE_URL" ]]; then
        echo -e "${BLUE}Your application is live at: ${BASE_URL}${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}Monitoring:${NC}"
    echo -e "${YELLOW}CloudWatch Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=Taxclusive-${ENVIRONMENT}${NC}"
    echo -e "${YELLOW}Lambda Logs: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#logsV2:log-groups/log-group/\$252Faws\$252Flambda\$252F${LAMBDA_FUNCTION}${NC}"
    
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some tests failed. Please check the deployment.${NC}"
    echo ""
    
    echo -e "${YELLOW}Common troubleshooting steps:${NC}"
    echo -e "${YELLOW}1. Check CloudFormation stack status${NC}"
    echo -e "${YELLOW}2. Verify all SSM parameters are set correctly${NC}"
    echo -e "${YELLOW}3. Check Lambda function logs in CloudWatch${NC}"
    echo -e "${YELLOW}4. Ensure DNS records are properly configured${NC}"
    echo -e "${YELLOW}5. Verify SSL certificate is valid and deployed${NC}"
    
    exit 1
fi