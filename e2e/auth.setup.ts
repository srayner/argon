import { test as setup } from "@playwright/test";

setup("log in", async ({ page }) => {
  await page.goto("/auth/login");
  await page.locator('input[name="email"]').fill("user@example.com");
  await page.locator('input[name="password"]').fill(process.env.USER_PASSWORD_USER ?? "");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(/\/dashboard/);
  await page.context().storageState({ path: "playwright/.auth/user.json" });
});
