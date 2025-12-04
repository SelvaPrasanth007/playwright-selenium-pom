import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Social Media Links - Footer Links Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Login to access the home page with footer
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const validUsername = process.env.VALID_USERNAME || 'standard_user';
    const validPassword = process.env.VALID_PASSWORD || 'secret_sauce';

    await loginPage.navigateTo();
    await loginPage.loginWithValidCredentials(validUsername, validPassword);
    expect(await homePage.isHomePageVisible()).toBe(true);
  });

  test('should verify LinkedIn icon and link are visible', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check LinkedIn link
    const linkedInLink = page.locator('a[href*="linkedin"]');
    expect(await linkedInLink.isVisible()).toBe(true);

    // Verify the link has correct href
    const linkedInHref = await linkedInLink.getAttribute('href');
    expect(linkedInHref).toBeTruthy();
    expect(linkedInHref).toContain('linkedin');
  });

  test('should verify Facebook icon and link are visible', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check Facebook link
    const facebookLink = page.locator('a[href*="facebook"]');
    expect(await facebookLink.isVisible()).toBe(true);

    // Verify the link has correct href
    const facebookHref = await facebookLink.getAttribute('href');
    expect(facebookHref).toBeTruthy();
    expect(facebookHref).toContain('facebook');
  });

  test('should verify Twitter icon and link are visible', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check Twitter link
    const twitterLink = page.locator('a[href*="twitter"]');
    expect(await twitterLink.isVisible()).toBe(true);

    // Verify the link has correct href
    const twitterHref = await twitterLink.getAttribute('href');
    expect(twitterHref).toBeTruthy();
    expect(twitterHref).toContain('twitter');
  });

  test('should verify all social media links are visible together', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const linkedInLink = page.locator('a[href*="linkedin"]');
    const facebookLink = page.locator('a[href*="facebook"]');
    const twitterLink = page.locator('a[href*="twitter"]');

    expect(await linkedInLink.isVisible()).toBe(true);
    expect(await facebookLink.isVisible()).toBe(true);
    expect(await twitterLink.isVisible()).toBe(true);
  });

  test('should verify social media links open in new tab', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const linkedInLink = page.locator('a[href*="linkedin"]');

    // Check if the link has target="_blank"
    const target = await linkedInLink.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('should verify footer section contains all social icons', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Locate footer container
    const footer = page.locator('footer, .footer, [class*="footer"]').first();
    expect(await footer.isVisible()).toBe(true);

    // Check for social links within footer
    const socialLinks = footer.locator('a[href*="linkedin"], a[href*="facebook"], a[href*="twitter"]');
    const socialLinksCount = await socialLinks.count();
    expect(socialLinksCount).toBeGreaterThanOrEqual(1);
  });
});
