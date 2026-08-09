// src/agents/generatorAgent.js
// Agent 2 — GENERATOR
// test-plan.md वाचतो → POM Classes + Playwright Spec बनवतो

const { callAI }              = require('../aiClient');
const { readFile, writeFile } = require('../utils/fileHelper');
const { showBanner, showAgent, showSuccess, showError, showInfo } = require('../utils/display');

// ── POM Prompt ────────────────────────────────────────────────
const POM_PROMPT = [
  'You are a senior Playwright automation engineer.',
  'Generate a Page Object Model class for SauceDemo.',
  '',
  'SITE: https://www.saucedemo.com',
  '',
  'CRITICAL METHOD RULES:',
  '1. Getter methods that return locators MUST NOT be async:',
  '   WRONG: async getErrorMessage() { return this.locator; }',
  '   RIGHT: getErrorMessage() { return this.locator; }',
  '2. Only methods with await inside should be async',
  '3. Methods that return a locator directly = NOT async',
  '4. Methods that fill/click/goto = async',
  '',
  'GETTER METHODS — NEVER async:',
  '  getErrorMessage()   → return this.errorMessage;',
  '  getCartBadge()      → return this.cartBadge;',
  '  getCartItems()      → return this.cartItems;',
  '  getCartBadge()      → return this.cartBadge;',
  'CRITICAL OUTPUT RULES:',
  '1. Output ONLY raw JavaScript code',
  '2. NO markdown backticks anywhere',
  '3. NO ```javascript at start',
  '4. NO ``` at end',
  '5. Start directly with: const { expect } = require("@playwright/test");',
  '',
  'REAL SELECTORS — USE ONLY THESE:',
  'Login Page:',
  '  username:     page.locator("#user-name")',
  '  password:     page.locator("#password")',
  '  loginButton:  page.locator("#login-button")',
  '  errorMessage: page.locator("[data-test=error]")',
  '  inventoryList: page.locator(".inventory_list")',
  '',
  'Product Page:',
  '  inventoryItem:  page.locator(".inventory_item")',
  '  itemButton:     page.locator(".inventory_item").first().locator("button")',
  '  cartBadge:      page.locator(".shopping_cart_badge")',
  '  cartLink:       page.locator(".shopping_cart_link")',
  '  sortDropdown:   page.locator("[data-test=product-sort-container]")',
  '',
  'Cart Page:',
  '  cartItems:   page.locator(".cart_item")',
  '  itemName:    page.locator(".inventory_item_name").first()',
  '  removeBtn:   page.locator(".cart_item").first().locator("button")',
  '  checkoutBtn: page.locator("[data-test=checkout]")',
  '',
  'VALID CREDENTIALS:',
  '  username: standard_user',
  '  password: secret_sauce',
  '',
  'MANDATORY METHOD NAMES — USE EXACTLY THESE:',
  '',
  'LoginPage methods:',
  '  navigateToLoginPage() — navigate to login page',
  '  enterEmail(username)  — fill username field',
  '  enterPassword(pass)   — fill password field',
  '  clickLoginButton()    — click login button',
  '  login(user, pass)     — full login flow',
  '  getErrorMessage()     — return error locator',
  '  isLoggedIn()          — return true if logged in',
  '',
  'ProductPage methods:',
  '  navigateToProductsPage()   — go to inventory page',
  '  addFirstProductToCart()    — click first item add button',
  '  addProductByIndex(index)   — click nth item add button',
  '  getCartBadge()             — return cart badge locator',
  '  getCartCount()             — return cart count text',
  '  goToCart()                 — click cart link',
  '  sortBy(option)             — select sort option',
  '  getSearchedProductsHeading() — return title locator',
  '  searchProduct(name)        — filter by name',
  '  clickSearchButton()        — no-op for SauceDemo',
  '',
  'CartPage methods:',
  '  navigate()           — go to cart page',
  '  getCartItems()       — return cart items locator',
  '  getCartItemCount()   — return count of cart items',
  '  getFirstProductName() — return first item name text',
  '  removeFirstItem()    — click remove on first item',
  '  isEmpty()            — return true if cart empty',
  '  proceedToCheckout()  — click checkout button',
  '',
  'CLASS STRUCTURE:',
  'class ClassName {',
  '  constructor(page) {',
  '    this.page = page;',
  '    // define locators here',
  '  }',
  '  // async methods here',
  '}',
  'module.exports = ClassName;',
].join('\n');

