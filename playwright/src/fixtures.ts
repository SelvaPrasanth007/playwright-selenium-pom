import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import dotenv from 'dotenv';

dotenv.config();

type TestFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  cartPage: CartPage;
  validUsername: string;
  validPassword: string;
  invalidUsername: string;
  invalidPassword: string;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  validUsername: async ({}, use) => {
    await use(process.env.VALID_USERNAME || 'standard_user');
  },
  validPassword: async ({}, use) => {
    await use(process.env.VALID_PASSWORD || 'secret_sauce');
  },
  invalidUsername: async ({}, use) => {
    await use(process.env.INVALID_USERNAME || 'invalid_user');
  },
  invalidPassword: async ({}, use) => {
    await use(process.env.INVALID_PASSWORD || 'invalid_password');
  },
});

export { expect };
