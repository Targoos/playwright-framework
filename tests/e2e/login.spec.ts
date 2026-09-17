import { test, expect } from "@fixtures/base.fixture";
import { USERS } from "@models/users.data";

test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("login exitoso con usuario estándar", async ({ loginPage }) => {
    await loginPage.login(USERS.standard);
    await loginPage.expectUrl(/inventory/);
  });

  test("login fallido con usuario bloqueado", async ({ loginPage }) => {
    await loginPage.login(USERS.locked);
    await expect(loginPage.errorMessageLocator).toContainText("locked out");
  });

  test("login fallido con credenciales inválidas", async ({ loginPage }) => {
    await loginPage.login({
      username: "usuario_invalido",
      password: "password_invalido",
    });
    await expect(loginPage.errorMessageLocator).toContainText(
      "Username and password do not match",
    );
  });
});
