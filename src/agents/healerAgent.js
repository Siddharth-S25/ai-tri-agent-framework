// src/agents/healerAgent.js
// Agent 3 — HEALER
// Failed Tests शोधतो → AI Fix करतो → POM Update करतो → Rerun करतो

const { callAI }                          = require('../aiClient');
const { readFile, writeFile, fileExists } = require('../utils/fileHelper');
const { showBanner, showAgent, showSuccess, showError, showInfo } = require('../utils/display');
const { execSync }                        = require('child_process');

// ── Healer Prompt ─────────────────────────────────────────────
const HEALER_PROMPT = [
  'You are a senior Playwright debugging expert.',
  'You fix broken Playwright tests by analyzing errors.',
  '',
  'SITE: https://www.saucedemo.com',
  '',
  'REAL SELECTORS — USE ONLY THESE:',
  'Login:',
  '  username:      #user-name',
  '  password:      #password',
  '  loginButton:   #login-button',
  '  errorMessage:  [data-test="error"]',
  '  inventoryList: .inventory_list',
  '',
  'Products:',
  '  inventoryItem: .inventory_item',
  '  addButton:     .inventory_item button',
  '  cartBadge:     .shopping_cart_badge',
  '  cartLink:      .shopping_cart_link',
  '',
  'Cart:',
  '  cartItems:   .cart_item',
  '  itemName:    .inventory_item_name',
  '  removeBtn:   .cart_item button',
  '  checkoutBtn: [data-test="checkout"]',
  '',
  'VALID URLS:',
  '  https://www.saucedemo.com/',
  '  https://www.saucedemo.com/inventory.html',
  '  https://www.saucedemo.com/cart.html',
  '',
  'OUTPUT RULES:',
  '1. Output ONLY the fixed JavaScript code',
  '2. NO markdown backticks anywhere',
  '3. NO explanation text before or after code',
  '4. Keep ALL existing methods — only fix the broken one',
  '5. Keep module.exports at the end',
  '6. Start directly with: const { expect } = require("@playwright/test");',
].join('\n');

