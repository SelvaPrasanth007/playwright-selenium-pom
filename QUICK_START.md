# Quick Start Guide

## Project Overview
This is a fully functional Playwright TypeScript test automation framework for testing the Sauce Demo application with:
- ✅ Page Object Model (POM) architecture
- ✅ Environment configuration support (.env)
- ✅ Excel-based data-driven testing
- ✅ Reusable Playwright fixtures
- ✅ Multiple test suites (Login, Social Media, Hamburger Menu)
- ✅ Full TypeScript support

## What's Been Created

### Page Object Classes
1. **LoginPage.ts** - Login functionality with valid/invalid credential methods
2. **HomePage.ts** - Product listing, filtering, and cart operations
3. **CartPage.ts** - Shopping cart operations

### Test Specifications
1. **login.spec.ts** - Data-driven login tests (reads from Excel)
2. **socialMedia.spec.ts** - Social media links verification
3. **hamburgerMenu.spec.ts** - Navigation menu tests
4. **example.spec.ts** - Basic example tests

### Utilities
- **ExcelUtility.ts** - Read/write Excel files using xlsx library

### Configuration Files
- **.env** - Environment variables for credentials and base URL
- **playwright.config.ts** - Playwright test configuration
- **tsconfig.json** - TypeScript compilation settings
- **package.json** - Dependencies and scripts
- **test-data/login-data.xlsx** - Sample test data

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd /home/zadmin/Desktop/playwright-selenium-pom/playwright
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npm run test:headed

# Run specific test file
npx playwright test tests/login.spec.ts

# Run with UI (interactive mode)
npx playwright test --ui

# Debug mode (step-by-step)
npx playwright test --debug
```

## Test Scenarios Implemented

### 1. Login Tests (Data-Driven from Excel)
✅ Valid login with standard_user
✅ Locked out user scenario
✅ Invalid credentials
✅ Missing username/password
✅ Environment variable-based credentials

### 2. Social Media Tests
✅ LinkedIn link visibility and href
✅ Facebook link visibility and href
✅ Twitter link visibility and href
✅ Links open in new tab
✅ Footer contains all social icons

### 3. Hamburger Menu Tests
✅ Hamburger button visibility
✅ Menu opens when clicked
✅ All menu items visible (All Items, About, Logout, Reset App State)
✅ Navigation from menu items
✅ Logout functionality
✅ Menu closes by clicking backdrop

## Project Structure

```
playwright/
├── src/
│   ├── pages/          # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── HomePage.ts
│   │   └── CartPage.ts
│   ├── utils/          # Utility classes
│   │   └── ExcelUtility.ts
│   └── fixtures.ts     # Playwright fixtures
├── tests/              # Test specifications
│   ├── login.spec.ts
│   ├── socialMedia.spec.ts
│   ├── hamburgerMenu.spec.ts
│   └── example.spec.ts
├── test-data/          # Test data files
│   └── login-data.xlsx
├── .env                # Environment variables
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Configuration

### Environment Variables (.env)
```env
VALID_USERNAME=standard_user
VALID_PASSWORD=secret_sauce
INVALID_USERNAME=invalid_user
INVALID_PASSWORD=invalid_password
BASE_URL=https://www.saucedemo.com
HEADLESS=true
```

## Available NPM Scripts

```bash
npm test              # Run all tests
npm run test:headed   # Run tests with browser visible
```

## Adding New Tests

### 1. Create a new Page Object (if needed)
```typescript
// src/pages/NewPage.ts
import { Page, Locator } from '@playwright/test';

export class NewPage {
  readonly page: Page;
  readonly element: Locator;

  constructor(page: Page) {
    this.page = page;
    this.element = page.locator('selector');
  }

  async methodName(): Promise<void> {
    // Implementation
  }
}
```

### 2. Create a new test file
```typescript
// tests/new-feature.spec.ts
import { test, expect } from '@playwright/test';
import { NewPage } from '../src/pages/NewPage';

test.describe('New Feature Tests', () => {
  test('should do something', async ({ page }) => {
    const newPage = new NewPage(page);
    // Test implementation
  });
});
```

## Reports

### View HTML Report
```bash
npx playwright show-report
```

### Test Results Location
```
test-results/
```

## Troubleshooting

### Tests fail with element not found
- Run tests in headed mode to see what's happening: `npm run test:headed`
- Check if selectors match the current application UI
- Use `--debug` mode to step through tests

### Dependencies installation fails
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

### TypeScript compilation errors
```bash
npx tsc --noEmit
```

## Documentation

- See `README.md` for detailed documentation
- Playwright Docs: https://playwright.dev
- Sauce Demo: https://www.saucedemo.com

## Next Steps

1. **Run the tests** - `npm test`
2. **Review the code** - Check out the page objects and test specs
3. **Add your own tests** - Follow the pattern for new features
4. **Customize for your needs** - Update base URL, credentials, or selectors

## Key Features

✅ **Type-Safe** - Full TypeScript support with strict checking
✅ **Maintainable** - Page Object Model pattern for easy updates
✅ **Data-Driven** - Excel integration for flexible test data
✅ **Configurable** - Environment variables for different environments
✅ **Well-Organized** - Clear folder structure and naming
✅ **Documented** - Comprehensive comments and README

Enjoy your automated testing! 🚀
