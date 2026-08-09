const { expect } = require("@playwright/test");

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.errorMessage = page.locator("[data-test=error]");
    this.inventoryList = page.locator(".inventory_list");
  }

  async navigateToLoginPage() {
    await this.page.goto("https://www.saucedemo.com");
  }

  async enterEmail(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(pass) {
    await this.passwordInput.fill(pass);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(user, pass) {
    await this.enterEmail(user);
    await this.enterPassword(pass);
    await this.clickLoginButton();
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  async isLoggedIn() {
    return await this.inventoryList.isVisible();
  }
}

module.exports = LoginPage;