import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginContainer = page.locator('.login_container');
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithValidCredentials(username: string, password: string): Promise<void> {
    await this.login(username, password);
    // Wait for navigation to products page
    await this.page.waitForURL('**/inventory.html');
  }

  async loginWithInvalidCredentials(username: string, password: string): Promise<string> {
    await this.login(username, password);
    // Return error message text
    return await this.errorMessage.textContent() || '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isLoginPageVisible(): Promise<boolean> {
    return await this.loginContainer.isVisible();
  }
}
