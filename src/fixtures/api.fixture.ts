import { test as base, request as playwrightRequest } from "@playwright/test";
import { ApiClient } from "@api/ApiClient";

type ApiFixtures = {
  apiClient: ApiClient;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({}, use) => {
    const apiContext = await playwrightRequest.newContext();
    const baseURL = process.env.API_BASE_URL || "http://localhost:3001";
    const apiClient = new ApiClient(apiContext, baseURL);

    await use(apiClient);

    await apiContext.dispose();
  },
});

export { expect } from "@playwright/test";
