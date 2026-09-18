import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  // Step 1: Form
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly errorMessage: Locator;

  // Step 2: Overview
  private readonly cartItems: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;

  // Step 3: Complete
  private readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    // Step 1
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.postalCodeInput = page.getByPlaceholder("Zip/Postal Code");
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.errorMessage = page.locator('[data-test="error"]');
    // Step 2
    this.cartItems = page.locator(".cart_item");
    this.subtotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
    this.finishButton = page.getByRole("button", { name: "Finish" });
    // Step 3
    this.completeHeader = page.locator(".complete-header");
    this.backHomeButton = page.getByRole("button", { name: "Back Home" });
  }

  async fillInfo(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? "";
  }

  get errorMessageLocator(): Locator {
    return this.errorMessage;
  }

  // === Step 2: Overview ===

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getSubtotal(): Promise<number> {
    const text = (await this.subtotalLabel.textContent()) ?? "";
    return parseFloat(text.replace(/[^0-9.]/g, ""));
  }

  async getTax(): Promise<number> {
    const text = (await this.taxLabel.textContent()) ?? "";
    return parseFloat(text.replace(/[^0-9.]/g, ""));
  }

  async getTotal(): Promise<number> {
    const text = (await this.totalLabel.textContent()) ?? "";
    return parseFloat(text.replace(/[^0-9.]/g, ""));
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  // === Step 3: Complete ===

  async getCompleteMessage(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? "";
  }

  get completeMessageLocator(): Locator {
    return this.completeHeader;
  }

  async backToHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
