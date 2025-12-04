#!/bin/bash

# Slack integration for test results
# This script runs tests and sends results to Slack
# Set SLACK_WEBHOOK_URL and CI_BUILD_URL environment variables before running

set -e

SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
CI_BUILD_URL="${CI_BUILD_URL:-https://github.com/SelvaPrasanth007/playwright-selenium-pom}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "$SLACK_WEBHOOK_URL" ]; then
  echo "⚠️  Warning: SLACK_WEBHOOK_URL environment variable not set"
  echo "Set it with: export SLACK_WEBHOOK_URL='your-webhook-url'"
fi

echo "🚀 Starting test execution with Slack integration..."
echo "Project Directory: $PROJECT_DIR"
echo "Slack Webhook: ${SLACK_WEBHOOK_URL:0:50}..."

# Run API tests
echo "📡 Running API tests..."
cd "$PROJECT_DIR/api"
npm test -- --json --outputFile=test-results.json > api-test.log 2>&1 || true# Extract API test results
if [ -f test-results.json ]; then
  API_TESTS=$(jq '.numTotalTests // 0' test-results.json)
  API_PASSED=$(jq '.numPassedTests // 0' test-results.json)
  API_FAILED=$(jq '.numFailedTests // 0' test-results.json)
else
  API_TESTS=0
  API_PASSED=0
  API_FAILED=0
fi

echo "✅ API Tests: Total=$API_TESTS, Passed=$API_PASSED, Failed=$API_FAILED"

# Run Playwright tests
echo "🎭 Running Playwright tests..."
cd "$PROJECT_DIR/playwright"

# Run tests and capture results
npm test 2>&1 | tee playwright-test.log || true

# Parse Playwright test results from log
PLAYWRIGHT_SUMMARY=$(grep -E "passed|failed|skipped" playwright-test.log | tail -1 || echo "")

echo "✅ Test execution complete"
echo "Summary: $PLAYWRIGHT_SUMMARY"

# Prepare Slack message
echo "📤 Preparing Slack notification..."

# Create JSON payload for Slack
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')

# Build test summary
TEST_SUMMARY="
🧪 *API Tests*
• Total: $API_TESTS
• Passed: $API_PASSED ✅
• Failed: $API_FAILED ❌

🎭 *Playwright Tests*
• Status: Check GitHub Actions for details

🕐 *Test Run Time*
• Timestamp: $CURRENT_TIME

🔗 *Build Links*
• CI: $CI_BUILD_URL
• Repository: https://github.com/SelvaPrasanth007/playwright-selenium-pom
"

# Send to Slack using curl
SLACK_MESSAGE=$(cat <<EOF
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🧪 Test Results - Playwright & API",
        "emoji": true
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "$TEST_SUMMARY"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*API Total*\n$API_TESTS tests"
        },
        {
          "type": "mrkdwn",
          "text": "*API Passed*\n$API_PASSED ✅"
        },
        {
          "type": "mrkdwn",
          "text": "*API Failed*\n$API_FAILED ❌"
        },
        {
          "type": "mrkdwn",
          "text": "*Status*\n$([ $API_FAILED -eq 0 ] && echo 'Success ✅' || echo 'Failed ❌')"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View CI Build",
            "emoji": true
          },
          "value": "ci_build",
          "url": "$CI_BUILD_URL"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View Repository",
            "emoji": true
          },
          "value": "repo",
          "url": "https://github.com/SelvaPrasanth007/playwright-selenium-pom"
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "Test run completed at $CURRENT_TIME | <$CI_BUILD_URL|View Details>"
        }
      ]
    }
  ]
}
EOF
)

# Send to Slack
echo "📨 Sending notification to Slack..."
RESPONSE=$(curl -X POST -H 'Content-type: application/json' \
  --data "$SLACK_MESSAGE" \
  "$SLACK_WEBHOOK_URL" 2>&1)

echo "Slack Response: $RESPONSE"

if [ "$RESPONSE" == "ok" ]; then
  echo "✅ Slack notification sent successfully!"
else
  echo "⚠️ Slack notification may have failed: $RESPONSE"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📊 FINAL TEST SUMMARY"
echo "════════════════════════════════════════════════════════════════"
echo "API Tests: $API_PASSED/$API_TESTS passed"
echo "Status: $([ $API_FAILED -eq 0 ] && echo '✅ SUCCESS' || echo '❌ FAILED')"
echo "Slack: Notification sent to webhook"
echo "════════════════════════════════════════════════════════════════"
