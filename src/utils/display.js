// src/utils/display.js
const chalk = require('chalk');

function showBanner(title) {
  console.log(chalk.blue('\n╔══════════════════════════════════════════════╗'));
  console.log(chalk.blue(`║  🤖 ${title.padEnd(41)}║`));
  console.log(chalk.blue('╚══════════════════════════════════════════════╝\n'));
}

function showStep(step, total, message) {
  console.log(chalk.cyan(`\n[${step}/${total}] ${message}`));
}

function showSuccess(message) {
  console.log(chalk.green(`✅ ${message}`));
}

function showError(message) {
  console.log(chalk.red(`❌ ${message}`));
}

function showInfo(message) {
  console.log(chalk.yellow(`ℹ️  ${message}`));
}

function showAgent(agentName, message) {
  console.log(chalk.magenta(`\n🤖 Agent [${agentName}]: ${message}`));
}

module.exports = { showBanner, showStep, showSuccess, showError, showInfo, showAgent };