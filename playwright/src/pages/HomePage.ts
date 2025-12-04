import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly productContainer: Locator;
  readonly productItems: Locator;
  readonly filterContainer: Locator;
  readonly sortDropdown: Locator;
  readonly addToCartButtons: Locator;
  readonly cartBadge: Locator;
  readonly hamburgerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productContainer = page.locator('.inventory_container');
    this.productItems = page.locator('.inventory_item');
    this.filterContainer = page.locator('.product_sort_container');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.addToCartButtons = page.locator('button[data-test*="add-to-cart"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.hamburgerButton = page.locator('#react-burger-menu-btn');
  }

  async isHomePageVisible(): Promise<boolean> {
    return await this.productContainer.isVisible();
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async getProductTitles(): Promise<string[]> {
    return await this.productItems.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return await this.productItems.locator('.inventory_item_price').allTextContents();
  }

  async getProductDetails(index: number): Promise<{ title: string; price: string; description: string }> {
    const product = this.productItems.nth(index);
    const title = await product.locator('.inventory_item_name').textContent() || '';
    const price = await product.locator('.inventory_item_price').textContent() || '';
    const description = await product.locator('.inventory_item_desc').textContent() || '';
    return { title, price, description };
  }

  async addToCart(productIndex: number): Promise<void> {
    await this.addToCartButtons.nth(productIndex).click();
  }

  async addToCartByName(productName: string): Promise<void> {
    const product = this.productItems.filter({ has: this.page.locator(`:has-text("${productName}")`) }).first();
    const button = product.locator('button[data-test*="add-to-cart"]');
    await button.click();
  }

  async getCartItemCount(): Promise<string> {
    return await this.cartBadge.textContent() || '0';
  }

  async openHamburgerMenu(): Promise<void> {
    await this.hamburgerButton.click();
  }

  async isHamburgerMenuVisible(): Promise<boolean> {
    return await this.hamburgerButton.isVisible();
  }

  async sortByPriceLowToHigh(): Promise<void> {
    await this.sortDropdown.selectOption('lohi');
  }

  async sortByPriceHighToLow(): Promise<void> {
    await this.sortDropdown.selectOption('hilo');
  }

  async sortByName(): Promise<void> {
    await this.sortDropdown.selectOption('az');
  }

  async verifyProductCardVisible(productName: string): Promise<boolean> {
    const product = this.productItems.filter({ has: this.page.locator(`:has-text("${productName}")`) });
    return await product.isVisible();
  }
}
