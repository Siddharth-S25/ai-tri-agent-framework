// generate.js — CLI Entry Point
const { runGenerator } = require('./src/agents/generatorAgent');
const { program } = require('commander');
const { runPlanner } = require('./src/agents/plannerAgent');
const chalk = require('chalk');


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

// ── PLAN Command — Agent 1 ────────────────────────────────────
program
  .command('plan')
  .description('Agent 1: Generate test plan from user story')
  .requiredOption('-s, --story <story>', 'User story in plain English')
  .action(async (options) => {
    const result = await runPlanner(options.story);
    if (result.success) {
      console.log(chalk.green('\n✅ Agent 1 Complete!'));
      console.log(chalk.cyan('Next step: node generate.js generate'));
    } else {
      console.log(chalk.red('\n❌ Agent 1 Failed'));
      process.exit(1);
    }
  });
  program
    .command('generate')
    .description('Agent 2: Generate POM classes and Playwright specs')
    .action(async () => {
      const result = await runGenerator();
      if (result.success) {
        console.log(chalk.green('\n✅ Agent 2 Complete!'));
        console.log(chalk.cyan('Next step: npm test'));
      } else {
        console.log(chalk.red('\n❌ Agent 2 Failed'));
        process.exit(1);
      }
    });

program.parse();