const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page          = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton   = page.locator('#login-button');
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  async navigate() {
    await this.page.goto('https://www.saucedemo.com/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToLoginPage() {
    await this.navigate();
  }

  async enterEmail(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.navigate();
    await this.enterEmail(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  async isLoggedIn() {
    return await this.page.locator('.inventory_list').isVisible();
  }
}

module.exports = LoginPage;