import { test, expect } from "@playwright/test";

test("adds stock", async ({ page }) => {
  const data = { location: "Bin 103", qty: "50" };

  await page.goto("/dashboard");
  await page.locator('[data-e2e="products-link"]').click();
  await expect(page).toHaveURL(/\/products/);

  await page.getByLabel("Search").fill("100 Ohm Resistor");
  await page.getByRole("link", { name: "100 Ohm Resistor" }).first().click();

  await page.locator('[data-e2e="add-stock-button"]').click();
  await page.locator('[data-e2e="locationId-select"]').click();
  await page.locator("li", { hasText: data.location }).first().click();
  await page.locator('input[name="qty"]').fill(data.qty);
  await page.getByRole("button", { name: "Add", exact: true }).click();

  // The grid should contain a row with the location and quantity we added.
  const rows = page
    .locator('div[data-e2e="stock-locations-panel"]')
    .locator('div[role="row"].ag-row');
  const matchingRow = rows
    .filter({
      has: page.locator('div[role="gridcell"]', {
        hasText: new RegExp(`^\\s*${data.location}\\s*$`),
      }),
    })
    .filter({
      has: page.locator('div[role="gridcell"]', {
        hasText: new RegExp(`^\\s*${data.qty}\\s*$`),
      }),
    });
  await expect(matchingRow.first()).toBeVisible();
});
