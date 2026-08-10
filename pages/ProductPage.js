const { expect } = require("@playwright/test");

class ProductPage {
  constructor(page) {
    this.page = page;
    this.inventoryItem = page.locator(".inventory_item");
    this.addButton = page.locator(".inventory_item").first().locator("button");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
    this.sortDropdown = page.locator("[data-test=product-sort-container]");
  }

  async navigateToProductsPage() {
    await this.page.goto("https://www.saucedemo.com/inventory.html");
  }

  async addFirstProductToCart() {
    await this.addButton.click();
  }

  async addProductByIndex(idx) {
    const button = this.inventoryItem.nth(idx).locator("button");
    await button.click();
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
    return this.page.locator(".inventory_header");
  }
}

module.exports = ProductPage;