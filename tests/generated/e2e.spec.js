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

  test("TC001 — Valid login — assert URL is /inventory.html and .inventory_list visible", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);

    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    await expect(page.locator(".inventory_list")).toBeVisible();
  });

  test("TC002 — Locked user login — assert error message visible", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.enterEmail("locked_out_user");
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();

    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

  test("TC003 — Add to cart — assert cart badge shows 1", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);

    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();

    await productPage.addFirstProductToCart();

    await expect(productPage.getCartBadge()).toHaveText("1");
  });

  test("TC004 — Verify cart — navigate to cart, assert 1 item", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();

    await productPage.addFirstProductToCart();
    await productPage.goToCart();

    await expect(cartPage.getCartItems()).toHaveCount(1);
  });

  test("TC005 — Remove from cart — add item, go to cart, remove, assert isEmpty() count is 0", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await loginPage.enterEmail(USERNAME);
    await loginPage.enterPassword(PASSWORD);
    await loginPage.clickLoginButton();

    await productPage.addFirstProductToCart();
    await productPage.goToCart();

    await cartPage.removeFirstItem();
    await expect(cartPage.isEmpty()).toHaveCount(0);
  });
});