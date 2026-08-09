const { expect } = require("@playwright/test");

class ProductPage {
  constructor(page) {
    this.page = page;
    this.inventoryItem = page.locator(".inventory_item");
    this.itemButton = page.locator(".inventory_item").first().locator("button");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
    this.sortDropdown = page.locator("[data-test=product-sort-container]");
    this.productsHeading = page.locator(".title");
  }

  async navigateToProductsPage() {
    await this.page.goto("https://www.saucedemo.com/inventory.html");
  }

  async addFirstProductToCart() {
    await this.inventoryItem.first().locator("button").click();
  }

  async addProductByIndex(index) {
    await this.inventoryItem.nth(index).locator("button").click();
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
    return this.productsHeading;
  }

  async searchProduct(name) {
    // SauceDemo does not have a functional search bar, implementing as placeholder for required interface
    const searchInput = this.page.locator('[data-test="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill(name);
    }
  }

  async clickSearchButton() {
    // No-op as per instructions
  }
}

module.exports = ProductPage;