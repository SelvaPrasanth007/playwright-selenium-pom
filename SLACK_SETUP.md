# Slack Integration Setup Guide

## Overview
Automatic Slack notifications are triggered after every Playwright test run. Test results including metrics, pass rate, and failure details are sent directly to your Slack channel.

## Configuration

The Slack integration uses environment variables that are automatically loaded from the `.env.slack` file in the `playwright/` directory.

### Setup Steps

1. **Create `.env.slack` file** (already created in `playwright/` directory):
   ```bash
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR_WEBHOOK_URL
   CI_BUILD_URL=https://github.com/your-repo/actions/runs/YOUR_BUILD_ID
   ```

2. **File Location**: 
   - `playwright/.env.slack` - ⚠️ **NEVER commit this file** (it's in `.gitignore`)

3. **Update Values**:
   - Replace `YOUR_WEBHOOK_URL` with your Slack Incoming Webhook URL
   - Replace `YOUR_BUILD_ID` with your CI build URL

## How It Works

### Automatic Loading
When you run `npm test`, the runner automatically:
1. Loads environment variables from `.env.slack`
2. Executes Playwright tests
3. Collects test metrics (total, passed, failed, skipped, flaky)
4. Sends formatted Slack message with:
   - ✅ Test counts and pass rate
   - ⏱️ Execution duration
   - 🔴 Top 3 failures with error details
   - 🔗 Links to CI build and repository
   - 📅 Timestamp

### Running Tests
Simply run the standard command - Slack notification is automatic:
```bash
cd playwright
npm test
```

Or from root directory:
```bash
npm -w playwright test
```

## Slack Message Format

Each Slack notification includes:
```
✅ All Playwright Tests Passed! (or ❌ Some Tests Failed)

📊 Test Results
• Total: 23
• Passed: 17 ✅
• Failed: 6 ❌
• Skipped: 0 ⏭️
• Flaky: 0 🔄

⏱️ Execution Time
• Duration: 97.48s

ℹ️ Environment
• Framework: Playwright (Local/CI)
• Browser: Chromium
• Timestamp: 12/4/2025, 6:42:42 PM

🔴 Top Failures (if any)
1. Test name
   Error message...
```

## Environment Variables

### SLACK_WEBHOOK_URL
- **Required**: Yes (for Slack notifications)
- **Format**: `https://hooks.slack.com/services/XXXXX/XXXXX/XXXXX`
- **How to Get**: 
  1. Go to your Slack workspace
  2. Create an Incoming Webhook integration
  3. Copy the webhook URL

### CI_BUILD_URL
- **Required**: No (defaults to repository URL)
- **Format**: `https://github.com/your-org/your-repo/actions/runs/BUILD_ID`
- **Purpose**: Provides clickable link in Slack message to your CI build

## Manual Override

If needed, you can override environment variables:
```bash
cd playwright
SLACK_WEBHOOK_URL='your-custom-url' CI_BUILD_URL='your-build-url' npm test
```

## Troubleshooting

### Slack notification not sent?
1. Check `.env.slack` file exists: `ls -la playwright/.env.slack`
2. Verify webhook URL is correct: `grep SLACK_WEBHOOK_URL playwright/.env.slack`
3. Check Slack workspace for messages
4. Verify webhook is still active in Slack settings

### Tests run but no Slack message?
- ⚠️ Warning message will show: "Slack webhook configured" means it's loaded
- ✅ Success message: "Slack notification sent successfully!" 
- 📤 If you see "Skipping Slack notification (webhook not configured)", the .env.slack file wasn't loaded

### How to create a Slack Incoming Webhook?
1. Go to https://api.slack.com/apps
2. Create a new app or select existing
3. Enable "Incoming Webhooks"
4. Add new webhook to desired channel
5. Copy the webhook URL to `.env.slack`

## Security Notes

- ⚠️ **NEVER commit `.env.slack` to git** (it contains secrets)
- `.env.slack` is in `.gitignore` - it's not tracked
- The webhook URL is sensitive - keep it confidential
- For CI/CD environments, use GitHub Secrets or equivalent

## Examples

### Running tests normally
```bash
cd /home/zadmin/Desktop/playwright-selenium-pom/playwright
npm test
```
Output:
```
✅ Slack webhook configured
📍 CI Build: https://github.com/SelvaPrasanth007/playwright-selenium-pom/actions/runs/19929219723
🎭 Running Playwright Tests...
📤 Sending results to Slack...
✅ Slack notification sent successfully!
```

### Optional: Override webhook for testing
```bash
SLACK_WEBHOOK_URL='https://hooks.slack.com/services/TEST/WEBHOOK/URL' npm test
```

## Next Steps

1. ✅ Verify `.env.slack` file exists: `ls -la playwright/.env.slack`
2. ✅ Run tests: `npm test`
3. ✅ Check Slack channel for notification
4. ✅ Confirm test metrics appear in message

## Support

For issues with:
- **Playwright tests**: Check `playwright-report/index.html`
- **Slack webhook**: Verify URL in Slack App settings
- **Environment variables**: Check `.env.slack` file exists
- **Git configuration**: Verify `.env.slack` in `.gitignore`
