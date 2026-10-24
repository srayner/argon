import { test, expect } from "@playwright/test";

test("adds some property values", async ({ page }) => {
  await page.goto("/dashboard");

  // Navigate to product.
  await page.locator('[data-e2e="products-link"]').click();
  await expect(page).toHaveURL(/\/products/);
  await page.getByRole("link", { name: "100 Ohm Resistor" }).first().click();

  const valuesToAdd = [
    { type: "Type", value: "Through Hole", expected: "Through Hole" },
    { type: "Pack Qty", value: "12", expected: "Through Hole" },
    { type: "Lead Diameter", value: "0.6", expected: "0.6mm" },
    { type: "Prefix", value: "44", expected: "#44" },
  ];

  for (const value of valuesToAdd) {
    await page.locator('[data-e2e="add-property-value-button"]').click();
    await page.locator('select[name="propertyId"]').selectOption({ label: value.type });
    await page.locator('input[name="value"]').fill(value.value);
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByText(value.expected).first()).toBeVisible();
  }
});
