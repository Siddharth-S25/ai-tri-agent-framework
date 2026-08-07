const { test, expect } = require("@playwright/test");
const LoginPage   = require("../../pages/LoginPage");
const ProductPage = require("../../pages/ProductPage");
const CartPage    = require("../../pages/CartPage");

const USERNAME = process.env.TEST_EMAIL    || "standard_user";
const PASSWORD = process.env.TEST_PASSWORD || "secret_sauce";

test.describe("SauceDemo Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.waitForTimeout(2000);
    await page.goto("https://www.saucedemo.com/");
    await page.waitForLoadState("domcontentloaded");
  });

 /* test("TC001 — Valid login → assert URL is /inventory.html", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(productPage.getCartBadge()).toBeVisible();
  }); */
  test('TC001 — Valid login → assert URL is /inventory.html', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test("TC002 — Invalid login → assert error message visible", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.enterEmail("wrong_user");
    await loginPage.enterPassword("wrong_pass");
    await loginPage.clickLoginButton();

    await expect(loginPage.getErrorMessage()).toBeVisible();
    await expect(loginPage.getErrorMessage()).toContainText("Username and password do not match");
  });

  test("TC003 — Add to cart → assert cart badge shows 1", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await productPage.addFirstProductToCart();

    await expect(productPage.getCartBadge()).toBeVisible();
    await expect(productPage.getCartBadge()).toContainText("1");
  });

  test("TC004 — Verify cart → assert cart has 1 item", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await productPage.addFirstProductToCart();
    await productPage.goToCart();

    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    await expect(cartPage.getCartItems()).toHaveCount(1);
  });

  test("TC005 — Remove from cart → assert cart has 0 items", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await productPage.addFirstProductToCart();
    await productPage.goToCart();

    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    await cartPage.removeFirstItem();

    await expect(cartPage.getCartItems()).toHaveCount(0);
  });
});