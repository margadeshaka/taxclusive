#!/usr/bin/env node

/**
 * AWS SES Test Script for Taxclusive
 * This script tests the AWS SES email configuration
 * Run with: node scripts/test-aws-ses.js
 */

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

// Configuration
const config = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const emailConfig = {
  senderName: process.env.EMAIL_SENDER_NAME || "Taxclusive",
  senderAddress: process.env.EMAIL_SENDER_ADDRESS || "noreply@taxclusive.com",
  recipientAddress: process.env.EMAIL_RECIPIENT_ADDRESS || "contact@taxclusive.com",
  recipientName: process.env.EMAIL_RECIPIENT_NAME || "Taxclusive Support",
};

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkConfiguration() {
  log("\n=== Checking AWS SES Configuration ===", "blue");

  // Check required environment variables
  const requiredVars = [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "EMAIL_SENDER_ADDRESS",
    "EMAIL_RECIPIENT_ADDRESS",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    log(`❌ Missing required environment variables: ${missingVars.join(", ")}`, "red");
    log("Please ensure your .env.local file is properly configured.", "yellow");
    return false;
  }

  log("✅ All required environment variables are set", "green");

  // Display configuration
  log("\nCurrent Configuration:", "cyan");
  log(`📍 AWS Region: ${config.region}`, "cyan");
  log(`👤 Access Key ID: ${config.credentials.accessKeyId?.substring(0, 8)}...`, "cyan");
  log(`📧 Sender: ${emailConfig.senderName} <${emailConfig.senderAddress}>`, "cyan");
  log(`📬 Recipient: ${emailConfig.recipientName} <${emailConfig.recipientAddress}>`, "cyan");

  return true;
}

async function testSESConnection() {
  log("\n=== Testing AWS SES Connection ===", "blue");

  try {
    const sesClient = new SESClient(config);

    // Test basic connectivity by checking send quota
    const { GetSendQuotaCommand } = require("@aws-sdk/client-ses");
    const quotaCommand = new GetSendQuotaCommand({});
    const quotaResult = await sesClient.send(quotaCommand);

    log("✅ Successfully connected to AWS SES", "green");
    log(`📊 Send Quota: ${quotaResult.Max24HourSend} emails per 24 hours`, "cyan");
    log(`📈 Sent in last 24h: ${quotaResult.SentLast24Hours}`, "cyan");
    log(`⚡ Max send rate: ${quotaResult.MaxSendRate} emails per second`, "cyan");

    return sesClient;
  } catch (error) {
    log("❌ Failed to connect to AWS SES", "red");
    log(`Error: ${error.message}`, "red");
    return null;
  }
}

async function checkDomainVerification(sesClient) {
  log("\n=== Checking Domain Verification Status ===", "blue");

  try {
    const { GetIdentityVerificationAttributesCommand } = require("@aws-sdk/client-ses");
    const domain = emailConfig.senderAddress.split("@")[1];

    const command = new GetIdentityVerificationAttributesCommand({
      Identities: [domain, emailConfig.senderAddress],
    });

    const result = await sesClient.send(command);

    // Check domain verification
    if (result.VerificationAttributes[domain]) {
      const domainStatus = result.VerificationAttributes[domain].VerificationStatus;
      if (domainStatus === "Success") {
        log(`✅ Domain ${domain} is verified`, "green");
      } else {
        log(`⚠️  Domain ${domain} verification status: ${domainStatus}`, "yellow");
        log("Please check your DNS records and wait for propagation.", "yellow");
      }
    }

    // Check email verification
    if (result.VerificationAttributes[emailConfig.senderAddress]) {
      const emailStatus =
        result.VerificationAttributes[emailConfig.senderAddress].VerificationStatus;
      if (emailStatus === "Success") {
        log(`✅ Email ${emailConfig.senderAddress} is verified`, "green");
      } else {
        log(`⚠️  Email ${emailConfig.senderAddress} verification status: ${emailStatus}`, "yellow");
      }
    }

    return true;
  } catch (error) {
    log("❌ Failed to check verification status", "red");
    log(`Error: ${error.message}`, "red");
    return false;
  }
}