// ── Spec Prompt ───────────────────────────────────────────────
const SPEC_PROMPT = [
  'You are a senior Playwright automation engineer.',
  'Generate a complete Playwright test spec file for SauceDemo.',
  '',
  'CRITICAL OUTPUT RULES:',
  '1. Output ONLY raw JavaScript code',
  '2. NO markdown backticks anywhere',
  '3. NO ```javascript at start',
  '4. NO ``` at end',
  '5. First line MUST be: const { test, expect } = require("@playwright/test");',
  '',
  'MANDATORY IMPORTS — USE EXACTLY:',
  'const { test, expect } = require("@playwright/test");',
  'const LoginPage   = require("../../pages/LoginPage");',
  'const ProductPage = require("../../pages/ProductPage");',
  'const CartPage    = require("../../pages/CartPage");',
  '',
  'CREDENTIALS:',
  'const USERNAME = process.env.TEST_EMAIL    || "standard_user";',
  'const PASSWORD = process.env.TEST_PASSWORD || "secret_sauce";',
  '',
  'MANDATORY TEST STRUCTURE:',
  'test.describe("SauceDemo Tests", () => {',
  '  test.beforeEach(async ({ page }) => {',
  '    await page.waitForTimeout(2000);',
  '    await page.goto("https://www.saucedemo.com/");',
  '    await page.waitForLoadState("domcontentloaded");',
  '  });',
  '  // tests here',
  '});',
  '',
  'MANDATORY RULES:',
  '1. ALWAYS use test.beforeEach — NEVER plain beforeEach',
  '2. ALWAYS add waitForTimeout(2000) as FIRST line in beforeEach',
  '3. ALWAYS add page.goto as SECOND line in beforeEach',
  '4. NEVER use hardcoded selectors — ALWAYS use POM methods',
  '5. Each test MUST be independent — no test depends on another',
  '6. ONLY use these URLs:',
  '   https://www.saucedemo.com/',
  '   https://www.saucedemo.com/inventory.html',
  '   https://www.saucedemo.com/cart.html',
  '   https://www.saucedemo.com/checkout-step-one.html',
  '',
  'MANDATORY METHOD NAMES — USE EXACTLY THESE:',
  'LoginPage:   navigateToLoginPage(), enterEmail(), enterPassword(),',
  '             clickLoginButton(), getErrorMessage(), isLoggedIn()',
  'ProductPage: navigateToProductsPage(), addFirstProductToCart(),',
  '             getCartBadge(), getCartCount(), goToCart()',
  'CartPage:    navigate(), getCartItems(), getCartItemCount(),',
  '             removeFirstItem(), isEmpty()',
  '',
  'ASSERTIONS TO USE:',
  '- URL check:     await expect(page).toHaveURL("url")',
  '- Visible:       await expect(locator).toBeVisible()',
  '- Text:          await expect(locator).toContainText("text")',
  '- Count:         await expect(locator).toHaveCount(number)',
  '- Text exact:    await expect(locator).toHaveText("text")',
].join('\n');

// ── Generate LoginPage ────────────────────────────────────────
async function generateLoginPage() {
  showInfo('Generating LoginPage.js...');

  const message = [
    'Generate a LoginPage class for SauceDemo login page.',
    'URL: https://www.saucedemo.com/',
    '',
    'Use EXACTLY these method names:',
    '  navigateToLoginPage()',
    '  enterEmail(username)',
    '  enterPassword(password)',
    '  clickLoginButton()',
    '  login(username, password)',
    '  getErrorMessage()',
    '  isLoggedIn()',
    '',
    'Use ONLY these selectors:',
    '  #user-name',
    '  #password',
    '  #login-button',
    '  [data-test="error"]',
    '  .inventory_list',
  ].join('\n');

  const code = await callAI(POM_PROMPT, message);
  const clean = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();
  writeFile('pages/LoginPage.js', clean);
  showSuccess('pages/LoginPage.js created');
}

