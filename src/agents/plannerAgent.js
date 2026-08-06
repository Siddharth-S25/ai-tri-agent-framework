// src/agents/plannerAgent.js
// Agent 1 — PLANNER
// User Story वाचतो → AI ला पाठवतो → test-plan.md बनवतो

const { callAI }     = require('../aiClient');
const { writeFile }  = require('../utils/fileHelper');
const { showBanner, showAgent, showSuccess, showError, showInfo } = require('../utils/display');

// ── System Prompt ─────────────────────────────────────────────
const PLANNER_PROMPT = `
You are a senior QA architect with 15 years experience.
Target site: SauceDemo — https://www.saucedemo.com

REAL URLS:
- Login:    https://www.saucedemo.com/
- Products: https://www.saucedemo.com/inventory.html
- Cart:     https://www.saucedemo.com/cart.html
- Checkout: https://www.saucedemo.com/checkout-step-one.html

REAL SELECTORS:
- Username:    #user-name
- Password:    #password
- Login Btn:   #login-button
- Error:       [data-test="error"]
- Cart Badge:  .shopping_cart_badge
- Cart Link:   .shopping_cart_link
- Items:       .inventory_item
- Add to Cart: .inventory_item button
- Cart Items:  .cart_item

VALID CREDENTIALS:
- Username: standard_user
- Password: secret_sauce

LOCKED USER (for negative tests):
- Username: locked_out_user
- Password: secret_sauce

RULES:
1. ONLY use URLs listed above
2. ONLY use selectors listed above
3. Minimum 5 test cases
4. Cover: login, add to cart, cart verification, remove from cart

Output ONLY valid Markdown test plan.
`;

Given the user story, create a detailed test plan.

Output ONLY a valid Markdown file with this EXACT structure:

# Test Plan: [Story Title]
Site: https://www.saucedemo.com/
Generated: [today's date]

## Overview
[2 sentences about what is being tested]

## Test Cases

### TC001 — [Test Name]
- **Type**: Positive/Negative/Edge Case
- **Priority**: High/Medium/Low
- **Page**: [URL]
- **Precondition**: [what must be true before test]
- **Steps**:
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- **Selector**: [exact selector to use]
- **Expected Result**: [what should happen]
- **Assertion**: [exact text or URL to assert]

[Repeat for each test case — minimum 5 test cases]

## Summary
- Total Tests: [number]
- High Priority: [number]
- Medium Priority: [number]
- Low Priority: [number]
`;

// ── Main Function ─────────────────────────────────────────────
async function runPlanner(userStory) {
  showBanner('Agent 1 — PLANNER');
  showAgent('PLANNER', 'Starting test plan generation...');
  showInfo(`User Story: "${userStory}"`);

  try {
    // Step 1 — AI ला User Story पाठव
    showAgent('PLANNER', 'Sending story to AI...');
    const userMessage = `
Create a detailed test plan for this user story:

"${userStory}"

Site: AutomationExercise.com
Use ONLY the selectors and URLs provided in your instructions.
Generate minimum 5 test cases covering positive, negative, and edge cases.
`;

    const plan = await callAI(PLANNER_PROMPT, userMessage);

    // Step 2 — Plan Save करा
    const outputPath = 'plans/test-plan.md';
    writeFile(outputPath, plan);

    showSuccess(`Test plan saved to: ${outputPath}`);

    // Step 3 — Summary दाखव
    const lines      = plan.split('\n');
    const tcLines    = lines.filter(l => l.startsWith('### TC'));
    const totalTests = tcLines.length;

    console.log('\n📋 Plan Summary:');
    console.log(`   Total Test Cases: ${totalTests}`);
    tcLines.forEach(tc => {
      console.log(`   • ${tc.replace('### ', '')}`);
    });

    return { success: true, path: outputPath, totalTests };

  } catch (error) {
    showError(`Planner failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

module.exports = { runPlanner };