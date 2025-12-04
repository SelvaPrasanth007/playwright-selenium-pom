# Python Quick Start Guide

## Project Overview
This is a fully functional Playwright Python test automation framework for testing the Sauce Demo application with:
- ✅ Page Object Model (POM) architecture
- ✅ Environment configuration support (.env)
- ✅ Excel-based data-driven testing using openpyxl
- ✅ Pytest with async/await support
- ✅ Multiple test suites (Login, Social Media, Hamburger Menu)
- ✅ Full type hints for Python 3.8+

## What's Been Created

### Page Object Classes (Python)
1. **login_page.py** - Login functionality with valid/invalid credential methods
2. **home_page.py** - Product listing, filtering, and cart operations
3. **cart_page.py** - Shopping cart operations

### Test Specifications (Python)
1. **test_login.py** - Data-driven login tests (reads from Excel)
2. **test_social_media.py** - Social media links verification
3. **test_hamburger_menu.py** - Navigation menu tests

### Utilities (Python)
- **excel_utility.py** - Read/write Excel files using openpyxl

### Configuration Files
- **.env** - Environment variables for credentials and base URL
- **requirements.txt** - Python dependencies
- **pytest.ini** - Pytest configuration
- **test-data/login-data.xlsx** - Sample test data

## Quick Start (5 minutes)

### 1. Navigate to Project
```bash
cd /home/zadmin/Desktop/playwright-selenium-pom/playwright
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install Playwright Browsers
```bash
playwright install
```

### 5. Run Tests
```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_login.py

# Run with coverage
pytest --cov=src tests/
```

## Test Scenarios Implemented

### 1. Login Tests (Data-Driven from Excel)
✅ Valid login with standard_user
✅ Locked out user scenario
✅ Invalid credentials
✅ Missing username
✅ Missing password
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
│   │   ├── login_page.py
│   │   ├── home_page.py
│   │   └── cart_page.py
│   ├── utils/          # Utility classes
│   │   └── excel_utility.py
│   └── __init__.py
├── tests/              # Test specifications
│   ├── test_login.py
│   ├── test_social_media.py
│   ├── test_hamburger_menu.py
│   └── __init__.py
├── test-data/          # Test data files
│   └── login-data.xlsx
├── .env                # Environment variables
├── requirements.txt    # Python dependencies
├── pytest.ini          # Pytest configuration
└── README_PYTHON.md    # Full documentation
```

## Environment Variables (.env)
```env
VALID_USERNAME=standard_user
VALID_PASSWORD=secret_sauce
INVALID_USERNAME=invalid_user
INVALID_PASSWORD=invalid_password
BASE_URL=https://www.saucedemo.com
```

## Available Pytest Commands

```bash
pytest                          # Run all tests
pytest -v                       # Verbose output
pytest tests/test_login.py      # Run specific file
pytest -k test_name             # Run by test name pattern
pytest --collect-only           # Show all tests without running
pytest --cov=src tests/         # Coverage report
pytest -x                       # Stop on first failure
pytest -s                       # Show print statements
```

## Adding New Tests

### 1. Create a new Page Object (if needed)
```python
# src/pages/new_page.py
from playwright.async_api import Page, Locator


class NewPage:
    def __init__(self, page: Page):
        self.page = page
        self.element: Locator = page.locator('selector')

    async def method_name(self) -> None:
        # Implementation
        pass
```

### 2. Create a new test file
```python
# tests/test_new_feature.py
import pytest
from src.pages.new_page import NewPage


class TestNewFeature:
    @pytest.fixture(autouse=True)
    async def setup(self):
        async with async_playwright() as p:
            self.browser = await p.chromium.launch()
            self.page = await self.browser.new_page()
            yield
            await self.browser.close()

    @pytest.mark.asyncio
    async def test_something(self):
        new_page = NewPage(self.page)
        # Test implementation
```

## Python-specific Features

✅ **Type Hints** - Full type annotations for IDE support
✅ **Async/Await** - Modern Python async patterns
✅ **Virtual Environment** - Isolated Python environment
✅ **Snake_case** - Python naming conventions
✅ **Pytest Fixtures** - Reusable test setup
✅ **Context Managers** - Proper resource cleanup

## Troubleshooting

### "No module named 'src'" error
- Ensure pytest.ini exists
- Run tests from the `playwright` directory
- Check `src/__init__.py` exists

### Virtual environment issues
```bash
# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Playwright browser not found
```bash
playwright install
```

### Import errors
- Activate virtual environment: `source venv/bin/activate`
- Verify dependencies: `pip install -r requirements.txt`

## Next Steps

1. **Run the tests** - `pytest -v`
2. **Review the code** - Check out the page objects and test specs
3. **Add your own tests** - Follow the pattern for new features
4. **Customize for your needs** - Update base URL, credentials, or selectors

## Key Features

✅ **Type-Safe** - Full type hints and mypy support
✅ **Maintainable** - Page Object Model pattern for easy updates
✅ **Data-Driven** - Excel integration for flexible test data
✅ **Configurable** - Environment variables for different environments
✅ **Well-Organized** - Clear folder structure and naming
✅ **Documented** - Comprehensive comments and README

Enjoy your Python automation tests! 🚀
