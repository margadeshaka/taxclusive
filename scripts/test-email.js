/**
 * Email Testing Script for Taxclusive CA Firm
 * Tests AWS SES email functionality
 */

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
require("dotenv").config({ path: ".env.local" });

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
};

/**
 * Validate environment configuration
 */
function validateConfig() {
  log.info("Validating configuration...");

  const requiredVars = [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "EMAIL_SENDER_ADDRESS",
    "EMAIL_RECIPIENT_ADDRESS",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    log.error("Missing required environment variables:");
    missing.forEach((varName) => console.log(`  - ${varName}`));
    log.warning("Please check your .env.local file and configure AWS credentials.");
    return false;
  }

  log.success("Configuration validated successfully");
  return true;
}

/**
 * Test basic email sending functionality
 */
async function testBasicEmail() {
  log.info("Testing basic email functionality...");

  try {
    const client = new SESClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = {
      Destination: {
        ToAddresses: [process.env.EMAIL_RECIPIENT_ADDRESS],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Taxclusive - Email System Test</h2>
                        <p>This is a test email to verify AWS SES setup.</p>
                        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
                        <p><strong>System Information:</strong></p>
                        <ul>
                            <li>Timestamp: ${new Date().toISOString()}</li>
                            <li>Sender: ${process.env.EMAIL_SENDER_ADDRESS}</li>
                            <li>Environment: ${process.env.NODE_ENV || "development"}</li>
                        </ul>
                        <p style="color: #6b7280; font-size: 12px;">
                            This email was generated automatically by the Taxclusive website email testing system.
                        </p>
                    </div>
                `,
          },
          Text: {
            Charset: "UTF-8",
            Data: "This is a test email to verify AWS SES setup for Taxclusive CA firm website.",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Test Email - Taxclusive System Check",
        },
      },
      Source: process.env.EMAIL_SENDER_ADDRESS,
    };

    const command = new SendEmailCommand(params);
    const result = await client.send(command);

    log.success(`Basic email sent successfully!`);
    console.log(`  Message ID: ${result.MessageId}`);

    return true;
  } catch (error) {
    log.error(`Basic email test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test contact form email functionality
 */
async function testContactFormEmail() {
  log.info("Testing contact form email...");

  try {
    const { formatContactEmail, sendEmail } = require("../lib/email");

    const formData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "+91-9876543210",
      subject: "Test Contact Form Submission",
      message: "This is a test message from the contact form email functionality test.",
    };

    const emailData = formatContactEmail(formData);
    await sendEmail(emailData);

    log.success("Contact form email sent successfully!");
    return true;
  } catch (error) {
    log.error(`Contact form email test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test appointment form email functionality
 */
async function testAppointmentFormEmail() {
  log.info("Testing appointment form email...");

  try {
    const { formatAppointmentEmail, sendEmail } = require("../lib/email");

    const formData = {
      firstName: "Test",
      lastName: "Client",
      email: "testclient@example.com",
      phone: "+91-9876543210",
      service: "Tax Planning Consultation",
      date: "2024-12-01",
      time: "10:00 AM",
      meetingType: "In-person",
      message: "Looking forward to discussing tax planning strategies for my business.",
    };

    const emailData = formatAppointmentEmail(formData);
    await sendEmail(emailData);

    log.success("Appointment form email sent successfully!");
    return true;
  } catch (error) {
    log.error(`Appointment form email test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test query form email functionality
 */
async function testQueryFormEmail() {
  log.info("Testing query form email...");

  try {
    const { formatQueryEmail, sendEmail } = require("../lib/email");

    const formData = {
      fullName: "Test Business Owner",
      email: "business@example.com",
      phone: "+91-9876543210",
      category: "GST Compliance",
      priority: "High",
      subject: "GST Return Filing Query",
      query:
        "I need help with GST return filing for my manufacturing business. Can you guide me through the process?",
    };

    const emailData = formatQueryEmail(formData);
    await sendEmail(emailData);

    log.success("Query form email sent successfully!");
    return true;
  } catch (error) {
    log.error(`Query form email test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test newsletter subscription email
 */
async function testNewsletterEmail() {
  log.info("Testing newsletter subscription email...");

  try {
    const { formatNewsletterEmail, sendEmail } = require("../lib/email");

    const formData = {
      email: "newsletter@example.com",
    };

    const emailData = formatNewsletterEmail(formData);
    await sendEmail(emailData);

    log.success("Newsletter subscription email sent successfully!");
    return true;
  } catch (error) {
    log.error(`Newsletter email test failed: ${error.message}`);
    return false;
  }
}

/**
 * Run all email tests
 */
async function runAllTests() {
  console.log("\n" + "=".repeat(60));
  console.log("  TAXCLUSIVE EMAIL SYSTEM TESTING");
  console.log("=".repeat(60) + "\n");

  // Validate configuration first
  if (!validateConfig()) {
    process.exit(1);
  }

  const tests = [
    { name: "Basic Email", func: testBasicEmail },
    { name: "Contact Form", func: testContactFormEmail },
    { name: "Appointment Form", func: testAppointmentFormEmail },
    { name: "Query Form", func: testQueryFormEmail },
    { name: "Newsletter", func: testNewsletterEmail },
  ];

  let passedTests = 0;

  for (const test of tests) {
    try {
      const result = await test.func();
      if (result) passedTests++;
    } catch (error) {
      log.error(`Test "${test.name}" encountered an error: ${error.message}`);
    }
    console.log(""); // Add spacing between tests
  }

  // Summary
  console.log("=".repeat(60));
  console.log(`TEST SUMMARY: ${passedTests}/${tests.length} tests passed`);

  if (passedTests === tests.length) {
    log.success("All email tests passed! Your email system is working correctly.");
  } else {
    log.warning(`${tests.length - passedTests} test(s) failed. Please check the errors above.`);
  }

  console.log("=".repeat(60) + "\n");

  // Additional information
  if (passedTests === tests.length) {
    console.log("✅ Your email system is ready for production!");
    console.log("✅ All form submissions will be sent to:", process.env.EMAIL_RECIPIENT_ADDRESS);
    console.log("✅ Emails will be sent from:", process.env.EMAIL_SENDER_ADDRESS);
  } else {
    console.log("❌ Please fix the failing tests before deploying to production.");
    console.log("📖 Check AWS SES documentation for troubleshooting.");
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Usage: node test-email.js [options]

Options:
  --help, -h     Show this help message
  --basic        Run only basic email test
  --contact      Run only contact form test
  --appointment  Run only appointment form test
  --query        Run only query form test
  --newsletter   Run only newsletter test

Examples:
  node test-email.js                 # Run all tests
  node test-email.js --basic         # Run only basic email test
  node test-email.js --contact       # Run only contact form test
        `);
    process.exit(0);
  }

  // Run specific tests based on arguments
  if (args.includes("--basic")) {
    validateConfig() && testBasicEmail();
  } else if (args.includes("--contact")) {
    validateConfig() && testContactFormEmail();
  } else if (args.includes("--appointment")) {
    validateConfig() && testAppointmentFormEmail();
  } else if (args.includes("--query")) {
    validateConfig() && testQueryFormEmail();
  } else if (args.includes("--newsletter")) {
    validateConfig() && testNewsletterEmail();
  } else {
    // Run all tests by default
    runAllTests();
  }
}