# 🤖 AI Tri-Agent QA Framework

![CI](https://github.com/Siddharth-S25/ai-tri-agent-framework/actions/workflows/ai-qa.yml/badge.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Playwright](https://img.shields.io/badge/playwright-1.62-blue)
![AI](https://img.shields.io/badge/AI-OpenRouter-purple)
![License](https://img.shields.io/badge/license-MIT-green)

> **One sentence in. Five passing tests out. Zero manual code written.**
>
> Three AI agents work together — Plan, Generate, Heal — fully autonomously.

---

## 🎯 What This Does

```
You type:
  node generate.js full-agent -s "login and manage cart on SauceDemo"

Agent 1 — PLANNER reads your story and creates a structured test plan
Agent 2 — GENERATOR reads the plan and writes POM classes + Playwright tests
Tests run automatically against the real website
Agent 3 — HEALER detects failures and auto-fixes broken selectors
Result: 5/5 tests passing in under 60 seconds
```

**Zero manual test code. One command does everything.**

---

## ✨ Three Agents Explained

### 🗺️ Agent 1 — PLANNER
- Takes plain English user story as input
- Uses AI with few-shot prompting for consistent output
- Produces structured Markdown test plan with 5+ test cases
- Covers positive, negative, and edge case scenarios
- Output: `plans/test-plan.md`

### ⚙️ Agent 2 — GENERATOR
- Reads test plan produced by Agent 1
- Generates Page Object Model classes for each page
- Writes complete Playwright spec file using POM methods
- Uses context-setting to eliminate AI hallucination
- Output: `pages/*.js` + `tests/generated/e2e.spec.js`

### 🏥 Agent 3 — HEALER
- Reads `reports/results.json` after test failure
- Identifies error type: selector, URL, text, count
- Sends broken POM class to AI for repair
- Writes fixed code and takes backup of original
- Re-runs tests to confirm fix worked
- Output: Fixed POM + `reports/healer-report.md`

---

## 🚀 Quick Start

### Prerequisites
```bash
node --version   # >= 18
npm --version    # >= 8
```

### Installation
```bash
git clone https://github.com/Siddharth-S25/ai-tri-agent-framework.git
cd ai-tri-agent-framework
npm install
npx playwright install chromium
cp .env.example .env

```

### Run Full Pipeline
```bash
node generate.js full-agent -s "As a user I should login to SauceDemo and manage shopping cart"
```

---

## 📋 All Commands

```bash
# ── Full Autonomous Pipeline ──────────────────────────────────
node generate.js full-agent -s "your user story here"

# ── Individual Agents ─────────────────────────────────────────
node generate.js plan      -s "your user story"   # Agent 1 only
node generate.js generate                          # Agent 2 only
node generate.js heal                              # Agent 3 only

# ── Tests ─────────────────────────────────────────────────────
npm test                                           # Run all tests
npx playwright show-report reports/html            # View HTML report
```

---

## 🏗️ Architecture

```
ai-tri-agent-framework/
├── src/
│   ├── agents/
│   │   ├── plannerAgent.js    # Agent 1 — Test plan from user story
│   │   ├── generatorAgent.js  # Agent 2 — POM + Spec generation
│   │   └── healerAgent.js     # Agent 3 — Auto-fix failing tests
│   ├── aiClient.js            # OpenRouter AI integration
│   └── utils/
│       ├── display.js         # Terminal formatting
│       └── fileHelper.js      # File read/write utilities
├── pages/                     # AI-generated Page Object Model
│   ├── LoginPage.js
│   ├── ProductPage.js
│   └── CartPage.js
├── tests/
│   └── generated/
│       └── e2e.spec.js        # AI-generated Playwright specs
├── plans/
│   └── test-plan.md           # Agent 1 output
├── reports/
│   ├── html/                  # Playwright HTML report
│   ├── results.json           # Test results for Healer
│   └── healer-report.md       # What Healer fixed
├── .github/
│   └── workflows/
│       └── ai-qa.yml          # CI/CD pipeline
├── generate.js                # CLI entry point
├── playwright.config.js       # Playwright configuration
├── .env.example               # Environment template
└── package.json
```

---

## 🧠 Prompt Engineering Techniques

### Context-Setting
Real selectors and URLs injected into every prompt. AI never guesses — it uses exact application data.

### Few-Shot Prompting
Example of perfect output provided before generation request. Ensures consistent JSON/Markdown structure every run.

### Method Name Locking
Exact method names defined in both POM prompt and Spec prompt. Eliminates mismatch between generated POM and generated test.

### Output Sanitization
All AI output is cleaned of markdown backticks automatically before saving. No manual cleanup needed.

---

## 🐛 AI Errors Found and Fixed

| Error | What AI Did | Fix Applied |
|---|---|---|
| Async getter methods | `async getErrorMessage()` returned Promise | Locked getter rules in prompt |
| Markdown in output | Added ` ```javascript ` to code files | Auto-clean with `.replace()` |
| Method name mismatch | POM and Spec used different names | Same names defined in both prompts |
| Wrong POM identified | Healer fixed wrong file | Improved `identifyPOMFile()` logic |
| 402 credits error | Paid model used on free key | Switched to `:free` model suffix |

---

## 🏥 Self-Healing in Action

```
Selector breaks → Test fails → Healer runs:

1. Reads reports/results.json
2. Finds failed test: TC003 — Add to cart
3. Identifies: SELECTOR_ERROR in ProductPage.js
4. Sends broken code to AI with error context
5. AI returns fixed code with correct selector
6. Backup saved: ProductPage.js.backup
7. Fixed code written to ProductPage.js
8. Tests re-run: 5/5 passing ✅

Healer Report:
  Total Failures: 1
  Auto-Healed:    1
  Manual Review:  0
```

---

## 📊 Test Results

```
Running 5 tests using 1 worker

  ✓ TC001 — Successful Login                    (21.5s)
  ✓ TC002 — Locked Out User Login Attempt        (6.9s)
  ✓ TC003 — Add Product to Cart                  (6.8s)
  ✓ TC004 — Verify Cart Contents                 (6.9s)
  ✓ TC005 — Remove from Cart                     (8.7s)

  5 passed (57.2s) — Zero manual test code written
```

---

## 🔄 CI/CD Pipeline

Every push to `main` triggers:
```
1. Install Node.js 20 and dependencies
2. Install Playwright Chromium browser
3. Run full Playwright test suite
4. Upload HTML report as downloadable artifact
```

API key stored as GitHub Secret — never in code.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | >= 18 | Runtime |
| Playwright | 1.62 | Browser automation |
| OpenRouter AI | - | Cloud AI (multiple models) |
| Google Gemma 4 | Free tier | AI model for generation |
| Commander.js | - | CLI framework |
| Chalk | 4.x | Terminal color output |
| Axios | - | HTTP client for AI APIs |
| GitHub Actions | - | CI/CD pipeline |

---

## 🎯 JD Requirements Covered

- ✅ AI-assisted test case generation from user stories
- ✅ Advanced prompt engineering (few-shot, context-setting, method locking)
- ✅ Review and validate AI-generated scripts
- ✅ Self-healing test framework (Agent 3)
- ✅ Page Object Model architecture
- ✅ Playwright automation on real website
- ✅ CI/CD pipeline with GitHub Actions
- ✅ AI error detection and correction

---

---

## 📄 License

MIT — Educational and personal use.
Commercial use requires written permission from the author.

---

## 👤 Author

Built by Siddharth Sable — QA Automation Engineer
- GitHub: https://github.com/Siddharth-S25

---

*Built Three agents. One command. Five passing tests.*
*Every error documented. Every fix explained. All green in CI.*