// ── Parse Results JSON — Fixed for Playwright 1.62 Structure ──
function parseResults(resultsPath) {
  const raw     = readFile(resultsPath);
  const results = JSON.parse(raw);
  const failures = [];

  // Structure: results.suites[0].suites[0].specs[]
  const topSuite = results.suites && results.suites[0];
  if (!topSuite) return failures;

  // Inner suites = describe blocks
  const describeSuites = topSuite.suites || [];

  describeSuites.forEach(function(describeSuite) {
    const specs = describeSuite.specs || [];

    specs.forEach(function(spec) {
      // ok: false = test failed
      if (spec.ok === false) {
        const tests = spec.tests || [];

        tests.forEach(function(test) {
          // Find first failed result with errors
          const failedResult = test.results && test.results.find(function(r) {
            return r.status === 'failed' && r.errors && r.errors.length > 0;
          });

          if (failedResult) {
            // Clean ANSI escape codes from error message
            const rawMsg  = failedResult.errors[0].message || 'Unknown error';
            const cleanMsg = rawMsg.replace(/\u001b\[[0-9;]*m/g, '').trim();

            failures.push({
              title: spec.title  || 'Unknown test',
              error: cleanMsg,
            });
          }
        });
      }
    });
  });

  return failures;
}

// ── Identify Error Type ───────────────────────────────────────
function identifyErrorType(errorMessage) {
  if (!errorMessage) return 'UNKNOWN';
  const msg = errorMessage.toLowerCase();

  if (msg.includes('element(s) not found') ||
      msg.includes('waiting for locator')  ||
      msg.includes('locator') && msg.includes('not found')) {
    return 'SELECTOR_ERROR';
  }
  if (msg.includes('tohaveurl')) {
    return 'URL_ERROR';
  }
  if (msg.includes('tocontaintext') || msg.includes('tohavetext')) {
    return 'TEXT_ERROR';
  }
  if (msg.includes('tohavecount')) {
    return 'COUNT_ERROR';
  }
  if (msg.includes('timeout') || msg.includes('exceeded')) {
    return 'TIMEOUT_ERROR';
  }
  return 'UNKNOWN';
}

// ── Identify Which POM File Needs Fix ────────────────────────
function identifyPOMFile(errorMessage, testTitle) {
  const msg   = (errorMessage || '').toLowerCase();
  const title = (testTitle    || '').toLowerCase();

  // Login related — highest priority
  if (title.includes('login') ||
      msg.includes('#user-name') ||
      msg.includes('#password')  ||
      msg.includes('login-button')) {
    return 'pages/LoginPage.js';
  }

  // Add to cart → ProductPage (not CartPage!)
  if (title.includes('add to cart') ||
      title.includes('add first')   ||
      title.includes('product')     ||
      msg.includes('wrong_badge')   ||
      msg.includes('shopping_cart_badge') ||
      msg.includes('shopping_cart') ||
      msg.includes('inventory')) {
    return 'pages/ProductPage.js';
  }

  // Cart page — remove, verify cart
  if (title.includes('verify cart') ||
      title.includes('remove')      ||
      msg.includes('cart_item')     ||
      msg.includes('checkout')) {
    return 'pages/CartPage.js';
  }

  return null;
}

// ── Fix with AI ───────────────────────────────────────────────
async function fixWithAI(failure, pomFile) {
  const pomContent = readFile(pomFile);
  const errorType  = identifyErrorType(failure.error);

  const message = [
    'This Playwright test is failing. Fix the POM class.',
    '',
    'TEST NAME: ' + failure.title,
    '',
    'ERROR TYPE: ' + errorType,
    '',
    'ERROR MESSAGE:',
    failure.error.substring(0, 500),
    '',
    'CURRENT POM FILE (' + pomFile + '):',
    pomContent,
    '',
    'INSTRUCTIONS:',
    '1. Read the error message carefully',
    '2. Identify which selector or method is wrong',
    '3. Fix it using ONLY the real selectors from your instructions',
    '4. Return the COMPLETE fixed class — not just the changed part',
    '5. Keep ALL other methods exactly as they are',
    '6. NO markdown backticks in output',
    '7. Start directly with: const { expect } = require("@playwright/test");',
  ].join('\n');

  const fixed = await callAI(HEALER_PROMPT, message);
  return fixed
    .replace(/```javascript\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

// ── Run Tests Again ───────────────────────────────────────────
function runTests() {
  try {
    showInfo('Running tests to verify fixes...');
    execSync('npx playwright test', {
      cwd:   process.cwd(),
      stdio: 'inherit',
    });
    return true;
  } catch {
    return false;
  }
}

// ── Main Healer Function ──────────────────────────────────────
async function runHealer() {
  showBanner('Agent 3 — HEALER');
  showAgent('HEALER', 'Starting self-healing process...');

  const resultsPath = 'reports/results.json';

  // Step 1 — results.json आहे का?
  if (!fileExists(resultsPath)) {
    showError('No results.json found!');
    showInfo('Run: npm test   first to generate results');
    return { success: false, error: 'No results found' };
  }

  try {
    // Step 2 — Failed Tests शोधा
    showAgent('HEALER', 'Analyzing test results...');
    const failures = parseResults(resultsPath);

    if (failures.length === 0) {
      showSuccess('No failures found — all tests passing! Nothing to heal.');
      return { success: true, healed: 0, manual: 0 };
    }

    console.log('\n❌ Found ' + failures.length + ' failure(s):');
    failures.forEach(function(f) {
      console.log('   • ' + f.title);
    });

    // Step 3 — प्रत्येक Failure Fix करा
    var healed       = 0;
    var manual       = 0;
    var manualReview = [];

    for (var i = 0; i < failures.length; i++) {
      var failure   = failures[i];
      var errorType = identifyErrorType(failure.error);
      var pomFile   = identifyPOMFile(failure.error, failure.title);

      console.log('\n🔍 Analyzing: ' + failure.title);
      console.log('   Error Type: ' + errorType);
      console.log('   POM File:   ' + (pomFile || 'Unknown'));

      // Timeout → Human Review
      if (errorType === 'TIMEOUT_ERROR') {
        showInfo('Timeout error — flagging for human review');
        manual++;
        manualReview.push({
          test:   failure.title,
          reason: 'Timeout — check network or increase timeout in config',
          error:  failure.error.substring(0, 300),
        });
        continue;
      }

      // No POM file identified → Human Review
      if (!pomFile) {
        showInfo('Cannot identify POM file — flagging for human review');
        manual++;
        manualReview.push({
          test:   failure.title,
          reason: 'Could not identify which POM file to fix',
          error:  failure.error.substring(0, 300),
        });
        continue;
      }

      // AI Fix करतो
      showAgent('HEALER', 'Asking AI to fix ' + pomFile + '...');

      try {
        var fixedCode = await fixWithAI(failure, pomFile);

        // Original Backup करा
        var backup = readFile(pomFile);
        writeFile(pomFile + '.backup', backup);
        showInfo('Backup saved: ' + pomFile + '.backup');

        // Fixed Code Write करा
        writeFile(pomFile, fixedCode);
        showSuccess('Fixed: ' + pomFile);
        healed++;

      } catch (fixError) {
        showError('AI fix failed: ' + fixError.message);
        manual++;
        manualReview.push({
          test:   failure.title,
          reason: 'AI fix failed: ' + fixError.message,
          error:  failure.error.substring(0, 300),
        });
      }
    }

    // Step 4 — Report बनवा
    var reportLines = [
      '# Healer Report',
      'Generated: ' + new Date().toISOString(),
      '',
      '## Summary',
      '- Total Failures: ' + failures.length,
      '- Auto-Healed:    ' + healed,
      '- Manual Review:  ' + manual,
      '',
    ];

    if (manualReview.length > 0) {
      reportLines.push('## Manual Review Required');
      manualReview.forEach(function(item) {
        reportLines.push('');
        reportLines.push('### ' + item.test);
        reportLines.push('- Reason: ' + item.reason);
        reportLines.push('- Error: ' + item.error);
      });
    }

    writeFile('reports/healer-report.md', reportLines.join('\n'));
    showSuccess('Report saved: reports/healer-report.md');

    // Step 5 — Summary दाखव
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║        🏥 HEALER REPORT               ║');
    console.log('╠══════════════════════════════════════╣');
    console.log('║  Total Failures:  ' + String(failures.length).padEnd(18) + '║');
    console.log('║  Auto-Healed:     ' + String(healed).padEnd(18)          + '║');
    console.log('║  Manual Review:   ' + String(manual).padEnd(18)          + '║');
    console.log('╚══════════════════════════════════════╝');

    // Step 6 — Healed असेल तर Tests परत Run करा
    if (healed > 0) {
      console.log('\n✅ Re-running tests to verify all fixes...');
      runTests();
    }

    return { success: true, healed: healed, manual: manual };

  } catch (error) {
    showError('Healer crashed: ' + error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { runHealer };