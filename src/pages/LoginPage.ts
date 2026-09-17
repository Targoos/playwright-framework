import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { User } from "@models/user.types";

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await super.goto("/");
    await this.waitForPageLoad();
  }

  async login(user: User): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }

  get errorMessageLocator(): Locator {
    return this.errorMessage;
  }
}
