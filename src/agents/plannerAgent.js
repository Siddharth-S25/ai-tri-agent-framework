// src/agents/plannerAgent.js
// Agent 1 — PLANNER
// User Story वाचतो → AI ला पाठवतो → test-plan.md बनवतो

const { callAI }     = require('../aiClient');
const { writeFile }  = require('../utils/fileHelper');
const { showBanner, showAgent, showSuccess, showError, showInfo } = require('../utils/display');

// ── System Prompt ─────────────────────────────────────────────
const PLANNER_PROMPT = `
You are a senior QA architect with 15 years experience.
You specialize in testing e-commerce websites.

The target site is: AutomationExercise.com
Here is the REAL site structure you must use:

PAGES AND URLS:
- Home:        https://automationexercise.com/
- Login:       https://automationexercise.com/login
- Signup:      https://automationexercise.com/signup
- Products:    https://automationexercise.com/products
- Cart:        https://automationexercise.com/view_cart
- Checkout:    https://automationexercise.com/checkout
- Contact Us:  https://automationexercise.com/contact_us
- Orders:      https://automationexercise.com/customer_login (after login)

REAL SELECTORS (verified):
- Login email:    input[data-qa="login-email"]
- Login password: input[data-qa="login-password"]
- Login button:   button[data-qa="login-button"]
- Signup name:    input[data-qa="signup-name"]
- Signup email:   input[data-qa="signup-email"]
- Signup button:  button[data-qa="signup-button"]
- Search input:   input#search_input
- Search button:  button#submit_search
- Add to cart:    button.add-to-cart (first product)
- Cart count:     li#cart_li a span (cart badge)
- Nav Cart:       a[href="/view_cart"]

VALID TEST CREDENTIALS:
- Email:    testuser@mailinator.com
- Password: Test@1234
- Name:     Test User

RULES — STRICTLY FOLLOW:
1. ONLY use URLs listed above — never invent URLs
2. ONLY use selectors listed above — never guess
3. Each test must have EXACTLY these fields
4. Priority must be: High, Medium, or Low
5. testType must be: Positive, Negative, or Edge Case

Given the user story, create a detailed test plan.

Output ONLY a valid Markdown file with this EXACT structure:

# Test Plan: [Story Title]
Site: https://automationexercise.com
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