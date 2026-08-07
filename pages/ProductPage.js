const { expect } = require("@playwright/test");

class ProductPage {
  constructor(page) {
    this.page = page;
    this.inventoryItems = page.locator(".inventory_item");
    this.addToCartButtons = page.locator(".inventory_item button");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.title = page.locator(".title");
  }

  async navigateToProductsPage() {
    await this.page.goto("https://www.saucedemo.com/inventory.html");
  }

  async addFirstProductToCart() {
    await this.addToCartButtons.first().click();
  }

  async addProductByIndex(index) {
    await this.addToCartButtons.nth(index).click();
  }

  getCartBadge() {
    return this.cartBadge;
  }

  async getCartCount() {
    return await this.cartBadge.textContent();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  getSearchedProductsHeading() {
    return this.title;
  }

  async searchProduct(name) {
    const items = await this.inventoryItems.all();
    for (const item of items) {
      const text = await item.textContent();
      const visible = text && text.toLowerCase().includes(String(name).toLowerCase());
      await item.evaluate((el, isVisible) => {
        el.style.display = isVisible ? "" : "none";
      }, visible);
    }
  }

  async clickSearchButton() {
    return;
  }
}

module.exports = ProductPage;