import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartContainer: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly removeButtons: Locator;
  readonly cartBadge: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartContainer = page.locator('.cart_list');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
    this.removeButtons = page.locator('button[data-test*="remove"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.emptyCartMessage = page.locator('.empty_message');
  }

  async navigateToCart(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async isCartPageVisible(): Promise<boolean> {
    return await this.cartContainer.isVisible();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async getCartItemPrices(): Promise<string[]> {
    return await this.cartItemPrices.allTextContents();
  }

  async verifyProductInCart(productName: string): Promise<boolean> {
    const items = await this.getCartItemNames();
    return items.some(item => item.includes(productName));
  }

  async removeFromCart(productIndex: number): Promise<void> {
    await this.removeButtons.nth(productIndex).click();
  }

  async removeFromCartByName(productName: string): Promise<void> {
    const item = this.cartItems.filter({ has: this.page.locator(`:has-text("${productName}")`) }).first();
    const removeButton = item.locator('button[data-test*="remove"]');
    await removeButton.click();
  }

  async continueShoppingClick(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.page.waitForURL('**/inventory.html');
  }

  async checkoutClick(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout-step-one.html');
  }

  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.checkoutButton.isVisible();
  }

  async isContinueShoppingButtonVisible(): Promise<boolean> {
    return await this.continueShoppingButton.isVisible();
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.cartBadge.textContent() || '0';
  }
}
