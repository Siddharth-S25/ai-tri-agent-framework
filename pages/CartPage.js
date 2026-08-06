const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page        = page;
    this.cartItems   = page.locator('.cart_item');
    this.productName = page.locator('.inventory_item_name').first();
    this.removeBtn   = page.locator('.cart_item').first()
                           .locator('button');
    this.checkoutBtn = page.locator('[data-test="checkout"]');
    this.continueBtn = page.locator('[data-test="continue-shopping"]');
  }

  async navigate() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  getCartItems() {
    return this.cartItems;
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getFirstProductName() {
    return await this.productName.textContent();
  }

  async removeFirstItem() {
    await this.removeBtn.click();
    await this.page.waitForTimeout(500);
  }

  async isEmpty() {
    return (await this.cartItems.count()) === 0;
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = CartPage;