// src/agents/plannerAgent.js
const { callAI }    = require('../aiClient');
const { writeFile } = require('../utils/fileHelper');
const { showBanner, showAgent, showSuccess, showError, showInfo } = require('../utils/display');

const PLANNER_PROMPT = [
  'You are a senior QA architect with 15 years experience.',
  'Target site: SauceDemo — https://www.saucedemo.com',
  '',
  'REAL URLS:',
  '- Login:    https://www.saucedemo.com/',
  '- Products: https://www.saucedemo.com/inventory.html',
  '- Cart:     https://www.saucedemo.com/cart.html',
  '- Checkout: https://www.saucedemo.com/checkout-step-one.html',
  '',
  'REAL SELECTORS:',
  '- Username:    #user-name',
  '- Password:    #password',
  '- Login Btn:   #login-button',
  '- Error:       [data-test="error"]',
  '- Cart Badge:  .shopping_cart_badge',
  '- Cart Link:   .shopping_cart_link',
  '- Items:       .inventory_item',
  '- Add to Cart: .inventory_item button',
  '- Cart Items:  .cart_item',
  '- Sort:        [data-test="product-sort-container"]',
  '',
  'VALID CREDENTIALS:',
  '- Username: standard_user',
  '- Password: secret_sauce',
  '',
  'LOCKED USER (negative tests):',
  '- Username: locked_out_user',
  '- Password: secret_sauce',
  '',
  'RULES:',
  '1. ONLY use URLs listed above — never invent URLs',
  '2. ONLY use selectors listed above — never guess',
  '3. Priority: High, Medium, or Low ONLY',
  '4. Type: Positive, Negative, or Edge Case ONLY',
  '5. Minimum 5 test cases always',
  '6. Output ONLY valid Markdown — no extra text',
  '',
  'Output in this EXACT structure:',
  '',
  '# Test Plan: [Title]',
  'Site: https://www.saucedemo.com',
  'Generated: [date]',
  '',
  '## Overview',
  '[2 sentences about what is being tested]',
  '',
  '## Test Cases',
  '',
  '### TC001 — [Test Name]',
  '- **Type**: Positive',
  '- **Priority**: High',
  '- **Page**: [URL]',
  '- **Precondition**: [condition]',
  '- **Steps**:',
  '  1. [step]',
  '  2. [step]',
  '- **Selector**: [selector]',
  '- **Expected Result**: [result]',
  '- **Assertion**: [exact text or URL]',
  '',
  '## Summary',
  '- Total Tests: [number]',
  '- High Priority: [number]',
  '- Medium Priority: [number]',
  '- Low Priority: [number]',
].join('\n');

async function runPlanner(userStory) {
  showBanner('Agent 1 — PLANNER');
  showAgent('PLANNER', 'Starting test plan generation...');
  showInfo('User Story: "' + userStory + '"');

  try {
    showAgent('PLANNER', 'Sending story to AI...');

    const userMessage = [
      'Create a detailed test plan for this user story:',
      '',
      '"' + userStory + '"',
      '',
      'Site: SauceDemo — https://www.saucedemo.com',
      'Generate minimum 5 test cases covering positive,',
      'negative, and edge cases.',
      'Use ONLY the selectors and URLs from your instructions.',
    ].join('\n');

    const plan = await callAI(PLANNER_PROMPT, userMessage);

    const outputPath = 'plans/test-plan.md';
    writeFile(outputPath, plan);
    showSuccess('Test plan saved to: ' + outputPath);

    const lines   = plan.split('\n');
    const tcLines = lines.filter(function(l) {
      return l.startsWith('### TC');
    });

    console.log('\n📋 Plan Summary:');
    console.log('   Total Test Cases: ' + tcLines.length);
    tcLines.forEach(function(tc) {
      console.log('   • ' + tc.replace('### ', ''));
    });

    return { success: true, path: outputPath, totalTests: tcLines.length };

  } catch (error) {
    showError('Planner failed: ' + error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { runPlanner };