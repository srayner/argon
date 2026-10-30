import { test, expect } from "@playwright/test";

type NewProperty = {
  name: string;
  type?: string;
  units?: string;
  unitPosition?: string;
};

test("adds properties", async ({ page }) => {
  const properties: NewProperty[] = [
    { name: "Test Property A" },
    { name: "Test Property B", type: "Numeric" },
    { name: "Test Property C", type: "Numeric", units: "mm" },
    { name: "Test Property D", type: "Numeric", units: "#", unitPosition: "Prefix" },
    { name: "Test Property E", type: "Metric", units: "Ω" },
    { name: "Test Property F", type: "Imperial", units: '"' },
  ];

  await page.goto("/dashboard");
  await page.locator('[data-e2e="categories-link"]').click();
  await expect(page).toHaveURL(/\/categories/);

  await page.getByLabel("Search").fill("Through Hole Resistors");
  await page.getByRole("link", { name: "Through Hole Resistors" }).first().click();

  for (const property of properties) {
    await page.locator('[data-e2e="add-property-button"]').click();
    await page.locator('input[name="name"]').fill(property.name);
    if (property.type) {
      await page.locator('select[name="type"]').selectOption({ label: property.type });
    }
    if (property.units) {
      await page.locator('input[name="units"]').fill(property.units);
    }
    if (property.unitPosition) {
      await page
        .locator('select[name="unitPosition"]')
        .selectOption({ label: property.unitPosition });
    }
    await page.getByRole("button", { name: "Add", exact: true }).click();
  }
});
