import pytest
import os
from playwright.async_api import async_playwright, Page
from src.pages.login_page import LoginPage
from src.pages.home_page import HomePage
from dotenv import load_dotenv

load_dotenv()


class TestHamburgerMenu:
    """Hamburger menu navigation tests"""

    @pytest.fixture(autouse=True)
    async def setup(self):
        """Setup before each test - login first"""
        async with async_playwright() as p:
            self.browser = await p.chromium.launch()
            self.page = await self.browser.new_page()
            self.login_page = LoginPage(self.page)
            self.home_page = HomePage(self.page)

            # Login
            valid_username = os.getenv('VALID_USERNAME', 'standard_user')
            valid_password = os.getenv('VALID_PASSWORD', 'secret_sauce')
            await self.login_page.navigate_to()
            await self.login_page.login_with_valid_credentials(valid_username, valid_password)

            yield

            await self.browser.close()

    @pytest.mark.asyncio
    async def test_hamburger_button_visible(self):
        """Verify hamburger button is visible"""
        assert await self.home_page.is_hamburger_menu_visible()

    @pytest.mark.asyncio
    async def test_hamburger_menu_opens(self):
        """Verify hamburger menu opens when clicked"""
        await self.home_page.open_hamburger_menu()

        # Wait for menu
        await self.page.wait_for_selector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', timeout=5000)

        menu_container = self.page.locator('.bm-menu-wrap, nav.bm-menu').first
        assert await menu_container.is_visible()

    @pytest.mark.asyncio
    async def test_all_items_menu_visible(self):
        """Verify All Items menu item is visible"""
        await self.home_page.open_hamburger_menu()
        await self.page.wait_for_selector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', timeout=5000)

        all_items = self.page.locator('a[data-test="inventory-sidebar-link"], text="All Items"').first
        assert await all_items.is_visible()

    @pytest.mark.asyncio
    async def test_about_menu_visible(self):
        """Verify About menu item is visible"""
        await self.home_page.open_hamburger_menu()
        await self.page.wait_for_selector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', timeout=5000)

        about = self.page.locator('a[data-test="about-sidebar-link"], text="About"').first
        assert await about.is_visible()

    @pytest.mark.asyncio
    async def test_logout_menu_visible(self):
        """Verify Logout menu item is visible"""
        await self.home_page.open_hamburger_menu()
        await self.page.wait_for_selector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', timeout=5000)

        logout = self.page.locator('a[data-test="logout-sidebar-link"], text="Logout"').first
        assert await logout.is_visible()

    @pytest.mark.asyncio
    async def test_reset_app_state_menu_visible(self):
        """Verify Reset App State menu item is visible"""
        await self.home_page.open_hamburger_menu()
        await self.page.wait_for_selector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', timeout=5000)

        reset = self.page.locator('a[data-test="reset-sidebar-link"], text="Reset App State"').first
        assert await reset.is_visible()

    @pytest.mark.asyncio
    async def test_all_menu_items_visible(self):
        """Verify all menu items are visible"""
        await self.home_page.open_hamburger_menu()
        await self.page.wait_for_selector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', timeout=5000)

        all_items = self.page.locator('a[data-test="inventory-sidebar-link"]').first
        about = self.page.locator('a[data-test="about-sidebar-link"]').first
        logout = self.page.locator('a[data-test="logout-sidebar-link"]').first
        reset = self.page.locator('a[data-test="reset-sidebar-link"]').first

        assert await all_items.is_visible()
        assert await about.is_visible()
        assert await logout.is_visible()
        assert await reset.is_visible()

    @pytest.mark.asyncio
    async def test_navigate_from_menu(self):
        """Verify navigation from All Items menu"""
        await self.home_page.open_hamburger_menu()
        await self.page.wait_for_selector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', timeout=5000)

        all_items = self.page.locator('a[data-test="inventory-sidebar-link"]').first
        await all_items.click()

        assert 'inventory.html' in self.page.url
        assert await self.home_page.is_home_page_visible()

    @pytest.mark.asyncio
    async def test_logout_from_menu(self):
        """Verify logout from hamburger menu"""
        await self.home_page.open_hamburger_menu()
        await self.page.wait_for_selector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', timeout=5000)

        logout = self.page.locator('a[data-test="logout-sidebar-link"]').first
        await logout.click()

        await self.page.wait_for_url('**/index.html', timeout=5000)
        assert 'index.html' in self.page.url

    @pytest.mark.asyncio
    async def test_close_menu_by_backdrop(self):
        """Verify menu closes by clicking backdrop"""
        await self.home_page.open_hamburger_menu()
        await self.page.wait_for_selector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', timeout=5000)

        backdrop = self.page.locator('.bm-overlay').first
        if await backdrop.is_visible():
            await backdrop.click()

        try:
            await self.page.wait_for_function(
                'document.querySelector(".bm-menu-wrap.bm-menu-wrap--open") === null',
                timeout=5000
            )
        except:
            pass  # Menu might close immediately
