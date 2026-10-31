import { test, expect } from "@playwright/test";
import { testGrid } from "./helpers/grid";

testGrid({ path: "/dashboard/categories", endpoint: "/api/categories" });

test("adds category", async ({ page }) => {
  const data = { name: "New Category" };

  await page.goto("/dashboard");

  // Navigate to categories.
  await page.locator('[data-e2e="categories-link"]').click();
  await expect(page).toHaveURL(/\/categories/);

  // Navigate to 'Add' page.
  await page.getByRole("link", { name: "Add", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/categories\/add/);

  // Enter the details and submit form.
  await page.locator('input[name="name"]').fill(data.name);
  await page.getByRole("button", { name: "Add", exact: true }).click();

  // Check we redirected to category detail page.
  await expect(page).toHaveURL(/\/dashboard\/categories\/[a-z0-9]+$/);
  await expect(page.getByRole("heading", { level: 1, name: data.name })).toBeVisible();
});
