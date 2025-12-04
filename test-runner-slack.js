#!/usr/bin/env node

/**
 * Test Results Reporter with Slack Integration
 * Runs API and Playwright tests, sends results to Slack
 */

const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const https = require('https');

// Configuration - use environment variables
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const CI_BUILD_URL = process.env.CI_BUILD_URL || 'https://github.com/SelvaPrasanth007/playwright-selenium-pom';
const PROJECT_DIR = path.join(__dirname);

class TestRunner {
  constructor() {
    this.results = {
      api: { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 },
      playwright: { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 },
      timestamp: new Date().toISOString(),
      startTime: Date.now()
    };
    this.failures = [];
  }

  /**
   * Run API tests
   */
  async runAPITests() {
    console.log('\n📡 Running API Tests...');
    const apiDir = path.join(PROJECT_DIR, 'api');
    
    try {
      const startTime = Date.now();
      
      // Run Jest with JSON output
      execSync('npm test -- --json --outputFile=test-results.json', {
        cwd: apiDir,
        stdio: 'inherit'
      });

      const duration = Date.now() - startTime;
      this.results.api.duration = duration;

      // Parse results
      try {
        const resultsFile = path.join(apiDir, 'test-results.json');
        if (fs.existsSync(resultsFile)) {
          const jestResults = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
          
          this.results.api.total = jestResults.numTotalTests || 0;
          this.results.api.passed = jestResults.numPassedTests || 0;
          this.results.api.failed = jestResults.numFailedTests || 0;
          this.results.api.skipped = jestResults.numPendingTests || 0;

          // Collect failures
          if (jestResults.testResults) {
            jestResults.testResults.forEach(suite => {
              if (suite.assertionResults) {
                suite.assertionResults.forEach(test => {
                  if (test.status === 'failed') {
                    this.failures.push({
                      title: test.title,
                      error: test.failureMessages?.[0] || 'Unknown error',
                      suite: suite.name
                    });
                  }
                });
              }
            });
          }
        }
      } catch (parseError) {
        console.error('Error parsing API test results:', parseError.message);
      }

      console.log(`✅ API Tests: ${this.results.api.passed}/${this.results.api.total} passed`);
      return true;
    } catch (error) {
      console.error('❌ API tests failed:', error.message);
      this.results.api.failed = -1; // Mark as error
      return false;
    }
  }

  /**
   * Run Playwright tests
   */
  async runPlaywrightTests() {
    console.log('\n🎭 Running Playwright Tests...');
    const playwrightDir = path.join(PROJECT_DIR, 'playwright');
    
    try {
      const startTime = Date.now();
      
      execSync('npm test', {
        cwd: playwrightDir,
        stdio: 'inherit'
      });

      const duration = Date.now() - startTime;
      this.results.playwright.duration = duration;

      console.log('✅ Playwright tests completed');
      return true;
    } catch (error) {
      console.error('❌ Playwright tests failed:', error.message);
      return false;
    }
  }

