import { test, expect } from "@playwright/test";

test("adds multiple products", async ({ page }) => {
  const products = [
    { name: "Product A", qtyInStock: 10 },
    { name: "Product B", qtyInStock: 5 },
    { name: "Product C", qtyInStock: 20 },
    { name: "Product D", qtyInStock: 0 },
  ];

  await page.goto("/dashboard");

  for (const product of products) {
    // Navigate to products listing.
    await page.locator('[data-e2e="products-link"]').click();
    await expect(page).toHaveURL(/\/products/);

    // Navigate to 'Add' page.
    await page.getByRole("link", { name: "Add", exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard\/products\/add/);

    // Add a new product.
    await page.locator('input[name="name"]').fill(product.name);
    await page.getByRole("button", { name: "Add", exact: true }).click();

    // Check we redirected to the product detail page.
    await expect(page).toHaveURL(/\/dashboard\/products\/[a-z0-9]+$/);
    await expect(
      page.getByRole("heading", { level: 1, name: product.name })
    ).toBeVisible();
  }
});
