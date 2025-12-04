# Playwright Python Test Automation Suite

A comprehensive Playwright Python test automation framework using the Page Object Model (POM) pattern for testing the Sauce Demo application (https://www.saucedemo.com).

## Project Structure

```
playwright/
├── src/
│   ├── pages/
│   │   ├── login_page.py         # Login page object model
│   │   ├── home_page.py          # Home/inventory page object model
│   │   └── cart_page.py          # Shopping cart page object model
│   ├── utils/
│   │   └── excel_utility.py      # Excel file reader utility using openpyxl
│   └── __init__.py
├── tests/
│   ├── test_login.py            # Login feature tests (data-driven with Excel)
│   ├── test_social_media.py     # Social media links verification tests
│   ├── test_hamburger_menu.py   # Hamburger menu navigation tests
│   └── __init__.py
├── test-data/
│   └── login-data.xlsx          # Excel file with test data
├── .env                         # Environment variables (credentials, base URL)
├── .env.example                 # Example environment variables template
├── requirements.txt             # Python dependencies
├── pytest.ini                   # Pytest configuration
└── README.md                    # This file
```

## Features

✅ **Page Object Model (POM)** - Well-organized page classes for maintainability
✅ **Environment Configuration** - .env support for credentials and base URL
✅ **Data-Driven Testing** - Excel integration using openpyxl for test data management
✅ **Python 3.8+** - Async/await support with pytest-asyncio
✅ **Multiple Test Suites**:
   - Login feature tests with valid/invalid credentials
   - Social media links verification
   - Hamburger menu navigation tests
   - Product page interactions

## Installation

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Setup Steps

1. **Clone/Navigate to project:**
   ```bash
   cd playwright
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Playwright browsers:**
   ```bash
   playwright install
   ```

5. **Configure environment variables:**
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
   ```

## Running Tests

### Run All Tests
```bash
pytest
```

### Run Specific Test File
```bash
pytest tests/test_login.py
```

### Run Tests with Verbose Output
```bash
pytest -v
```

### Run Tests with Coverage
```bash
pytest --cov=src tests/
```

### Run Tests in Headed Mode (see browser)
For headed mode, modify the `setup` fixture in test files to add `headless=False`:
```python
self.browser = await p.chromium.launch(headless=False)
```

### Run Specific Test
```bash
pytest tests/test_login.py::TestLogin::test_valid_login_with_env_vars
```

## Test Suites

### 1. Login Tests (`tests/test_login.py`)
Data-driven tests with various scenarios:
- ✅ Valid login with standard_user
- ✅ Locked user account
- ✅ Invalid credentials
- ✅ Missing username
- ✅ Missing password
- ✅ Environment variable-based credentials

**Excel file location:** `test-data/login-data.xlsx`

### 2. Social Media Links Tests (`tests/test_social_media.py`)
Verifies social media icons and links in footer:
- ✅ LinkedIn link visibility and href verification
- ✅ Facebook link visibility and href verification
- ✅ Twitter link visibility and href verification
- ✅ Links open in new tab (target="_blank")
- ✅ Footer section contains all social icons

### 3. Hamburger Menu Tests (`tests/test_hamburger_menu.py`)
Navigation menu verification:
- ✅ Hamburger button visibility
- ✅ Menu opens when clicked
- ✅ All menu items visible (All Items, About, Logout, Reset App State)
- ✅ Navigation from menu items
- ✅ Logout functionality
- ✅ Menu closes by clicking backdrop

## Page Object Models

### LoginPage (`src/pages/login_page.py`)
**Methods:**
- `navigate_to()` - Navigate to login page
- `login(username, password)` - Perform login
- `login_with_valid_credentials(username, password)` - Login and wait for products page
- `login_with_invalid_credentials(username, password)` - Login and return error message
- `is_error_message_visible()` - Check if error message is shown
- `get_error_message()` - Get error message text
- `is_login_page_visible()` - Check if login page is visible

### HomePage (`src/pages/home_page.py`)
**Methods:**
- `is_home_page_visible()` - Verify products page is visible
- `get_product_count()` - Get number of products
- `get_product_titles()` - Get all product titles
- `get_product_prices()` - Get all product prices
- `get_product_details(index)` - Get details of specific product
- `add_to_cart(product_index)` - Add product to cart
- `add_to_cart_by_name(product_name)` - Add product by name
- `sort_by_price_low_to_high()` - Sort products by price
- `open_hamburger_menu()` - Open hamburger menu
- `is_hamburger_menu_visible()` - Check if hamburger button visible

### CartPage (`src/pages/cart_page.py`)
**Methods:**
- `navigate_to_cart()` - Navigate to cart page
- `is_cart_page_visible()` - Verify cart page is visible
- `get_cart_item_count()` - Get number of items in cart
- `get_cart_item_names()` - Get all product names in cart
- `verify_product_in_cart(product_name)` - Verify specific product in cart
- `remove_from_cart(product_index)` - Remove product from cart
- `continue_shopping_click()` - Click continue shopping
- `checkout_click()` - Click checkout

## Utilities

### ExcelUtility (`src/utils/excel_utility.py`)
Utility class for reading/writing Excel files using `openpyxl`:

```python
from src.utils.excel_utility import ExcelUtility

# Read test data from Excel
excel_util = ExcelUtility('./test-data/login-data.xlsx')
data = excel_util.read_excel_file('LoginTestData')

# Get specific row
row = excel_util.get_row_data('LoginTestData', 0)

# Get specific column
usernames = excel_util.get_column_data('LoginTestData', 'username')
```

## Dependencies

### Core Dependencies
- `playwright==1.40.0` - Browser automation library
- `pytest==7.4.3` - Testing framework
- `pytest-asyncio==0.21.1` - Async test support
- `python-dotenv==1.0.0` - Environment variable management
- `openpyxl==3.11.0` - Excel file handling

### Optional
- `pytest-cov==4.1.0` - Code coverage

## Configuration

### Pytest Config (`pytest.ini`)
- Configures async test support
- Sets up path for importing modules

### Environment Variables (.env)
```env
# Credentials
VALID_USERNAME=standard_user
VALID_PASSWORD=secret_sauce
INVALID_USERNAME=invalid_user
INVALID_PASSWORD=invalid_password

# Base URL
BASE_URL=https://www.saucedemo.com
```

## Best Practices Implemented

1. **Page Object Model** - Separates test logic from UI interactions
2. **Environment Configuration** - Sensitive data stored in .env files
3. **Data-Driven Testing** - Test data in Excel files for easy maintenance
4. **Async/Await** - Modern Python async patterns with pytest-asyncio
5. **Type Hints** - Full type annotations for better IDE support
6. **Descriptive Test Names** - Clear test purposes
7. **Error Handling** - Proper wait and error handling strategies
8. **DRY Principle** - Utility methods reduce code duplication

## Troubleshooting

### Tests fail with "No module named 'src'"
- Ensure you're running tests from the `playwright` directory
- Check that `src/__init__.py` exists
- Verify pytest.ini is present

### Excel file not found error
- Verify `test-data/login-data.xlsx` exists
- Check file path in test spec

### Elements not found
- Run tests with headless=False to see what's happening
- Verify selectors match current application UI
- Check for element visibility and wait conditions

### Import errors
- Ensure virtual environment is activated
- Verify all dependencies installed: `pip install -r requirements.txt`

## Virtual Environment

### Create Virtual Environment
```bash
python -m venv venv
```

### Activate Virtual Environment
```bash
# On Linux/Mac
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

### Deactivate Virtual Environment
```bash
deactivate
```

## Contributing

1. Add new test specs in `tests/` directory
2. Create corresponding page objects in `src/pages/`
3. Follow existing naming conventions (snake_case for Python)
4. Add type hints to all methods
5. Update README with new features
6. Ensure all tests pass: `pytest`

## CI/CD Integration

Run tests in CI/CD pipeline:
```bash
pip install -r requirements.txt
playwright install
pytest -v --cov=src tests/
```

## License

This project is licensed under the MIT License.

## Author

Automated Test Suite for Sauce Demo Application (Python Version)

## Resources

- [Playwright Python Documentation](https://playwright.dev/python/)
- [Sauce Demo Application](https://www.saucedemo.com)
- [Page Object Model Pattern](https://playwright.dev/python/docs/pom)
- [Pytest Documentation](https://docs.pytest.org)
- [Openpyxl Documentation](https://openpyxl.readthedocs.io)