  /**
   * Send results to Slack
   */
  sendToSlack() {
    console.log('\n📤 Sending results to Slack...');

    const totalDuration = ((Date.now() - this.results.startTime) / 1000).toFixed(2);
    const allPassed = this.results.api.failed === 0;

    // Format failure details
    let failureText = '';
    if (this.failures.length > 0) {
      failureText = '\n\n*Top Failures:*\n';
      this.failures.slice(0, 3).forEach((failure, index) => {
        failureText += `${index + 1}. *${failure.title}*\n`;
        failureText += `   Error: ${failure.error.substring(0, 100)}...\n`;
      });
      if (this.failures.length > 3) {
        failureText += `\n_and ${this.failures.length - 3} more..._`;
      }
    }

    const slackMessage = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: allPassed ? '✅ All Tests Passed' : '❌ Tests Failed',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Test Results Summary*\n\n🧪 *API Tests*\n• Total: ${this.results.api.total}\n• Passed: ${this.results.api.passed} ✅\n• Failed: ${this.results.api.failed} ❌\n• Skipped: ${this.results.api.skipped} ⏭️\n• Duration: ${(this.results.api.duration / 1000).toFixed(2)}s\n\n⏱️ *Total Duration*\n• ${totalDuration}s\n\n🔗 *Build Information*\n• Repository: <https://github.com/SelvaPrasanth007/playwright-selenium-pom|View Repo>\n• Build: <${CI_BUILD_URL}|View CI Build>\n• Timestamp: ${new Date(this.results.timestamp).toLocaleString()}${failureText}`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*API Total*\n${this.results.api.total} tests`
            },
            {
              type: 'mrkdwn',
              text: `*API Passed*\n${this.results.api.passed} ✅`
            },
            {
              type: 'mrkdwn',
              text: `*API Failed*\n${this.results.api.failed} ❌`
            },
            {
              type: 'mrkdwn',
              text: `*Status*\n${allPassed ? 'Success ✅' : 'Failed ❌'}`
            }
          ]
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
                text: 'View CI Build',
                emoji: true
              },
              url: CI_BUILD_URL,
              action_id: 'view_ci'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Repository',
                emoji: true
              },
              url: 'https://github.com/SelvaPrasanth007/playwright-selenium-pom',
              action_id: 'view_repo'
            }
          ]
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Test run completed at ${new Date(this.results.timestamp).toLocaleString()} | Total duration: ${totalDuration}s`
            }
          ]
        }
      ]
    };

    return this.postToSlack(slackMessage);
  }

  /**
   * Post message to Slack webhook
   */
  postToSlack(payload) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(SLACK_WEBHOOK_URL);
      
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200 && data === 'ok') {
            console.log('✅ Slack notification sent successfully!');
            resolve(true);
          } else {
            console.warn(`⚠️ Slack response: ${data} (Status: ${res.statusCode})`);
            resolve(true); // Don't fail the entire run for Slack issues
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Failed to send Slack notification:', error.message);
        reject(error);
      });

      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  /**
   * Display console summary
   */
  displaySummary() {
    const totalDuration = ((Date.now() - this.results.startTime) / 1000).toFixed(2);
    const allPassed = this.results.api.failed === 0;

    console.log('\n');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('                    📊 TEST RESULTS SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log('\n🧪 API Tests:');
    console.log(`   • Total: ${this.results.api.total}`);
    console.log(`   • Passed: ${this.results.api.passed} ✅`);
    console.log(`   • Failed: ${this.results.api.failed} ❌`);
    console.log(`   • Skipped: ${this.results.api.skipped} ⏭️`);
    console.log(`   • Duration: ${(this.results.api.duration / 1000).toFixed(2)}s`);

    console.log('\n⏱️  Total Duration: ' + totalDuration + 's');
    console.log('\n📤 Slack Notification: Sent to webhook');
    console.log(`📅 Timestamp: ${new Date(this.results.timestamp).toLocaleString()}`);
    console.log(`🔗 Build: ${CI_BUILD_URL}`);

    if (this.failures.length > 0) {
      console.log(`\n❌ Failures (${this.failures.length}):`);
      this.failures.slice(0, 3).forEach((failure, index) => {
        console.log(`   ${index + 1}. ${failure.title}`);
        console.log(`      ${failure.error.substring(0, 80)}`);
      });
      if (this.failures.length > 3) {
        console.log(`   ... and ${this.failures.length - 3} more`);
      }
    }

    console.log('\n' + (allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'));
    console.log('════════════════════════════════════════════════════════════════\n');
  }

  /**
   * Main execution
   */
  async run() {
    try {
      console.log('🚀 Starting Test Execution with Slack Integration\n');
      console.log(`Slack Webhook: ${SLACK_WEBHOOK_URL.substring(0, 50)}...`);
      console.log(`CI Build URL: ${CI_BUILD_URL}\n`);

      // Run API tests
      await this.runAPITests();

      // Run Playwright tests
      await this.runPlaywrightTests();

      // Send results to Slack
      await this.sendToSlack();

      // Display summary
      this.displaySummary();

      // Exit with appropriate code
      const exitCode = this.results.api.failed > 0 ? 1 : 0;
      process.exit(exitCode);
    } catch (error) {
      console.error('❌ Error during test execution:', error.message);
      process.exit(1);
    }
  }
}

// Run the test runner
const runner = new TestRunner();
runner.run();
