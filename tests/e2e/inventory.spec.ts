import { test, expect } from "@fixtures/base.fixture";

test.describe("Inventory", () => {
  test.beforeEach(async ({ authenticatedPage }) => {});

  test("muestra 6 productos en el listado", async ({ inventoryPage }) => {
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test("ordena productos por precio de menor a mayor", async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy("lohi");
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("ordena productos por nombre Z a A", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("za");
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test("agregar producto al carrito actualiza el badge", async ({
    inventoryPage,
  }) => {
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });
});
