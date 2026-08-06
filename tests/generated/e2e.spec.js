const { test, expect } = require('@playwright/test');
const LoginPage    = require('../../pages/LoginPage');
const ProductPage  = require('../../pages/ProductPage');
const CartPage     = require('../../pages/CartPage');

const USERNAME = process.env.TEST_EMAIL    || 'standard_user';
const PASSWORD = process.env.TEST_PASSWORD || 'secret_sauce';

test.describe('SauceDemo Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.waitForTimeout(2000);
    await page.goto('https://www.saucedemo.com/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC001 - Successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC002 - Failed login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.enterEmail('wrong_user');
    await loginPage.enterPassword('wrong_pass');
    await loginPage.clickLoginButton();
    await expect(loginPage.getErrorMessage()).toBeVisible();
    await expect(loginPage.getErrorMessage())
      .toContainText('Username and password do not match');
  });

  test('TC003 - Add first product to cart', async ({ page }) => {
    const loginPage   = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await productPage.addFirstProductToCart();
    await expect(productPage.getCartBadge()).toBeVisible();
    await expect(productPage.getCartBadge()).toHaveText('1');
  });

  test('TC004 - Verify product appears in cart', async ({ page }) => {
    const loginPage   = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage    = new CartPage(page);
    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();
    await productPage.addFirstProductToCart();
    await productPage.goToCart();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(cartPage.getCartItems()).toHaveCount(1);
  });

  test('TC005 - Remove product from cart', async ({ page }) => {
    const loginPage   = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage    = new CartPage(page);
    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();
    await productPage.addFirstProductToCart();
    await productPage.goToCart();
    await cartPage.removeFirstItem();
    await expect(cartPage.getCartItems()).toHaveCount(0);
  });

});