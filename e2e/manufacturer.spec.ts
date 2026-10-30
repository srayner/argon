import { test, expect } from "@playwright/test";
import { checkEveryColumnCanBeSorted } from "./helpers/grid";

test("every column on the manufacturers list can be sorted", async ({ page }) => {
  await checkEveryColumnCanBeSorted(page, {
    path: "/dashboard/manufacturers",
    endpoint: "/api/manufacturers",
  });
});

test("adds manufacturer", async ({ page }) => {
  const data = { name: "New Manufacturer" };

  await page.goto("/dashboard");

  // Navigate to manufacturers.
  await page.locator('[data-e2e="manufacturers-link"]').click();
  await expect(page).toHaveURL(/\/manufacturers/);

  // Navigate to 'Add' page.
  await page.getByRole("link", { name: "Add", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/manufacturers\/add/);

  // Enter the details and submit form.
  await page.locator('input[name="name"]').fill(data.name);
  await page.getByRole("button", { name: "Add", exact: true }).click();

  // Check we redirected to manufacturer detail page.
  await expect(page).toHaveURL(/\/dashboard\/manufacturers\/[a-z0-9]+$/);
  await expect(page.getByRole("heading", { level: 1, name: data.name })).toBeVisible();
});