// ── Generate ProductPage ──────────────────────────────────────
async function generateProductPage() {
  showInfo('Generating ProductPage.js...');

  const message = [
    'Generate a ProductPage class for SauceDemo inventory page.',
    'URL: https://www.saucedemo.com/inventory.html',
    '',
    'Use EXACTLY these method names:',
    '  navigateToProductsPage()',
    '  addFirstProductToCart()',
    '  addProductByIndex(index)',
    '  getCartBadge()',
    '  getCartCount()',
    '  goToCart()',
    '  sortBy(option)',
    '  getSearchedProductsHeading()',
    '  searchProduct(name)',
    '  clickSearchButton()',
    '',
    'Use ONLY these selectors:',
    '  .inventory_item',
    '  .inventory_item button',
    '  .shopping_cart_badge',
    '  .shopping_cart_link',
    '  [data-test="product-sort-container"]',
    '  .title',
  ].join('\n');

  const code = await callAI(POM_PROMPT, message);
  const clean = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();
  writeFile('pages/ProductPage.js', clean);
  showSuccess('pages/ProductPage.js created');
}

// ── Generate CartPage ─────────────────────────────────────────
async function generateCartPage() {
  showInfo('Generating CartPage.js...');

  const message = [
    'Generate a CartPage class for SauceDemo cart page.',
    'URL: https://www.saucedemo.com/cart.html',
    '',
    'Use EXACTLY these method names:',
    '  navigate()',
    '  getCartItems()',
    '  getCartItemCount()',
    '  getFirstProductName()',
    '  removeFirstItem()',
    '  isEmpty()',
    '  proceedToCheckout()',
    '',
    'Use ONLY these selectors:',
    '  .cart_item',
    '  .inventory_item_name',
    '  .cart_item button',
    '  [data-test="checkout"]',
    '  [data-test="continue-shopping"]',
  ].join('\n');

  const code = await callAI(POM_PROMPT, message);
  const clean = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();
  writeFile('pages/CartPage.js', clean);
  showSuccess('pages/CartPage.js created');
}

// ── Generate Spec ─────────────────────────────────────────────
async function generateSpec(testPlan) {
  showAgent('GENERATOR', 'Generating Playwright Spec...');

  const message = [
    'Generate a complete Playwright spec file based on this test plan:',
    '',
    testPlan,
    '',
    'GENERATE EXACTLY 5 TESTS:',
     'TC001 — Valid login → assert URL is /inventory.html',
    ' AND assert .inventory_list is visible',
    ' DO NOT assert cart badge — cart is empty after login',
    'TC002 — Invalid login → assert error message visible',
    'TC003 — Add to cart → assert cart badge shows 1',
    'TC004 — Verify cart → assert cart has 1 item',
    'TC005 — Remove from cart → assert cart has 0 items',
    '',
    'USE ONLY THESE POM METHODS:',
    'loginPage.navigateToLoginPage()',
    'loginPage.enterEmail(USERNAME)',
    'loginPage.enterPassword(PASSWORD)',
    'loginPage.clickLoginButton()',
    'loginPage.getErrorMessage()',
    'productPage.addFirstProductToCart()',
    'productPage.getCartBadge()',
    'productPage.goToCart()',
    'cartPage.getCartItems()',
    'cartPage.removeFirstItem()',
  ].join('\n');

  const code = await callAI(SPEC_PROMPT, message);
  const clean = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();
  writeFile('tests/generated/e2e.spec.js', clean);
  showSuccess('tests/generated/e2e.spec.js created');
}

// ── Main Function ─────────────────────────────────────────────
async function runGenerator() {
  showBanner('Agent 2 — GENERATOR');
  showAgent('GENERATOR', 'Reading test plan...');

  try {
    // Step 1 — Plan वाचा
    const testPlan = readFile('plans/test-plan.md');
    showSuccess('Test plan loaded — ' + testPlan.split('\n').length + ' lines');

    // Step 2 — POM Classes बनवा
    showAgent('GENERATOR', 'Generating POM Classes...');
    await generateLoginPage();
    await generateProductPage();
    await generateCartPage();

    // Step 3 — Spec बनवा
    await generateSpec(testPlan);

    // Step 4 — Summary
    console.log('\n📁 Generated Files:');
    console.log('   • pages/LoginPage.js');
    console.log('   • pages/ProductPage.js');
    console.log('   • pages/CartPage.js');
    console.log('   • tests/generated/e2e.spec.js');

    return { success: true };

  } catch (error) {
    showError('Generator failed: ' + error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { runGenerator };