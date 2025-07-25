#!/usr/bin/env node

/**
 * Email Integration Test Suite
 * Tests all email endpoints to ensure they're working correctly
 */

const fetch = require('node-fetch');

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(colors.green, `✅ ${message}`);
}

function logError(message) {
  log(colors.red, `❌ ${message}`);
}

function logInfo(message) {
  log(colors.blue, `ℹ️  ${message}`);
}

function logWarning(message) {
  log(colors.yellow, `⚠️  ${message}`);
}

// Test data for different form types
const testData = {
  contact: {
    firstName: 'John',
    lastName: 'Doe',
    email: TEST_EMAIL,
    phone: '+91-9876543210',
    subject: 'Test Contact Form',
    message: 'This is a test message from the automated email integration test.'
  },
  
  appointment: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: TEST_EMAIL,
    phone: '+91-9876543210',
    service: 'Tax Planning & Preparation',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
    time: 'Morning (9:00 AM - 12:00 PM)',
    meetingType: 'Video Conference',
    message: 'Test appointment booking from automated system.'
  },
  
  newsletter: {
    email: TEST_EMAIL
  },
  
  query: {
    fullName: 'Bob Johnson',
    email: TEST_EMAIL,
    phone: '+91-9876543210',
    category: 'Tax',
    priority: 'Normal',
    subject: 'Test Query Submission',
    query: 'This is a test query to verify the email integration is working correctly.',
    files: []
  },
  
  message: {
    name: 'Alice Brown',
    email: TEST_EMAIL,
    phone: '+91-9876543210',
    subject: 'Test Message Form',
    message: 'This is a test message to verify the general message form email integration.'
  }
};

// Test function for each endpoint
async function testEndpoint(endpoint, data) {
  try {
    logInfo(`Testing ${endpoint} endpoint...`);
    
    const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      logSuccess(`${endpoint} endpoint: ${result.message}`);
      return true;
    } else {
      logError(`${endpoint} endpoint failed: ${result.message}`);
      if (result.errors) {
        console.log('Validation errors:', result.errors);
      }
      return false;
    }
  } catch (error) {
    logError(`${endpoint} endpoint error: ${error.message}`);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log(`${colors.bold}${colors.blue}🧪 Taxclusive Email Integration Test Suite${colors.reset}\n`);
  
  logInfo(`Testing against: ${BASE_URL}`);
  logInfo(`Test email: ${TEST_EMAIL}\n`);

  const results = [];
  
  // Test all endpoints
  for (const [endpoint, data] of Object.entries(testData)) {
    const success = await testEndpoint(endpoint, data);
    results.push({ endpoint, success });
    console.log(''); // Empty line for readability
  }

  // Summary
  console.log(`${colors.bold}📊 Test Results Summary:${colors.reset}`);
  console.log('━'.repeat(50));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(({ endpoint, success }) => {
    const status = success ? logSuccess : logError;
    status(`${endpoint.padEnd(15)} ${success ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log('━'.repeat(50));
  
  if (passed === total) {
    logSuccess(`All ${total} tests passed! 🎉`);
    logInfo('Email integration is working correctly.');
  } else {
    logWarning(`${passed}/${total} tests passed.`);
    logError(`${total - passed} tests failed.`);
    
    if (passed === 0) {
      logError('No tests passed. Check your email configuration:');
      console.log('1. Ensure AZURE_COMMUNICATION_CONNECTION_STRING is set in .env.local');
      console.log('2. Verify your Azure Communication Services setup');
      console.log('3. Check that the development server is running');
    }
  }

  console.log('\n' + '═'.repeat(60));
  logInfo('Next Steps:');
  console.log('1. If tests failed, check Azure Communication Services configuration');
  console.log('2. Verify environment variables in .env.local');
  console.log('3. Test forms manually in your browser');
  console.log('4. Check server logs for detailed error messages');
  
  return passed === total;
}

// Additional utility functions
async function checkServerHealth() {
  try {
    logInfo('Checking server health...');
    const response = await fetch(`${BASE_URL}/api/health`);
    
    if (response.ok) {
      logSuccess('Server is running and accessible');
      return true;
    } else {
      logWarning(`Server responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Cannot connect to server: ${error.message}`);
    logInfo('Make sure the development server is running with: pnpm dev');
    return false;
  }
}

async function testEmailConfiguration() {
  logInfo('Testing email configuration...');
  
  const requiredEnvVars = [
    'AZURE_COMMUNICATION_CONNECTION_STRING',
    'EMAIL_SENDER_ADDRESS',
    'EMAIL_RECIPIENT_ADDRESS'
  ];
  
  const missing = requiredEnvVars.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    logError(`Missing environment variables: ${missing.join(', ')}`);
    logInfo('Please set these in your .env.local file');
    return false;
  }
  
  logSuccess('All required environment variables are set');
  return true;
}

// Main execution
async function main() {
  console.clear();
  
  try {
    // Check if server is running
    const serverOk = await checkServerHealth();
    if (!serverOk && BASE_URL.includes('localhost')) {
      logError('Development server is not running. Start it with: pnpm dev');
      process.exit(1);
    }
    
    // Test email configuration
    const configOk = await testEmailConfiguration();
    if (!configOk) {
      logError('Email configuration is incomplete');
      process.exit(1);
    }
    
    // Run the main test suite
    const allTestsPassed = await runTests();
    
    process.exit(allTestsPassed ? 0 : 1);
    
  } catch (error) {
    logError(`Test suite failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
${colors.bold}Taxclusive Email Integration Test Suite${colors.reset}

Usage:
  node scripts/test-email-integration.js [options]

Options:
  --help, -h     Show this help message
  
Environment Variables:
  NEXT_PUBLIC_BASE_URL    Base URL for testing (default: http://localhost:3000)
  
Examples:
  # Test against local development server
  node scripts/test-email-integration.js
  
  # Test against production
  NEXT_PUBLIC_BASE_URL=https://your-domain.com node scripts/test-email-integration.js
`);
  process.exit(0);
}

// Run the tests
main();