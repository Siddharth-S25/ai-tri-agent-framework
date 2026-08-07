const { expect } = require("@playwright/test");

class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator("#user-name");
    this.password = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.errorMessage = page.locator("[data-test=\"error\"]");
    this.inventoryList = page.locator(".inventory_list");
  }

  async navigateToLoginPage() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async enterEmail(username) {
    await this.username.fill(username);
  }

  async enterPassword(password) {
    await this.password.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.navigateToLoginPage();
    await this.enterEmail(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  async isLoggedIn() {
    try {
      await expect(this.inventoryList).toBeVisible();
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = LoginPage;