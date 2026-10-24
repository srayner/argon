import { test, expect } from "@playwright/test";

test("adds location", async ({ page }) => {
  const data = { name: "New Location" };

  await page.goto("/dashboard");

  // Navigate to locations.
  await page.locator('[data-e2e="locations-link"]').click();
  await expect(page).toHaveURL(/\/locations/);

  // Navigate to 'Add' page.
  await page.getByRole("link", { name: "Add", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/locations\/add/);

  // Enter the details and submit form.
  await page.locator('input[name="name"]').fill(data.name);
  await page.getByRole("button", { name: "Add", exact: true }).click();

  // Check we redirected to location detail page.
  await expect(page).toHaveURL(/\/dashboard\/locations\/[a-z0-9]+$/);
  await expect(page.getByRole("heading", { level: 1, name: data.name })).toBeVisible();
});
