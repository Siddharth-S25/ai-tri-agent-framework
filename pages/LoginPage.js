const { expect } = require("@playwright/test");

class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator("#user-name");
    this.password = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.errorMessage = page.locator("[data-test=error]");
    this.inventoryList = page.locator(".inventory_list");
  }

  async navigateToLoginPage() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async enterEmail(username) {
    await this.username.fill(username);
  }

  async enterPassword(pass) {
    await this.password.fill(pass);
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