async function sendTestEmail(sesClient) {
  log("\n=== Sending Test Email ===", "blue");

  const testEmailParams = {
    Destination: {
      ToAddresses: [emailConfig.recipientAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #2c5aa0;">🧪 AWS SES Test Email</h2>
                  <p>This is a test email from the Taxclusive application to verify AWS SES configuration.</p>
                  
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #495057;">Test Details:</h3>
                    <ul style="margin: 0;">
                      <li><strong>Sent from:</strong> ${emailConfig.senderAddress}</li>
                      <li><strong>AWS Region:</strong> ${config.region}</li>
                      <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
                    </ul>
                  </div>
                  
                  <p>If you receive this email, your AWS SES configuration is working correctly! 🎉</p>
                  
                  <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
                  <p style="font-size: 12px; color: #6c757d;">
                    This is an automated test email from Taxclusive application.<br>
                    Please do not reply to this email.
                  </p>
                </div>
              </body>
            </html>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
AWS SES Test Email

This is a test email from the Taxclusive application to verify AWS SES configuration.

Test Details:
- Sent from: ${emailConfig.senderAddress}
- AWS Region: ${config.region}
- Timestamp: ${new Date().toISOString()}

If you receive this email, your AWS SES configuration is working correctly!

This is an automated test email from Taxclusive application.
Please do not reply to this email.
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `🧪 AWS SES Test - ${new Date().toLocaleDateString()}`,
      },
    },
    Source: emailConfig.senderAddress,
  };

  try {
    const command = new SendEmailCommand(testEmailParams);
    const result = await sesClient.send(command);

    log("✅ Test email sent successfully!", "green");
    log(`📧 Message ID: ${result.MessageId}`, "cyan");
    log(`📬 Sent to: ${emailConfig.recipientAddress}`, "cyan");

    return true;
  } catch (error) {
    log("❌ Failed to send test email", "red");
    log(`Error: ${error.message}`, "red");

    // Provide helpful error messages
    if (error.message.includes("Email address not verified")) {
      log("\n💡 Troubleshooting:", "yellow");
      log("- Your email address or domain needs to be verified in AWS SES", "yellow");
      log("- Check AWS SES console for verification status", "yellow");
      log("- Add required DNS records if using domain verification", "yellow");
    } else if (error.message.includes("AccessDenied")) {
      log("\n💡 Troubleshooting:", "yellow");
      log("- Check if your AWS credentials have SES permissions", "yellow");
      log("- Ensure IAM user has ses:SendEmail and ses:SendRawEmail permissions", "yellow");
    } else if (error.message.includes("Sandbox")) {
      log("\n💡 Troubleshooting:", "yellow");
      log("- AWS SES is in sandbox mode", "yellow");
      log("- You can only send emails to verified addresses", "yellow");
      log("- Request production access through AWS Console", "yellow");
    }

    return false;
  }
}

async function main() {
  log("🚀 Starting AWS SES Test Suite for Taxclusive", "magenta");
  log("================================================", "magenta");

  try {
    // Step 1: Check configuration
    const configValid = await checkConfiguration();
    if (!configValid) {
      process.exit(1);
    }

    // Step 2: Test SES connection
    const sesClient = await testSESConnection();
    if (!sesClient) {
      process.exit(1);
    }

    // Step 3: Check domain verification
    await checkDomainVerification(sesClient);

    // Step 4: Send test email
    const emailSent = await sendTestEmail(sesClient);

    // Summary
    log("\n=== Test Summary ===", "blue");
    if (emailSent) {
      log("🎉 All tests passed! AWS SES is configured correctly.", "green");
      log("\nNext steps:", "cyan");
      log("1. Check your inbox for the test email", "cyan");
      log("2. If email is not received, check spam folder", "cyan");
      log("3. Monitor AWS SES console for delivery status", "cyan");
      log("4. Consider requesting production access to remove sandbox limitations", "cyan");
    } else {
      log("⚠️  Some tests failed. Please check the errors above.", "yellow");
    }
  } catch (error) {
    log(`💥 Unexpected error: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run the test suite
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkConfiguration,
  testSESConnection,
  checkDomainVerification,
  sendTestEmail,
};
