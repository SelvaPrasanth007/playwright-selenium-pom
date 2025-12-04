from playwright.async_api import Page, Locator
from typing import Optional


class LoginPage:
    """Page Object for Login Page of Sauce Demo"""

    def __init__(self, page: Page):
        self.page = page
        self.username_input: Locator = page.locator('#user-name')
        self.password_input: Locator = page.locator('#password')
        self.login_button: Locator = page.locator('#login-button')
        self.error_message: Locator = page.locator('[data-test="error"]')
        self.login_container: Locator = page.locator('.login_container')

    async def navigate_to(self) -> None:
        """Navigate to login page"""
        await self.page.goto('/')

    async def login(self, username: str, password: str) -> None:
        """Perform login with given credentials"""
        await self.username_input.fill(username)
        await self.password_input.fill(password)
        await self.login_button.click()

    async def login_with_valid_credentials(self, username: str, password: str) -> None:
        """Login and wait for products page"""
        await self.login(username, password)
        await self.page.wait_for_url('**/inventory.html')

    async def login_with_invalid_credentials(self, username: str, password: str) -> str:
        """Login with invalid credentials and return error message"""
        await self.login(username, password)
        return await self.error_message.text_content() or ''

    async def is_error_message_visible(self) -> bool:
        """Check if error message is visible"""
        return await self.error_message.is_visible()

    async def get_error_message(self) -> str:
        """Get error message text"""
        return await self.error_message.text_content() or ''

    async def is_login_page_visible(self) -> bool:
        """Check if login page is visible"""
        return await self.login_container.is_visible()
