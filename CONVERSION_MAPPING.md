# TypeScript to Python Conversion Mapping

## Complete File Conversion Reference

### Page Objects

| TypeScript | Python | Changes |
|-----------|--------|---------|
| `src/pages/LoginPage.ts` | `src/pages/login_page.py` | snake_case naming, async/await, type hints |
| `src/pages/HomePage.ts` | `src/pages/home_page.py` | snake_case naming, async/await, type hints |
| `src/pages/CartPage.ts` | `src/pages/cart_page.py` | snake_case naming, async/await, type hints |

### Test Specifications

| TypeScript | Python | Changes |
|-----------|--------|---------|
| `tests/login.spec.ts` | `tests/test_login.py` | pytest format, fixture-based setup, pytest.mark.asyncio |
| `tests/socialMedia.spec.ts` | `tests/test_social_media.py` | pytest format, fixture-based setup, pytest.mark.asyncio |
| `tests/hamburgerMenu.spec.ts` | `tests/test_hamburger_menu.py` | pytest format, fixture-based setup, pytest.mark.asyncio |

### Utilities

| TypeScript | Python | Changes |
|-----------|--------|---------|
| `src/utils/ExcelUtility.ts` | `src/utils/excel_utility.py` | openpyxl instead of xlsx, snake_case methods, type hints |

### Configuration Files

| TypeScript | Python | Purpose |
|-----------|--------|---------|
| `package.json` | `requirements.txt` | Python dependency management |
| `playwright.config.ts` | `pytest.ini` | Test runner configuration |
| `tsconfig.json` | (removed) | Not needed for Python |
| `.env` | `.env` | Same format, environment variables |
| `fixtures.ts` | (built into each test) | Pytest fixtures in test files |

### New Python-specific Files

| File | Purpose |
|------|---------|
| `src/__init__.py` | Package initialization |
| `src/pages/__init__.py` | Pages package initialization |
| `src/utils/__init__.py` | Utils package initialization |
| `tests/__init__.py` | Tests package initialization |
| `pytest.ini` | Pytest configuration |
| `README_PYTHON.md` | Comprehensive Python documentation |
| `QUICK_START_PYTHON.md` | Python quick start guide |

## Language-Specific Conversions

### 1. Imports
**TypeScript:**
```typescript
import { Page, Locator } from '@playwright/test';
```

**Python:**
```python
from playwright.async_api import Page, Locator
from typing import List, Dict, Any
```

### 2. Class Definition
**TypeScript:**
```typescript
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
  }
}
```

**Python:**
```python
class LoginPage:
    """Page Object for Login Page"""
    
    def __init__(self, page: Page):
        self.page = page
        self.username_input: Locator = page.locator('#user-name')
```

### 3. Async Methods
**TypeScript:**
```typescript
async navigateTo(): Promise<void> {
  await this.page.goto('/');
}
```

**Python:**
```python
async def navigate_to(self) -> None:
    """Navigate to login page"""
    await self.page.goto('/')
```

### 4. Test Structure
**TypeScript:**
```typescript
test.describe('Login Feature', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo();
  });

  test('should login successfully', async ({ loginPage }) => {
    // Test code
  });
});
```

**Python:**
```python
class TestLogin:
    @pytest.fixture(autouse=True)
    async def setup(self):
        async with async_playwright() as p:
            self.browser = await p.chromium.launch()
            self.page = await self.browser.new_page()
            self.login_page = LoginPage(self.page)
            await self.login_page.navigate_to()
            yield
            await self.browser.close()

    @pytest.mark.asyncio
    async def test_should_login_successfully(self):
        # Test code
```

### 5. Excel Handling
**TypeScript (xlsx):**
```typescript
const worksheet = xlsx.utils.json_to_sheet(data);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
xlsx.writeFile(workbook, this.filePath);
```

**Python (openpyxl):**
```python
workbook = openpyxl.Workbook()
worksheet = workbook.active
worksheet.title = sheet_name

# Write headers and data...
workbook.save(self.file_path)
```

## Dependencies Conversion

### TypeScript Dependencies (npm)
```json
{
  "@playwright/test": "^1.40.0",
  "@types/node": "^20.10.0",
  "dotenv": "^16.3.1",
  "typescript": "^4.9.0",
  "xlsx": "^0.18.5"
}
```

### Python Dependencies (pip)
```
playwright==1.40.0
pytest==7.4.3
pytest-asyncio==0.21.1
python-dotenv==1.0.0
openpyxl==3.11.0
pytest-cov==4.1.0 (optional)
```

## Key Differences

### 1. Naming Conventions
- TypeScript: `camelCase` for methods and properties
- Python: `snake_case` for methods and properties

### 2. File Naming
- TypeScript: PascalCase (LoginPage.ts)
- Python: snake_case (login_page.py)

### 3. Type Annotations
- TypeScript: Inline type annotations
- Python: Type hints using `typing` module

### 4. Async Handling
- TypeScript: Built-in promise support in Playwright
- Python: `pytest-asyncio` for async test support

### 5. Test Framework
- TypeScript: Playwright's built-in test framework
- Python: pytest (more Pythonic)

### 6. Environment Variables
- Same format `.env`
- TypeScript: `dotenv` package
- Python: `python-dotenv` package

### 7. Excel Operations
- TypeScript: `xlsx` library (JavaScript-based)
- Python: `openpyxl` library (Python-native)

## Running Tests

### TypeScript (Original)
```bash
npm install
npm test
npm run test:headed
```

### Python (Converted)
```bash
pip install -r requirements.txt
pytest
pytest -v
pytest tests/test_login.py
```

## Setup Process

### TypeScript
```bash
npm install
npx playwright install
cp .env.example .env
npm test
```

### Python
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install
cp .env.example .env
pytest -v
```

## Summary

This conversion maintains feature parity between TypeScript and Python versions while adhering to language-specific best practices:

✅ Same test scenarios
✅ Same page object structure
✅ Same data-driven approach (Excel)
✅ Same functionality
✅ Python idioms and conventions
✅ Type hints for better IDE support
✅ Modern async/await patterns
✅ Pytest-based testing framework
