import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';

test.describe('Sauce Demo Example Tests', () => {
  test('should verify home page is visible after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');

    const isVisible = await homePage.isHomePageVisible();
    expect(isVisible).toBe(true);
  });

  test('should get product titles from home page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');

    const titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
  });
});
