import { expect, Page } from "@playwright/test";

export async function openDetail(page: Page, list: string, name: string) {
  await page.goto(`/dashboard/${list}`);
  await page.getByLabel("Search").fill(name);
  await page.getByRole("link", { name, exact: true }).first().click();
  await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
}
