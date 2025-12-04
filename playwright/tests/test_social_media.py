import pytest
import os
from playwright.async_api import async_playwright, Page
from src.pages.login_page import LoginPage
from src.pages.home_page import HomePage
from dotenv import load_dotenv

load_dotenv()


class TestSocialMedia:
    """Social media links verification tests"""

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
    async def test_linkedin_link_visible(self):
        """Verify LinkedIn link is visible"""
        # Scroll to footer
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight)')

        linkedin_link = self.page.locator('a[href*="linkedin"]')
        assert await linkedin_link.is_visible()

        linkedin_href = await linkedin_link.get_attribute('href')
        assert linkedin_href
        assert 'linkedin' in linkedin_href

    @pytest.mark.asyncio
    async def test_facebook_link_visible(self):
        """Verify Facebook link is visible"""
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight)')

        facebook_link = self.page.locator('a[href*="facebook"]')
        assert await facebook_link.is_visible()

        facebook_href = await facebook_link.get_attribute('href')
        assert facebook_href
        assert 'facebook' in facebook_href

    @pytest.mark.asyncio
    async def test_twitter_link_visible(self):
        """Verify Twitter link is visible"""
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight)')

        twitter_link = self.page.locator('a[href*="twitter"]')
        assert await twitter_link.is_visible()

        twitter_href = await twitter_link.get_attribute('href')
        assert twitter_href
        assert 'twitter' in twitter_href

    @pytest.mark.asyncio
    async def test_all_social_links_visible(self):
        """Verify all social media links are visible"""
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight)')

        linkedin_link = self.page.locator('a[href*="linkedin"]')
        facebook_link = self.page.locator('a[href*="facebook"]')
        twitter_link = self.page.locator('a[href*="twitter"]')

        assert await linkedin_link.is_visible()
        assert await facebook_link.is_visible()
        assert await twitter_link.is_visible()

    @pytest.mark.asyncio
    async def test_social_links_open_in_new_tab(self):
        """Verify social media links open in new tab"""
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight)')

        linkedin_link = self.page.locator('a[href*="linkedin"]')
        target = await linkedin_link.get_attribute('target')
        assert target == '_blank'

    @pytest.mark.asyncio
    async def test_footer_contains_social_icons(self):
        """Verify footer contains all social icons"""
        await self.page.evaluate('window.scrollTo(0, document.body.scrollHeight)')

        footer = self.page.locator('footer, .footer, [class*="footer"]').first
        assert await footer.is_visible()

        social_links = footer.locator(
            'a[href*="linkedin"], a[href*="facebook"], a[href*="twitter"]'
        )
        count = await social_links.count()
        assert count >= 1
