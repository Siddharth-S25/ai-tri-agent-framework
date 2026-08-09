const { expect } = require("@playwright/test");

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator(".cart_item");
    this.itemName = page.locator(".inventory_item_name").first();
    this.removeBtn = page.locator(".cart_item").first().locator("button");
    this.checkoutBtn = page.locator("[data-test='checkout']");
    this.continueShoppingBtn = page.locator("[data-test='continue-shopping']");
  }

  async navigate() {
    await this.page.goto("https://www.saucedemo.com/cart.html");
  }

  getCartItems() {
    return this.cartItems;
  }

  getCartItemCount() {
    return this.cartItems;
  }

  async getFirstProductName() {
    return await this.itemName.innerText();
  }

  async removeFirstItem() {
    await this.removeBtn.click();
  }

  async isEmpty() {
    return await this.cartItems.count() === 0;
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }
}

module.exports = CartPage;