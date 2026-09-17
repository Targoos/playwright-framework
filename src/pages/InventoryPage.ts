import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Product, SortOption } from "@models/product.types";

export class InventoryPage extends BasePage {
  private readonly inventoryItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly cartBadge: Locator;
  private readonly productNames: Locator;
  private readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator(".inventory_item");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.productNames = page.locator(".inventory_item_name");
    this.productPrices = page.locator(".inventory_item_price");
  }

  async goto(): Promise<void> {
    await super.goto("/inventory.html");
    await this.waitForPageLoad();
  }

  async getItemCount(): Promise<number> {
    await this.inventoryItems.first().waitFor({ state: "visible" });
    return this.inventoryItems.count();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace("$", "")));
  }

  async addProductToCart(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.getByRole("button", { name: /add to cart/i }).click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return parseInt((await this.cartBadge.textContent()) ?? "0", 10);
  }

  async getProducts(): Promise<Product[]> {
    const names = await this.getProductNames();
    const prices = await this.getProductPrices();
    return names.map((name, i) => ({
      name,
      description: "",
      price: prices[i],
    }));
  }
}
