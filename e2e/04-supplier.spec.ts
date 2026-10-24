import { test, expect } from "@playwright/test";

test("adds supplier", async ({ page }) => {
  const data = { name: "New Supplier" };

  await page.goto("/dashboard");

  // Navigate to suppliers.
  await page.locator('[data-e2e="suppliers-link"]').click();
  await expect(page).toHaveURL(/\/suppliers/);

  // Navigate to 'Add' page.
  await page.getByRole("link", { name: "Add", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/suppliers\/add/);

  // Enter the details and submit form.
  await page.locator('input[name="name"]').fill(data.name);
  await page.getByRole("button", { name: "Add", exact: true }).click();

  // Check we redirected to supplier detail page.
  await expect(page).toHaveURL(/\/dashboard\/suppliers\/[a-z0-9]+$/);
  await expect(page.getByRole("heading", { level: 1, name: data.name })).toBeVisible();
});
