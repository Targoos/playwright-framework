import { test as base } from "@fixtures/base.fixture";
import AxeBuilder from "@axe-core/playwright";

type A11yFixtures = {
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<A11yFixtures>({
  makeAxeBuilder: async ({ page }, use) => {
    await use(() =>
      new AxeBuilder({ page }).withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
      ]),
    );
  },
});

export { expect } from "@playwright/test";
