import pytest
import os
from pathlib import Path
from playwright.async_api import async_playwright, Page
from src.pages.login_page import LoginPage
from src.pages.home_page import HomePage
from src.utils.excel_utility import ExcelUtility
from dotenv import load_dotenv

load_dotenv()

# Get test data
excel_file_path = Path(__file__).parent.parent / 'test-data' / 'login-data.xlsx'
excel_utility = ExcelUtility(str(excel_file_path))

try:
    login_data = excel_utility.read_excel_file('LoginTestData')
except Exception as e:
    print(f'Failed to read Excel file: {e}')
    login_data = []


class TestLogin:
    """Login feature tests - Data driven from Excel"""

    @pytest.fixture(autouse=True)
    async def setup(self):
        """Setup before each test"""
        async with async_playwright() as p:
            self.browser = await p.chromium.launch()
            self.page = await self.browser.new_page()
            self.login_page = LoginPage(self.page)
            await self.login_page.navigate_to()
            yield
            await self.browser.close()

    @pytest.mark.asyncio
    async def test_login_page_visible(self):
        """Verify login page is visible"""
        assert await self.login_page.is_login_page_visible()
        assert await self.login_page.username_input.is_visible()
        assert await self.login_page.password_input.is_visible()
        assert await self.login_page.login_button.is_visible()

    @pytest.mark.asyncio
    async def test_valid_login_with_env_vars(self):
        """Verify valid login with environment variables"""
        valid_username = os.getenv('VALID_USERNAME', 'standard_user')
        valid_password = os.getenv('VALID_PASSWORD', 'secret_sauce')
        home_page = HomePage(self.page)

        await self.login_page.login_with_valid_credentials(valid_username, valid_password)
        assert await home_page.is_home_page_visible()

    @pytest.mark.asyncio
    async def test_invalid_login_shows_error(self):
        """Verify invalid login shows error"""
        invalid_username = os.getenv('INVALID_USERNAME', 'invalid_user')
        invalid_password = os.getenv('INVALID_PASSWORD', 'invalid_password')

        error_message = await self.login_page.login_with_invalid_credentials(
            invalid_username, invalid_password
        )
        assert error_message

    @pytest.mark.asyncio
    async def test_login_success(self):
        """Test successful login with standard_user"""
        home_page = HomePage(self.page)
        await self.login_page.login('standard_user', 'secret_sauce')
        assert await self.page.url.__contains__('inventory.html')
        assert await home_page.is_home_page_visible()

    @pytest.mark.asyncio
    async def test_login_locked_out_user(self):
        """Test locked out user"""
        await self.login_page.login('locked_out_user', 'secret_sauce')
        assert await self.login_page.is_error_message_visible()
        error_msg = await self.login_page.get_error_message()
        assert 'locked out' in error_msg

    @pytest.mark.asyncio
    async def test_login_invalid_credentials(self):
        """Test invalid credentials"""
        await self.login_page.login('invalid_user', 'invalid_pass')
        assert await self.login_page.is_error_message_visible()
        error_msg = await self.login_page.get_error_message()
        assert error_msg

    @pytest.mark.asyncio
    async def test_login_missing_username(self):
        """Test missing username"""
        await self.login_page.login('', 'secret_sauce')
        assert await self.login_page.is_error_message_visible()
        error_msg = await self.login_page.get_error_message()
        assert 'required' in error_msg.lower()

    @pytest.mark.asyncio
    async def test_login_missing_password(self):
        """Test missing password"""
        await self.login_page.login('standard_user', '')
        assert await self.login_page.is_error_message_visible()
        error_msg = await self.login_page.get_error_message()
        assert 'required' in error_msg.lower()
