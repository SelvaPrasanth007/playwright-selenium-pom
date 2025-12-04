#!/usr/bin/env node

/**
 * Playwright Test Runner with Slack Integration
 * Executes Playwright tests and sends comprehensive results to Slack
 * Automatically loads environment variables from .env.slack file
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// Load environment variables from .env.slack if it exists
const envSlackPath = path.join(__dirname, '.env.slack');
if (fs.existsSync(envSlackPath)) {
  const envContent = fs.readFileSync(envSlackPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

// Configuration - use environment variables
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const CI_BUILD_URL = process.env.CI_BUILD_URL || 'https://github.com/SelvaPrasanth007/playwright-selenium-pom';

class PlaywrightTestRunner {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      flaky: 0,
      duration: 0,
      timestamp: new Date().toISOString(),
      startTime: Date.now(),
      failureDetails: [],
      testSuites: []
    };
  }

  /**
   * Parse Playwright HTML report to extract test results
   */
  parseHTMLReport() {
    const reportPath = path.join(__dirname, 'playwright-report/index.html');
    
    if (!fs.existsSync(reportPath)) {
      console.log('⚠️  HTML report not found, using JSON approach');
      return this.parseJSONReport();
    }

    try {
      const htmlContent = fs.readFileSync(reportPath, 'utf8');
      
      // Extract summary from HTML
      const summaryMatch = htmlContent.match(/passed.*?(\d+).*?failed.*?(\d+).*?skipped.*?(\d+)/is);
      if (summaryMatch) {
        this.results.passed = parseInt(summaryMatch[1]) || 0;
        this.results.failed = parseInt(summaryMatch[2]) || 0;
        this.results.skipped = parseInt(summaryMatch[3]) || 0;
        this.results.total = this.results.passed + this.results.failed + this.results.skipped;
      }
    } catch (error) {
      console.warn('Could not parse HTML report:', error.message);
    }
  }

  /**
   * Parse test results from test output
   */
  parseTestOutput(output) {
    // Parse passed tests
    const passedMatch = output.match(/(\d+)\s+passed/);
    if (passedMatch) {
      this.results.passed = parseInt(passedMatch[1]);
    }

    // Parse failed tests
    const failedMatch = output.match(/(\d+)\s+failed/);
    if (failedMatch) {
      this.results.failed = parseInt(failedMatch[1]);
    }

    // Parse skipped tests
    const skippedMatch = output.match(/(\d+)\s+skipped/);
    if (skippedMatch) {
      this.results.skipped = parseInt(skippedMatch[1]);
    }

    // Parse flaky tests
    const flakyMatch = output.match(/(\d+)\s+flaky/);
    if (flakyMatch) {
      this.results.flaky = parseInt(flakyMatch[1]);
    }

    // Calculate total
    this.results.total = this.results.passed + this.results.failed + this.results.skipped;

    // Extract failure details
    const failurePattern = /❌\s+(.+?)\n(.*?)(?=❌|\n\n|$)/gs;
    let match;
    while ((match = failurePattern.exec(output)) !== null) {
      this.results.failureDetails.push({
        title: match[1].trim(),
        error: match[2].substring(0, 200).trim()
      });
    }
  }

  /**
   * Run Playwright tests
   */
  async runTests() {
    console.log('🎭 Running Playwright Tests...\n');
    
    try {
      const startTime = Date.now();
      
      // Run Playwright tests with JSON reporter
      const output = execSync('npx playwright test --reporter=json --reporter=html', {
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: __dirname
      }).toString();

      const duration = Date.now() - startTime;
      this.results.duration = duration;

      // Parse output
      this.parseTestOutput(output);

      // Try to parse HTML report for more details
      this.parseHTMLReport();

      // Try to parse JSON report if available
      this.parseJSONReport();

      console.log(`✅ Playwright tests completed in ${(duration / 1000).toFixed(2)}s`);
      console.log(`   Passed: ${this.results.passed} ✅`);
      console.log(`   Failed: ${this.results.failed} ❌`);
      console.log(`   Skipped: ${this.results.skipped} ⏭️`);
      console.log(`   Flaky: ${this.results.flaky} 🔄\n`);

      return true;
    } catch (error) {
      // Playwright returns non-zero exit code if tests fail, which is expected
      const output = error.stdout ? error.stdout.toString() : error.message;
      
      this.parseTestOutput(output);
      
      const duration = Date.now() - this.results.startTime;
      this.results.duration = duration;

      console.log(`⚠️  Tests completed with failures`);
      console.log(`   Passed: ${this.results.passed} ✅`);
      console.log(`   Failed: ${this.results.failed} ❌`);
      console.log(`   Skipped: ${this.results.skipped} ⏭️\n`);

      return false;
    }
  }

  /**
   * Parse JSON report if available
   */
  parseJSONReport() {
    try {
      const jsonReportPath = path.join(__dirname, 'test-results/results.json');
      
      if (fs.existsSync(jsonReportPath)) {
        const jsonResults = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
        
        if (jsonResults.stats) {
          this.results.passed = jsonResults.stats.expected || 0;
          this.results.failed = jsonResults.stats.unexpected || 0;
          this.results.skipped = jsonResults.stats.skipped || 0;
          this.results.flaky = jsonResults.stats.flaky || 0;
          this.results.total = this.results.passed + this.results.failed + this.results.skipped;
        }

        // Extract failures
        if (jsonResults.suites) {
          jsonResults.suites.forEach(suite => {
            suite.tests?.forEach(test => {
              if (test.status === 'failed' && test.failureDetails) {
                test.failureDetails.forEach(detail => {
                  if (this.results.failureDetails.length < 5) {
                    this.results.failureDetails.push({
                      title: test.title,
                      error: detail.message?.substring(0, 150) || 'Unknown error'
                    });
                  }
                });
              }
            });
          });
        }
      }
    } catch (error) {
      console.warn('Could not parse JSON report:', error.message);
    }
  }

  /**
   * Create Slack message payload
   */
  createSlackMessage() {
    const totalDuration = ((this.results.duration) / 1000).toFixed(2);
    const allPassed = this.results.failed === 0;
    const headerText = allPassed ? '✅ All Playwright Tests Passed!' : '❌ Some Playwright Tests Failed';

    // Build failure text
    let failureText = '';
    if (this.results.failureDetails.length > 0) {
      failureText = '\n\n*🔴 Top Failures:*';
      this.results.failureDetails.slice(0, 3).forEach((failure, index) => {
        const errorSnippet = failure.error.substring(0, 80).replace(/`/g, "'");
        failureText += `\n${index + 1}. ${failure.title}\n   _${errorSnippet}..._`;
      });
      if (this.results.failureDetails.length > 3) {
        failureText += `\n_... and ${this.results.failureDetails.length - 3} more failures_`;
      }
    }

    const reportLink = 'file://' + path.join(__dirname, 'playwright-report/index.html');
    
    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: headerText,
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*📊 Test Results*\n• Total: ${this.results.total}\n• Passed: ${this.results.passed} ✅\n• Failed: ${this.results.failed} ❌\n• Skipped: ${this.results.skipped} ⏭️\n• Flaky: ${this.results.flaky} 🔄\n\n*⏱️ Execution Time*\n• Duration: ${totalDuration}s\n\n*ℹ️ Environment*\n• Framework: Playwright (${process.env.CI ? 'CI' : 'Local'})\n• Browser: Chromium\n• Timestamp: ${new Date(this.results.timestamp).toLocaleString()}${failureText}`
          }
        },
        {
          type: 'divider'
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📋 CI Build',
                emoji: true
              },
              url: CI_BUILD_URL
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📂 Repository',
                emoji: true
              },
              url: 'https://github.com/SelvaPrasanth007/playwright-selenium-pom'
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Pass Rate: ${this.results.total > 0 ? ((this.results.passed / this.results.total) * 100).toFixed(1) : 0}% | Status: ${allPassed ? 'SUCCESS ✅' : 'FAILED ❌'}`
            }
          ]
        }
      ]
    };

    return message;
  }

  /**
   * Send message to Slack
   */
  sendToSlack() {
    return new Promise((resolve, reject) => {
      console.log('📤 Sending results to Slack...');

      const slackMessage = this.createSlackMessage();
      const payload = JSON.stringify(slackMessage);

      const urlObj = new URL(SLACK_WEBHOOK_URL);
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200 && data === 'ok') {
            console.log('✅ Slack notification sent successfully!\n');
            resolve(true);
          } else {
            console.warn(`⚠️  Slack response: ${data} (Status: ${res.statusCode})\n`);
            resolve(true);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Failed to send Slack notification:', error.message);
        reject(error);
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Display console summary
   */
  displaySummary() {
    const totalDuration = (this.results.duration / 1000).toFixed(2);
    const allPassed = this.results.failed === 0;
    const passRate = this.results.total > 0 ? ((this.results.passed / this.results.total) * 100).toFixed(1) : 0;

    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log('                   🎭 PLAYWRIGHT TEST RESULTS SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════════════\n');

    console.log('📊 Test Metrics:');
    console.log(`   • Total Tests: ${this.results.total}`);
    console.log(`   • Passed: ${this.results.passed} ✅`);
    console.log(`   • Failed: ${this.results.failed} ❌`);
    console.log(`   • Skipped: ${this.results.skipped} ⏭️`);
    console.log(`   • Flaky: ${this.results.flaky} 🔄`);
    console.log(`   • Pass Rate: ${passRate}%`);
    console.log(`   • Duration: ${totalDuration}s\n`);

    if (this.results.failureDetails.length > 0) {
      console.log('🔴 Top Failures:');
      this.results.failureDetails.slice(0, 3).forEach((failure, index) => {
        console.log(`   ${index + 1}. ${failure.title}`);
        console.log(`      Error: ${failure.error.substring(0, 70)}...`);
      });
      if (this.results.failureDetails.length > 3) {
        console.log(`   ... and ${this.results.failureDetails.length - 3} more failures`);
      }
      console.log();
    }

    console.log(`🔗 Links:`);
    console.log(`   • CI Build: ${CI_BUILD_URL}`);
    console.log(`   • Repository: https://github.com/SelvaPrasanth007/playwright-selenium-pom`);
    console.log(`   • Report: ${path.join(__dirname, 'playwright-report/index.html')}\n`);

    console.log('📅 Timestamp: ' + new Date(this.results.timestamp).toLocaleString());
    console.log(`📤 Slack: Sent to webhook\n`);

    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log(allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    console.log('═══════════════════════════════════════════════════════════════════════\n');
  }

  /**
   * Main execution
   */
  async run() {
    try {
      console.log('🚀 Starting Playwright Test Runner with Slack Integration\n');
      
      if (!SLACK_WEBHOOK_URL) {
        console.warn('⚠️  Warning: SLACK_WEBHOOK_URL not configured');
        console.warn('Set it in .env.slack or via environment variable\n');
      } else {
        console.log('✅ Slack webhook configured');
      }
      
      console.log(`📍 CI Build: ${CI_BUILD_URL}\n`);

      // Run tests
      await this.runTests();

      // Send to Slack if webhook is configured
      if (SLACK_WEBHOOK_URL) {
        await this.sendToSlack();
      } else {
        console.log('📤 Skipping Slack notification (webhook not configured)\n');
      }

      // Display summary
      this.displaySummary();

      // Exit with appropriate code
      const exitCode = this.results.failed > 0 ? 1 : 0;
      process.exit(exitCode);
    } catch (error) {
      console.error('❌ Error during test execution:', error.message);
      process.exit(1);
    }
  }
}

// Run the test runner
const runner = new PlaywrightTestRunner();
runner.run();
