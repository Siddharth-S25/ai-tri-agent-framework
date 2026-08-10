// src/agents/generatorAgent.js
// Agent 2 — GENERATOR
// test-plan.md वाचतो → POM Classes + Playwright Spec बनवतो

const { callAI }              = require('../aiClient');
const { readFile, writeFile } = require('../utils/fileHelper');
const { showBanner, showAgent, showSuccess, showError, showInfo } = require('../utils/display');

// ── Delay Helper ──────────────────────────────────────────────
function delay(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

// ── Clean AI Output ───────────────────────────────────────────
function cleanCode(raw) {
  if (!raw || typeof raw !== 'string') {
    throw new Error('AI returned empty or null response');
  }
  return raw
    .replace(/```javascript\n?/g, '')
    .replace(/```js\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

// ── Safe AI Call with Retry ───────────────────────────────────
async function safeCallAI(prompt, message, label) {
  const maxRetries = 3;
  for (var i = 0; i < maxRetries; i++) {
    try {
      showInfo('Calling AI for ' + label + ' (attempt ' + (i+1) + ')...');
      const result = await callAI(prompt, message);
      if (!result || result.trim() === '') {
        throw new Error('Empty response from AI');
      }
      return result;
    } catch (err) {
      if (err.message.includes('429') || err.message.includes('Too Many Requests')) {
        showInfo('Rate limited — waiting 20 seconds...');
        await delay(20000);
      } else if (i < maxRetries - 1) {
        showInfo('Retrying in 10 seconds...');
        await delay(10000);
      } else {
        throw err;
      }
    }
  }
}

// ── POM Prompt ────────────────────────────────────────────────
const POM_PROMPT = [
  'You are a senior Playwright automation engineer.',
  'Generate a Page Object Model class for SauceDemo.',
  '',
  'SITE: https://www.saucedemo.com',
  '',
  'CRITICAL OUTPUT RULES:',
  '1. Output ONLY raw JavaScript code',
  '2. NO markdown backticks anywhere in output',
  '3. NO ```javascript at start',
  '4. NO ``` at end',
  '5. Start directly with: const { expect } = require("@playwright/test");',
  '',
  'REAL SELECTORS — USE ONLY THESE:',
  'Login Page:',
  '  username:      page.locator("#user-name")',
  '  password:      page.locator("#password")',
  '  loginButton:   page.locator("#login-button")',
  '  errorMessage:  page.locator("[data-test=error]")',
  '  inventoryList: page.locator(".inventory_list")',
  '',
  'Product Page:',
  '  inventoryItem: page.locator(".inventory_item")',
  '  addButton:     page.locator(".inventory_item").first().locator("button")',
  '  cartBadge:     page.locator(".shopping_cart_badge")',
  '  cartLink:      page.locator(".shopping_cart_link")',
  '  sortDropdown:  page.locator("[data-test=product-sort-container]")',
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
  '  lockedUser: locked_out_user',
  '',
  'CRITICAL GETTER RULES — VERY IMPORTANT:',
  '1. Methods that RETURN a locator = NEVER async',
  '   CORRECT:   getErrorMessage() { return this.errorMessage; }',
  '   WRONG:     async getErrorMessage() { return this.errorMessage; }',
  '',
  '2. Methods with await inside = async',
  '   CORRECT:   async login(u, p) { await this.fill(); }',
  '',
  '3. isEmpty() must return locator NOT boolean:',
  '   CORRECT:   isEmpty() { return this.cartItems; }',
  '   WRONG:     async isEmpty() { return count === 0; }',
  '',
  '4. Boolean check = async with different name:',
  '   CORRECT:   async isCartEmpty() { return await this.cartItems.count() === 0; }',
  '',
  'MANDATORY METHOD NAMES — USE EXACTLY THESE:',
  '',
  'LoginPage methods:',
  '  navigateToLoginPage()    — navigate to login page',
  '  enterEmail(username)     — fill username field',
  '  enterPassword(password)  — fill password field',
  '  clickLoginButton()       — click login button',
  '  login(user, pass)        — complete login flow',
  '  getErrorMessage()        — return error locator — NOT async',
  '  isLoggedIn()             — async, return boolean',
  '',
  'ProductPage methods:',
  '  navigateToProductsPage()    — go to inventory page',
  '  addFirstProductToCart()     — click first add button',
  '  addProductByIndex(index)    — click nth add button',
  '  getCartBadge()              — return badge locator — NOT async',
  '  getCartCount()              — async, return count text',
  '  goToCart()                  — click cart link',
  '  sortBy(option)              — select sort option',
  '  getSearchedProductsHeading() — return title locator — NOT async',
  '',
  'CartPage methods:',
  '  navigate()              — go to cart page',
  '  getCartItems()          — return cart items locator — NOT async',
  '  isEmpty()               — return cart items locator — NOT async',
  '  getCartItemCount()      — async, return count number',
  '  getFirstProductName()   — async, return name text',
  '  removeFirstItem()       — async, click remove button',
  '  proceedToCheckout()     — async, click checkout',
  '',
  'CLASS STRUCTURE:',
  'const { expect } = require("@playwright/test");',
  '',
  'class ClassName {',
  '  constructor(page) {',
  '    this.page = page;',
  '    // define locators as this.locatorName = page.locator(...)',
  '  }',
  '  // methods here',
  '}',
  '',
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
  'MANDATORY IMPORTS — FIRST 4 LINES:',
  'const { test, expect } = require("@playwright/test");',
  'const LoginPage   = require("../../pages/LoginPage");',
  'const ProductPage = require("../../pages/ProductPage");',
  'const CartPage    = require("../../pages/CartPage");',
  '',
  'CREDENTIALS LINES:',
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
  '});',
  '',
  'CRITICAL RULES:',
  '1. ALWAYS use test.beforeEach — NEVER plain beforeEach',
  '2. ALWAYS waitForTimeout(2000) as FIRST line in beforeEach',
  '3. NEVER use async getter methods in assertions',
  '4. getErrorMessage() returns Locator — use directly in expect',
  '5. getCartBadge() returns Locator — use directly in expect',
  '6. getCartItems() returns Locator — use directly in expect',
  '7. isEmpty() returns Locator — use directly in expect',
  '8. Each test MUST be completely independent',
  '9. ONLY these URLs:',
  '   https://www.saucedemo.com/',
  '   https://www.saucedemo.com/inventory.html',
  '   https://www.saucedemo.com/cart.html',
  '',
  'CORRECT ASSERTION EXAMPLES:',
  '  await expect(loginPage.getErrorMessage()).toBeVisible();',
  '  await expect(productPage.getCartBadge()).toHaveText("1");',
  '  await expect(cartPage.getCartItems()).toHaveCount(1);',
  '  await expect(cartPage.isEmpty()).toHaveCount(0);',
  '',
  'WRONG — NEVER DO THIS:',
  '  await expect(cartPage.isEmpty()).toBeVisible(); // isEmpty is for count not visibility',
  '  await expect(await cartPage.isCartEmpty()).toBeVisible(); // boolean not locator',
  '',
  'METHOD NAMES AVAILABLE:',
  'LoginPage:   navigateToLoginPage, enterEmail, enterPassword,',
  '             clickLoginButton, login, getErrorMessage, isLoggedIn',
  'ProductPage: navigateToProductsPage, addFirstProductToCart,',
  '             addProductByIndex, getCartBadge, getCartCount, goToCart',
  'CartPage:    navigate, getCartItems, isEmpty, getCartItemCount,',
  '             getFirstProductName, removeFirstItem, proceedToCheckout',
].join('\n');

// ── Generate LoginPage ────────────────────────────────────────
async function generateLoginPage() {
  const message = [
    'Generate a LoginPage class for SauceDemo.',
    'URL: https://www.saucedemo.com/',
    '',
    'Use EXACTLY these method names:',
    '  navigateToLoginPage() — async, goto login URL',
    '  enterEmail(username)  — async, fill #user-name',
    '  enterPassword(pass)   — async, fill #password',
    '  clickLoginButton()    — async, click #login-button',
    '  login(user, pass)     — async, complete login',
    '  getErrorMessage()     — NOT async, return locator',
    '  isLoggedIn()          — async, return boolean',
  ].join('\n');

  const raw   = await safeCallAI(POM_PROMPT, message, 'LoginPage');
  const clean = cleanCode(raw);
  writeFile('pages/LoginPage.js', clean);
  showSuccess('pages/LoginPage.js created');
}

// ── Generate ProductPage ──────────────────────────────────────
async function generateProductPage() {
  const message = [
    'Generate a ProductPage class for SauceDemo inventory.',
    'URL: https://www.saucedemo.com/inventory.html',
    '',
    'Use EXACTLY these method names:',
    '  navigateToProductsPage() — async, goto inventory',
    '  addFirstProductToCart()  — async, click first add button',
    '  addProductByIndex(idx)   — async, click nth add button',
    '  getCartBadge()           — NOT async, return locator',
    '  getCartCount()           — async, return text',
    '  goToCart()               — async, click cart link',
    '  sortBy(option)           — async, select sort',
    '  getSearchedProductsHeading() — NOT async, return locator',
  ].join('\n');

  const raw   = await safeCallAI(POM_PROMPT, message, 'ProductPage');
  const clean = cleanCode(raw);
  writeFile('pages/ProductPage.js', clean);
  showSuccess('pages/ProductPage.js created');
}

// ── Generate CartPage ─────────────────────────────────────────
async function generateCartPage() {
  const message = [
    'Generate a CartPage class for SauceDemo cart.',
    'URL: https://www.saucedemo.com/cart.html',
    '',
    'Use EXACTLY these method names:',
    '  navigate()           — async, goto cart URL',
    '  getCartItems()       — NOT async, return locator',
    '  isEmpty()            — NOT async, return same locator as getCartItems',
    '  getCartItemCount()   — async, return count number',
    '  getFirstProductName() — async, return text',
    '  removeFirstItem()    — async, click remove',
    '  proceedToCheckout()  — async, click checkout',
    '',
    'IMPORTANT: isEmpty() must return this.cartItems locator directly',
    'Do NOT make isEmpty() async or return a boolean',
  ].join('\n');

  const raw   = await safeCallAI(POM_PROMPT, message, 'CartPage');
  const clean = cleanCode(raw);
  writeFile('pages/CartPage.js', clean);
  showSuccess('pages/CartPage.js created');
}

// ── Generate Spec ─────────────────────────────────────────────
async function generateSpec(testPlan) {
  showAgent('GENERATOR', 'Generating Playwright Spec...');

  const message = [
    'Generate a complete Playwright spec based on this test plan:',
    '',
    testPlan,
    '',
    'GENERATE EXACTLY 5 INDEPENDENT TESTS:',
    'TC001 — Valid login — assert URL is /inventory.html and .inventory_list visible',
    'TC002 — Locked user login — assert error message visible',
    'TC003 — Add to cart — assert cart badge shows 1',
    'TC004 — Verify cart — navigate to cart, assert 1 item',
    'TC005 — Remove from cart — add item, go to cart, remove, assert isEmpty() count is 0',
    '',
    'FOR TC005 USE THIS EXACT PATTERN:',
    '  await cartPage.removeFirstItem();',
    '  await expect(cartPage.isEmpty()).toHaveCount(0);',
    '',
    'DO NOT use toBeVisible on isEmpty() — use toHaveCount(0)',
  ].join('\n');

  const raw   = await safeCallAI(SPEC_PROMPT, message, 'Spec');
  const clean = cleanCode(raw);
  writeFile('tests/generated/e2e.spec.js', clean);
  showSuccess('tests/generated/e2e.spec.js created');
}

// ── Generate POM Classes with Delays ─────────────────────────
async function generatePOMClasses(testPlan) {
  showAgent('GENERATOR', 'Generating POM Classes...');

  showInfo('Generating LoginPage.js...');
  await generateLoginPage();

  showInfo('Waiting 15s for rate limit...');
  await delay(15000);

  showInfo('Generating ProductPage.js...');
  await generateProductPage();

  showInfo('Waiting 15s for rate limit...');
  await delay(15000);

  showInfo('Generating CartPage.js...');
  await generateCartPage();

  showInfo('Waiting 15s for rate limit...');
  await delay(15000);
}

// ── Main Function ─────────────────────────────────────────────
async function runGenerator() {
  showBanner('Agent 2 — GENERATOR');
  showAgent('GENERATOR', 'Reading test plan...');

  try {
    const testPlan = readFile('plans/test-plan.md');
    showSuccess('Test plan loaded — ' + testPlan.split('\n').length + ' lines');

    await generatePOMClasses(testPlan);
    await generateSpec(testPlan);

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