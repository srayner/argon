import { test, expect } from "@playwright/test";

test("performs a search", async ({ page }) => {
  await page.goto("/dashboard");

  // Navigate to the category we want.
  await page.getByRole("link", { name: "Advanced Search" }).first().click();
  await page.getByRole("link", { name: "Resistors", exact: true }).first().click();
  await page.getByRole("link", { name: "Through Hole Resistors" }).first().click();

  // Verify the properties exist.
  await expect(page.getByRole("heading", { level: 3, name: "Resistance" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Power Rating" }).first()).toBeVisible();

  // Perform the search.
  await page.getByRole("button", { name: "Apply Filters" }).click();

  // Verify and click the result.
  await page.getByRole("link", { name: "100 Ohm Resistor" }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: "100 Ohm Resistor" })).toBeVisible();
});
