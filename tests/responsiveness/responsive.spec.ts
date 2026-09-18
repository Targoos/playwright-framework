import { test, expect } from '@fixtures/base.fixture';
import { USERS } from '@models/users.data';

test.describe('Responsiveness', () => {
  test('login page es usable y sin scroll horizontal', async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.usernameInputLocator).toBeVisible();
    await expect(loginPage.passwordInputLocator).toBeVisible();
    await loginPage.expectNoHorizontalScroll();
  });

  test('inventory page es usable y sin scroll horizontal', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
    await inventoryPage.expectUrl(/inventory/);
    await inventoryPage.waitForPageLoad();

    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);

    await inventoryPage.expectNoHorizontalScroll();
  });

  test('cart page es usable y sin scroll horizontal', async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
    await inventoryPage.expectUrl(/inventory/);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await cartPage.goto();
    await cartPage.expectItemCount(1);

    await cartPage.expectNoHorizontalScroll();
  });

  test('checkout page es usable y sin scroll horizontal', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
    await inventoryPage.expectUrl(/inventory/);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await cartPage.goto();
    await cartPage.clickCheckout();
    await checkoutPage.expectUrl(/checkout-step-one/);
    await checkoutPage.waitForPageLoad();

    await checkoutPage.expectNoHorizontalScroll();
  });
});
