import { Page, expect } from "@playwright/test";

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = "/") {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getTitle() {
    return this.page.title();
  }

  async expectUrl(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/${name}.png`,
      fullPage: true,
    });
  }
}
