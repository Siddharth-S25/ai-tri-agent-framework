# 🤖 AI Tri-Agent QA Framework

![CI](https://github.com/YOUR_USERNAME/ai-tri-agent-framework/actions/workflows/ai-qa.yml/badge.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Playwright](https://img.shields.io/badge/playwright-1.x-blue)

> One command. Three AI agents. Self-healing tests.

## How It Works

node generate.js full-agent -s "user story"

↓

Agent 1 — PLANNER

Reads user story → Creates structured test plan

↓
Agent 2 — GENERATOR

Reads plan → Generates POM classes + Playwright spec

↓
Tests Run Automatically

↓
Agent 3 — HEALER (if tests fail)

Detects broken selectors → AI fixes → Re-runs
↓

✅ All Tests Passing!


## Quick Start

git clone https://github.com/YOUR_USERNAME/ai-tri-agent-framework

cd ai-tri-agent-framework

npm install

npx playwright install chromium

cp .env.example .env

# Add your OpenRouter API key to .env



## Commands

bash

# Full autonomous pipeline
node generate.js full-agent -s "user story"

# Individual agents
node generate.js plan      -s "user story"
node generate.js generate
node generate.js heal

# Run tests
npm test


## Results


✅ TC001 — Successful Login
✅ TC002 — Login with Locked User
✅ TC003 — Add Item to Cart
✅ TC004 — Verify Cart Contents
✅ TC005 — Remove from Cart

5 passed in 266s — Zero manual test code!


## Tech Stack

Node.js | Playwright | OpenRouter AI |
GitHub Actions | Page Object Model

## Author

Built by Siddharth Sable

GitHub: https://github.com/Siddharth-S25