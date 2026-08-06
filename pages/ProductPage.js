const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) {
    this.page           = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartBtn   = page.locator('.inventory_item').first()
                              .locator('button');
    this.cartBadge      = page.locator('.shopping_cart_badge');
    this.navCart        = page.locator('.shopping_cart_link');
    this.sortDropdown   = page.locator('[data-test="product-sort-container"]');
  }

  async navigateToProductsPage() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('.inventory_list');
  }

  async addFirstProductToCart() {
    await this.page.locator('.inventory_item')
          .first()
          .locator('button')
          .click();
    await this.page.waitForTimeout(500);
  }

  async addProductByName(name) {
    const item = this.page.locator('.inventory_item')
                     .filter({ hasText: name });
    await item.locator('button').click();
    await this.page.waitForTimeout(500);
  }

  getCartBadge() {
    return this.cartBadge;
  }

  async getCartCount() {
    const badge = this.cartBadge;
    if (await badge.isVisible()) {
      return await badge.textContent();
    }
    return '0';
  }

  async goToCart() {
    await this.navCart.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  getSearchedProductsHeading() {
    return this.page.locator('.title');
  }

  async searchProduct(name) {
    // SauceDemo ला search नाही — filter करतो
    return this.page.locator('.inventory_item').filter({ hasText: name });
  }

  async clickSearchButton() {
    // SauceDemo ला search button नाही
    return;
  }
}

module.exports = ProductPage;