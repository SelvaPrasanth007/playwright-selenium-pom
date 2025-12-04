from playwright.async_api import Page, Locator
from typing import List


class CartPage:
    """Page Object for Shopping Cart Page of Sauce Demo"""

    def __init__(self, page: Page):
        self.page = page
        self.cart_container: Locator = page.locator('.cart_list')
        self.cart_items: Locator = page.locator('.cart_item')
        self.cart_item_names: Locator = page.locator('.inventory_item_name')
        self.cart_item_prices: Locator = page.locator('.inventory_item_price')
        self.continue_shopping_button: Locator = page.locator('#continue-shopping')
        self.checkout_button: Locator = page.locator('#checkout')
        self.remove_buttons: Locator = page.locator('button[data-test*="remove"]')
        self.cart_badge: Locator = page.locator('.shopping_cart_badge')
        self.empty_cart_message: Locator = page.locator('.empty_message')

    async def navigate_to_cart(self) -> None:
        """Navigate to cart page"""
        await self.page.goto('/cart.html')

    async def is_cart_page_visible(self) -> bool:
        """Check if cart page is visible"""
        return await self.cart_container.is_visible()

    async def get_cart_item_count(self) -> int:
        """Get number of items in cart"""
        return await self.cart_items.count()

    async def get_cart_item_names(self) -> List[str]:
        """Get all product names in cart"""
        return await self.cart_item_names.all_text_contents()

    async def get_cart_item_prices(self) -> List[str]:
        """Get all product prices in cart"""
        return await self.cart_item_prices.all_text_contents()

    async def verify_product_in_cart(self, product_name: str) -> bool:
        """Verify specific product is in cart"""
        items = await self.get_cart_item_names()
        return any(product_name in item for item in items)

    async def remove_from_cart(self, product_index: int) -> None:
        """Remove product from cart by index"""
        await self.remove_buttons.nth(product_index).click()

    async def remove_from_cart_by_name(self, product_name: str) -> None:
        """Remove product from cart by name"""
        item = self.cart_items.filter(
            has=self.page.locator(f':has-text("{product_name}")')
        ).first
        remove_button = item.locator('button[data-test*="remove"]')
        await remove_button.click()

    async def continue_shopping_click(self) -> None:
        """Click continue shopping button"""
        await self.continue_shopping_button.click()
        await self.page.wait_for_url('**/inventory.html')

    async def checkout_click(self) -> None:
        """Click checkout button"""
        await self.checkout_button.click()
        await self.page.wait_for_url('**/checkout-step-one.html')

    async def is_checkout_button_visible(self) -> bool:
        """Check if checkout button is visible"""
        return await self.checkout_button.is_visible()

    async def is_continue_shopping_button_visible(self) -> bool:
        """Check if continue shopping button is visible"""
        return await self.continue_shopping_button.is_visible()

    async def is_cart_empty(self) -> bool:
        """Check if cart is empty"""
        return await self.empty_cart_message.is_visible()

    async def get_cart_badge_count(self) -> str:
        """Get cart badge count"""
        return await self.cart_badge.text_content() or '0'
