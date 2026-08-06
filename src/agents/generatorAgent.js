// src/agents/generatorAgent.js
// Agent 2 — GENERATOR
// test-plan.md वाचतो → POM Classes + Playwright Spec बनवतो

const { callAI }              = require('../aiClient');
const { readFile, writeFile } = require('../utils/fileHelper');
const { showBanner, showAgent, showSuccess, showError, showInfo } = require('../utils/display');

// ── POM Generation Prompt ─────────────────────────────────────
const POM_PROMPT = `
You are a senior Playwright automation engineer.
Generate Page Object Model classes for AutomationExercise.com

MANDATORY RULES — STRICTLY FOLLOW:
1. ALWAYS start file with: const { expect } = require('@playwright/test');
2. NEVER use getByLabel() — always use locator('selector')
3. Output ONLY raw JavaScript code — NO markdown backticks
4. NO triple backticks at start or end
5. Start directly with the require statement
6. ALWAYS use these EXACT selectors:

LOGIN PAGE SELECTORS:
- Email:    this.page.locator('input[data-qa="login-email"]')
- Password: this.page.locator('input[data-qa="login-password"]')
- Button:   this.page.locator('button[data-qa="login-button"]')
- Error:    this.page.locator('.login-form p')

PRODUCT PAGE SELECTORS:
- Search:    this.page.locator('input#search_input')
- SearchBtn: this.page.locator('button#submit_search')
- AddToCart: this.page.locator('.product-image-wrapper').first().locator('button.add-to-cart')
- CartBadge: this.page.locator('li#cart_li a span')
- NavCart:   this.page.locator('a[href="/view_cart"]')

CART PAGE SELECTORS:
- CartItems:   this.page.locator('tr.cart_product')
- ProductName: this.page.locator('td.cart_description h4 a').first()
- DeleteBtn:   this.page.locator('a.cart_quantity_delete').first()

VALID TEST DATA:
- URL:      https://automationexercise.com
- Email:    testuser@mailinator.com
- Password: Test@1234

Generate a class with constructor(page) and async methods.
Each method does ONE action only.
Export with module.exports = ClassName;
`;

// ── Spec Generation Prompt ────────────────────────────────────
const SPEC_PROMPT = `
You are a senior Playwright automation engineer.
Generate a complete Playwright test spec file.

MANDATORY RULES — STRICTLY FOLLOW ALL:
1. First line MUST be: const { test, expect } = require('@playwright/test');
2. Import POM: const LoginPage = require('../../pages/LoginPage');
3. Import POM: const ProductPage = require('../../pages/ProductPage');
4. Import POM: const CartPage = require('../../pages/CartPage');
5. Output ONLY raw JavaScript — NO markdown backticks anywhere
6. NO triple backticks at start or end of file
7. ALWAYS use test.beforeEach — NEVER plain beforeEach
8. ALWAYS add await page.waitForTimeout(3000) as FIRST line in beforeEach
9. ALWAYS add await page.goto('https://automationexercise.com') after timeout
10. NEVER invent URLs — only use:
    https://automationexercise.com/
    https://automationexercise.com/login
    https://automationexercise.com/products
    https://automationexercise.com/view_cart
11. NEVER use hardcoded selectors — always use POM methods
12. Each test must be completely independent

Use describe block: test.describe('AutomationExercise Tests', () => {})
`;

// ── Generate POM Classes ──────────────────────────────────────
async function generatePOMClasses(testPlan) {
  showAgent('GENERATOR', 'Generating POM Classes...');

  // LoginPage
  showInfo('Generating LoginPage.js...');
  const loginMessage = `
Generate a LoginPage POM class for AutomationExercise.com login page.
URL: https://automationexercise.com/login

Include these methods:
- async navigate() — goes to login page
- async login(email, password) — fills and submits login form
- async getErrorMessage() — returns login error text
- async isLoggedIn() — returns true if login successful

Use ONLY the selectors from your instructions.
`;
  const loginPage = await callAI(POM_PROMPT, loginMessage);
  writeFile('pages/LoginPage.js', loginPage);
  showSuccess('pages/LoginPage.js created');

  // ProductPage
  showInfo('Generating ProductPage.js...');
  const productMessage = `
Generate a ProductPage POM class for AutomationExercise.com products page.
URL: https://automationexercise.com/products

Include these methods:
- async navigate() — goes to products page
- async searchProduct(name) — searches for a product
- async addFirstProductToCart() — adds first product to cart
- async getCartCount() — returns cart badge count
- async goToCart() — clicks cart link

Use ONLY the selectors from your instructions.
`;
  const productPage = await callAI(POM_PROMPT, productMessage);
  writeFile('pages/ProductPage.js', productPage);
  showSuccess('pages/ProductPage.js created');

  // CartPage
  showInfo('Generating CartPage.js...');
  const cartMessage = `
Generate a CartPage POM class for AutomationExercise.com cart page.
URL: https://automationexercise.com/view_cart

Include these methods:
- async navigate() — goes to cart page
- async getCartItemCount() — returns number of items in cart
- async getFirstProductName() — returns first product name
- async removeFirstItem() — removes first item from cart
- async isEmpty() — returns true if cart is empty

Use ONLY the selectors from your instructions.
`;
  const cartPage = await callAI(POM_PROMPT, cartMessage);
  writeFile('pages/CartPage.js', cartPage);
  showSuccess('pages/CartPage.js created');
}

// ── Generate Spec File ────────────────────────────────────────
async function generateSpec(testPlan) {
  showAgent('GENERATOR', 'Generating Playwright Spec...');

  const specMessage = `
Here is the test plan to convert into Playwright tests:

${testPlan}

Generate a complete spec file with:
1. All 5 test cases from the plan
2. Use LoginPage and ProductPage POM classes
3. test.beforeEach with waitForTimeout(3000) and goto
4. Proper assertions using expect()
5. Each test independent and complete

CRITICAL: Start with exact imports:
const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ProductPage = require('../../pages/ProductPage');
const CartPage = require('../../pages/CartPage');
`;

  const spec = await callAI(SPEC_PROMPT, specMessage);
  writeFile('tests/generated/e2e.spec.js', spec);
  showSuccess('tests/generated/e2e.spec.js created');
}

// ── Main Function ─────────────────────────────────────────────
async function runGenerator() {
  showBanner('Agent 2 — GENERATOR');
  showAgent('GENERATOR', 'Reading test plan...');

  try {
    // Step 1 — Plan वाचा
    const testPlan = readFile('plans/test-plan.md');
    showSuccess(`Test plan loaded — ${testPlan.split('\n').length} lines`);

    // Step 2 — POM Classes बनवा
    await generatePOMClasses(testPlan);

    // Step 3 — Spec File बनवा
    await generateSpec(testPlan);

    // Step 4 — Summary
    console.log('\n📁 Generated Files:');
    console.log('   • pages/LoginPage.js');
    console.log('   • pages/ProductPage.js');
    console.log('   • pages/CartPage.js');
    console.log('   • tests/generated/e2e.spec.js');

    return { success: true };

  } catch (error) {
    showError(`Generator failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

module.exports = { runGenerator };