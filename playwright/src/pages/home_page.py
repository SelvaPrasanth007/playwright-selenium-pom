from playwright.async_api import Page, Locator
from typing import List, Dict, Any


class HomePage:
    """Page Object for Home/Inventory Page of Sauce Demo"""

    def __init__(self, page: Page):
        self.page = page
        self.product_container: Locator = page.locator('.inventory_container')
        self.product_items: Locator = page.locator('.inventory_item')
        self.filter_container: Locator = page.locator('.product_sort_container')
        self.sort_dropdown: Locator = page.locator('[data-test="product_sort_container"]')
        self.add_to_cart_buttons: Locator = page.locator('button[data-test*="add-to-cart"]')
        self.cart_badge: Locator = page.locator('.shopping_cart_badge')
        self.hamburger_button: Locator = page.locator('#react-burger-menu-btn')

    async def is_home_page_visible(self) -> bool:
        """Verify home page is visible"""
        return await self.product_container.is_visible()

    async def get_product_count(self) -> int:
        """Get number of products"""
        return await self.product_items.count()

    async def get_product_titles(self) -> List[str]:
        """Get all product titles"""
        return await self.product_items.locator('.inventory_item_name').all_text_contents()

    async def get_product_prices(self) -> List[str]:
        """Get all product prices"""
        return await self.product_items.locator('.inventory_item_price').all_text_contents()

    async def get_product_details(self, index: int) -> Dict[str, str]:
        """Get details of specific product"""
        product = self.product_items.nth(index)
        title = await product.locator('.inventory_item_name').text_content() or ''
        price = await product.locator('.inventory_item_price').text_content() or ''
        description = await product.locator('.inventory_item_desc').text_content() or ''
        return {'title': title, 'price': price, 'description': description}

    async def add_to_cart(self, product_index: int) -> None:
        """Add product to cart by index"""
        await self.add_to_cart_buttons.nth(product_index).click()

    async def add_to_cart_by_name(self, product_name: str) -> None:
        """Add product to cart by name"""
        product = self.product_items.filter(
            has=self.page.locator(f':has-text("{product_name}")')
        ).first
        button = product.locator('button[data-test*="add-to-cart"]')
        await button.click()

    async def get_cart_item_count(self) -> str:
        """Get cart item count from badge"""
        return await self.cart_badge.text_content() or '0'

    async def open_hamburger_menu(self) -> None:
        """Open hamburger menu"""
        await self.hamburger_button.click()

    async def is_hamburger_menu_visible(self) -> bool:
        """Check if hamburger menu button is visible"""
        return await self.hamburger_button.is_visible()

    async def sort_by_price_low_to_high(self) -> None:
        """Sort products by price low to high"""
        await self.sort_dropdown.select_option('lohi')

    async def sort_by_price_high_to_low(self) -> None:
        """Sort products by price high to low"""
        await self.sort_dropdown.select_option('hilo')

    async def sort_by_name(self) -> None:
        """Sort products by name"""
        await self.sort_dropdown.select_option('az')

    async def verify_product_card_visible(self, product_name: str) -> bool:
        """Verify product card is visible"""
        product = self.product_items.filter(
            has=self.page.locator(f':has-text("{product_name}")')
        )
        return await product.is_visible()
