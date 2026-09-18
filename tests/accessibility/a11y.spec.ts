import { test, expect } from "@fixtures/a11y.fixture";
import { USERS } from "@models/users.data";

test.describe("Accessibility - WCAG 2.1 AA", () => {
  const filterSevere = (violations: any[]) =>
    violations.filter((v) => v.impact === "critical" || v.impact === "serious");

  const formatViolations = (violations: any[]) =>
    violations.map((v) => `[${v.impact}] ${v.id}: ${v.help}`).join("\n");

  test("login page no tiene violaciones críticas", async ({
    loginPage,
    makeAxeBuilder,
  }) => {
    await loginPage.goto();
    await loginPage.waitForPageLoad();

    const results = await makeAxeBuilder().analyze();
    const severe = filterSevere(results.violations);

    if (severe.length > 0) {
      expect(severe, formatViolations(severe)).toEqual([]);
    }
  });

  test("inventory page no tiene violaciones críticas", async ({
    loginPage,
    inventoryPage,
    makeAxeBuilder,
  }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
    await inventoryPage.expectUrl(/inventory/);
    await inventoryPage.waitForPageLoad();

    const results = await makeAxeBuilder().analyze();
    const severe = filterSevere(results.violations);

    if (severe.length > 0) {
      expect(severe, formatViolations(severe)).toEqual([]);
    }
  });

  test("cart page no tiene violaciones críticas", async ({
    loginPage,
    inventoryPage,
    cartPage,
    makeAxeBuilder,
  }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
    await inventoryPage.expectUrl(/inventory/);

    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await cartPage.goto();
    await cartPage.expectItemCount(1);
    await cartPage.waitForPageLoad();

    const results = await makeAxeBuilder().analyze();
    const severe = filterSevere(results.violations);

    if (severe.length > 0) {
      expect(severe, formatViolations(severe)).toEqual([]);
    }
  });

  test("checkout page no tiene violaciones críticas", async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    makeAxeBuilder,
  }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
    await inventoryPage.expectUrl(/inventory/);

    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await cartPage.goto();
    await cartPage.clickCheckout();
    await checkoutPage.expectUrl(/checkout-step-one/);
    await checkoutPage.waitForPageLoad();

    const results = await makeAxeBuilder().analyze();
    const severe = filterSevere(results.violations);

    if (severe.length > 0) {
      expect(severe, formatViolations(severe)).toEqual([]);
    }
  });
});
