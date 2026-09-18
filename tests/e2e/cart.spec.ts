import { test, expect } from "@fixtures/base.fixture";

test.describe("Cart", () => {
  test.beforeEach(async ({ authenticatedPage }) => {});

  test("carrito vacío no muestra badge", async ({
    inventoryPage,
    cartPage,
  }) => {
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    await cartPage.goto();
    await cartPage.expectItemCount(0);
  });

  test("agregar múltiples productos actualiza el badge", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    await inventoryPage.addProductToCart("Sauce Labs Bolt T-Shirt");

    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  test("producto agregado aparece en el carrito con datos correctos", async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await cartPage.goto();
    await cartPage.expectItemCount(1);

    const names = await cartPage.getItemNames();
    const prices = await cartPage.getItemPrices();

    expect(names).toContain("Sauce Labs Backpack");
    expect(prices.length).toBe(1);
    expect(prices[0]).toBeGreaterThan(0);
  });

  test("eliminar producto actualiza el carrito y el badge", async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    await cartPage.goto();

    await cartPage.expectItemCount(2);

    await cartPage.removeItemByName("Sauce Labs Backpack");

    await cartPage.expectItemCount(1);
    expect(await cartPage.getItemNames()).not.toContain("Sauce Labs Backpack");
  });
});
