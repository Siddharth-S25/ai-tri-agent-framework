// generate.js — CLI Entry Point
const { program } = require('commander');
const chalk        = require('chalk');
const { execSync } = require('child_process');

const { runPlanner }   = require('./src/agents/plannerAgent');
const { runGenerator } = require('./src/agents/generatorAgent');
const { runHealer }    = require('./src/agents/healerAgent');

console.log(chalk.blue(`
╔══════════════════════════════════════════════╗
║     🤖 AI Tri-Agent QA Framework  v1.0       ║
║  Story → Plan → Tests → Self-Healing         ║
╚══════════════════════════════════════════════╝
`));

program
  .name('generate')
  .description('AI Tri-Agent QA Framework')
  .version('1.0.0');

// ── PLAN — Agent 1 ────────────────────────────────────────────
program
  .command('plan')
  .description('Agent 1: Generate test plan from user story')
  .requiredOption('-s, --story <story>', 'User story in plain English')
  .action(async (options) => {
    const result = await runPlanner(options.story);
    if (result.success) {
      console.log(chalk.green('\n✅ Agent 1 Complete!'));
      console.log(chalk.cyan('Next: node generate.js generate'));
    } else {
      console.log(chalk.red('\n❌ Agent 1 Failed'));
      process.exit(1);
    }
  });

// ── GENERATE — Agent 2 ────────────────────────────────────────
program
  .command('generate')
  .description('Agent 2: Generate POM classes and Playwright specs')
  .action(async () => {
    const result = await runGenerator();
    if (result.success) {
      console.log(chalk.green('\n✅ Agent 2 Complete!'));
      console.log(chalk.cyan('Next: npm test'));
    } else {
      console.log(chalk.red('\n❌ Agent 2 Failed'));
      process.exit(1);
    }
  });

// ── HEAL — Agent 3 ────────────────────────────────────────────
program
  .command('heal')
  .description('Agent 3: Auto-fix failing tests')
  .action(async () => {
    const result = await runHealer();
    if (result.success) {
      console.log(chalk.green('\n✅ Agent 3 Complete!'));
      console.log(chalk.cyan('Healed: ' + result.healed));
      console.log(chalk.yellow('Manual: ' + result.manual));
    } else {
      console.log(chalk.red('\n❌ Agent 3 Failed'));
      process.exit(1);
    }
  });

// ── FULL AGENT — All 3 Together ───────────────────────────────
program
  .command('full-agent')
  .description('Run all 3 agents: Plan → Generate → Test → Heal')
  .requiredOption('-s, --story <story>', 'User story in plain English')
  .action(async (options) => {

    console.log(chalk.blue('\n🚀 Starting Full Agent Pipeline...\n'));
    const startTime = Date.now();

    // ── Step 1: Agent 1 — PLANNER ─────────────────
    const planResult = await runPlanner(options.story);
    if (!planResult.success) {
      console.log(chalk.red('\n❌ Pipeline stopped — Planner failed'));
      process.exit(1);
    }

    // ── Step 2: Agent 2 — GENERATOR ───────────────
    const genResult = await runGenerator();
    if (!genResult.success) {
      console.log(chalk.red('\n❌ Pipeline stopped — Generator failed'));
      process.exit(1);
    }

    // ── Step 3: Run Tests ──────────────────────────
    console.log(chalk.cyan('\n🎭 Running generated tests...\n'));
    let testsPassed = false;
    try {
      execSync('npx playwright test', {
        cwd:   process.cwd(),
        stdio: 'inherit'
      });
      testsPassed = true;
    } catch {
      testsPassed = false;
    }

    // ── Step 4: Agent 3 — HEALER ──────────────────
    let healResult = { healed: 0, manual: 0 };
    if (!testsPassed) {
      console.log(chalk.yellow('\n🏥 Tests failed — Starting Healer...\n'));
      healResult = await runHealer();
    } else {
      console.log(chalk.green('\n✅ All tests passed — No healing needed!'));
    }

    // ── Final Summary ──────────────────────────────
    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log(chalk.blue('\n╔══════════════════════════════════════════════╗'));
    console.log(chalk.blue('║     🎉 FULL AGENT PIPELINE COMPLETE!          ║'));
    console.log(chalk.blue('╠══════════════════════════════════════════════╣'));
    console.log(chalk.blue('║  ✅ Agent 1 — Test Plan Generated             ║'));
    console.log(chalk.blue('║  ✅ Agent 2 — POM + Tests Generated           ║'));
    if (testsPassed) {
      console.log(chalk.blue('║  ✅ Tests   — All Passed                      ║'));
    } else {
      console.log(chalk.blue('║  🏥 Agent 3 — Healed: ' + String(healResult.healed).padEnd(23) + '║'));
      console.log(chalk.blue('║  👤 Manual  — Review: ' + String(healResult.manual).padEnd(23) + '║'));
    }
    console.log(chalk.blue('║  ⏱️  Duration: ' + String(duration + 's').padEnd(30) + '║'));
    console.log(chalk.blue('╚══════════════════════════════════════════════╝'));
  });

program.parse();