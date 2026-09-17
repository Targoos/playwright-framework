import { test, expect } from "@fixtures/api.fixture";
import { ENDPOINTS } from "@api/endpoints";
import {
  UsersListResponseSchema,
  SingleUserResponseSchema,
  CreateUserResponseSchema,
} from "@models/api.schemas";

test.describe("API - Users", () => {
  test("GET lista de usuarios retorna 200 y schema válido", async ({
    apiClient,
  }) => {
    const response = await apiClient.get(ENDPOINTS.users.list(1));

    expect(response.status()).toBe(200);

    const body = await response.json();
    const parsed = UsersListResponseSchema.parse(body);

    expect(parsed.page).toBe(1);
    expect(parsed.data.length).toBeGreaterThan(0);
  });

  test("GET usuario específico retorna 200 y schema válido", async ({
    apiClient,
  }) => {
    const response = await apiClient.get(ENDPOINTS.users.detail(2));

    expect(response.status()).toBe(200);

    const body = await response.json();
    const parsed = SingleUserResponseSchema.parse(body);

    expect(parsed.data.id).toBe(2);
  });

  test("GET usuario inexistente retorna 404", async ({ apiClient }) => {
    const response = await apiClient.get(ENDPOINTS.users.detail(9999));

    expect(response.status()).toBe(404);
  });

  test("POST crear usuario retorna 201 y schema válido", async ({
    apiClient,
  }) => {
    const payload = { name: "Tulio", job: "SDET" };
    const response = await apiClient.post(ENDPOINTS.users.create, payload);

    expect(response.status()).toBe(201);

    const body = await response.json();
    const parsed = CreateUserResponseSchema.parse(body);

    expect(parsed.name).toBe(payload.name);
    expect(parsed.job).toBe(payload.job);
  });
});
