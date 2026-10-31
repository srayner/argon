import { test, expect } from "@playwright/test";

test("opens the dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator('[data-e2e="products-link"]')).toBeVisible();
});
