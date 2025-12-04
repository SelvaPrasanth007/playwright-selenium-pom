# Playwright Sauce Demo Test Suite

A comprehensive Playwright TypeScript test automation framework using the Page Object Model (POM) pattern for testing the Sauce Demo application (https://www.saucedemo.com).

## Project Structure

```
playwright/
├── src/
│   ├── pages/
│   │   ├── LoginPage.ts         # Login page object model
│   │   ├── HomePage.ts          # Home/inventory page object model
│   │   └── CartPage.ts          # Shopping cart page object model
│   ├── utils/
│   │   └── ExcelUtility.ts      # Excel file reader utility using xlsx library
│   └── fixtures.ts              # Playwright fixtures for reusable test setup
├── tests/
│   ├── example.spec.ts          # Example tests
│   ├── login.spec.ts            # Login feature tests (data-driven with Excel)
│   ├── socialMedia.spec.ts      # Social media links verification tests
│   └── hamburgerMenu.spec.ts    # Hamburger menu navigation tests
├── test-data/
│   └── login-data.xlsx          # Excel file with test data for login tests
├── .env                         # Environment variables (credentials, base URL)
├── .env.example                 # Example environment variables template
├── package.json                 # Project dependencies
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## Features

✅ **Page Object Model (POM)** - Well-organized page classes for maintainability
✅ **Environment Configuration** - .env support for credentials and base URL
✅ **Data-Driven Testing** - Excel integration for test data management
✅ **Reusable Fixtures** - Playwright fixtures for common test setup
✅ **TypeScript** - Full TypeScript support with strict type checking
✅ **Multiple Test Suites**:
   - Login feature tests with valid/invalid credentials
   - Social media links verification
   - Hamburger menu navigation tests
   - Product page interactions

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your credentials (defaults are provided for Sauce Demo):
   ```env
   VALID_USERNAME=standard_user
   VALID_PASSWORD=secret_sauce
   INVALID_USERNAME=invalid_user
   INVALID_PASSWORD=invalid_password
   BASE_URL=https://www.saucedemo.com
   HEADLESS=true
   ```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode (see browser)
```bash
npm run test:headed
```

### Run Specific Test File
```bash
npx playwright test tests/login.spec.ts
```

### Run Tests with Debugging
```bash
npx playwright test --debug
```

### Run Tests in UI Mode (interactive)
```bash
npx playwright test --ui
```

### Generate HTML Report
```bash
npx playwright show-report
```

## Test Suites

### 1. Login Tests (`tests/login.spec.ts`)
Data-driven tests reading credentials from Excel file with various scenarios:
- Valid login with standard user
- Locked user account
- Invalid credentials
- Missing username/password
- Environment variable-based credentials

**Excel file location:** `test-data/login-data.xlsx`

### 2. Social Media Links Tests (`tests/socialMedia.spec.ts`)
Verifies social media icons and links in footer:
- LinkedIn link visibility and href verification
- Facebook link visibility and href verification
- Twitter link visibility and href verification
- Links open in new tab (target="_blank")
- Footer section contains all social icons

### 3. Hamburger Menu Tests (`tests/hamburgerMenu.spec.ts`)
Navigation menu verification:
- Hamburger button visibility
- Menu opens/closes functionality
- All menu items visible (All Items, About, Logout, Reset App State)
- Navigation from menu items
- Logout functionality
- Menu closing by clicking backdrop

### 4. Example Tests (`tests/example.spec.ts`)
Basic example tests demonstrating:
- Login and homepage navigation
- Product title retrieval

## Page Object Models

### LoginPage (`src/pages/LoginPage.ts`)
**Locators:**
- `usernameInput` - Username field
- `passwordInput` - Password field
- `loginButton` - Login button
- `errorMessage` - Error message container

**Methods:**
- `navigateTo()` - Navigate to login page
- `login(username, password)` - Perform login
- `loginWithValidCredentials(username, password)` - Login and wait for products page
- `loginWithInvalidCredentials(username, password)` - Login and return error message
- `isErrorMessageVisible()` - Check if error message is shown
- `getErrorMessage()` - Get error message text

### HomePage (`src/pages/HomePage.ts`)
**Locators:**
- `productContainer` - Products list container
- `productItems` - Individual product items
- `sortDropdown` - Sort/filter dropdown
- `addToCartButtons` - Add to cart buttons
- `cartBadge` - Cart item count badge
- `hamburgerButton` - Hamburger menu button

**Methods:**
- `isHomePageVisible()` - Verify products page is visible
- `getProductCount()` - Get number of products
- `getProductTitles()` - Get all product titles
- `getProductPrices()` - Get all product prices
- `getProductDetails(index)` - Get details of specific product
- `addToCart(productIndex)` - Add product to cart
- `addToCartByName(productName)` - Add product by name
- `sortByPriceLowToHigh()` - Sort products by price
- `openHamburgerMenu()` - Open hamburger menu
- `isHamburgerMenuVisible()` - Check if hamburger button visible

### CartPage (`src/pages/CartPage.ts`)
**Locators:**
- `cartItems` - Items in cart
- `cartItemNames` - Product names in cart
- `removeButtons` - Remove item buttons
- `checkoutButton` - Checkout button
- `continueShoppingButton` - Continue shopping button

**Methods:**
- `navigateToCart()` - Navigate to cart page
- `isCartPageVisible()` - Verify cart page is visible
- `getCartItemCount()` - Get number of items in cart
- `getCartItemNames()` - Get all product names in cart
- `verifyProductInCart(productName)` - Verify specific product in cart
- `removeFromCart(productIndex)` - Remove product from cart
- `continueShoppingClick()` - Click continue shopping
- `checkoutClick()` - Click checkout

## Utilities

### ExcelUtility (`src/utils/ExcelUtility.ts`)
Utility class for reading/writing Excel files using `xlsx` library:

```typescript
// Read test data from Excel
const excelUtil = new ExcelUtility('./test-data/login-data.xlsx');
const data = excelUtil.readExcelFile('LoginTestData');

// Get specific row
const row = excelUtil.getRowData('LoginTestData', 0);

// Get specific column
const usernames = excelUtil.getColumnData('LoginTestData', 'username');
```

## Dependencies

### Runtime
- `dotenv` - Environment variable management
- `xlsx` - Excel file reading/writing

### Dev Dependencies
- `@playwright/test` - Playwright testing framework
- `@types/node` - TypeScript definitions for Node.js
- `typescript` - TypeScript compiler

## Configuration

### Playwright Config (`playwright.config.ts`)
- **testDir:** `./tests` - Test files directory
- **timeout:** 30 seconds per test
- **reporter:** HTML report generation
- **screenshot:** Only on test failure
- **trace:** Recording on first retry

### TypeScript Config (`tsconfig.json`)
- **target:** ES2020
- **module:** CommonJS
- **strict:** Full strict type checking enabled

## Environment Variables

Create a `.env` file with the following variables:

```env
# Credentials
VALID_USERNAME=standard_user
VALID_PASSWORD=secret_sauce
INVALID_USERNAME=invalid_user
INVALID_PASSWORD=invalid_password

# Base URL
BASE_URL=https://www.saucedemo.com

# Browser settings
HEADLESS=true
SLOW_MO=0
```

## Best Practices Implemented

1. **Page Object Model** - Separates test logic from UI interactions
2. **Environment Configuration** - Sensitive data stored in .env files
3. **Data-Driven Testing** - Test data in Excel files for easy maintenance
4. **Reusable Fixtures** - Common setup code in fixtures
5. **TypeScript** - Type safety and better IDE support
6. **Descriptive Test Names** - Clear test purposes
7. **Error Handling** - Proper wait and error message handling
8. **DRY Principle** - Utility methods reduce code duplication

## Troubleshooting

### Tests fail with "Target page, context or browser has been closed"
- Ensure tests don't close the browser/page unexpectedly
- Check for proper error handling in test setup

### Excel file not found error
- Verify `test-data/login-data.xlsx` exists
- Check file path in test spec

### Elements not found
- Run tests in headed mode to see what's happening
- Verify selectors match current application UI
- Check for element visibility and wait conditions

### Port already in use
- Ensure no other instances are running
- Kill process on the port and retry

## CI/CD Integration

Set environment variable for CI:
```bash
CI=true npm test
```

This runs tests with:
- Single worker (instead of parallel)
- Retry on failure
- HTML report generation

## Contributing

1. Add new test specs in `tests/` directory
2. Create corresponding page objects in `src/pages/`
3. Follow existing naming conventions
4. Update README with new features
5. Ensure TypeScript compilation passes

## License

This project is licensed under the MIT License.

## Author

Automated Test Suite for Sauce Demo Application

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Sauce Demo Application](https://www.saucedemo.com)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [XLSX Documentation](https://docs.sheetjs.com)
