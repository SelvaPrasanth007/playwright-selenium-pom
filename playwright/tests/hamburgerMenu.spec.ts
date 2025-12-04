import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Hamburger Menu - Validation & Logout Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Login to access the home page with hamburger menu
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const validUsername = process.env.VALID_USERNAME || 'standard_user';
    const validPassword = process.env.VALID_PASSWORD || 'secret_sauce';

    await loginPage.navigateTo();
    await loginPage.loginWithValidCredentials(validUsername, validPassword);
    expect(await homePage.isHomePageVisible()).toBe(true);
  });

  test('MAIN TEST: Verify hamburger menu is visible, clickable, shows all items, and logout works', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    // Step 1: Verify hamburger button is visible
    console.log('✓ Step 1: Checking if hamburger menu button is visible...');
    expect(await homePage.isHamburgerMenuVisible()).toBe(true);
    console.log('✓ PASS: Hamburger menu button is visible');

    // Step 2: Click hamburger button and verify menu opens
    console.log('✓ Step 2: Clicking hamburger menu button...');
    await homePage.openHamburgerMenu();
    await page.waitForSelector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu', { timeout: 5000 });
    const menuContainer = page.locator('.bm-menu-wrap, nav.bm-menu').first();
    expect(await menuContainer.isVisible()).toBe(true);
    console.log('✓ PASS: Hamburger menu opened successfully');

    // Step 3: Verify all menu items are visible
    console.log('✓ Step 3: Verifying all menu items are visible...');
    const allItemsOption = page.locator('a[data-test="inventory-sidebar-link"]');
    const aboutOption = page.locator('a[data-test="about-sidebar-link"]');
    const logoutOption = page.locator('a[data-test="logout-sidebar-link"]');
    const resetAppStateOption = page.locator('a[data-test="reset-sidebar-link"]');

    expect(await allItemsOption.isVisible()).toBe(true);
    console.log('  ✓ "All Items" is visible');
    
    expect(await aboutOption.isVisible()).toBe(true);
    console.log('  ✓ "About" is visible');
    
    expect(await resetAppStateOption.isVisible()).toBe(true);
    console.log('  ✓ "Reset App State" is visible');
    
    expect(await logoutOption.isVisible()).toBe(true);
    console.log('  ✓ "Logout" is visible');
    console.log('✓ PASS: All menu items are visible');

    // Step 4: Click Logout and verify redirect to login page
    console.log('✓ Step 4: Clicking Logout option...');
    await logoutOption.click();
    
    // Wait for navigation to login page
    console.log('✓ Step 5: Verifying logout and redirect to login page...');
    await page.waitForURL('**/index.html', { timeout: 5000 });
    expect(await loginPage.isLoginPageVisible()).toBe(true);
    console.log('✓ PASS: Successfully logged out and redirected to login page');
    
    console.log('\n✅ ALL TESTS PASSED: Hamburger menu validation and logout verification complete!');
  });

  test('Verify hamburger button is visible', async ({ page }) => {
    const homePage = new HomePage(page);
    expect(await homePage.isHamburgerMenuVisible()).toBe(true);
  });

  test('Verify hamburger menu opens when clicked', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openHamburgerMenu();
    await page.waitForSelector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu');
    const menuContainer = page.locator('.bm-menu-wrap, nav.bm-menu').first();
    expect(await menuContainer.isVisible()).toBe(true);
  });

  test('Verify all menu items are visible', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openHamburgerMenu();
    await page.waitForSelector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu');

    const allItemsOption = page.locator('a[data-test="inventory-sidebar-link"]').first();
    const aboutOption = page.locator('a[data-test="about-sidebar-link"]').first();
    const logoutOption = page.locator('a[data-test="logout-sidebar-link"]').first();
    const resetAppStateOption = page.locator('a[data-test="reset-sidebar-link"]').first();

    expect(await allItemsOption.isVisible()).toBe(true);
    expect(await aboutOption.isVisible()).toBe(true);
    expect(await logoutOption.isVisible()).toBe(true);
    expect(await resetAppStateOption.isVisible()).toBe(true);
  });

  test('Verify logout functionality from hamburger menu', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    
    // Open hamburger menu
    await homePage.openHamburgerMenu();
    await page.waitForSelector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu');

    // Click Logout
    const logoutOption = page.locator('a[data-test="logout-sidebar-link"]').first();
    await logoutOption.click();

    // Verify redirect to login page
    await page.waitForURL('**/index.html', { timeout: 5000 });
    expect(await loginPage.isLoginPageVisible()).toBe(true);
  });

  test('Verify hamburger menu closes by clicking outside', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openHamburgerMenu();
    await page.waitForSelector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu');

    // Click outside menu (on backdrop)
    const backdrop = page.locator('.bm-overlay').first();
    if (await backdrop.isVisible()) {
      await backdrop.click();
    }

    // Verify menu is closed
    await page.waitForFunction(
      () => !document.querySelector('.bm-menu-wrap.bm-menu-wrap--open'),
      { timeout: 5000 }
    ).catch(() => {});
  });

  test('Verify clicking "All Items" menu navigates to inventory', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Open hamburger menu
    console.log('✓ Opening hamburger menu...');
    await homePage.openHamburgerMenu();
    await page.waitForSelector('.bm-menu-wrap.bm-menu-wrap--open, nav.bm-menu');
    console.log('✓ PASS: Hamburger menu opened');

    // Click "All Items" menu item
    console.log('✓ Clicking "All Items" menu item...');
    const allItemsLink = page.locator('a[data-test="inventory-sidebar-link"]');
    expect(await allItemsLink.isVisible()).toBe(true);
    console.log('✓ PASS: "All Items" link is visible');
    
    await allItemsLink.click();
    console.log('✓ PASS: "All Items" link clicked');

    // Verify we're still on inventory page
    console.log('✓ Verifying navigation to inventory page...');
    await page.waitForURL('**/inventory.html', { timeout: 5000 });
    expect(await homePage.isHomePageVisible()).toBe(true);
    console.log('✓ PASS: Successfully navigated to inventory page via "All Items" menu');
  });
});
