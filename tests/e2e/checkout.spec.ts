import { test, expect } from "@fixtures/base.fixture";

test.describe("Checkout", () => {
  test.beforeEach(async ({ authenticatedPage, inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await cartPage.goto();
    await cartPage.clickCheckout();
  });

  test("flujo completo: compra exitosa", async ({ checkoutPage, page }) => {
    await checkoutPage.fillInfo("Tulio", "Ramirez", "1414");
    await checkoutPage.continueToOverview();
    await checkoutPage.expectUrl(/checkout-step-two/);

    await checkoutPage.finishOrder();
    await checkoutPage.expectUrl(/checkout-complete/);

    await expect(checkoutPage.completeMessageLocator).toContainText(
      "Thank you for your order",
    );
  });

  test("formulario incompleto muestra error", async ({ checkoutPage }) => {
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessageLocator).toBeVisible();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain("First Name is required");
  });

  test("cálculo de totales: subtotal + tax = total", async ({
    checkoutPage,
  }) => {
    await checkoutPage.fillInfo("Tulio", "Ramirez", "1414");
    await checkoutPage.continueToOverview();

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test("volver al home desde confirmación", async ({ checkoutPage, page }) => {
    await checkoutPage.fillInfo("Tulio", "Ramirez", "1414");
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();

    await checkoutPage.backToHome();
    await expect(page).toHaveURL(/inventory/);
  });
});
