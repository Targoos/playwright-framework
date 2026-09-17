import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  private readonly cartItems: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(".cart_item");
    this.itemNames = page.locator(".inventory_item_name");
    this.itemPrices = page.locator(".inventory_item_price");
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto(): Promise<void> {
    await super.goto("/cart.html");
    await this.waitForPageLoad();
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async expectItemCount(count: number, timeout: number = 5000): Promise<void> {
    await expect(this.cartItems).toHaveCount(count, { timeout });
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace("$", "")));
  }

  async removeItemByName(name: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: name });
    await item.getByRole("button", { name: /remove/i }).click();
    await item.waitFor({ state: "detached" });
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
