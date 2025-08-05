#!/usr/bin/env node

/**
 * Test Summary Script
 * Runs comprehensive test suite and generates summary report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Comprehensive Test Suite for Taxclusive\n');

const testResults = {
  unit: { status: 'pending', duration: 0, coverage: null },
  integration: { status: 'pending', duration: 0 },
  e2e: { status: 'pending', duration: 0 },
  performance: { status: 'pending', duration: 0 },
  accessibility: { status: 'pending', duration: 0 },
  security: { status: 'pending', duration: 0 },
  lint: { status: 'pending', duration: 0 },
  typecheck: { status: 'pending', duration: 0 },
};

function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  const startTime = Date.now();
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: ['inherit', 'pipe', 'pipe'],
      timeout: 300000 // 5 minutes timeout
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ ${description} completed in ${(duration / 1000).toFixed(2)}s\n`);
    
    return { status: 'passed', duration, output };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`❌ ${description} failed in ${(duration / 1000).toFixed(2)}s`);
    console.log(`Error: ${error.message}\n`);
    
    return { status: 'failed', duration, error: error.message };
  }
}

async function runTestSuite() {
  console.log('🔍 Environment Check');
  console.log(`Node.js: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\n`);

  // 1. Linting
  const lintResult = runCommand('pnpm lint', 'Running ESLint');
  testResults.lint = lintResult;

  // 2. Type Checking
  const typecheckResult = runCommand('npx tsc --noEmit', 'Type checking with TypeScript');
  testResults.typecheck = typecheckResult;

  // 3. Unit Tests with Coverage
  const unitResult = runCommand('pnpm test:coverage --passWithNoTests', 'Running unit tests with coverage');
  testResults.unit = unitResult;

  // Extract coverage information if available
  if (unitResult.status === 'passed') {
    try {
      const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
      if (fs.existsSync(coveragePath)) {
        const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        testResults.unit.coverage = coverage.total;
      }
    } catch (error) {
      console.log('Could not parse coverage report');
    }
  }

  // 4. Performance Tests
  const performanceResult = runCommand('pnpm test:performance --passWithNoTests', 'Running performance tests');
  testResults.performance = performanceResult;

  // 5. Accessibility Tests  
  const accessibilityResult = runCommand('pnpm test -- accessibility --passWithNoTests', 'Running accessibility tests');
  testResults.accessibility = accessibilityResult;

  // 6. Security Tests
  const securityResult = runCommand('pnpm test:security --passWithNoTests', 'Running security tests');
  testResults.security = securityResult;

  // 7. Build Test
  console.log('🏗️  Testing application build...');
  const buildResult = runCommand('pnpm build', 'Building application');
  
  // 8. E2E Tests (only if build succeeds)
  if (buildResult.status === 'passed') {
    const e2eResult = runCommand('pnpm test:e2e --reporter=line', 'Running E2E tests');
    testResults.e2e = e2eResult;
  } else {
    console.log('⏭️  Skipping E2E tests due to build failure\n');
    testResults.e2e = { status: 'skipped', duration: 0 };
  }

  // Generate Summary Report
  generateSummaryReport();
}

function generateSummaryReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY REPORT');
  console.log('='.repeat(60));

  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(r => r.status === 'passed').length;
  const failedTests = Object.values(testResults).filter(r => r.status === 'failed').length;
  const skippedTests = Object.values(testResults).filter(r => r.status === 'skipped').length;

  console.log(`\n📈 Overall Results:`);
  console.log(`   Total Test Suites: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   ⏭️  Skipped: ${skippedTests}`);

  const overallStatus = failedTests === 0 ? '✅ PASS' : '❌ FAIL';
  console.log(`\n🎯 Overall Status: ${overallStatus}`);

  console.log(`\n📋 Detailed Results:`);
  
  Object.entries(testResults).forEach(([testType, result]) => {
    const statusIcon = result.status === 'passed' ? '✅' : 
                      result.status === 'failed' ? '❌' : 
                      result.status === 'skipped' ? '⏭️' : '⏸️';
    
    const duration = (result.duration / 1000).toFixed(2);
    console.log(`   ${statusIcon} ${testType.padEnd(15)}: ${result.status.padEnd(8)} (${duration}s)`);
    
    if (result.error) {
      console.log(`      Error: ${result.error.split('\n')[0]}`);
    }
  });

  // Coverage Report
  if (testResults.unit.coverage) {
    const coverage = testResults.unit.coverage;
    console.log(`\n📊 Code Coverage:`);
    console.log(`   Lines:      ${coverage.lines.pct}%`);
    console.log(`   Functions:  ${coverage.functions.pct}%`);
    console.log(`   Branches:   ${coverage.branches.pct}%`);
    console.log(`   Statements: ${coverage.statements.pct}%`);
  }

  // Performance Metrics
  const totalDuration = Object.values(testResults).reduce((sum, result) => sum + result.duration, 0);
  console.log(`\n⏱️  Total Execution Time: ${(totalDuration / 1000).toFixed(2)}s`);

  // Recommendations
  console.log(`\n💡 Recommendations:`);
  
  if (failedTests > 0) {
    console.log(`   - Fix ${failedTests} failing test suite(s) before deployment`);
  }
  
  if (testResults.unit.coverage) {
    const coverage = testResults.unit.coverage;
    if (coverage.lines.pct < 70) {
      console.log(`   - Increase test coverage (currently ${coverage.lines.pct}%, target: 70%)`);
    }
  }
  
  if (testResults.e2e.status === 'skipped') {
    console.log(`   - Run E2E tests after fixing build issues`);
  }

  console.log(`\n📄 Detailed reports available in:`);
  console.log(`   - Coverage: ./coverage/lcov-report/index.html`);
  console.log(`   - E2E Results: ./test-results/`);
  console.log(`   - Playwright Report: ./playwright-report/`);

  console.log('\n' + '='.repeat(60));
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Handle process interruption
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Test suite interrupted');
  generateSummaryReport();
});

// Run the test suite
runTestSuite().catch((error) => {
  console.error('💥 Unexpected error running test suite:', error);
  process.exit(1);
});