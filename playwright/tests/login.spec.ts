import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';
import { ExcelUtility } from '../src/utils/ExcelUtility';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const excelFilePath = path.join(__dirname, '../test-data/login-data.xlsx');
let loginData: any[] = [];

try {
  const excelUtility = new ExcelUtility(excelFilePath);
  loginData = excelUtility.readExcelFile('LoginTestData');
} catch (error) {
  console.error('Failed to read Excel file:', error);
}

test.describe('Login Feature - Excel Data Driven', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
  });

  if (loginData.length > 0) {
    loginData.forEach((data) => {
      if (data.expectedResult === 'success') {
        test(`should login successfully with username: ${data.username}`, async ({ page }) => {
          const loginPage = new LoginPage(page);
          const homePage = new HomePage(page);
          await loginPage.login(data.username as string, data.password as string);
          await expect(page).toHaveURL(/.*inventory.html/);
          expect(await homePage.isHomePageVisible()).toBe(true);
        });
      }

      if (data.expectedResult === 'locked') {
        test(`should show locked out error for username: ${data.username}`, async ({ page }) => {
          const loginPage = new LoginPage(page);
          await loginPage.login(data.username as string, data.password as string);
          expect(await loginPage.isErrorMessageVisible()).toBe(true);
          const errorMsg = await loginPage.getErrorMessage();
          expect(errorMsg).toContain('locked out');
        });
      }

      if (data.expectedResult === 'failed') {
        test(`should show error for invalid credentials: ${data.username}`, async ({ page }) => {
          const loginPage = new LoginPage(page);
          await loginPage.login(data.username as string, data.password as string);
          expect(await loginPage.isErrorMessageVisible()).toBe(true);
          const errorMsg = await loginPage.getErrorMessage();
          expect(errorMsg).toBeTruthy();
        });
      }

      if (data.expectedResult === 'error') {
        test(`should show error for missing ${data.username ? 'password' : 'username'}`, async ({ page }) => {
          const loginPage = new LoginPage(page);
          await loginPage.login(data.username as string, data.password as string);
          expect(await loginPage.isErrorMessageVisible()).toBe(true);
          const errorMsg = await loginPage.getErrorMessage();
          expect(errorMsg).toContain('required');
        });
      }
    });
  }

  test('should verify login page elements are visible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    expect(await loginPage.isLoginPageVisible()).toBe(true);
    expect(await loginPage.usernameInput.isVisible()).toBe(true);
    expect(await loginPage.passwordInput.isVisible()).toBe(true);
    expect(await loginPage.loginButton.isVisible()).toBe(true);
  });

  test('should verify valid login with environment variables', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const validUsername = process.env.VALID_USERNAME || 'standard_user';
    const validPassword = process.env.VALID_PASSWORD || 'secret_sauce';
    await loginPage.loginWithValidCredentials(validUsername, validPassword);
    expect(await homePage.isHomePageVisible()).toBe(true);
  });

  test('should verify invalid login shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const invalidUsername = process.env.INVALID_USERNAME || 'invalid_user';
    const invalidPassword = process.env.INVALID_PASSWORD || 'invalid_password';
    const errorMessage = await loginPage.loginWithInvalidCredentials(invalidUsername, invalidPassword);
    expect(errorMessage).toBeTruthy();
  });
});
